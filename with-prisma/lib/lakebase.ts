// Fetches short-lived DB tokens from Databricks; returns connection string for Prisma.
import { PrismaClient } from "@prisma/client";

const MAX_AGE_MS = 50 * 60 * 1000; // 50 min (under 60 min token lifetime)
let cached: { client: PrismaClient; expiresAt: number } | null = null;

async function getConnectionString(): Promise<string> {
  const host = process.env.DATABRICKS_HOST!;
  const clientId = process.env.DATABRICKS_CLIENT_ID!;
  const clientSecret = process.env.DATABRICKS_CLIENT_SECRET!;
  const endpoint = process.env.LAKEBASE_ENDPOINT!;
  const dbHost = process.env.LAKEBASE_HOST!;
  const port = process.env.LAKEBASE_PORT ?? "5432";
  const database = process.env.LAKEBASE_DATABASE ?? "databricks_postgres";

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
  const { token } = (await dbRes.json()) as { token: string };

  const user = encodeURIComponent(clientId);
  const password = encodeURIComponent(token);
  return `postgresql://${user}:${password}@${dbHost}:${port}/${database}?sslmode=require`;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

export async function getPrisma(): Promise<PrismaClient> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.client;
  }
  const url = await getConnectionString();
  const client = new PrismaClient({ datasources: { db: { url } } });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  cached = { client, expiresAt: now + MAX_AGE_MS };
  return client;
}
