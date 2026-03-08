import 'dotenv/config';
import { pool } from './lib/lakebase.js';

async function readData() {
  try {
    console.log('Connection established');

    const result = await pool.query('SELECT * FROM books ORDER BY publication_year;');
    const books = result.rows;

    console.log('\n--- Book Library ---');
    books.forEach((book) => {
      console.log(
        `ID: ${book.id}, Title: ${book.title}, Author: ${book.author}, Year: ${book.publication_year}, In Stock: ${book.in_stock}`
      );
    });
    console.log('--------------------\n');
  } catch (err) {
    console.error('Connection failed.', err);
  } finally {
    await pool.end();
  }
}

readData();
