export const runtime = "edge";

import { getSql } from "../../lib/lakebase";

export async function GET() {
  if (
    !process.env.LAKEBASE_HOST ||
    !process.env.DATABRICKS_CLIENT_ID
  ) {
    return new Response(null, { status: 500 });
  }
  const sql = await getSql();
  const response = await sql`SELECT version()`;
  return new Response(response[0].version);
}
