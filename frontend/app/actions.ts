import { sql } from "@/lib/db";

/* eslint-disable */
export async function saveUserToDB(user: any) {
  const { id, name, email } = user;

  try {
    const data = await sql`SELECT email FROM users WHERE email = ${email}`;

    if (data.length > 0) return { error: false };

    await sql`INSERT INTO users(user_id, name, email) VALUES(${id}, ${name}, ${email});`;
    return { error: false };
  } catch (error) {
    console.error(error);
    return { error: true };
  }
}
