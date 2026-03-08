import { defineConfig } from "drizzle-kit";

// For migrations: set DATABASE_URL to a Lakebase connection string (e.g. from databricks postgres generate-database-credential)
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL or connection string required for drizzle-kit (e.g. for migrations).");

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: { url },
  schema: "./lib/schema.ts",
});
