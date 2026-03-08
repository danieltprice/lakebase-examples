# Deploy with Netlify Functions and Databricks Lakebase

This example deploys a Netlify site with serverless functions that connect to **Databricks Lakebase**. The function uses `getSql()` from `lakebase.mjs`, which fetches a short-lived token and caches the Postgres client.

## Lakebase setup

1. Create a Lakebase instance and a service principal with database access.
2. In Netlify (Site settings → Environment variables), add:
   - `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`
   - `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`

## Local test

```bash
cd neon-netlify-example
cp ../.env.example .env
# Edit .env with your Lakebase credentials
npm install
netlify dev
```

## Deploy

Deploy to Netlify and set the Lakebase environment variables in the dashboard.
