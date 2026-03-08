// Edge-compatible: Lakebase connection string + cached serverless client for Drizzle.
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const MAX_AGE_MS = 50 * 60 * 1000;
let cached: { db: ReturnType<typeof drizzle>; expiresAt: number } | null = null;

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

export async function getDb() {
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.db;
  }
  const connectionString = await getConnectionString();
  const pool = new Pool({ connectionString });
  const db = drizzle(pool);
  cached = { db, expiresAt: now + MAX_AGE_MS };
  return db;
}
