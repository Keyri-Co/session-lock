// initDb.js
require('dotenv').config();
const { query } = require('./database');

async function createTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `);

  console.log('Tables created successfully');
}

createTables();
