# Getting started with Databricks Lakebase and Astro

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-astro ./with-astro
```

Copy the `.env.example` file:

```bash
cp .env.example .env
```

## Configure your Lakebase credentials

Fill in your `.env` file with your Databricks service principal and Lakebase connection details:

```
DATABRICKS_HOST=your-workspace.cloud.databricks.com
DATABRICKS_CLIENT_ID=your-service-principal-client-id
DATABRICKS_CLIENT_SECRET=your-service-principal-secret

LAKEBASE_ENDPOINT=projects/<project-id>/branches/<branch-id>/endpoints/<endpoint-id>
LAKEBASE_HOST=your-endpoint.database.<region>.cloud.databricks.com
LAKEBASE_PORT=5432
LAKEBASE_DATABASE=databricks_postgres
```

The app uses short-lived database tokens fetched automatically from Databricks — no manual credential rotation needed. The token is refreshed lazily before it expires.

## Before you run — complete these steps

**1. Create a Lakebase instance** (if you don't have one)
```bash
databricks postgres create-project --display-name "my-project"
databricks postgres create-branch "projects/<id>" --display-name "main"
databricks postgres create-endpoint "projects/<id>/branches/<id>"
```

**2. Set up a service principal**
- Create one in your Databricks workspace under Settings → Service Principals
- Generate a client secret and note the Client ID and Secret

**3. Grant the service principal database access**

Get an owner token to connect:
```bash
databricks postgres generate-database-credential \
  "projects/<id>/branches/<id>/endpoints/<id>" -o json
```

Then connect with `psql` (use your Databricks email as user, the token as password) and run:
```sql
CREATE EXTENSION IF NOT EXISTS databricks_auth;
SELECT databricks_create_role('<your-client-id>', 'SERVICE_PRINCIPAL');
GRANT USAGE ON SCHEMA public TO "<your-client-id>";
GRANT CREATE ON SCHEMA public TO "<your-client-id>";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "<your-client-id>";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "<your-client-id>";
```

**4. Find your `LAKEBASE_ENDPOINT` and `LAKEBASE_HOST`**
```bash
databricks postgres list-projects -o json
databricks postgres list-branches "projects/<id>" -o json
databricks postgres list-endpoints "projects/<id>/branches/<id>" -o json
```
The `name` field is your `LAKEBASE_ENDPOINT`. The `status.hosts.host` field is your `LAKEBASE_HOST`.

## Install and run

```bash
npm install
npm run dev
```
