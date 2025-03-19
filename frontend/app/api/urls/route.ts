import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const s3RawFilesBucketName = process.env.AWS_S3_BUCKET_NAME_RAW_FILES as string;

export const POST = async (request: NextRequest) => {
  const session = await getToken({ req: request });

  if (!session) {
    return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  }

  const { sub: userId } = session;
  const { file_name } = await request.json();
  const objectKey = `${userId}/${file_name}`;

  try {
    const putCommand = new PutObjectCommand({
      Bucket: s3RawFilesBucketName,
      Key: objectKey,
    });

    const url = await getSignedUrl(s3, putCommand, { expiresIn: 1800 });

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.log("Error fetching Upload URL: ", error);
    return NextResponse.json(
      { error: "Error fetching Presigned URL" },
      { status: 500 },
    );
  }
};
