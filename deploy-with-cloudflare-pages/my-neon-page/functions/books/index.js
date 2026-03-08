import { getSql } from "../lakebase.js";

export async function onRequestGet(context) {
  const sql = await getSql(context.env);
  const rows = await sql`SELECT * FROM books_to_read;`;
  return new Response(JSON.stringify(rows));
}
