# Confidence levels: converted apps actually working

Rough confidence that each converted app will run and connect to Lakebase as intended. **None of these have been run/e2e tested** in this repo; levels are based on pattern consistency, known pitfalls, and dependency/API assumptions.

**Legend**
- **High (≈85–95%)** – Same pattern as other working examples; no known API/env quirks.
- **Medium (≈65–85%)** – Pattern is sound but runtime, env, or package version could bite.
- **Low (≈50–70%)** – Doc-only, token supplied externally, or non-standard/untested path.

---

## with-* (Node / TypeScript)

| App | Confidence | Notes |
|-----|------------|--------|
| with-analog | High | pg pool + lakebase; standard Node server. |
| with-angular | High | Same pattern as other Node backends. |
| with-astro, with-astro-api-routes | High | pg pool + lakebase. |
| with-bun | High | pg Pool + password callback; Bun loads .env. |
| with-express, with-nodejs, with-node-postgres | High | pg pool + lakebase; well-used pattern. |
| with-fastify | High | getPoolConfig() + @fastify/postgres; matches other Node apps. |
| with-hono | Medium | getSql() + neon cached; edge runtime and cold starts. |
| with-hyperdrive | Medium | getSql(env) + postgres.js in Workers; env and cache in Workers. |
| with-knex | High | getConnectionString() + knex; same as Sequelize-style. |
| with-neon-serverless | High | pg pool via lib/lakebase.js; standard Node. |
| with-nestjs | High | pg Pool + password callback; Nest loads env. |
| with-nextjs-* (server components, server actions, getStaticProps, getServerSideProps, serverless, aws-s3) | High | pg pool + lakebase; Node runtime. |
| with-nextjs-drizzle-local-vercel | High | pg pool + Drizzle; Node (no edge). |
| with-nextjs-drizzle-edge | Medium | getDb() + serverless driver; edge + TTL cache. |
| with-nextjs-edge-functions | Medium | getSql() cached; edge runtime. |
| with-nextjs-prisma | High | getPrisma() + dynamic URL; same as standalone Prisma. |
| with-nextjs-prisma-edge, with-nextjs-prisma-cloudflare-workers | Medium | getPrisma() + adapter; edge/Workers and caching. |
| with-nodejs-pg-notify | High | pg Client + getPoolConfig(); same as Fastify. |
| with-node-postgres-js | High | postgres.js + getSql(); Node. |
| with-nuxt | High | server/utils lakebase pool; Nuxt server. |
| with-prisma | High | getPrisma() + connection URL cache. |
| with-react-router, with-remix, with-solid-start | High | pg pool + lakebase. |
| with-redwoodsdk | Medium | getSql(env) in Cloudflare Workers; env and cache. |
| with-sequelize | High | getConnectionString() then Sequelize(url); async init. |
| with-sveltekit, with-sveltekit-feature-flags | High | pg pool + lakebase. |
| with-tanstack-start-server-functions | High | pool + getPostgresJs(); Node server. |
| with-tanstack-start-static-server-functions | Medium | Same code; static server context may differ. |
| with-waku | High | pg pool + lakebase. |
| with-wasp | Low | Docs + .env only; app expects DATABASE_URL from external script. |

---

## with-* (Python)

| App | Confidence | Notes |
|-----|------------|--------|
| with-django | High | Aligned with working example in ~/with-django: myproject.lakebase_auth.get_password(), same DATABASES shape and OPTIONS; conditional fallback to DATABASE_URL. |
| with-fastapi | High | lakebase_auth.get_connection_url() + async engine; same as other Python async. |
| with-flask | High | lakebase_auth.get_connection_kwargs() + psycopg2; used elsewhere. |
| with-python-asyncpg | High | lakebase_auth.get_connection_url() + asyncpg. |
| with-python-psycopg | High | Aligned with working example in ~/with-python-psycopg: lakebase_auth with _fetch_api_token/_fetch_db_token, host.rstrip("/"), urlencode, robust expire parsing. |
| with-python-psycopg2 | High | Same as Flask-style kwargs. |
| with-sqlalchemy-asyncpg | High | lakebase_auth.get_connection_url(); same pattern as FastAPI. |

