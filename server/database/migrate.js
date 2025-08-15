const { query } = require('./connection');

const createTables = async () => {
  try {
    console.log('🔄 Starting database migration...');

    // Users table
    await query(`
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

    // Trust accounts table
    await query(`
      CREATE TABLE IF NOT EXISTS trust_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        trust_name VARCHAR(255) NOT NULL,
        trust_type VARCHAR(100) NOT NULL,
        trust_purpose TEXT,
        initial_funding_amount DECIMAL(15,2),
        current_balance DECIMAL(15,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        stripe_account_id VARCHAR(255),
        compliance_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Beneficiaries table
    await query(`
      CREATE TABLE IF NOT EXISTS beneficiaries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        trust_id UUID REFERENCES trust_accounts(id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        date_of_birth DATE,
        relationship VARCHAR(100),
        allocation_percentage DECIMAL(5,2),
        stripe_customer_id VARCHAR(255),
        kyc_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Transfers table
    await query(`
      CREATE TABLE IF NOT EXISTS transfers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        trust_id UUID REFERENCES trust_accounts(id) ON DELETE CASCADE,
        beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
        amount DECIMAL(15,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        transfer_type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        stripe_transfer_id VARCHAR(255),
        stripe_payment_intent_id VARCHAR(255),
        description TEXT,
        compliance_approved BOOLEAN DEFAULT FALSE,
        compliance_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Compliance logs table
    await query(`
      CREATE TABLE IF NOT EXISTS compliance_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type VARCHAR(50) NOT NULL,
        entity_id UUID NOT NULL,
        action VARCHAR(100) NOT NULL,
        details JSONB,
        user_id UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Audit trail table
    await query(`
      CREATE TABLE IF NOT EXISTS audit_trail (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        table_name VARCHAR(100) NOT NULL,
        record_id UUID NOT NULL,
        action VARCHAR(50) NOT NULL,
        old_values JSONB,
        new_values JSONB,
        user_id UUID REFERENCES users(id),
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_trust_accounts_user_id ON trust_accounts(user_id);
      CREATE INDEX IF NOT EXISTS idx_beneficiaries_trust_id ON beneficiaries(trust_id);
      CREATE INDEX IF NOT EXISTS idx_transfers_trust_id ON transfers(trust_id);
      CREATE INDEX IF NOT EXISTS idx_transfers_beneficiary_id ON transfers(beneficiary_id);
      CREATE INDEX IF NOT EXISTS idx_compliance_logs_entity ON compliance_logs(entity_type, entity_id);
      CREATE INDEX IF NOT EXISTS idx_audit_trail_record ON audit_trail(table_name, record_id);
    `);

    // Create updated_at trigger function
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Add triggers to tables
    await query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_trust_accounts_updated_at ON trust_accounts;
      CREATE TRIGGER update_trust_accounts_updated_at
        BEFORE UPDATE ON trust_accounts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_beneficiaries_updated_at ON beneficiaries;
      CREATE TRIGGER update_beneficiaries_updated_at
        BEFORE UPDATE ON beneficiaries
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_transfers_updated_at ON transfers;
      CREATE TRIGGER update_transfers_updated_at
        BEFORE UPDATE ON transfers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Database migration completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - users');
    console.log('   - trust_accounts');
    console.log('   - beneficiaries');
    console.log('   - transfers');
    console.log('   - compliance_logs');
    console.log('   - audit_trail');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables }; 