# Getting started with Databricks Lakebase and Next.js (Server Actions)

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-nextjs-server-actions ./with-nextjs-server-actions
```

Copy the `.env.example` file and fill in your Databricks service principal and Lakebase connection details:

```bash
cp .env.example .env
```

The app uses short-lived database tokens from Databricks — no manual credential rotation needed.

## Before you run

Create a Lakebase instance, set up a service principal, grant it database access, and set `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST` (see the main repo or other examples for the full checklist).

## Install and run

```bash
npm install
npm run dev
```

Submit a comment via the form; it is stored in Lakebase using a Server Action.
