import { rawFilesMinioClient } from "@/lib/minio";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const minioBucketName = process.env.RAW_MINIO_BUCKET_NAME as string;
const minioBucketPresignedURLExpiry = Number(
  process.env.RAW_MINIO_PRESIGNED_URL_EXPIRY as string,
);

export const POST = async (request: NextRequest) => {
  const session = await getToken({ req: request });

  if (!session) {
    return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  }

  const { sub: userId } = session;
  const { file_name } = await request.json();
  const objectKey = `${userId}/${file_name}`;

  try {
    const url = await rawFilesMinioClient.presignedPutObject(
      minioBucketName,
      objectKey,
      minioBucketPresignedURLExpiry,
    );

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching Presigned URL" },
      { status: 500 },
    );
  }
};
