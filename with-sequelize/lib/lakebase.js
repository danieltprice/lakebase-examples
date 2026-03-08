// Fetches short-lived DB tokens from Databricks; returns connection string.
const BUFFER_MS =
  parseFloat(process.env.LAKEBASE_LAZY_REFRESH_BUFFER_MINUTES || "2") * 60 * 1000;

let cachedToken = null;
let expiresAt = 0;
let refreshPromise = null;

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

  cachedToken = token;
  expiresAt = new Date(expire_time).getTime();
  return token;
}

async function getPassword() {
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

async function getConnectionString() {
  const password = encodeURIComponent(await getPassword());
  const user = encodeURIComponent(process.env.DATABRICKS_CLIENT_ID);
  const host = process.env.LAKEBASE_HOST;
  const port = process.env.LAKEBASE_PORT || "5432";
  const database = process.env.LAKEBASE_DATABASE || "databricks_postgres";
  return `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require`;
}

module.exports = { getConnectionString };
