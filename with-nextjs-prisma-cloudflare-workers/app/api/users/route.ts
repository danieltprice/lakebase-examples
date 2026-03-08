export const runtime = "edge";

export const dynamic = "force-dynamic";

export const fetchCache = "force-no-store";

import { getPrisma } from "@/lib/prisma.server";

export async function GET() {
  const startTime = Date.now();
  const prisma = await getPrisma();
  const users = await prisma.users.findMany();
  const duration = Date.now() - startTime;
  return Response.json({ users, duration });
}
