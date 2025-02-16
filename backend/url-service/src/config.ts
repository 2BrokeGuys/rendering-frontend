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

const GATEWAY_URL = env.get("GATEWAY_URL").default("*").required().asString();

const DATABASE_HOST = env
  .get("DATABASE_HOST")
  .default("localhost")
  .required()
  .asString();

const DATABASE_PORT = env
  .get("DATABASE_PORT")
  .default(5432)
  .required()
  .asPortNumber();

const DATABASE_USER = env
  .get("DATABASE_USER")
  .default("postgres")
  .required()
  .asString();

const DATABASE_PASSWORD = env.get("DATABASE_PASSWORD").required().asString();

const DATABASE_NAME = env.get("DATABASE_NAME").required().asString();

export {
  MINIO_PRESIGNED_URL_EXPIRY,
  MINIO_ENDPOINT_URL,
  MINIO_PORT,
  MINIO_BUCKET_NAME,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  GATEWAY_URL,
};
