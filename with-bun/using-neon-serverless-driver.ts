/**
 * Run with: bun run using-neon-serverless-driver.ts
 * Uses pg pool with Lakebase token rotation (standard driver).
 */
import { pool } from "./lib/lakebase";

const result = await pool.query("SELECT version()");
console.log(result.rows[0]);
await pool.end();
