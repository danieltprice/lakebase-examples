# Getting started with Databricks Lakebase and Next.js (getStaticProps)

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-nextjs-get-static-props ./with-nextjs-get-static-props
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

The page uses `getStaticProps` to fetch the database version at build time.
