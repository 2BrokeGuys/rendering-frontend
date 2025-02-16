import env from "env-var";
import { configDotenv } from "dotenv";

configDotenv();

const URL_SERVICE_ENDPOINT = env
  .get("URL_SERVICE_ENDPOINT")
  .required()
  .asString();

const USER_SERVICE_ENDPOINT = env
  .get("USER_SERVICE_ENDPOINT")
  .required()
  .asString();

const JOB_MANAGER_ENDPOINT = env
  .get("JOB_MANAGER_ENDPOINT")
  .required()
  .asString();

const JWT_ACCESS_TOKEN_SECRET = env
  .get("JWT_ACCESS_TOKEN_SECRET")
  .required()
  .asString();

export {
  URL_SERVICE_ENDPOINT,
  USER_SERVICE_ENDPOINT,
  JOB_MANAGER_ENDPOINT,
  JWT_ACCESS_TOKEN_SECRET,
};
