# Getting started with Databricks Lakebase and Go (GORM)

This example connects to Lakebase from Go using [GORM](https://gorm.io) and the standard PostgreSQL driver. The `lakebase` package fetches a short-lived token from the Databricks API and returns a connection string.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-golang-gorm ./with-golang-gorm
cd with-golang-gorm
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the application

```bash
go mod tidy
go run app.go
```
