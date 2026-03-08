# Getting started with Databricks Lakebase and Python (psycopg2)

This example connects to Lakebase from Python using [psycopg2](https://pypi.org/project/psycopg2/) with scripts for CRUD operations.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-python-psycopg2 ./with-python-psycopg2
cd with-python-psycopg2
```

Copy the `.env.example` file and fill in your Databricks service principal and Lakebase connection details:

```bash
cp .env.example .env
```

The app uses short-lived database tokens from Databricks (see `lakebase_auth.py`); the token is refreshed lazily before expiry.

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST` (see the main repo README or other examples for the full checklist).

## Run the scripts

```bash
python -m venv venv
source venv/bin/activate   # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
python create_table.py
python read_data.py
python update_data.py
python delete_data.py
```
