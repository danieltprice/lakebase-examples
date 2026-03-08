# Getting started with Databricks Lakebase and Sequelize

This example uses [Sequelize](https://sequelize.org) with Lakebase. The app calls `getConnectionString()` from `lib/lakebase.js` to get a Postgres URL with token rotation, then creates a `Sequelize` instance.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-sequelize ./with-sequelize
cd with-sequelize
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the application

```bash
npm install
npm test
```
