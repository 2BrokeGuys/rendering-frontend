import { sql } from "@/lib/db";

/* eslint-disable */
export async function saveUserToDB(user: any) {
  const { id, name, image, email } = user;

  try {
    const data = await sql`SELECT email FROM users WHERE email = ${email}`;

    if (data.length > 0) return { error: false };

    await sql`INSERT INTO users(user_id, name, image, email) VALUES(${id}, ${name}, ${image}, ${email});`;
    return { error: false };
  } catch (error) {
    console.error("Error saving user to DB: ", error);
    return { error: true };
  }
}