---

## with-* (Go / Rust / Ruby / Dart / .NET / Java / PHP)

| App | Confidence | Notes |
|-----|------------|--------|
| with-golang, with-golang-gorm | High | lakebase package + connection string; standard HTTP + pg. |
| with-rust-postgres | Medium | New deps (reqwest, serde, base64, urlencoding). **Cargo.toml has `edition = "2024"`** – may need `"2021"` if 2024 not supported. |
| with-rust-tokio-postgres | Medium | Same deps/edition note as above; async HTTP. |
| with-rust-cloudflare-workers | Low | No in-worker token fetch; expects POSTGRES_URL + LAKEBASE_HOST from env/script. |
| with-ruby | High | lakebase_auth.rb + PG.connect; stdlib HTTP. |
| with-dart | Medium | HttpClient + postgres package; env from Platform.environment. |
| with-dotnet-npgsql, with-dotnet-entity-framework | High | LakebaseAuth + Npgsql; EF design-time may need DATABASE_URL for migrations. |
| with-java-jdbc | High | LakebaseAuth + Gson; dotenv + JDBC URL. |
| with-laravel | Medium | AppServiceProvider boot() sets pgsql url; config cache and timing. |
| with-micronaut-kotlin | Low | Env only (LAKEBASE_JDBC_URL etc.); no in-app token fetch; user runs script. |

---

## with-* (other / doc-only)

| App | Confidence | Notes |
|-----|------------|--------|
| with-electricsql | Low | Script outputs URL; Docker + token expiry; no in-container refresh. |
| with-encore | Low | Docs only; Encore manages DB. |

---

## ai/*

| App | Confidence | Notes |
|-----|------------|--------|
| ai/hybrid-search-nextjs | High | getSql() in API routes; same pattern as other Next server. |
| ai/inngest/rag-starter-nextjs | High | getSql() in routes and inngest functions. |
| ai/inngest/auto-embeddings-nextjs | High | getSql() in route and inngest. |
| ai/llamaindex/semantic-search-nextjs | High | getVectorStore() + PGVectorStore(connectionString). |
| ai/llamaindex/reverse-image-search-nextjs | High | Same; connectionString at top level. |
| ai/llamaindex/rag-nextjs | High | getVectorStore() + top-level connectionString (aligned with other LLamaIndex apps). |
| ai/llamaindex/chatbot-nextjs | High | connectionString at top level. |
| ai/llamaindex/chat-with-pdf-nextjs | High | Same. |
| ai/langchain/semantic-search-nextjs, rag-nextjs, chatbot-nextjs, chat-with-pdf-nextjs | High | getConnectionString() + NeonPostgres.initialize(); NeonPostgres accepts generic Postgres URL. |
| ai/langchain/react-agent-python | Medium | get_connection_url() at startup; long-running process will see token expire. |
| ai/fuzzy-semantic-search-nextjs | High | getDb() async; getSql() when Lakebase env set; fallback to DATABASE_URL. |
| ai/aws-bedrock/chatbot-nextjs | N/A | No Postgres; no conversion. |

---

## Quick fixes that would raise confidence

1. **Rust** – In `with-rust-postgres` and `with-rust-tokio-postgres`, set `edition = "2021"` in Cargo.toml if the toolchain doesn’t support 2024.
2. **ai/llamaindex/rag-nextjs** – If PGVectorStore from `llamaindex/storage/vectorStore/PGVectorStore` expects a top-level `connectionString`, change to that and remove `clientConfig`.
3. **with-micronaut-kotlin** – Document “run script to set LAKEBASE_JDBC_URL (and optionally USERNAME/PASSWORD) before starting app.”

---

## How to validate

- **Node/TS:** `npm install && npm run dev` (or equivalent) with Lakebase env set; hit a route that does a DB query.
- **Python:** `pip install -r requirements.txt` (or venv), set env, run main script or `flask run` / `uvicorn`.
- **Rust:** `cargo build` (and fix edition if needed); then `cargo run --bin create_table` with env set.
- **Go:** `go build` and run the main binary with env set.
- **Deploy targets:** Deploy to the platform with Lakebase env vars (or secrets) and test one DB-backed endpoint.
