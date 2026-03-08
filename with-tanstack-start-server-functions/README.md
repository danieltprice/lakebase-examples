# Getting started with Databricks Lakebase and TanStack Start (server functions)

This TanStack Start app connects to Lakebase using **pg** and **postgres.js** with token rotation. Server functions in `src/data/get-neon-data.ts` use `src/data/lakebase.ts`.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-tanstack-start-server-functions ./with-tanstack-start-server-functions
cd with-tanstack-start-server-functions
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
