import express from "express";
import { pool } from "./lib/lakebase.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    // Fetch the list of plants from your database using the postgres connection
    const { rows } = await pool.query("SELECT * FROM plant_care_log;");
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch plants", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
