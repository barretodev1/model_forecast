require("dotenv").config();
const { Pool } = require("pg"); 

const pool = new Pool({
  connectionString: process.env.URL_DB,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
});

module.exports = pool;