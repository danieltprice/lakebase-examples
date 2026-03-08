# Lakebase conversion status

This repo is being converted from Neon to **Databricks Lakebase** (Databricks’s managed Postgres). Each app should use standard Postgres drivers with Lakebase token rotation, except **edge/serverless runtimes** (e.g. Cloudflare Workers), which keep a serverless-style driver with a cached connection and TTL.

## Pattern per runtime

- **Node (pg / postgres.js)**  
  - Use a shared `lib/lakebase.ts` or `lib/lakebase.js` that:
    - Fetches OIDC token from `POST https://<DATABRICKS_HOST>/oidc/v1/token`
    - Fetches DB token from `POST https://<DATABRICKS_HOST>/api/2.0/postgres/credentials`
    - Caches token and refreshes lazily (e.g. 2 min buffer before expiry)
  - **pg**: create a `Pool` with `password: getPassword` (callback).
  - **postgres.js**: no password callback → use `getSql()` that returns a client built from a connection string with current token, cached with TTL (~50 min).

- **Python (psycopg2 / psycopg / asyncpg / SQLAlchemy)**  
  - Add `lakebase_auth.py` with `get_password()` and `get_connection_kwargs()`.
  - Use `**get_connection_kwargs()` for `connect()` or equivalent.

- **Edge / serverless (Cloudflare Workers, Vercel Edge, etc.)**  
  - Keep serverless driver; implement `getConnectionString()` that uses OIDC + postgres/credentials, then build a cached client with TTL (~50 min).

## Env vars (all apps)

Replace `DATABASE_URL` (and any Neon-specific vars) with:

```bash
DATABRICKS_HOST=your-workspace.cloud.databricks.com
DATABRICKS_CLIENT_ID=your-service-principal-client-id
DATABRICKS_CLIENT_SECRET=your-service-principal-secret
LAKEBASE_ENDPOINT=projects/<project-id>/branches/<branch-id>/endpoints/<endpoint-id>
LAKEBASE_HOST=your-endpoint.database.<region>.cloud.databricks.com
LAKEBASE_PORT=5432
LAKEBASE_DATABASE=databricks_postgres
```

## README per app

Each app README should be a **Databricks README**:

- Clone from `databricks-solutions/lakebase-examples/...`
- Configure Lakebase credentials (env vars above)
- “Before you run” checklist: create Lakebase instance, service principal, grant DB access, find `LAKEBASE_ENDPOINT` / `LAKEBASE_HOST`
- No Neon branding or links

## Lessons from working examples (Django, with-python-psycopg)

These patterns come from **verified working** examples (`~/with-django`, `~/with-python-psycopg`) and improve success when applied elsewhere:

**Python `lakebase_auth` modules**

1. **Trim trailing slash on `DATABRICKS_HOST`**  
   Use `host = os.environ["DATABRICKS_HOST"].rstrip("/")` before building URLs. Avoids `https://host//oidc/...` if the user has a trailing slash in `.env`.

2. **Robust expire-time parsing**  
   The API returns `expire_time` as ISO 8601 (e.g. `"2025-03-08T12:00:00Z"`). Parse with:
   - `expire_str = body["expire_time"].rstrip("Z")`
   - `expires_at = datetime.fromisoformat(expire_str).replace(tzinfo=timezone.utc).timestamp()`
   This avoids `fromisoformat()` issues with the `Z` suffix and keeps timestamps in UTC.

3. **OIDC form body**  
   Use `urllib.parse.urlencode({"grant_type": "client_credentials", "scope": "all-apis"}).encode()` for the OIDC POST body so it’s valid `application/x-www-form-urlencoded`.

4. **Split token fetch (optional but helpful)**  
   Separate `_fetch_api_token()` (OIDC) and `_fetch_db_token()` (postgres/credentials) returning `(token, expires_at)`. Clearer and easier to debug.

5. **Docstrings**  
   At the top of the module, list required and optional env vars; add a short usage example for `get_connection_kwargs()` or `get_password()`.

**Django specifically**

- Put `lakebase_auth` **inside the project package** (e.g. `myproject/lakebase_auth.py`) and import with `from myproject.lakebase_auth import get_password`. That way the import works regardless of `PYTHONPATH` or cwd.

**Node / JS**

