# Getting started with Databricks Lakebase, Next.js and Drizzle

This example uses **Drizzle ORM** with the standard **pg** driver and a Lakebase pool (token rotation). The API route runs on Node (not edge) so it can use `pg`.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-nextjs-drizzle-local-vercel ./with-nextjs-drizzle-local-vercel
```

Copy the `.env.example` file and fill in your Databricks service principal and Lakebase connection details:

```bash
cp .env.example .env
```

For `drizzle-kit` migrations, set `DATABASE_URL` to a Lakebase connection string (e.g. from `databricks postgres generate-database-credential`).

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST`.

## Install and run

```bash
npm install
npm run dev
```
