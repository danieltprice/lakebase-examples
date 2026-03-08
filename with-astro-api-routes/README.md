# Getting started with Databricks Lakebase and Astro API Routes

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-astro-api-routes ./with-astro-api-routes
```

Copy the `.env.example` file and fill in your Databricks service principal and Lakebase connection details:

```bash
cp .env.example .env
```

The app uses short-lived database tokens from Databricks — no manual credential rotation needed.

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST` (see other examples for the full checklist).

## Install and run

```bash
npm install
npm run dev
```

POST to `/api/version` to get the database version.
