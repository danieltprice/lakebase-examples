# Getting started with Databricks Lakebase and Ruby

This example connects to Lakebase from Ruby using the **pg** gem. `lakebase_auth.rb` fetches a short-lived token from the Databricks API and returns a Postgres connection string.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-ruby ./with-ruby
cd with-ruby
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples). Ensure the `playing_with_neon` table exists.

## Run the application

```bash
bundle install
ruby index.rb
```
