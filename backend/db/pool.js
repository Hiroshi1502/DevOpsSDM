const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection when the server starts
pool.connect()
  .then((client) => {
    console.log("✅ PostgreSQL connected successfully!");
    client.release(); // Release the client back to the pool
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err);
  });

module.exports = pool;