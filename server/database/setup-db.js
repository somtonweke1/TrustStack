const { Pool } = require('pg');
const { createTables } = require('./migrate');

// Create a comprehensive database setup for production
const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database connection...');
    
    // Create connection pool
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/truststack',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Run full migration to create all tables
    await createTables();
    
    client.release();
    console.log('✅ Database setup completed successfully!');
    
    return pool;
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    // Return null so the app can handle gracefully
    return null;
  }
};

module.exports = { setupDatabase };
