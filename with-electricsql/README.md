# Getting started with Databricks Lakebase and Electric SQL

This example runs [Electric SQL](https://electric-sql.com) in Docker, connected to a Postgres database. For Databricks Lakebase, the connection string is built from a short-lived token using the provided script.

## Requirements

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- Python 3 (for the connection-string script)

## Project structure

- `docker-compose.yaml` – Electric SQL service; expects `DATABASE_URL` in the environment.
- `scripts/get-database-url.sh` – Fetches a Lakebase token and prints a Postgres URL.
- `react-app/` – React app that uses the Electric sync API at `http://localhost:3000`.

## Configure Lakebase

1. Copy `.env.example` to `.env` and set `DATABRICKS_HOST`, `DATABRICKS_CLIENT_ID`, `DATABRICKS_CLIENT_SECRET`, `LAKEBASE_ENDPOINT`, `LAKEBASE_HOST` (and optionally `LAKEBASE_PORT`, `LAKEBASE_DATABASE`).

2. Build a connection string (token is short-lived; restart the container when it expires or re-export before starting):

   ```bash
   source .env   # or export the vars
   chmod +x scripts/get-database-url.sh
   export DATABASE_URL=$(./scripts/get-database-url.sh)
   ```

3. Start Electric:

   ```bash
   docker compose up
   ```

4. In another terminal, run the React app:

   ```bash
   cd react-app && npm install && npm run dev
   ```

The React app uses the `useShape` hook from `@electric-sql/react` and talks to `http://localhost:3000/v1/shape/foo`. Adjust the shape URL and rendering in `react-app/src/App.tsx` as needed.

## Notes

- Lakebase tokens expire (typically after about an hour). If the Electric container loses the connection, re-run `export DATABASE_URL=$(./scripts/get-database-url.sh)` and restart with `docker compose up`.
- For a long-running setup, consider a token-refresh sidecar or a proxy that injects a fresh token.
