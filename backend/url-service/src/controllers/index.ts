import { RequestHandler } from "express";
import minioClient from "../utils/minio";
import { MINIO_BUCKET_NAME, MINIO_PRESIGNED_URL_EXPIRY } from "../config";
import { AuthenticatedRequest, AuthenticatedUserJWT } from "../types/auth";
import pool from "../utils/db";

const fetchPresignedURLController: RequestHandler = async (
  request: AuthenticatedRequest,
  response
) => {
  const { file_name } = request.body;

  if (!request.user) {
    response.status(401);
    return;
  }

  const { id: userId } = request.user as AuthenticatedUserJWT;
  const objectKey = `${userId}/${file_name}`;

  try {
    const url = await minioClient.presignedUrl(
      "GET",
      MINIO_BUCKET_NAME,
      objectKey,
      MINIO_PRESIGNED_URL_EXPIRY
    );

    response.status(200).send({ url });
  } catch (error) {
    response.status(500).send({ error: "Error fetching Presigned URL" });
  }
};

const fetchUsersAllOutputFiles: RequestHandler = async (
  request: AuthenticatedRequest,
  response
) => {
  if (!request.user) {
    response.status(401);
    return;
  }

  const { id: userId } = request.user as AuthenticatedUserJWT;

  try {
    const dbResponse = await pool.query(
      "SELECT file_name, file_size, file_urls FROM user_files WHERE user_id = $1",
      [userId]
    );

    const data = dbResponse.rows;

    if (data.length === 0) {
      response.status(404).send({ msg: "No files found!" });
      return;
    }

    response.status(200).send({ length: data.length, files: data });
  } catch (error) {
    response
      .status(500)
      .send({ error: "Error fetching your rendered output files" });
  }
};

export { fetchPresignedURLController, fetchUsersAllOutputFiles };
