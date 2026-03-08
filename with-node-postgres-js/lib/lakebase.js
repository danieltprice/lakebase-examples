// Fetches short-lived DB tokens from Databricks; refreshes automatically before expiry.
// postgres.js uses connection string only, so we cache a client with TTL.
import 'dotenv/config';
import postgres from 'postgres';

const MAX_AGE_MS = 50 * 60 * 1000; // 50 minutes (under 60 min token lifetime)
let cached = null;

async function getConnectionString() {
  const host = process.env.DATABRICKS_HOST;
  const clientId = process.env.DATABRICKS_CLIENT_ID;
  const clientSecret = process.env.DATABRICKS_CLIENT_SECRET;
  const endpoint = process.env.LAKEBASE_ENDPOINT;
  const dbHost = process.env.LAKEBASE_HOST;
  const port = process.env.LAKEBASE_PORT || '5432';
  const database = process.env.LAKEBASE_DATABASE || 'databricks_postgres';

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const oidcRes = await fetch(`https://${host}/oidc/v1/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials&scope=all-apis',
  });
  const { access_token } = await oidcRes.json();

  const dbRes = await fetch(`https://${host}/api/2.0/postgres/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ endpoint }),
  });
  const { token } = await dbRes.json();

  const user = encodeURIComponent(clientId);
  const password = encodeURIComponent(token);
  return `postgresql://${user}:${password}@${dbHost}:${port}/${database}?sslmode=require`;
}

/**
 * Returns a postgres.js client connected to Lakebase. Client is cached and refreshed when expired.
 * Call sql.end() when done if running as a script.
 */
export async function getSql() {
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.sql;
  }
  const connectionString = await getConnectionString();
  const sql = postgres(connectionString, { ssl: 'require', max: 1 });
  cached = { sql, expiresAt: now + MAX_AGE_MS };
  return sql;
}
