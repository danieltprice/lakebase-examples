# Getting started with Databricks Lakebase and Bun

This example connects to Lakebase from [Bun](https://bun.sh) using the **pg** driver with a password callback for token rotation. Bun loads `.env` automatically; set Lakebase env vars there.

## Clone the repository

```bash
bunx degit databricks-solutions/lakebase-examples/with-bun ./with-bun
cd with-bun
```

## Configure Lakebase

Copy `.env.example` to `.env` (or `.env.local`) and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST` (see main repo or other examples).

## Run the application

```bash
bun install
bun run using-neon-serverless-driver.ts
```

The script uses the shared `lib/lakebase.ts` pool (pg with token rotation) and prints the Postgres version.
