import env from "env-var";
import { configDotenv } from "dotenv";

configDotenv();

const MINIO_PRESIGNED_URL_EXPIRY = 12 * 60 * 60;

const MINIO_ENDPOINT_URL = env
  .get("MINIO_ENDPOINT_URL")
  .default("localhost")
  .required()
  .asString();

const MINIO_PORT = env
  .get("MINIO_PORT")
  .default(9000)
  .required()
  .asPortNumber();

const MINIO_BUCKET_NAME = env.get("MINIO_BUCKET_NAME").required().asString();

const MINIO_ACCESS_KEY = env.get("MINIO_ACCESS_KEY").required().asString();

const MINIO_SECRET_KEY = env.get("MINIO_SECRET_KEY").required().asString();

export {
  MINIO_PRESIGNED_URL_EXPIRY,
  MINIO_ENDPOINT_URL,
  MINIO_PORT,
  MINIO_BUCKET_NAME,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
};
