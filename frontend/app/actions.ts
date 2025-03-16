import { DB_URL } from "@/lib/db";
import { neon } from "@neondatabase/serverless";

/* eslint-disable */
export async function saveUserToDB(user: any) {
  const sql = neon(DB_URL);
  const { id, name, email, image } = user;

  try {
    const data = await sql`SELECT email FROM users WHERE email = ${email}`;

    if (data.length > 0) return;

    await sql`INSERT INTO users(user_id, name, email, image) VALUES(${id}, ${name}, ${email}, ${image});`;
  } catch (error) {
    console.log(error);
  }
}
