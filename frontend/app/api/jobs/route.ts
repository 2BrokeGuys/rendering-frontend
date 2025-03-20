import { s3, sqs } from "@/lib/aws";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type JobTypes = "image" | "anim";

type JobDetailsDataType = {
  fileName: string;
  jobType: JobTypes;
  renderResolutionHeight: number;
  renderResolutionWidth: number;
  renderResolutionPercentage: number;
  framesTotal: number;
  frameStart: number;
  frameEnd: number;
};

type TaskRenderImage = {
  userId: string;
  taskType: "image";
  renderResolutionHeight: number;
  renderResolutionWidth: number;
  renderResolutionPercentage: number;
  frameToRender: 1;
  rawFileUrl: string;
  tileIndex: 1 | 2;
};

type TaskRenderAnimation = {
  userId: string;
  taskType: "anim";
  renderResolutionHeight: number;
  renderResolutionWidth: number;
  renderResolutionPercentage: number;
  framesTotal: number;
  frameStart: number;
  frameEnd: number;
  rawFileUrl: string;
};

const s3RawFilesBucketName = process.env.AWS_S3_BUCKET_NAME_RAW_FILES as string;
const queueUrl = process.env.AWS_SQS_URL as string;

if (!s3RawFilesBucketName || !queueUrl) {
  throw new Error("Missing environment variables");
}

const createTasks = (
  userId: string,
  jobType: JobTypes,
  renderResolutionHeight: number,
  renderResolutionWidth: number,
  renderResolutionPercentage: number,
  framesTotal: number,
  frameStart: number,
  frameEnd: number,
  rawFileUrl: string,
): (TaskRenderImage | TaskRenderAnimation)[] => {
  if (jobType === "image") {
    return [
      {
        userId,
        taskType: "image",
        renderResolutionHeight,
        renderResolutionWidth,
        renderResolutionPercentage,
        frameToRender: 1,
        rawFileUrl,
        tileIndex: 1,
      },
      {
        userId,
        taskType: "image",
        renderResolutionHeight,
        renderResolutionWidth,
        renderResolutionPercentage,
        frameToRender: 1,
        rawFileUrl,
        tileIndex: 2,
      },
    ];
  }

  const animationTasks: TaskRenderAnimation[] = [];

  const incrementDelta = framesTotal <= 10 ? 1 : 5;

  for (let i = frameStart; i <= frameEnd; i += incrementDelta) {
    const endFrame = Math.min(i + incrementDelta - 1, frameEnd);
    animationTasks.push({
      userId,
      taskType: "anim",
      renderResolutionHeight,
      renderResolutionWidth,
      renderResolutionPercentage,
      framesTotal: endFrame - i + 1,
      frameStart: i,
      frameEnd: endFrame,
      rawFileUrl,
    });
  }

  return animationTasks;
};

export const POST = async (request: NextRequest) => {
  const session = await getToken({ req: request });

  if (!session) {
    return NextResponse.json({ message: "Not signed in" }, { status: 403 });
  }

  const { sub: userId } = session;

  if (!userId) {
    return NextResponse.json({ error: "User ID missing" }, { status: 401 });
  }

  const {
    fileName,
    jobType,
    renderResolutionHeight,
    renderResolutionWidth,
    renderResolutionPercentage,
    framesTotal,
    frameStart,
    frameEnd,
  }: JobDetailsDataType = await request.json();

  const isValidPayload =
    typeof fileName === "string" &&
    (jobType === "image" || jobType === "anim") &&
    Number.isInteger(renderResolutionHeight) &&
    Number.isInteger(renderResolutionWidth) &&
    Number.isInteger(renderResolutionPercentage) &&
    Number.isInteger(framesTotal) &&
    Number.isInteger(frameStart) &&
    Number.isInteger(frameEnd);

  if (!isValidPayload) {
    return NextResponse.json(
      { error: "Invalid Payload Data" },
      { status: 400 },
    );
  }

  const objectKey = `${userId}/${fileName}`;

  try {
    const getCommand = new GetObjectCommand({
      Bucket: s3RawFilesBucketName,
      Key: objectKey,
    });

    const rawFileUrl = await getSignedUrl(s3, getCommand, { expiresIn: 1800 });

    const tasks = createTasks(
      userId,
      jobType,
      renderResolutionHeight,
      renderResolutionWidth,
      renderResolutionPercentage,
      framesTotal,
      frameStart,
      frameEnd,
      rawFileUrl,
    );

    await Promise.all(
      tasks.map((task) => {
        const sendCommand = new SendMessageCommand({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(task),
        });
        return sqs.send(sendCommand);
      }),
    );

    return NextResponse.json(
      { message: "Tasks created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error Creating a Job: ", error);
    return NextResponse.json(
      {
        error: "Error Creating a Job",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
