# Getting started with Databricks Lakebase and Python (asyncpg)

This example connects to Lakebase from Python using [asyncpg](https://github.com/MagicStack/asyncpg). The `lakebase_auth` module provides `get_connection_url()` with lazy token refresh.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-python-asyncpg ./with-python-asyncpg
cd with-python-asyncpg
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
