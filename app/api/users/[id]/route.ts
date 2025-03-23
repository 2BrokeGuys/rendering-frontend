import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_request: NextRequest, { params }) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "User ID missing" }, { status: 401 });
  }

  try {
    const result = await sql`
    SELECT name, email, credits FROM users WHERE user_id = ${id};
    `;

    if (!result.length) {
      return NextResponse.json(
        { error: "User with the given ID does not exist" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user details: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const DELETE = async (_request: NextRequest, { params }) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json("Error: Missing id", { status: 401 });
  }

  try {
    const user = await sql`SELECT * FROM users WHERE user_id = ${id}`;

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await sql`DELETE FROM users WHERE user_id = ${id}`;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting user: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
