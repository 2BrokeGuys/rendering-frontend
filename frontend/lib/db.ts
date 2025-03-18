import { neon } from "@neondatabase/serverless";

const DB_URL = process.env.DATABASE_URL as string;

const sqlQueryFunction = neon(DB_URL);

export { sqlQueryFunction as sql };
