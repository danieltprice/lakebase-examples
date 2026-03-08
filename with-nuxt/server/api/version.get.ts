import { pool } from "../utils/lakebase";

export default defineCachedEventHandler(async () => {
  const result = await pool.query("SELECT version()");
  const row = result.rows[0];
  return row ? { version: (row as { version: string }).version } : { version: "" };
}, {
  maxAge: 60 * 60 * 24,
});
