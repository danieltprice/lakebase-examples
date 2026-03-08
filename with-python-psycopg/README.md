# Getting started with Databricks Lakebase and Python (psycopg v3)

This example connects to Lakebase from Python using [psycopg](https://pypi.org/project/psycopg/) (v3). The `lakebase_auth` module provides `get_connection_kwargs()` with lazy token refresh; scripts use `psycopg.connect(**get_connection_kwargs())`. The implementation matches the working example in `~/with-python-psycopg` (e.g. `_fetch_api_token` / `_fetch_db_token`, host.rstrip("/"), and robust expire-time parsing).

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-python-psycopg ./with-python-psycopg
cd with-python-psycopg
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the scripts

```bash
pip install -r requirements.txt
python create_table.py
python read_data.py
python update_data.py
python delete_data.py
```
