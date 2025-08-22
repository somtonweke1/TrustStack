// Mock database for immediate testing
class MockDatabase {
  constructor() {
    this.users = new Map();
    this.trusts = new Map();
    this.beneficiaries = new Map();
    this.transfers = new Map();
    this.complianceLogs = new Map();
    this.nextId = 1;
    
    // Initialize with sample data for AI testing
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Create sample user
    const userId = 'user-1';
    this.users.set(userId, {
      id: userId,
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      created_at: new Date().toISOString()
    });

    // Create sample trust
    const trustId = 'trust-1';
    this.trusts.set(trustId, {
      id: trustId,
      user_id: userId,
      trust_name: 'Family Wealth Trust',
      trust_type: 'Revocable',
      trust_purpose: 'Family wealth preservation',
      initial_funding_amount: 5000000,
      current_balance: 5200000,
      status: 'active',
      compliance_status: 'pending',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      updated_at: new Date().toISOString()
    });

    // Create sample beneficiaries
    this.beneficiaries.set('ben-1', {
      id: 'ben-1',
      trust_id: trustId,
      first_name: 'Sarah',
      last_name: 'Doe',
      email: 'sarah@example.com',
      relationship: 'Daughter',
      allocation_percentage: 40,
      kyc_status: 'verified',
      created_at: new Date().toISOString()
    });

    this.beneficiaries.set('ben-2', {
      id: 'ben-2',
      trust_id: trustId,
      first_name: 'Michael',
      last_name: 'Doe',
      email: 'michael@example.com',
      relationship: 'Son',
      allocation_percentage: 35,
      kyc_status: 'pending',
      created_at: new Date().toISOString()
    });

    this.beneficiaries.set('ben-3', {
      id: 'ben-3',
      trust_id: trustId,
      first_name: 'Emma',
      last_name: 'Doe',
      email: 'emma@example.com',
      relationship: 'Granddaughter',
      allocation_percentage: 25,
      kyc_status: 'verified',
      created_at: new Date().toISOString()
    });

    // Create sample transfers
    this.transfers.set('transfer-1', {
      id: 'transfer-1',
      trust_id: trustId,
      beneficiary_id: 'ben-1',
      amount: 100000,
      currency: 'USD',
      transfer_type: 'distribution',
      status: 'completed',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    this.transfers.set('transfer-2', {
      id: 'transfer-2',
      trust_id: trustId,
      beneficiary_id: 'ben-2',
      amount: 75000,
      currency: 'USD',
      transfer_type: 'gift',
      status: 'pending',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Create sample compliance logs
    this.complianceLogs.set('comp-1', {
      id: 'comp-1',
      entity_type: 'trust',
      entity_id: trustId,
      action: 'annual_review',
      details: { status: 'pending', notes: 'Annual compliance review due' },
      user_id: userId,
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days ago
    });
  }

  // Mock query function
  async query(text, params) {
    console.log(`📝 Mock Query: ${text}`);
    console.log(`📊 Params:`, params);
    
    if (text.includes('INSERT INTO users')) {
      const userId = `user-${this.nextId++}`;
      const user = {
        id: userId,
        email: params[0],
        first_name: params[2],
        last_name: params[3],
        created_at: new Date().toISOString()
      };
      this.users.set(userId, user);
      
      return {
        rows: [user],
        rowCount: 1
      };
    }
    
    if (text.includes('SELECT id FROM users WHERE email')) {
      const email = params[0];
      const existingUser = Array.from(this.users.values()).find(u => u.email === email);
      
      return {
        rows: existingUser ? [existingUser] : [],
        rowCount: existingUser ? 1 : 0
      };
    }
    
    if (text.includes('SELECT id, email, password_hash')) {
      const email = params[0];
      const user = Array.from(this.users.values()).find(u => u.email === email);
      
      if (user) {
        return {
          rows: [{
            id: user.id,
            email: user.email,
            password_hash: '$2b$12$mock.hash.for.testing',
            first_name: user.first_name,
            last_name: user.last_name,
            is_verified: true
          }],
          rowCount: 1
        };
      }
      
      return {
        rows: [],
        rowCount: 0
      };
    }
    
    // Handle trust account queries for AI wrapper
    if (text.includes('SELECT * FROM trust_accounts WHERE id')) {
      const trustId = params[0];
      const trust = this.trusts.get(trustId);
      
      if (trust) {
        return {
          rows: [trust],
          rowCount: 1
        };
      }
      
      return {
        rows: [],
        rowCount: 0
      };
    }

    // Handle beneficiaries queries for AI wrapper
    if (text.includes('SELECT * FROM beneficiaries WHERE trust_id')) {
      const trustId = params[0];
      const beneficiaries = Array.from(this.beneficiaries.values()).filter(ben => ben.trust_id === trustId);
      
      return {
        rows: beneficiaries,
        rowCount: beneficiaries.length
      };
    }

    // Handle transfers queries for AI wrapper
    if (text.includes('SELECT * FROM transfers WHERE trust_id')) {
      const trustId = params[0];
      const transfers = Array.from(this.transfers.values()).filter(transfer => transfer.trust_id === trustId);
      
      return {
        rows: transfers,
        rowCount: transfers.length
      };
    }

    // Handle compliance logs queries for AI wrapper
    if (text.includes('SELECT * FROM compliance_logs WHERE entity_type')) {
      const entityType = params[0];
      const entityId = params[1];
      const logs = Array.from(this.complianceLogs.values()).filter(log => 
        log.entity_type === entityType && log.entity_id === entityId
      );
      
      return {
        rows: logs,
        rowCount: logs.length
      };
    }

    // Handle failed transfers count for AI wrapper
    if (text.includes('SELECT COUNT(*) FROM transfers') && text.includes('status = \'failed\'')) {
      const trustId = params[0];
      const failedTransfers = Array.from(this.transfers.values()).filter(transfer => 
        transfer.trust_id === trustId && transfer.status === 'failed'
      );
      
      return {
        rows: [{ count: failedTransfers.length.toString() }],
        rowCount: 1
      };
    }

    // Handle any COUNT query on transfers table
    if (text.includes('SELECT COUNT(*) FROM transfers')) {
      const trustId = params[0];
      const transfers = Array.from(this.transfers.values()).filter(transfer => 
        transfer.trust_id === trustId
      );
      
      console.log('📊 Mock DB: COUNT query for transfers, trustId:', trustId, 'count:', transfers.length);
      
      return {
        rows: [{ count: transfers.length.toString() }],
        rowCount: 1
      };
    }

    // Catch-all for COUNT queries
    if (text.includes('COUNT(*)')) {
      console.log('📊 Mock DB: Generic COUNT query detected:', text);
      return {
        rows: [{ count: '0' }],
        rowCount: 1
      };
    }

    // Default response
    return {
      rows: [],
      rowCount: 0
    };
  }

  async connect() {
    console.log('🔌 Mock database connected');
    return {
      query: this.query.bind(this),
      release: () => console.log('🔌 Mock client released')
    };
  }
}

// Export mock database
const mockDb = new MockDatabase();

module.exports = {
  query: mockDb.query.bind(mockDb),
  getClient: () => mockDb.connect(),
  pool: mockDb
};
