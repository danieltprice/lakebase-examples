# Getting started with Databricks Lakebase and Waku

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-waku ./with-waku
```

Copy the `.env.example` file:

```bash
cp .env.example .env
```

## Configure your Lakebase credentials

Fill in your `.env` file with your Databricks service principal and Lakebase connection details. The app uses short-lived database tokens fetched automatically from Databricks — no manual credential rotation needed.

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST` (see other examples in this repo for the full checklist).

## Install and run

```bash
npm install
npm run dev
```
