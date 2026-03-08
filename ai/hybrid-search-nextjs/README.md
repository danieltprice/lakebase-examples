# Hybrid Search Chatbot (OpenAI + Databricks Lakebase)

An AI-powered Hybrid Search chatbot with Next.js, **Databricks Lakebase** (Postgres with pgvector), and OpenAI. The app uses `lib/lakebase.ts` for token rotation.

- Ingest content: embed with OpenAI and store in Lakebase with full-text and vector indexes.
- Chat: embed the query and run hybrid search (full-text + semantic) to return relevant snippets.

## Prerequisites

- A Lakebase instance and service principal with database access (see main repo).
- An OpenAI API key.

## Setup

1. Clone and install:
   ```bash
   npx degit databricks-solutions/lakebase-examples/ai/hybrid-search-nextjs ./hybrid-search-nextjs
   cd hybrid-search-nextjs && npm install
   ```
2. Copy `.env.example` to `.env` and set Lakebase variables and `OPENAI_API_KEY`.
3. Run `npm run dev`. Use the UI to add documents and chat.
