import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { pool } from "~/lib/lakebase";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const { rows } = await pool.query("SELECT version()");
  const { version } = rows[0];
  return version;
};

export default function Index() {
  const version = useLoaderData<typeof loader>();
  return <div>{version}</div>;
}
