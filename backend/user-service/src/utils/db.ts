import { Pool } from 'pg';
import TABLE_QUERIES from '../queries/tables';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER
} from '../config';

const pool = new Pool({
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  ssl: false
});

export const connectDatabase = async () => {
  try {
    await pool.connect();
  } catch (error: any) {
    console.log('Error connecting to the database:', error.message);
  }
};

export const createTablesIfNotExists = async (createTables = false) => {
  if (!createTables) return;

  for (const [key, query] of Object.entries(TABLE_QUERIES)) {
    console.log(`\nExecuting: ${key}`);
    try {
      await pool.query(query);
      console.log(`Successfully executed: ${key}`);
    } catch (error: any) {
      console.error(`Error executing ${key}:`, error.message);
    }
  }
};

export default pool;
