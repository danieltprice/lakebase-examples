// Edge-compatible: fetches Lakebase connection string and caches a serverless client with TTL.
import { neon } from "@neondatabase/serverless";

const MAX_AGE_MS = 50 * 60 * 1000; // 50 min
let cached: { sql: ReturnType<typeof neon>; expiresAt: number } | null = null;

async function getConnectionString(): Promise<string> {
  const host = process.env.DATABRICKS_HOST!;
  const clientId = process.env.DATABRICKS_CLIENT_ID!;
  const clientSecret = process.env.DATABRICKS_CLIENT_SECRET!;
  const endpoint = process.env.LAKEBASE_ENDPOINT!;
  const dbHost = process.env.LAKEBASE_HOST!;
  const port = process.env.LAKEBASE_PORT ?? "5432";
  const database = process.env.LAKEBASE_DATABASE ?? "databricks_postgres";

  const credentials = btoa(`${clientId}:${clientSecret}`);
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
  const { token } = (await dbRes.json()) as { token: string };

  const user = encodeURIComponent(clientId);
  const password = encodeURIComponent(token);
  return `postgresql://${user}:${password}@${dbHost}:${port}/${database}?sslmode=require`;
}

/** Returns a serverless SQL client for Lakebase; cached with TTL for edge. */
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
