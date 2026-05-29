import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pool from './database.js';

async function runSchema() {
  try {
    const schemaPath = path.resolve('schema.sql');
    console.log(`Reading SQL schema from: ${schemaPath}`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema in PostgreSQL...');
    await pool.query(sql);
    console.log('[SUCCESS] All tables and indices from schema.sql applied successfully!');
  } catch (error) {
    console.error('[ERROR] Failed to run schema.sql:', error);
  } finally {
    await pool.end();
  }
}

runSchema();
