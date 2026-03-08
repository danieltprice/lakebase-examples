# Getting started with Databricks Lakebase and .NET using Npgsql

This example connects to Databricks Lakebase from a .NET console application using [Npgsql](https://www.npgsql.org/). It uses short-lived database tokens from the Databricks API and performs basic CRUD operations.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-dotnet-npgsql/NeonLibraryExample ./with-dotnet-npgsql
cd with-dotnet-npgsql
```

## Configure Lakebase credentials

Set environment variables (or copy `env.example` to `.env` and load it). No connection string is stored in config; the app uses `LakebaseAuth.GetConnectionStringAsync()` to obtain a token and build the connection string.

Required variables:

- `DATABRICKS_HOST` – your workspace host (e.g. `your-workspace.cloud.databricks.com`)
- `DATABRICKS_CLIENT_ID` – service principal client ID
- `DATABRICKS_CLIENT_SECRET` – service principal secret
- `LAKEBASE_ENDPOINT` – e.g. `projects/<id>/branches/<id>/endpoints/<id>`
- `LAKEBASE_HOST` – Postgres host from the endpoint (e.g. `your-endpoint.database.<region>.cloud.databricks.com`)
- `LAKEBASE_PORT` – `5432` (default)
- `LAKEBASE_DATABASE` – `databricks_postgres` (default)

## Before you run

1. Create a Lakebase instance (`databricks postgres create-project`, `create-branch`, `create-endpoint`).
2. Create a service principal in the workspace and note Client ID and Secret.
3. Grant the service principal database access (`databricks_auth` extension, `databricks_create_role`, schema/table grants).

## Run the application

```bash
dotnet restore
dotnet run
```

The app creates a `books` table, inserts data, and runs read/update/delete steps. The database password is a short-lived token fetched from Databricks and refreshed automatically when needed.

## Further reading

- [Npgsql documentation](https://www.npgsql.org/doc/)
- [Databricks Lakebase documentation](https://docs.databricks.com/lakebase)
