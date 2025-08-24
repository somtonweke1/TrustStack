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
    // Initialize with empty data - no more hardcoded samples
    // Data will be populated through actual user interactions
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
