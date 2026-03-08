import { pool } from "../lib/lakebase";

async function getData() {
  const { rows } = await pool.query("SELECT version()");
  return rows[0].version;
}

export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
