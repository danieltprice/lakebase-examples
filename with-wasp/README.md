# Getting started with Databricks Lakebase and Wasp

This [Wasp](https://wasp-lang.dev) app uses PostgreSQL. Wasp reads the database URL from the environment (e.g. `.env.server`).

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-wasp ./with-wasp
cd with-wasp
```

## Configure the database

Copy `.env.example` to `.env.server`. For **Databricks Lakebase**, set `DATABASE_URL` to a Postgres URL that uses a short-lived token. You can use a script that calls the Databricks OIDC and postgres/credentials APIs to get the token and build the URL (see other examples in this repo for the token flow). Set the required Lakebase env vars (`DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, etc.) and run your script to export `DATABASE_URL` before starting Wasp, or paste the URL into `.env.server`.

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the application

```bash
wasp db migrate-dev
wasp start
```
