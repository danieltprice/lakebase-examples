import type { APIRoute } from "astro";
import { pool } from "../../lib/lakebase";

export const POST: APIRoute = async () => {
  const { rows } = await pool.query("SELECT version()");
  return new Response(rows[0].version);
};
