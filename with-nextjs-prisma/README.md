# Getting started with Databricks Lakebase, Next.js and Prisma

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-nextjs-prisma ./with-nextjs-prisma
```

Copy the `.env.example` file and fill in your Databricks service principal and Lakebase connection details:

```bash
cp .env.example .env
```

The app uses short-lived database tokens from Databricks; `getPrisma()` returns a cached PrismaClient that refreshes when the token is stale.

For migrations and seed, set `DATABASE_URL` to a Lakebase connection string (e.g. from `databricks postgres generate-database-credential`).

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST` (see main repo or other examples).

## Install and run

```bash
npm install
npm run setup   # migrate + seed (requires DATABASE_URL)
npm run dev
```
