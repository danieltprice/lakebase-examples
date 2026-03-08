// File: send.js

require("dotenv").config();

const { Client } = require("pg");
const { getPoolConfig } = require("./lib/lakebase");

const client = new Client(getPoolConfig());

async function insertRow(message) {
  try {
    // Connect to Postgres
    await client.connect();
    // Insert a row into Postgres table
    await client.query("INSERT INTO my_table (message) VALUES ($1)", [message]);
    console.log("Inserted a row in the 'my_table' table.");
    await client.end();
  } catch (e) {
    console.log(e);
  }
}

insertRow("Hello, world!").catch(console.log);
