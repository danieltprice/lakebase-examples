import 'dotenv/config';
import { getSql } from './lib/lakebase.js';

async function deleteData() {
    const sql = await getSql();
    try {
        console.log('Connection established');

        // Delete a data row from the table
        await sql`DELETE FROM books WHERE title = ${'1984'}`;
        console.log("Deleted the book '1984' from the table.");
    } catch (err) {
        console.error('Connection failed.', err);
    } finally {
        sql.end();
    }
}

deleteData();