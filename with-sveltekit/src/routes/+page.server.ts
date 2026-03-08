import { pool } from '$lib/lakebase';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({}) {
  const { rows } = await pool.query('SELECT version()');
  const { version } = rows[0];
  return {
    version,
  };
}
