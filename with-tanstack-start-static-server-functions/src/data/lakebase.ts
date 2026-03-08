// Lakebase token rotation: pg Pool and postgres.js client with cached connection string.
import { Pool } from "pg";
import postgres from "postgres";

const BUFFER_MS =
  (parseFloat(process.env.LAKEBASE_LAZY_REFRESH_BUFFER_MINUTES ?? "2") || 2) *
  60 *
  1000;

let cachedToken: string | null = null;
let expiresAt = 0;
let refreshPromise: Promise<string> | null = null;

async function fetchToken(): Promise<string> {
  const host = process.env.DATABRICKS_HOST!;
  const clientId = process.env.DATABRICKS_CLIENT_ID!;
  const clientSecret = process.env.DATABRICKS_CLIENT_SECRET!;
  const endpoint = process.env.LAKEBASE_ENDPOINT!;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const oidcRes = await fetch(`https://${host}/oidc/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials&scope=all-apis",
  });
  const { access_token } = (await oidcRes.json()) as { access_token: string };

  const dbRes = await fetch(`https://${host}/api/2.0/postgres/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ endpoint }),
  });
  const { token, expire_time } = (await dbRes.json()) as { token: string; expire_time: string };
  cachedToken = token;
  expiresAt = new Date(expire_time).getTime();
  return token;
}

async function getPassword(): Promise<string> {
  if (cachedToken && Date.now() < expiresAt - BUFFER_MS) {
    return cachedToken;
  }
  if (!refreshPromise) {
    refreshPromise = fetchToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export const pool = new Pool({
  host: process.env.LAKEBASE_HOST,
  port: parseInt(process.env.LAKEBASE_PORT ?? "5432", 10),
  database: process.env.LAKEBASE_DATABASE ?? "databricks_postgres",
  user: process.env.DATABRICKS_CLIENT_ID,
  password: getPassword,
  ssl: { rejectUnauthorized: true },
});

let cachedSql: ReturnType<typeof postgres> | null = null;
let cachedSqlExpires = 0;

export async function getPostgresJs() {
  if (cachedSql && Date.now() < cachedSqlExpires) {
    return cachedSql;
  }
  const password = await getPassword();
  const user = encodeURIComponent(process.env.DATABRICKS_CLIENT_ID!);
  const pass = encodeURIComponent(password);
  const host = process.env.LAKEBASE_HOST!;
  const port = process.env.LAKEBASE_PORT ?? "5432";
  const database = process.env.LAKEBASE_DATABASE ?? "databricks_postgres";
  const url = `postgresql://${user}:${pass}@${host}:${port}/${database}?sslmode=require`;
  cachedSql = postgres(url, { ssl: "require" });
  cachedSqlExpires = Date.now() + 50 * 60 * 1000;
  return cachedSql;
}
