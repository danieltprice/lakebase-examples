// Fetches short-lived DB token from Databricks for Cloudflare Workers; caches client.
import { neon } from "@neondatabase/serverless";

const MAX_AGE_MS = 55 * 60 * 1000;
let cached = null;

async function fetchConnectionString(env) {
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

  const user = encodeURIComponent(env.DATABRICKS_CLIENT_ID);
  const password = encodeURIComponent(token);
  const host = env.LAKEBASE_HOST;
  const port = env.LAKEBASE_PORT || "5432";
  const database = env.LAKEBASE_DATABASE || "databricks_postgres";
  return `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
}

export async function getSql(env) {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.sql;
  const connectionString = await fetchConnectionString(env);
  const sql = neon(connectionString);
  cached = { sql, expiresAt: now + MAX_AGE_MS };
  return sql;
}
