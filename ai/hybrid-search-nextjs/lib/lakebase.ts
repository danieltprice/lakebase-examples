// Lakebase token rotation; cached getSql() for serverless-style usage.
import { neon } from "@neondatabase/serverless";

const MAX_AGE_MS = 55 * 60 * 1000;
const BUFFER_MS = 2 * 60 * 1000;
let cached: { sql: ReturnType<typeof neon>; expiresAt: number } | null = null;
let tokenCache: string | null = null;
let tokenExpiresAt = 0;

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
  tokenCache = token;
  tokenExpiresAt = new Date(expire_time).getTime();
  return token;
}

async function getConnectionString(): Promise<string> {
  if (!tokenCache || Date.now() >= tokenExpiresAt - BUFFER_MS) {
    await fetchToken();
  }
  const user = encodeURIComponent(process.env.DATABRICKS_CLIENT_ID!);
  const password = encodeURIComponent(tokenCache!);
  const host = process.env.LAKEBASE_HOST!;
  const port = process.env.LAKEBASE_PORT ?? "5432";
  const database = process.env.LAKEBASE_DATABASE ?? "databricks_postgres";
  return `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
}

export async function getSql() {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.sql;
  const connectionString = await getConnectionString();
  const sql = neon(connectionString);
  cached = { sql, expiresAt: now + MAX_AGE_MS };
  return sql;
}
