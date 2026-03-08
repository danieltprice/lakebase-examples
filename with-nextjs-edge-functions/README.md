# Getting started with Databricks Lakebase and Next.js (Edge API Routes)

This example uses the **Neon serverless driver** on the edge (required for Edge runtime). The connection string is built from Lakebase tokens and the client is cached with a TTL.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-nextjs-edge-functions ./with-nextjs-edge-functions
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
npm run dev
```

The edge API route returns the database version.
