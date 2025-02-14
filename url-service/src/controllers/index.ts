import { RequestHandler } from "express";
import minioClient from "../utils/minio";
import { MINIO_BUCKET_NAME, MINIO_PRESIGNED_URL_EXPIRY } from "../config";

const fetchPresignedURLController: RequestHandler = async (
  request,
  response
) => {
  const { file_name } = request.body;
  //   const user = request.user.id;
  //   const objectKey = `${user}/${file_name}`;

  try {
    const url = await minioClient.presignedUrl(
      "GET",
      MINIO_BUCKET_NAME,
      file_name,
      MINIO_PRESIGNED_URL_EXPIRY
    );

    response.status(200).send({ url });
  } catch (error) {
    response.status(500).send({ error: "Error fetching Presigned URL" });
  }
};

export { fetchPresignedURLController };
