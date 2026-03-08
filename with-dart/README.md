# Getting started with Databricks Lakebase and Dart

This example connects to Lakebase from Dart using the **postgres** package. `lib/lakebase.dart` fetches a short-lived token from the Databricks API and returns an `Endpoint` and `ConnectionSettings` for `Connection.open`.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-dart ./with-dart
cd with-dart
```

## Configure Lakebase

Set environment variables (e.g. export in your shell or use a `.env` loader). Required: `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`. Optional: `LAKEBASE_PORT`, `LAKEBASE_DATABASE`. See `.env.example`.

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access (see main repo or other examples). Ensure the `playing_with_neon` table exists.

## Run the application

```bash
dart pub get
dart run index.dart
```
