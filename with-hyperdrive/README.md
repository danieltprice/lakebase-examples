# Getting started with Databricks Lakebase and Cloudflare Workers

This example connects to Lakebase from a Cloudflare Worker using **postgres.js** and short-lived tokens from the Databricks API (cached with TTL). It replaces the previous Hyperdrive binding with direct Lakebase connection.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-hyperdrive ./with-hyperdrive
cd with-hyperdrive
```

## Configure Lakebase

Copy `.env.example` to `.dev.vars` (for local dev with `wrangler dev`) and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`. For production, set these as secrets in the Cloudflare Workers dashboard.

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples). Ensure the `public."Comment"` table exists (or adjust the query in `src/index.ts`).

## Run the application

```bash
npm install
npm run dev
```

Deploy with `npm run deploy`.
