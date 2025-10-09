const { Pool } = require('pg');
require('dotenv').config();

// Check if DATABASE_URL exists (production) or use individual variables (local)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Render
      }
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'invenpro_db',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    });

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;