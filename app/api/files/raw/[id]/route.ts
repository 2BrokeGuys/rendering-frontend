import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_request: NextRequest, { params }) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json("Error: Missing id", { status: 401 });
  }

  try {
    const result =
      await sql`SELECT file_name FROM files WHERE user_id = ${id} AND file_type = 'raw'`;

    return NextResponse.json(
      { length: result.length, data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching Raw files: ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
