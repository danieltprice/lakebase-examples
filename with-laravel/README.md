# Getting started with Databricks Lakebase and Laravel

This Laravel 11 app connects to Databricks Lakebase (PostgreSQL) using short-lived tokens. When `DATABRICKS_HOST` and `LAKEBASE_HOST` are set, `AppServiceProvider` sets the pgsql connection URL from `App\LakebaseAuth::getConnectionUrl()` at boot.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-laravel ./with-laravel
cd with-laravel
```

## Configure Lakebase

Copy `.env.example` to `.env`. Set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`). Keep `DB_CONNECTION=pgsql`. The app will use the Lakebase URL from token auth instead of `DB_URL` when these are set.

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples). Run migrations as needed.

## Run the application

```bash
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Visit the database test route to confirm the connection.
