import { Client } from "minio";
import { configDotenv } from "dotenv";
import {
  MINIO_ACCESS_KEY,
  MINIO_ENDPOINT_URL,
  MINIO_PORT,
  MINIO_SECRET_KEY,
} from "../config";

configDotenv();

const minioClient = new Client({
  endPoint: MINIO_ENDPOINT_URL,
  port: MINIO_PORT,
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

export default minioClient;
