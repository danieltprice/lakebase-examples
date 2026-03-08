# Getting started with Databricks Lakebase and TanStack Start (static server functions)

This TanStack Start app uses static server functions and connects to Lakebase via **pg** and **postgres.js** with token rotation. See `src/data/lakebase.ts` and `src/data/get-neon-data.ts`.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-tanstack-start-static-server-functions ./with-tanstack-start-static-server-functions
cd with-tanstack-start-static-server-functions
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
