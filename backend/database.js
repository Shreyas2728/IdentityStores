import 'dotenv/config'
import pg from 'pg';
const { Pool } = pg;

// Load environment variables if dotenv is used in the future
// or fall back to local development configurations.
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE ,
  password: process.env.DB_PASSWORD ,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});



// Helper function to query the database
export const query = (text, params) => {
  return pool.query(text, params);
};


// Export the pool connection
export default pool;
