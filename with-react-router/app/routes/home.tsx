import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { pool } from "~/lib/lakebase";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lakebase with React Router" },
    { name: "description", content: "Welcome to React Router + Databricks Lakebase!" },
  ];
}

export async function loader({}: Route.ClientLoaderArgs) {
  const { rows } = await pool.query("SELECT version()");
  const { version } = rows[0];
  return { version };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome databaseVersion={loaderData.version} />;
}
