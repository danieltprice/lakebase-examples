# Getting started with Databricks Lakebase and Django

This Django 5 project connects to Databricks Lakebase (PostgreSQL) when Lakebase env vars are set. It uses `lakebase_auth.get_connection_kwargs()` for token rotation; otherwise it falls back to `DATABASE_URL`.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-django ./with-django
cd with-django
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`). The app loads `.env` via python-dotenv. When these are set, the default database uses Lakebase token auth instead of `DATABASE_URL`.

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access (see main repo or other examples).

## Run the application

```bash
python -m venv venv
source venv/bin/activate   # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
