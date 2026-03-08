# Getting started with Databricks Lakebase and Knex

This example uses **Knex** with the **pg** driver. The connection string is obtained at runtime from `lib/lakebase.js`, which fetches a short-lived token from the Databricks API.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-knex ./with-knex
cd with-knex
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access. Ensure the `playing_with_neon` table exists (or change the query in `index.tsx`).

## Run

```bash
npm install
npm test
```
