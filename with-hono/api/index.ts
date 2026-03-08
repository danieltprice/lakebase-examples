import { Hono } from "hono";
import { handle } from "hono/vercel";
import { getSql } from "../lib/lakebase";

export const config = {
  runtime: "edge",
};

const app = new Hono().basePath("/api");

app.get("/", async (c) => {
  const sql = await getSql();
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  return c.json({ version });
});

export default handle(app);
