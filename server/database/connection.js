const { Pool } = require('pg');
const mockDb = require('./mock-db');
require('dotenv').config();

let pool = null;

// Try to create real database connection
try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test the connection
    pool.query('SELECT NOW()', (err) => {
      if (err) {
        console.log('⚠️ Real database connection failed, using mock database');
        pool = null;
      } else {
        console.log('✅ Connected to real PostgreSQL database');
      }
    });
  } else {
    console.log('⚠️ No DATABASE_URL provided, using mock database');
    pool = null;
  }
} catch (error) {
  console.log('⚠️ Database configuration error, using mock database');
  pool = null;
}

// Helper function to run queries
const query = async (text, params) => {
  if (pool) {
    // Use real database
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log(`📊 Executed query in ${duration}ms`);
      return res;
    } catch (error) {
      console.error('❌ Query error:', error);
      throw error;
    }
  } else {
    // Use mock database
    return await mockDb.query(text, params);
  }
};

// Helper function to get a client for transactions
const getClient = async () => {
  if (pool) {
    return await pool.connect();
  } else {
    return await mockDb.getClient();
  }
};

module.exports = { query, getClient, pool }; 