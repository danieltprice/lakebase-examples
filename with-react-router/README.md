# Getting started with Databricks Lakebase and React Router

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-react-router ./with-react-router
```

Copy the `.env.example` file:

```bash
cp .env.example .env
```

## Configure your Lakebase credentials

Fill in your `.env` file with your Databricks service principal and Lakebase connection details. The app uses short-lived database tokens fetched automatically from Databricks — no manual credential rotation needed.

## Before you run — complete these steps

**1. Create a Lakebase instance** (if you don't have one)
```bash
databricks postgres create-project --display-name "my-project"
databricks postgres create-branch "projects/<id>" --display-name "main"
databricks postgres create-endpoint "projects/<id>/branches/<id>"
```

**2. Set up a service principal** in your Databricks workspace (Settings → Service Principals). Generate a client secret.

**3. Grant the service principal database access** (connect with owner token from `databricks postgres generate-database-credential`, then run `CREATE EXTENSION databricks_auth`, `databricks_create_role`, and grant schema/table permissions).

**4. Find your `LAKEBASE_ENDPOINT` and `LAKEBASE_HOST`** using `databricks postgres list-projects`, `list-branches`, and `list-endpoints`.

## Install and run

```bash
npm install
npm run dev
```
