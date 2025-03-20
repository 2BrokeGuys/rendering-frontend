import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_KEY as string,
  },
});

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_KEY as string,
  },
});

export { s3Client as s3, sqsClient as sqs };
