const { query } = require('./connection');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create demo user
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash('demo123', 12);
    
    const userResult = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, is_verified, kyc_status, aml_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, ['demo@truststack.com', passwordHash, 'Demo', 'User', '+1-555-0123', true, 'verified', 'cleared']);

    const userId = userResult.rows[0].id;
    console.log('✅ Demo user created');

    // Create demo trust accounts
    const trust1 = await query(`
      INSERT INTO trust_accounts (user_id, trust_name, trust_type, trust_purpose, initial_funding_amount, current_balance, status, compliance_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [userId, 'Family Legacy Trust', 'revocable', 'Preserve family wealth for future generations', 1000000, 1000000, 'active', 'approved']);

    const trust2 = await query(`
      INSERT INTO trust_accounts (user_id, trust_name, trust_type, trust_purpose, initial_funding_amount, current_balance, status, compliance_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [userId, 'Charitable Giving Trust', 'charitable', 'Support education and healthcare initiatives', 500000, 500000, 'active', 'approved']);

    console.log('✅ Demo trust accounts created');

    // Create demo beneficiaries
    await query(`
      INSERT INTO beneficiaries (trust_id, first_name, last_name, email, phone, relationship, allocation_percentage, kyc_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [trust1.rows[0].id, 'John', 'Smith Jr.', 'john.smith@email.com', '+1-555-0101', 'son', 50, 'verified']);

    await query(`
      INSERT INTO beneficiaries (trust_id, first_name, last_name, email, phone, relationship, allocation_percentage, kyc_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [trust1.rows[0].id, 'Sarah', 'Smith', 'sarah.smith@email.com', '+1-555-0102', 'daughter', 50, 'verified']);

    await query(`
      INSERT INTO beneficiaries (trust_id, first_name, last_name, email, phone, relationship, allocation_percentage, kyc_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [trust2.rows[0].id, 'Education', 'Foundation', 'info@educationfoundation.org', '+1-555-0201', 'charity', 100, 'verified']);

    console.log('✅ Demo beneficiaries created');

    // Get beneficiary IDs for transfers
    const beneficiary1Result = await query(`
      SELECT id FROM beneficiaries WHERE first_name = 'John' AND last_name = 'Smith Jr.'
    `);
    const beneficiary2Result = await query(`
      SELECT id FROM beneficiaries WHERE first_name = 'Sarah' AND last_name = 'Smith'
    `);

    // Create demo transfers
    const transfer1 = await query(`
      INSERT INTO transfers (trust_id, beneficiary_id, amount, currency, transfer_type, description, status, compliance_approved)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [trust1.rows[0].id, beneficiary1Result.rows[0].id, 50000, 'USD', 'inheritance', 'Initial inheritance distribution to John', 'completed', true]);

    const transfer2 = await query(`
      INSERT INTO transfers (trust_id, beneficiary_id, amount, currency, transfer_type, description, status, compliance_approved)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [trust1.rows[0].id, beneficiary2Result.rows[0].id, 50000, 'USD', 'inheritance', 'Initial inheritance distribution to Sarah', 'completed', true]);

    console.log('✅ Demo transfers created');

    // Create compliance logs
    await query(`
      INSERT INTO compliance_logs (entity_type, entity_id, action, details, user_id)
      VALUES ($1, $2, $3, $4, $5)
    `, ['trust', trust1.rows[0].id, 'kyc_verification', { status: 'approved', verified_by: 'system' }, userId]);

    await query(`
      INSERT INTO compliance_logs (entity_type, entity_id, action, details, user_id)
      VALUES ($1, $2, $3, $4, $5)
    `, ['transfer', transfer1.rows[0].id, 'compliance_check', { status: 'approved', checks: ['kyc', 'aml'] }, userId]);

    await query(`
      INSERT INTO compliance_logs (entity_type, entity_id, action, details, user_id)
      VALUES ($1, $2, $3, $4, $5)
    `, ['transfer', transfer2.rows[0].id, 'compliance_check', { status: 'approved', checks: ['kyc', 'aml'] }, userId]);

    console.log('✅ Demo compliance logs created');

    // Update trust balances after transfers
    await query(`
      UPDATE trust_accounts 
      SET current_balance = current_balance - 100000 
      WHERE id = $1
    `, [trust1.rows[0].id]);

    console.log('✅ Trust balances updated');

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Demo Data Summary:');
    console.log('   - 1 demo user (demo@truststack.com / demo123)');
    console.log('   - 2 trust accounts (Family Legacy & Charitable)');
    console.log('   - 3 beneficiaries (2 family + 1 charity)');
    console.log('   - 2 completed transfers ($100k total)');
    console.log('   - Compliance logs and audit trail');
    console.log('');
    console.log('🔗 Login at: http://localhost:3000');
    console.log('📱 Use demo@truststack.com / demo123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed script failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
