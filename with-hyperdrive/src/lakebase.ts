// Fetches short-lived DB tokens from Databricks; caches connection for Workers.
import postgres from "postgres";

const MAX_AGE_MS = 55 * 60 * 1000; // 55 minutes

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
  const { access_token } = await oidcRes.json();

  const dbRes = await fetch(`https://${env.DATABRICKS_HOST}/api/2.0/postgres/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ endpoint: env.LAKEBASE_ENDPOINT }),
  });
  const { token } = await dbRes.json();
  return token;
}

export async function getConnectionString(env: LakebaseEnv): Promise<string> {
  const password = await fetchToken(env);
  const host = env.LAKEBASE_HOST;
  const port = env.LAKEBASE_PORT ?? "5432";
  const database = env.LAKEBASE_DATABASE ?? "databricks_postgres";
  const user = encodeURIComponent(env.DATABRICKS_CLIENT_ID);
  const pass = encodeURIComponent(password);
  return `postgresql://${user}:${pass}@${host}:${port}/${database}?sslmode=require`;
}

export async function getSql(env: LakebaseEnv) {
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.sql;
  }
  const connectionString = await getConnectionString(env);
  const sql = postgres(connectionString);
  cached = { sql, expiresAt: now + MAX_AGE_MS };
  return sql;
}
