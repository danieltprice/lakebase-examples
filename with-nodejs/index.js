require("dotenv").config();

const http = require("http");
const { pool } = require("./lib/lakebase");

const requestHandler = async (req, res) => {
  const result = await pool.query("SELECT version()");
  const { version } = result.rows[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};

http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