- When building the OIDC or credentials URL, trim a trailing slash from `process.env.DATABRICKS_HOST` if present (e.g. `const host = (process.env.DATABRICKS_HOST || '').replace(/\/$/, '')`).

**Applied across the repo**

- **Python:** `host.rstrip("/")` and robust expire parsing (rstrip `Z` + `timezone.utc`) are now used in `with-flask`, `with-python-asyncpg`, `with-sqlalchemy-asyncpg`, `with-fastapi` (host only), and `ai/langchain/react-agent-python` lakebase_auth modules. Django and with-python-psycopg already matched the working examples.
- **Node:** `with-express` lakebase.js trims trailing slash on `DATABRICKS_HOST`. The same pattern can be applied to other Node/TS lakebase modules if needed.

## Converted (done)

- **with-analog** – pg pool + lakebase (already done)
- **with-angular** – (already done)
- **with-astro** – (already done)
- **with-astro-api-routes** – pg pool + lakebase
- **with-express** – pg pool + lakebase
- **with-nodejs** – pg pool + lakebase
- **with-node-postgres** – pg pool + lakebase
- **with-node-postgres-js** – postgres.js + getSql() + lakebase
- **with-python-psycopg2** – lakebase_auth.py + get_connection_kwargs()
- **with-remix** – pg pool + lakebase
- **with-react-router** – pg pool + lakebase
- **with-solid-start** – pg pool + lakebase
- **with-sveltekit** – pg pool + lakebase
- **with-sveltekit-feature-flags** – pg pool + lakebase
- **with-waku** – pg pool + lakebase
- **Next.js (Node):** with-nextjs-serverless-functions, with-nextjs-server-components, with-nextjs-server-actions, with-nextjs-get-static-props, with-nextjs-get-server-side-props – pg pool + lakebase
- **Next.js (Prisma Node):** with-nextjs-prisma – getPrisma() + connection string cache
- **Next.js (Drizzle Node):** with-nextjs-drizzle-local-vercel – pg pool + drizzle-orm/node-postgres
- **Next.js (Edge):** with-nextjs-edge-functions – serverless driver + getSql() cached TTL
- **Next.js (Drizzle Edge):** with-nextjs-drizzle-edge – getDb() + serverless Pool cached TTL
- **Next.js (Prisma Edge):** with-nextjs-prisma-edge, with-nextjs-prisma-cloudflare-workers – getPrisma() + PrismaNeon adapter cached TTL
- **.NET (C#):** with-dotnet-npgsql (NeonLibraryExample) – LakebaseAuth.GetConnectionStringAsync() + Npgsql; with-dotnet-entity-framework (NeonEfExample) – LakebaseAuth at startup + UseNpgsql(connectionString)
- **FastAPI:** with-fastapi – app/lakebase_auth.get_connection_url() at startup + SQLAlchemy async (asyncpg)
- **Fastify:** with-fastify – lib/lakebase.js getPoolConfig() with password callback + @fastify/postgres
- **Flask:** with-flask – lakebase_auth.get_connection_kwargs() + psycopg2
- **Go (pgx):** with-golang – lakebase.GetConnectionString() + pgx
- **Go (GORM):** with-golang-gorm – lakebase.GetConnectionString() + GORM postgres driver
- **Hono (Edge):** with-hono – lib/lakebase.ts getSql() cached TTL + @neondatabase/serverless
- **Hyperdrive → Lakebase:** with-hyperdrive – src/lakebase.ts getSql(env) + postgres.js (Cloudflare Workers); Hyperdrive binding removed
- **Java JDBC:** with-java-jdbc – LakebaseAuth.getConnectionString(Dotenv) + JDBC
- **Laravel:** with-laravel – App\LakebaseAuth::getConnectionUrl() in AppServiceProvider boot + pgsql url
- **Bun:** with-bun – lib/lakebase.ts pg Pool with password callback; script uses pool.query()
- **Dart:** with-dart – lib/lakebase.dart getLakebaseConnection() (HTTP token + Endpoint + ConnectionSettings); index.dart uses Connection.open
- **Django:** with-django – lakebase_auth.get_connection_kwargs() in settings.py when DATABRICKS_HOST and LAKEBASE_HOST are set; else DATABASE_URL
- **Electric SQL:** with-electricsql – Docker service expects DATABASE_URL; scripts/get-database-url.sh fetches Lakebase token and prints URL; user exports DATABASE_URL then runs docker compose up
- **Encore:** with-encore – Documentation only; Encore manages DB (local Postgres + cloud config); README/package.json updated for Lakebase branding and production DB guidance
- **Node.js pg_notify:** with-nodejs-pg-notify – lib/lakebase.js getPoolConfig() + pg Client in setup.js, send.js, listen.js
- **Nuxt:** with-nuxt – server/utils/lakebase.ts pg Pool; server/api/version.get.ts uses pool; Welcome.vue and README updated for Lakebase
- **Prisma (standalone):** with-prisma – lib/lakebase.ts getPrisma() + dynamic URL; index.ts uses getPrisma()
- **Python asyncpg:** with-python-asyncpg – lakebase_auth.get_connection_url() + asyncpg.connect()
- **Python psycopg (v3):** with-python-psycopg – lakebase_auth.get_connection_kwargs() + psycopg.connect(**kwargs)
- **Wasp:** with-wasp – README + .env.example for Lakebase; DATABASE_URL set from token script
- **Sequelize:** with-sequelize – lib/lakebase.js getConnectionString() + Sequelize(connectionString) async init
- **NestJS:** with-nestjs – src/database/lakebase.ts pg Pool with password callback; DatabaseModule + AppService use pool
- **neon-serverless (Node pg):** with-neon-serverless – lib/lakebase.js pool; create_table, read_data, update_data, delete_data use pool
- **TanStack Start (server + static):** with-tanstack-start-server-functions, with-tanstack-start-static-server-functions – src/data/lakebase.ts pool + getPostgresJs(); get-neon-data.ts uses them
- **SQLAlchemy asyncpg:** with-sqlalchemy-asyncpg – lakebase_auth.get_connection_url() + create_async_engine
- **Ruby:** with-ruby – lakebase_auth.rb fetch_lakebase_connection_string + PG.connect(conn_string)
- **RedwoodSDK (Workers):** with-redwoodsdk – src/lakebase.ts getSql(env) + postgres.js; Home.tsx uses getSql(env)
- **Rust postgres:** with-rust-postgres – src/lakebase.rs get_connection_string() + Client::connect
- **Rust tokio-postgres:** with-rust-tokio-postgres – src/lakebase.rs get_connection_string().await + tokio_postgres::connect
- **Rust Cloudflare Workers:** with-rust-cloudflare-workers – README + .env; POSTGRES_URL + LAKEBASE_HOST from env (token from script)
- **Knex:** with-knex – lib/lakebase.js getConnectionString() + knex({ connection: { connectionString } })
- **Micronaut Kotlin:** with-micronaut-kotlin – application.yml uses LAKEBASE_JDBC_URL, LAKEBASE_USERNAME, LAKEBASE_PASSWORD from env
- **ai/hybrid-search-nextjs:** lib/lakebase.ts getSql(); app/api/chat and app/api/learn use getSql()
- **ai/inngest/rag-starter-nextjs:** src/lib/lakebase.ts getSql(); API routes and inngest/functions.ts use getSql()
- **ai/llamaindex/semantic-search-nextjs, reverse-image-search-nextjs, rag-nextjs, chatbot-nextjs, chat-with-pdf-nextjs:** lib/lakebase.ts getConnectionString(); lib/vectorStore.ts exports getVectorStore() that awaits getConnectionString() and returns PGVectorStore; API routes use await getVectorStore()
- **ai/langchain/semantic-search-nextjs, rag-nextjs, chatbot-nextjs, chat-with-pdf-nextjs:** lib/lakebase.ts getConnectionString(); loadVectorStore() awaits getConnectionString() and passes to NeonPostgres.initialize()
- **ai/langchain/react-agent-python:** lakebase_auth.get_connection_url(); index.py uses it for ConnectionPool when Lakebase env vars are set
- **ai/inngest/auto-embeddings-nextjs:** src/lib/lakebase.ts getSql(); inngest/functions.ts and app/api/documents/route.ts use getSql()
- **ai/fuzzy-semantic-search-nextjs:** lib/lakebase.ts getSql(); lib/db.ts getDb() returns await getSql() when Lakebase env set, else neon(DATABASE_URL); API routes use await getDb()

## Remaining to convert

None; all `ai/*` apps in this repo are converted. For net new apps, use the patterns above. Search for `@neondatabase/serverless`, `neon.tech`, and `DATABASE_URL` to find any remaining usages.
