# Getting started with Databricks Lakebase, Next.js and AWS S3

## Clone the repository

```bash
npx degit databricks-solutions/lakebase-examples/with-nextjs-aws-s3 ./with-nextjs-aws-s3
```

Copy the `.env.example` file and fill in AWS and Lakebase credentials (Databricks service principal + Lakebase endpoint).

The app uses short-lived database tokens from Databricks for Postgres. Create a Lakebase instance and set up a service principal (see main repo or other examples).

## Install and run

```bash
npm install
npm run dev
```
