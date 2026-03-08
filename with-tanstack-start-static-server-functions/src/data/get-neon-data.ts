import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { pool, getPostgresJs } from "./lakebase";

export const getServerlessDriverData = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    const { rows } = await pool.query("SELECT version()");
    return rows[0]?.version ?? "";
  });

export const getPostgresJsData = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    const sql = await getPostgresJs();
    const response = await sql`SELECT version()`;
    return response[0]?.version ?? "";
  });

export const getNodePostgresData = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    const client = await pool.connect();
    try {
      const { rows } = await client.query("SELECT version()");
      return rows[0]?.version ?? "";
    } finally {
      client.release();
    }
  });
