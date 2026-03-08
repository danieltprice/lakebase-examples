# Getting started with Databricks Lakebase and NestJS

This NestJS app connects to Lakebase using **pg** with a password callback. The `DatabaseModule` provides a Pool from `src/database/lakebase.ts`.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-nestjs ./with-nestjs
cd with-nestjs
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples). Ensure the `playing_with_neon` table exists (or change the controller to use your table).

## Run the application

```bash
npm install
npm run start
```
