import { drizzle } from "drizzle-orm/node-postgres";
import { pool } from "./lakebase";

export default drizzle(pool);
