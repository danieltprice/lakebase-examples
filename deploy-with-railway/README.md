# Deploy with Railway and Databricks Lakebase

This example deploys a Node.js (Express + pg) app to **Railway** using **Databricks Lakebase** as the Postgres database. The app uses `lib/lakebase.js` for token rotation.

## Lakebase setup

1. Create a Lakebase instance and a service principal with database access.
2. In Railway, add **Variables** for the `neon-railway-example` service:
   - `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`
   - `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`

## Local test

```bash
cd neon-railway-example
cp ../.env.example .env
# Edit .env with your Lakebase credentials
npm install
node --env-file=.env index.js
```

## Deploy to Railway

Deploy the `neon-railway-example` service to Railway and set the Lakebase environment variables. The app will connect via token rotation.
