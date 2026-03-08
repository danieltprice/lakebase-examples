# Getting started with Databricks Lakebase and .NET using Entity Framework Core

This example connects to Databricks Lakebase from an ASP.NET Core Web API using **Entity Framework Core** and the **Npgsql** provider. The app uses short-lived database tokens from the Databricks API; the connection string is obtained at startup via `LakebaseAuth.GetConnectionStringAsync()`.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-dotnet-entity-framework/NeonEfExample ./with-dotnet-entity-framework
cd with-dotnet-entity-framework
```

## Configure Lakebase credentials

Set environment variables (or copy `env.example` to `.env` and load it):

- `DATABRICKS_HOST` – workspace host (e.g. `your-workspace.cloud.databricks.com`)
- `DATABRICKS_CLIENT_ID` – service principal client ID
- `DATABRICKS_CLIENT_SECRET` – service principal secret
- `LAKEBASE_ENDPOINT` – e.g. `projects/<id>/branches/<id>/endpoints/<id>`
- `LAKEBASE_HOST` – Postgres host from the endpoint
- `LAKEBASE_PORT` – `5432` (default)
- `LAKEBASE_DATABASE` – `databricks_postgres` (default)

## Before you run

1. Create a Lakebase instance and endpoint.
2. Create a service principal and note Client ID and Secret.
3. Grant the service principal database access (`databricks_auth`, `databricks_create_role`, schema/table grants).

## Run the application

```bash
dotnet restore
dotnet ef database update   # apply migrations (optional; ensure DATABASE_URL or connection is available for migrations)
dotnet run
```

The API runs with Swagger at `http://localhost:5001/swagger`. The DbContext is configured with a Lakebase connection string obtained once at startup.

## Further reading

- [Npgsql EF Core provider](https://www.npgsql.org/efcore/)
- [Databricks Lakebase documentation](https://docs.databricks.com/lakebase)
