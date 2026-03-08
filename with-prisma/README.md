# Getting started with Databricks Lakebase and Prisma

This example uses [Prisma](https://www.prisma.io) with Lakebase. The app uses `getPrisma()` from `lib/lakebase.ts`, which fetches a short-lived token and returns a cached `PrismaClient` with the correct connection URL.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-prisma ./with-prisma
cd with-prisma
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`). For running migrations, set `DATABASE_URL` to a valid Postgres URL (e.g. from the same Lakebase token script or a one-off connection string).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples). Run migrations: `npx prisma migrate dev --name init` (with `DATABASE_URL` set).

## Run the application

```bash
npm install
npx ts-node index.ts
```
