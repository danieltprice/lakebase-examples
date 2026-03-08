import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../lib/lakebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { rows } = await pool.query("SELECT version()");
  res.status(200).json({
    message: rows[0].version,
  });
}
