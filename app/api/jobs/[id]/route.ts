import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_request: NextRequest, { params }) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json("Error: Missing id", { status: 401 });
  }

  try {
    const result = await sql`
    SELECT job_id, status, credits_cost, created_at, completed_at, job_type FROM jobs WHERE user_id = ${id};
    `;

    return NextResponse.json(
      { length: result.length, data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching jobs: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
