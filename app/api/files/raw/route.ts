import { sql } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const session = await getToken({ req: request });

  if (!session) {
    return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  }

  const { sub: userId } = session;
  const { file_name } = await request.json();

  if (!file_name) {
    return NextResponse.json("File name is required", { status: 401 });
  }

  try {
    await sql`INSERT INTO files (user_id, file_name, file_type) VALUES (${userId}, ${file_name}, 'raw');`;
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log("Error storing file metadata: ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
