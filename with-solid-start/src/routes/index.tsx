import { createAsync, query } from "@solidjs/router";
import { pool } from "~/lib/lakebase";

const getVersion = query(async () => {
  "use server";
  const { rows } = await pool.query("SELECT version()");
  return rows[0].version;
}, "version");

export const route = {
  preload: () => getVersion(),
};

export default function Page() {
  const version = createAsync(() => getVersion());
  return <>{version()}</>;
}
