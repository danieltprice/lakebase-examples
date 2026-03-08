import { getPrisma } from "./lakebase";

// Re-export for backwards compatibility; callers should use await getPrisma() for Lakebase token rotation.
export { getPrisma };
