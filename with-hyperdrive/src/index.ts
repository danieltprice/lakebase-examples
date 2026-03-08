import { getSql } from "./lakebase";
import type { LakebaseEnv } from "./lakebase";

export interface Env extends LakebaseEnv {}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const sql = await getSql(env);
      const result = await sql`SELECT * from public."Comment"`;
      return Response.json({ result });
    } catch (e) {
      console.error(e);
      return Response.json(
        { error: e instanceof Error ? e.message : e },
        { status: 500 }
      );
    }
  },
};
