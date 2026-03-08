// Fetches short-lived DB token from Databricks; caches neon client for Netlify Functions.
import { neon } from "@neondatabase/serverless";

const MAX_AGE_MS = 55 * 60 * 1000;
const BUFFER_MS = 2 * 60 * 1000;
let cached = null;
let tokenCache = null;
let tokenExpiresAt = 0;

async function fetchToken() {
  const host = process.env.DATABRICKS_HOST;
  const clientId = process.env.DATABRICKS_CLIENT_ID;
  const clientSecret = process.env.DATABRICKS_CLIENT_SECRET;
  const endpoint = process.env.LAKEBASE_ENDPOINT;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
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
  const { token, expire_time } = await dbRes.json();
  tokenCache = token;
  tokenExpiresAt = new Date(expire_time).getTime();
  return token;
}

async function getConnectionString() {
  if (tokenCache && Date.now() < tokenExpiresAt - BUFFER_MS) {
    // use cached token
  } else {
    await fetchToken();
  }
  const user = encodeURIComponent(process.env.DATABRICKS_CLIENT_ID);
  const password = encodeURIComponent(tokenCache);
  const dbHost = process.env.LAKEBASE_HOST;
  const port = process.env.LAKEBASE_PORT || "5432";
  const database = process.env.LAKEBASE_DATABASE || "databricks_postgres";
  return `postgresql://${user}:${password}@${dbHost}:${port}/${database}?sslmode=require`;
}

export async function getSql() {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.sql;
  const connectionString = await getConnectionString();
  const sql = neon(connectionString);
  cached = { sql, expiresAt: now + MAX_AGE_MS };
  return sql;
}
