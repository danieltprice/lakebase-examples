import { defineEventHandler } from 'h3';
import { pool } from '../../../lib/lakebase';

export default defineEventHandler(async () => {
  const { rows } = await pool.query('SELECT version()');
  return rows[0]['version'];
});
