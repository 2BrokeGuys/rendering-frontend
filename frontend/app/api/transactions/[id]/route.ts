import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_request: NextRequest, { params }) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json("Error: Missing id", { status: 401 });
  }

  try {
    const result = await sql`
    SELECT stripe_payment_id, amount, status, created_at, payment_method FROM transactions WHERE user_id = ${id};
    `;

    return NextResponse.json(
      { length: result.length, data: result },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching transactions: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
