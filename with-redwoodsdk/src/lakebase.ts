// Fetches short-lived DB token from Databricks for Cloudflare Workers; caches postgres client.
import postgres from "postgres";

const MAX_AGE_MS = 55 * 60 * 1000;

export interface LakebaseEnv {
  DATABRICKS_HOST: string;
  DATABRICKS_CLIENT_ID: string;
  DATABRICKS_CLIENT_SECRET: string;
  LAKEBASE_ENDPOINT: string;
  LAKEBASE_HOST: string;
  LAKEBASE_PORT?: string;
  LAKEBASE_DATABASE?: string;
}

let cached: { sql: ReturnType<typeof postgres>; expiresAt: number } | null = null;

async function fetchToken(env: LakebaseEnv): Promise<string> {
  const credentials = btoa(`${env.DATABRICKS_CLIENT_ID}:${env.DATABRICKS_CLIENT_SECRET}`);
  const oidcRes = await fetch(`https://${env.DATABRICKS_HOST}/oidc/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials&scope=all-apis",
  });
  const { access_token } = (await oidcRes.json()) as { access_token: string };

  const dbRes = await fetch(`https://${env.DATABRICKS_HOST}/api/2.0/postgres/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ endpoint: env.LAKEBASE_ENDPOINT }),
  });
  const { token } = (await dbRes.json()) as { token: string };
  return token;
}

export async function getSql(env: LakebaseEnv) {
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.sql;
  }
  const password = await fetchToken(env);
  const host = env.LAKEBASE_HOST;
  const port = env.LAKEBASE_PORT ?? "5432";
  const database = env.LAKEBASE_DATABASE ?? "databricks_postgres";
  const user = encodeURIComponent(env.DATABRICKS_CLIENT_ID);
  const pass = encodeURIComponent(password);
  const connectionString = `postgresql://${user}:${pass}@${host}:${port}/${database}?sslmode=require`;
  const sql = postgres(connectionString, { ssl: "require" });
  cached = { sql, expiresAt: now + MAX_AGE_MS };
  return sql;
}
