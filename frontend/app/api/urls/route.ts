import { pool } from "@/lib/db";
import { rawFilesMinioClient } from "@/lib/minio";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const minioBucketName = process.env.RAW_MINIO_BUCKET_NAME as string;
const minioBucketPresignedURLExpiry = Number(
  process.env.RAW_MINIO_PRESIGNED_URL_EXPIRY as string
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
      minioBucketPresignedURLExpiry
    );

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching Presigned URL" },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest) => {
  const session = await getToken({ req: request });

  if (!session) {
    return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  }

  const { sub: userId } = session;

  try {
    const dbResponse = await pool.query(
      "SELECT file_name, file_size, file_urls FROM user_files WHERE user_id = $1",
      [userId]
    );

    const data = dbResponse.rows;

    if (data.length === 0) {
      return NextResponse.json({ message: "No files found!" }, { status: 404 });
    }

    NextResponse.json({ length: data.length, files: data }, { status: 200 });
  } catch (error) {
    console.log(error);
    NextResponse.json(
      { error: "Error fetching your rendered output files" },
      { status: 500 }
    );
  }
};
