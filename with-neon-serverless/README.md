# Getting started with Databricks Lakebase and Node.js (pg)

This example connects to Lakebase from Node.js using the **pg** driver. Scripts use a shared `lib/lakebase.js` pool with token rotation.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-neon-serverless ./with-neon-serverless
cd with-neon-serverless
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the scripts

```bash
npm install
node create_table.js
node read_data.js
node update_data.js
node delete_data.js
```
