# Databricks Lakebase and Rust on Cloudflare Workers

This example uses **tokio-postgres** on Cloudflare Workers with the Worker Socket API.

## Lakebase setup

Set **POSTGRES_URL** to a Postgres connection string that uses a short-lived token. For Lakebase, obtain the token by calling the Databricks OIDC and postgres/credentials APIs (see other examples in this repo for the token flow), then build the URL:

`postgresql://<client_id>:<token>@<LAKEBASE_HOST>:5432/<database>?sslmode=require`

Because the token expires, use one of:

- A build step or CI job that fetches the token and sets **POSTGRES_URL** as a Wrangler secret before deploy.
- A Worker that calls the Databricks APIs to get the token and then connects (requires implementing the token fetch inside the Worker).

Also set **LAKEBASE_HOST** (and optionally **LAKEBASE_PORT**) so the socket connects to your Lakebase endpoint.

## Configure

Copy `.env.example` to `.dev.vars` for local dev. Set **POSTGRES_URL**, **LAKEBASE_HOST**, and optionally **LAKEBASE_PORT**. For production, use `wrangler secret put POSTGRES_URL` and `wrangler secret put LAKEBASE_HOST`.

## Build and deploy

```bash
npm install
npm run deploy
```
