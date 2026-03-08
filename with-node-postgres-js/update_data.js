import 'dotenv/config';
import { getSql } from './lib/lakebase.js';

async function updateData() {
    const sql = await getSql();
    try {
        console.log('Connection established');

        // Update a data row in the table
        await sql`UPDATE books SET in_stock = ${true} WHERE title = ${'Dune'}`;
        console.log("Updated stock status for 'Dune'.");
    } catch (err) {
        console.error('Connection failed.', err);
    } finally {
        sql.end();
    }
}

updateData();