import { RequestInfo } from "rwsdk/worker";
import { env } from "cloudflare:workers";
import { getSql } from "../../lakebase";

async function getData() {
  const sql = await getSql(env as Parameters<typeof getSql>[0]);
  const response = await sql`SELECT version()`;
  return response[0]?.version ?? "";
}

export async function Home({ ctx }: RequestInfo) {
  return (
    <div>
      <h1>
        {await getData()}
      </h1>
      <h2>
        Using Cloudflare Workers with PostgreSQL (Lakebase)
      </h2>
    </div>
  );
}
