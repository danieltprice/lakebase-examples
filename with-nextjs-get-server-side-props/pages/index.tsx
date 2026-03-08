import { pool } from "../lib/lakebase";

export async function getServerSideProps() {
  if (
    !process.env.LAKEBASE_HOST ||
    !process.env.DATABRICKS_CLIENT_ID
  ) {
    return { props: { data: "" } };
  }
  const { rows } = await pool.query("SELECT version()");
  return { props: { data: rows[0]?.version ?? "" } };
}

export default function Page({ data }: { data: string }) {
  return <>{data}</>;
}
