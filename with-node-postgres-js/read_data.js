import 'dotenv/config';
import { getSql } from './lib/lakebase.js';

async function readData() {
    const sql = await getSql();
    try {
        console.log('Connection established');

        // Fetch all rows from the books table
        const books = await sql`SELECT * FROM books ORDER BY publication_year;`;

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
        sql.end();
    }
}

readData();