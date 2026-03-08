# Deploy with Render and Databricks Lakebase

This example deploys a Node.js (Express + pg) app to **Render** using **Databricks Lakebase** as the Postgres database. The app uses `lib/lakebase.js` for token rotation.

## Lakebase setup

1. Create a Lakebase instance and a service principal with database access.
2. In the Render dashboard, add **Environment** variables for your service (in `neon-render-example`):
   - `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`
   - `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`

## Local test

```bash
cd neon-render-example
cp ../.env.example .env
# Edit .env with your Lakebase credentials
npm install
node --env-file=.env index.js
```

## Deploy to Render

Deploy the `neon-render-example` service to Render and configure the Lakebase environment variables in the Render dashboard. The app will use them to connect via token rotation.
