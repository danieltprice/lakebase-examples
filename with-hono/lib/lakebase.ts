// Fetches short-lived DB tokens from Databricks; caches connection for edge (serverless driver).
import { neon } from "@neondatabase/serverless";

const MAX_AGE_MS =
  (parseFloat(process.env.LAKEBASE_LAZY_REFRESH_BUFFER_MINUTES ?? "2") || 2) *
  60 *
  1000;

let cached: { sql: ReturnType<typeof neon>; expiresAt: number } | null = null;

async function fetchToken(): Promise<string> {
  const host = process.env.DATABRICKS_HOST!;
  const clientId = process.env.DATABRICKS_CLIENT_ID!;
  const clientSecret = process.env.DATABRICKS_CLIENT_SECRET!;
  const endpoint = process.env.LAKEBASE_ENDPOINT!;

  const credentials = btoa(`${clientId}:${clientSecret}`);
  const oidcRes = await fetch(`https://${host}/oidc/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials&scope=all-apis",
  });
  const { access_token } = await oidcRes.json();

  const dbRes = await fetch(`https://${host}/api/2.0/postgres/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ endpoint }),
  });
  const { token } = await dbRes.json();
  return token;
}

export async function getConnectionString(): Promise<string> {
  const password = await fetchToken();
  const host = process.env.LAKEBASE_HOST!;
  const port = process.env.LAKEBASE_PORT ?? "5432";
  const database = process.env.LAKEBASE_DATABASE ?? "databricks_postgres";
  const user = encodeURIComponent(process.env.DATABRICKS_CLIENT_ID!);
  const pass = encodeURIComponent(password);
  return `postgresql://${user}:${pass}@${host}:${port}/${database}?sslmode=require`;
}

export async function getSql() {
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.sql;
  }
  const connectionString = await getConnectionString();
  const sql = neon(connectionString);
  cached = { sql, expiresAt: now + MAX_AGE_MS };
  return sql;
}
