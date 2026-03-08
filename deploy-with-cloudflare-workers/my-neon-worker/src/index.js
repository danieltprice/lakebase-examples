import { getSql } from "./lakebase.js";

export default {
	async fetch(request, env, ctx) {
		const sql = await getSql(env);
		const rows = await sql`SELECT * FROM books_to_read;`;
		return new Response(JSON.stringify(rows));
	},
};
