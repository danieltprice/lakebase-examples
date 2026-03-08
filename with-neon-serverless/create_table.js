import 'dotenv/config';
import { pool } from './lib/lakebase.js';

async function setup() {
  try {
    console.log('Connection established');

    await pool.query('DROP TABLE IF EXISTS books;');
    console.log('Finished dropping table (if it existed).');

    await pool.query(`
      CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        publication_year INT,
        in_stock BOOLEAN DEFAULT TRUE
      );
    `);
    console.log('Finished creating table.');

    await pool.query(
      `INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)`,
      ['The Catcher in the Rye', 'J.D. Salinger', 1951, true]
    );
    console.log('Inserted a single book.');

    const booksToInsert = [
      ['The Hobbit', 'J.R.R. Tolkien', 1937, true],
      ['1984', 'George Orwell', 1949, true],
      ['Dune', 'Frank Herbert', 1965, false],
    ];
    for (const row of booksToInsert) {
      await pool.query(
        `INSERT INTO books (title, author, publication_year, in_stock) VALUES ($1, $2, $3, $4)`,
        row
      );
    }
    console.log('Inserted 3 rows of data.');
  } catch (err) {
    console.error('Connection failed.', err);
  } finally {
    await pool.end();
  }
}

setup();
