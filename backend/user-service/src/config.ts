import env from 'env-var';
import { configDotenv } from 'dotenv';

configDotenv();

export const LOGGING_DIRECTORY = './logs/';

export const NODE_ENV = env.get('NODE_ENV').default('development').asString();

export const GATEWAY_URL = env
  .get('GATEWAY_URL')
  .default('*')
  .required()
  .asString();

export const DATABASE_HOST = env
  .get('DATABASE_HOST')
  .default('localhost')
  .required()
  .asString();

export const DATABASE_PORT = env
  .get('DATABASE_PORT')
  .default(5432)
  .required()
  .asPortNumber();

export const DATABASE_USER = env
  .get('DATABASE_USER')
  .default('postgres')
  .required()
  .asString();

export const DATABASE_PASSWORD = env
  .get('DATABASE_PASSWORD')
  .required()
  .asString();

export const DATABASE_NAME = env.get('DATABASE_NAME').required().asString();
