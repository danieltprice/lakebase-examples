# Deploy with Cloudflare Workers and Databricks Lakebase

This example deploys a **Cloudflare Worker** that connects to **Databricks Lakebase**. The worker uses `getSql(env)` from `src/lakebase.js`, which fetches a short-lived token and caches the Postgres client.

## Lakebase setup

1. Create a Lakebase instance and a service principal with database access.
2. Set Worker secrets (e.g. `wrangler secret put DATABRICKS_CLIENT_ID`):
   - `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`
   - `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`

## Local test

Copy `.env.example` to `.dev.vars` and fill in your Lakebase credentials. Run with `npm run dev` (or `wrangler dev`).

## Deploy

Deploy with `npm run deploy` (or `wrangler deploy`) and set the Lakebase secrets in the Cloudflare dashboard or via Wrangler.
