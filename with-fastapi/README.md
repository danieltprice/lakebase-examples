# Getting started with Databricks Lakebase and FastAPI

This example connects a FastAPI application to Databricks Lakebase (PostgreSQL) using SQLAlchemy 2.0 with async support. The connection URL is built from short-lived tokens fetched at startup via `app.lakebase_auth`.

## Prerequisites

- Python 3.10 or later
- A Databricks workspace and Lakebase instance

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-fastapi ./with-fastapi
cd with-fastapi
```

## Set up your environment

1. Copy the example environment file and set Lakebase variables:

```bash
cp .env.example .env
```

Set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`.

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST` (see main repo or other examples).

## Install and run

```bash
python -m venv venv
source venv/bin/activate   # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
fastapi dev main.py
```

The app creates the `playing_with_neon` table on startup and serves the API at `/docs`.
