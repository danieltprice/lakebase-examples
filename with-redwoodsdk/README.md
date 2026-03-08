# Getting started with Databricks Lakebase and RedwoodSDK

This RedwoodSDK app runs on Cloudflare Workers and connects to Lakebase using **postgres.js**. The app uses `src/lakebase.ts` to fetch a short-lived token and cache a Postgres client.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-redwoodsdk ./with-redwoodsdk
cd with-redwoodsdk
npm install
```

## Configure Lakebase

Set Lakebase-related secrets in Wrangler (e.g. for local dev use `.dev.vars`; for production use `wrangler secret put`):

- `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`
- `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`

Copy `.env.example` to `.dev.vars` and fill in the values for local development.

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the application

```bash
npm run dev
```

Open the app URL (e.g. `http://localhost:5173`) to see the PostgreSQL version from Lakebase.
