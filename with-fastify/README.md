# Getting started with Databricks Lakebase and Fastify

This example connects to Lakebase from a Fastify app using **pg** with a password callback for token rotation.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-fastify ./with-fastify
```

Copy the `.env.example` file and set Lakebase env vars (Databricks service principal + LAKEBASE_*). The app uses `lib/lakebase.js` to provide the pool config with lazy token refresh.

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST`.

## Run the application

```bash
npm install
npm run dev
```

The root route returns rows from the database table.
