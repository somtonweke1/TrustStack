// Mock database for immediate testing
class MockDatabase {
  constructor() {
    this.users = new Map();
    this.trusts = new Map();
    this.beneficiaries = new Map();
    this.transfers = new Map();
    this.nextId = 1;
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
