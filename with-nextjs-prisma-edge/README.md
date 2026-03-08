# Getting started with Databricks Lakebase, Next.js, Prisma and Edge

This example uses the **PrismaNeon adapter** on the edge. The Lakebase connection string is built from tokens and the Prisma client is cached with a TTL.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-nextjs-prisma-edge ./with-nextjs-prisma-edge
```

Copy the `.env.example` file and fill in your Databricks service principal and Lakebase connection details:

```bash
cp .env.example .env
```

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST`.

## Install and run

```bash
npm install
npm run prisma:initiate
npm run dev
```
