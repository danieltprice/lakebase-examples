# Deploy with Cloudflare Pages and Databricks Lakebase

This example deploys a **Cloudflare Pages** site with Functions that connect to **Databricks Lakebase**. The functions use `getSql(env)` from `functions/lakebase.js`, which fetches a short-lived token and caches the Postgres client.

## Lakebase setup

1. Create a Lakebase instance and a service principal with database access.
2. In Cloudflare Pages (Settings → Environment variables), add:
   - `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`
   - `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`

## Local test

Copy `.env.example` to `.dev.vars` for local development. Run with `npm run pages:dev` (or your Pages dev command).

## Deploy

Deploy to Cloudflare Pages and set the Lakebase environment variables in the dashboard.
