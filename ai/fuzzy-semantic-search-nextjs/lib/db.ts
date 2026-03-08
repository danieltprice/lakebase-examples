// Use Lakebase (getSql) when DATABRICKS_HOST and LAKEBASE_HOST are set; otherwise DATABASE_URL.
import { getSql } from './lakebase'

function useLakebase(): boolean {
  return !!(typeof process !== 'undefined' && process.env?.DATABRICKS_HOST && process.env?.LAKEBASE_HOST)
}

export async function getDb() {
  if (useLakebase()) {
    return await getSql()
  }
  const connectionString = process.env.DATABASE_URL_POOLER || process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL or Lakebase env vars (DATABRICKS_HOST, LAKEBASE_HOST, etc.) are required')
  }
  const { neon } = await import('@neondatabase/serverless')
  return neon(connectionString)
}

export function isUsingPooler(): boolean {
  return !!(typeof process !== 'undefined' && process.env?.DATABASE_URL_POOLER)
}
