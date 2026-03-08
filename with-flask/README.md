# Getting started with Databricks Lakebase and Flask

This example connects to Lakebase from a Flask app using **psycopg2** and short-lived database tokens from Databricks.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-flask ./with-flask
```

Copy the `.env.example` file and set Lakebase env vars (Databricks service principal + LAKEBASE_*). The app uses `lakebase_auth.get_connection_kwargs()` for the connection.

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST`.

## Run the application

```bash
pip install -r requirements.txt
flask run
```
