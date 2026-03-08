import 'dotenv/config';
import { pool } from './lib/lakebase.js';

async function updateData() {
  try {
    console.log('Connection established');

    await pool.query('UPDATE books SET in_stock = $1 WHERE title = $2', [true, 'Dune']);
    console.log("Updated stock status for 'Dune'.");
  } catch (err) {
    console.error('Connection failed.', err);
  } finally {
    await pool.end();
  }
}

updateData();
