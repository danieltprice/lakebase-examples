# Getting started with Databricks Lakebase and Hono (Edge)

This example connects to Lakebase from a Hono app deployed on Vercel Edge. It uses the **serverless driver** (`@neondatabase/serverless`) with a dynamically built connection string and token rotation (cached with TTL).

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-hono ./with-hono
cd with-hono
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the application

```bash
npm install
npm run dev
```

Deploy to Vercel; the API route runs on the edge and uses Lakebase with token rotation.
