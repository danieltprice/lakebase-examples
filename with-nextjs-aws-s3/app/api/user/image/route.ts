import { NextResponse, type NextRequest } from "next/server";
import { pool } from "../../../lib/lakebase";

export async function POST(request: NextRequest) {
  const { objectUrl } = await request.json();
  if (!process.env.LAKEBASE_HOST || !process.env.DATABRICKS_CLIENT_ID) {
    return new Response(null, { status: 500 });
  }
  try {
    await pool.query(
      'CREATE TABLE IF NOT EXISTS "user" (name TEXT, image TEXT)'
    );
    const user = "rishi";
    await pool.query(
      'INSERT INTO "user" (name, image) VALUES ($1, $2)',
      [user, objectUrl]
    );
    return NextResponse.json({ code: 1 });
  } catch (e) {
    return NextResponse.json({
      code: 0,
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
