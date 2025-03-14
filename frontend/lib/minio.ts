import { Client } from "minio";

export const rawFilesMinioClient = new Client({
  endPoint: process.env.RAW_MINIO_ENDPOINT_URL as string,
  port: Number(process.env.RAW_MINIO_PORT as string),
  useSSL: false,
  accessKey: process.env.RAW_MINIO_ACCESS_KEY,
  secretKey: process.env.RAW_MINIO_SECRET_KEY,
});

export const outputFilesMinioClient = new Client({
  endPoint: process.env.OUTPUT_MINIO_ENDPOINT_URL as string,
  port: Number(process.env.OUTPUT_MINIO_PORT as string),
  useSSL: false,
  accessKey: process.env.OUTPUT_MINIO_ACCESS_KEY,
  secretKey: process.env.OUTPUT_MINIO_SECRET_KEY,
});
