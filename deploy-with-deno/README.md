# Deploy with Deno and Databricks Lakebase

This example shows a **Deno** server that connects to Postgres (e.g. **Databricks Lakebase**). The server reads `DATABASE_URL` from the environment.

## Lakebase setup

For Lakebase, the database URL must include a short-lived token. You can:

1. Run a script (or use another example in this repo) to call the Databricks OIDC and postgres/credentials APIs, then set `DATABASE_URL` to the resulting connection string before starting the server.
2. For Deno Deploy, set `DATABASE_URL` in the project’s environment variables and refresh it periodically (e.g. via a cron or external process that updates the secret), since the token expires.

Required Lakebase env vars for the token script: `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST`, and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`.

## Local run

```bash
cp .env.example .env
# Edit .env: set DATABASE_URL (e.g. from a script that fetches the Lakebase token)
export $(grep -v '^#' .env | xargs) && deno run --allow-env --allow-net server.ts
```

## Deploy to Deno Deploy

Deploy the app and set `DATABASE_URL` (and any other env vars) in the Deno Deploy project settings. Use a URL that includes a valid Lakebase token; refresh the token as needed.
