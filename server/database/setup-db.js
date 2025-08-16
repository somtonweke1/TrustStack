const { Pool } = require('pg');

// Create a simple in-memory database setup for immediate use
const setupDatabase = async () => {
  try {
    // For now, let's use a simple approach
    console.log('🔧 Setting up database connection...');
    
    // This will be replaced by environment variables
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/truststack',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        ssn_hash VARCHAR(255),
        kyc_status VARCHAR(50) DEFAULT 'pending',
        aml_status VARCHAR(50) DEFAULT 'pending',
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Users table created/verified');
    client.release();
    
    return pool;
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    // Return null so the app can handle gracefully
    return null;
  }
};

module.exports = { setupDatabase };
