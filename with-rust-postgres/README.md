# Getting started with Databricks Lakebase and Rust (postgres crate)

This example uses the synchronous **postgres** crate with SSL. Connection string is provided by `lakebase::get_connection_string()` which fetches a short-lived token from the Databricks API.

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-rust-postgres ./with-rust-postgres
cd with-rust-postgres
```

## Configure Lakebase

Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

## Before you run

Create a Lakebase instance and a service principal with database access (see main repo or other examples).

## Build and run

```bash
cargo build --bin create_table
cargo run --bin create_table
cargo run --bin read_data
cargo run --bin update_data
cargo run --bin delete_data
```
