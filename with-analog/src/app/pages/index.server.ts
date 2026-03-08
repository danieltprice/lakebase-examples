import { PageServerLoad } from '@analogjs/router';
import { pool } from '../../lib/lakebase';

export const load = async ({}: PageServerLoad) => {
  const { rows } = await pool.query('SELECT version()');
  return rows[0];
};
