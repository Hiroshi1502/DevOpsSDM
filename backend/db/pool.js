const { Pool } = require('pg');

if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config();
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then((client) => {
      console.log("✅ PostgreSQL connected successfully!");
      client.release();
    })
    .catch((err) => {
      console.error("❌ PostgreSQL connection failed:", err);
    });
}

module.exports = pool;