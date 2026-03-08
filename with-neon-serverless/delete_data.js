import 'dotenv/config';
import { pool } from './lib/lakebase.js';

async function deleteData() {
  try {
    console.log('Connection established');

    await pool.query('DELETE FROM books WHERE title = $1', ['1984']);
    console.log("Deleted the book '1984' from the table.");
  } catch (err) {
    console.error('Connection failed.', err);
  } finally {
    await pool.end();
  }
}

deleteData();
