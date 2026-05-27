import 'dotenv/config';
import pool from './database.js';

async function testConnection() {
  console.log('Testing database connection with configuration from .env:');
  console.log({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_DATABASE || 'identity_stores',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD ? '********' : '(not set)'
  });

  try {
    const res = await pool.query('SELECT NOW() as now, current_database() as db_name, current_user as current_user_name');
    console.log('\n[SUCCESS] Connection established successfully!');
    console.log('Server time:', res.rows[0].now);
    console.log('Current database:', res.rows[0].db_name);
    console.log('Current user:', res.rows[0].current_user_name);
    
    // Check what tables are in the database
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('\nTables found in database:');
    if (tablesRes.rows.length === 0) {
      console.log('(No tables found)');
    } else {
      tablesRes.rows.forEach(row => console.log(`- ${row.table_name}`));
    }
  } catch (err) {
    console.error('\n[ERROR] Connection failed!');
    console.error('Error Code:', err.code);
    console.error('Message:', err.message);
    
    if (err.code === '28P01') {
      console.error('\nTip: Password authentication failed. Check if DB_USER and DB_PASSWORD in .env are correct.');
    } else if (err.code === '3D000') {
      console.error('\nTip: Database does not exist. You may need to create the database first.');
      console.error(`Run this query in pgAdmin or psql: CREATE DATABASE ${process.env.DB_DATABASE || 'identity_stores'};`);
    } else if (err.code === 'ECONNREFUSED') {
      console.error('\nTip: Could not connect to the PostgreSQL server. Is PostgreSQL running on the specified DB_HOST and DB_PORT?');
    }
  } finally {
    await pool.end();
  }
}

testConnection();
