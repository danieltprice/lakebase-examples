// File: listen.js

require("dotenv").config();

const { Client } = require("pg");
const { getPoolConfig } = require("./lib/lakebase");

const client = new Client(getPoolConfig());

async function listenToNotifications() {
  try {
    // Connect to Postgres
    await client.connect();
    // Listen to specific channel in Postgres
    // Attach a listener to notifications received
    client.on("notification", (msg) => {
      console.log("Notification received", msg.payload);
    });
    await client.query("LISTEN channel_name");
    console.log("Listening for notifications on my_channel");
  } catch (e) {
    console.log(e);
  }
}

listenToNotifications().catch(console.log);
