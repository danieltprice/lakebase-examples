# Auth.js (Next.js) with Databricks Lakebase

This example uses **NextAuth.js** (Auth.js) with the **Postgres adapter** and **Databricks Lakebase**. The app uses a shared `pg` Pool from `lib/lakebase.ts` with token rotation for the adapter and API routes.

## Setup

1. Create a Lakebase instance and a service principal with database access.
2. Copy `.env.example` to `.env` and set the Lakebase variables and `AUTH_SECRET`. For email sign-in, set `AUTH_RESEND_KEY` (see [Resend](https://resend.com)).
3. Run migrations or create the Auth.js tables (e.g. `npx prisma db push` if using Prisma, or use Drizzle/raw SQL as per Auth.js docs).

## Run

```bash
npm install
npm run dev
```

The app uses the Lakebase pool for the Postgres adapter and for the todos API.
