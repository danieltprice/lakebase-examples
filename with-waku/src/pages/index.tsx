import { pool } from "../lib/lakebase";

export default async function HomePage() {
  const data = await getData();
  return <>{data.version}</>;
}

const getData = async () => {
  const { rows } = await pool.query("SELECT version()");
  return rows[0];
};

export const getConfig = async () => {
  return {
    render: "static",
  };
};
