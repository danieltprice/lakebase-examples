# Getting started with Databricks Lakebase and Go (pgx)

This example connects to Lakebase from Go using [pgx](https://github.com/jackc/pgx). The `lakebase` package fetches a short-lived token from the Databricks API and returns a connection string.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-golang ./with-golang
cd with-golang
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access (see main repo or other examples).

## Run the scripts

```bash
go mod tidy
go run create_table.go
go run read_data.go
go run update_data.go
go run delete_data.go
```
