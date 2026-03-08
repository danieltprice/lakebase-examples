const express = require("express");
const { pool } = require("../lib/lakebase");

const router = express.Router();

// Get all todos
router.get("/", async (_, res, next) => {
  try {
    await pool.query(
      "CREATE TABLE IF NOT EXISTS todos (id SERIAL, text TEXT, completed BOOLEAN)"
    );
    const { rows: todos } = await pool.query("SELECT * FROM todos");
    return res.json(todos);
  } catch (err) {
    next(err);
  }
});

// Create one todo
router.post("/", async (req, res, next) => {
  try {
    const { text } = req.body;
    await pool.query(
      "INSERT INTO todos (text, completed) VALUES ($1, false)",
      [text]
    );
    return res.status(200).send("Todo created successfully");
  } catch (err) {
    next(err);
  }
});

// Toggle todo completion
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    await pool.query("UPDATE todos SET completed = $1 WHERE id = $2", [
      completed,
      id,
    ]);
    return res.status(200).send();
  } catch (err) {
    next(err);
  }
});

// Delete item
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    return res.status(200).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
