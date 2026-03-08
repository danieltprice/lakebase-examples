export const runtime = "edge";

export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

import { getDb } from "@/lib/drizzle.server";
import { usersTable } from "@/lib/schema";

export async function GET() {
  const startTime = Date.now();
  const db = await getDb();
  const users = await db.select().from(usersTable);
  const duration = Date.now() - startTime;
  return Response.json({ users, duration });
}
