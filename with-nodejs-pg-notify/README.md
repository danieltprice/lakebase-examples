# Using pg_notify with Databricks Lakebase and Node.js

This example uses PostgreSQL `LISTEN`/`NOTIFY` with Lakebase. Scripts use the **pg** driver and `lib/lakebase.js` for token rotation.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-nodejs-pg-notify ./with-nodejs-pg-notify
cd with-nodejs-pg-notify
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Run the scripts

1. **Setup** (create table and trigger): `node setup.js`
2. **Listen** (in one terminal): `node listen.js`
3. **Send** (in another): `node send.js`

You should see the notification payload in the listen terminal.
