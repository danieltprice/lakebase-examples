# Getting started with Databricks Lakebase and SQLAlchemy (asyncpg)

This example uses SQLAlchemy 2.0 with the asyncpg driver. The connection URL is provided by `lakebase_auth.get_connection_url()` with lazy token refresh.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-sqlalchemy-asyncpg ./with-sqlalchemy-asyncpg
cd with-sqlalchemy-asyncpg
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the application

```bash
pip install -r requirements.txt
python index.py
```
