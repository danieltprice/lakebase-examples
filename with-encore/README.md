# Getting started with Databricks Lakebase and Encore

This example shows an [Encore.ts](https://encore.dev) application that uses a SQL database. Encore manages the database configuration: locally it provisions Postgres for you; in production you configure your database (e.g. Databricks Lakebase when supported, or any Postgres-compatible endpoint) through the Encore platform.

## Prerequisites

- [Encore CLI](https://encore.dev/docs/install) installed

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-encore ./with-encore
cd with-encore
```

## Run the application locally

Start the Encore development server:

```bash
encore run
```

Encore provisions a **local PostgreSQL database** for development. The app is available at `http://localhost:4000` and the local dashboard at `http://localhost:9400`.

## Test the API

Create a message:

```bash
curl -X POST http://localhost:4000/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from Lakebase!"}'
```

List messages:

```bash
curl http://localhost:4000/messages
```

## Project structure

- `hello/` – Service directory
  - `encore.service.ts` – Service definition
  - `db.ts` – Database configuration (Encore `SQLDatabase`)
  - `hello.ts` – API endpoints
  - `migrations/` – Database migrations

## Using a production database (e.g. Lakebase)

For production, deploy to [Encore Cloud](https://encore.cloud) and attach your database in the Encore Dashboard (e.g. under **Settings → Integrations** or database configuration). Use a Postgres-compatible endpoint; for **Databricks Lakebase**, configure the connection when Encore supports it or use a Lakebase Postgres endpoint as your database URL in Encore’s database settings.

- [Encore Documentation](https://encore.dev/docs)
- [Encore SQL Databases](https://encore.dev/docs/ts/primitives/databases)
- [Databricks Lakebase](https://docs.databricks.com/lakebase)
