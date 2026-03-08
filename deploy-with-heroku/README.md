# Deploy with Heroku and Databricks Lakebase

This example deploys a Node.js (Express + pg) app to **Heroku** using **Databricks Lakebase** as the Postgres database. The app uses `lib/lakebase.js` for token rotation.

## Lakebase setup

1. Create a Lakebase instance and a service principal with database access.
2. Set config vars on your Heroku app (e.g. `heroku config:set DATABRICKS_HOST=...`):
   - `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`
   - `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`

## Local test

```bash
cd neon-heroku-example
cp ../.env.example .env
# Edit .env with your Lakebase credentials
npm install
node --env-file=.env index.js
```

## Deploy to Heroku

Deploy the `neon-heroku-example` app to Heroku and set the Lakebase config vars. The app will connect via token rotation.
