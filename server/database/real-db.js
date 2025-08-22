const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class RealDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, 'truststack.db');
    this.db = new sqlite3.Database(this.dbPath);
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Create tables if they don't exist
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS trust_accounts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          trust_name TEXT NOT NULL,
          trust_type TEXT NOT NULL,
          current_balance DECIMAL(15,2) DEFAULT 0,
          status TEXT DEFAULT 'active',
          compliance_status TEXT DEFAULT 'pending',
          risk_score INTEGER DEFAULT 50,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_compliance_check DATETIME,
          next_compliance_check DATETIME,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS beneficiaries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trust_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          relationship TEXT,
          allocation_percentage DECIMAL(5,2),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (trust_id) REFERENCES trust_accounts (id)
        )
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS transfers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trust_id INTEGER NOT NULL,
          amount DECIMAL(15,2) NOT NULL,
          transfer_type TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          FOREIGN KEY (trust_id) REFERENCES trust_accounts (id)
        )
      `);

      this.db.run(`
        CREATE TABLE IF NOT EXISTS compliance_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          entity_type TEXT NOT NULL,
          entity_id INTEGER NOT NULL,
          compliance_type TEXT NOT NULL,
          status TEXT NOT NULL,
          due_date DATETIME,
          completed_date DATETIME,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert sample data for demonstration
      this.insertSampleData();
    });
  }

  insertSampleData() {
    // Check if data already exists
    this.db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (err) {
        console.error('Error checking users:', err);
        return;
      }
      
      if (row.count === 0) {
        // Insert sample user
        this.db.run(`
          INSERT INTO users (email, name) VALUES (?, ?)
        `, ['demo@truststack.com', 'Demo User'], (err) => {
          if (err) {
            console.error('Error inserting user:', err);
            return;
          }
          
          const userId = this.lastID;
          
          // Insert sample trusts
          const trusts = [
            ['Family Wealth Trust', 'Revocable Living Trust', 8000000, 'active', 'pending', 60],
            ['Business Succession Trust', 'Irrevocable Trust', 5000000, 'active', 'verified', 25],
            ['Charitable Remainder Trust', 'Charitable Trust', 2000000, 'active', 'verified', 35]
          ];
          
          trusts.forEach((trust, index) => {
            this.db.run(`
              INSERT INTO trust_accounts (user_id, trust_name, trust_type, current_balance, status, compliance_status, risk_score)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [userId, ...trust], (err) => {
              if (err) {
                console.error('Error inserting trust:', err);
                return;
              }
              
              const trustId = this.lastID;
              
              // Insert sample beneficiaries
              const beneficiaries = [
                ['John Smith Jr.', 'Son', 40.0],
                ['Sarah Smith', 'Daughter', 35.0],
                ['Family Foundation', 'Charity', 25.0]
              ];
              
              beneficiaries.forEach(beneficiary => {
                this.db.run(`
                  INSERT INTO beneficiaries (trust_id, name, relationship, allocation_percentage)
                  VALUES (?, ?, ?, ?)
                `, [trustId, ...beneficiary]);
              });
              
              // Insert sample transfers
              const transfers = [
                [500000, 'distribution', 'completed'],
                [250000, 'contribution', 'pending'],
                [100000, 'distribution', 'completed']
              ];
              
              transfers.forEach(transfer => {
                this.db.run(`
                  INSERT INTO transfers (trust_id, amount, transfer_type, status)
                  VALUES (?, ?, ?, ?)
                `, [trustId, ...transfer]);
              });
              
              // Insert sample compliance logs
              const complianceLogs = [
                ['trust', trustId, 'annual_review', 'pending', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()],
                ['trust', trustId, 'tax_filing', 'completed', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()],
                ['trust', trustId, 'beneficiary_update', 'pending', new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()]
              ];
              
              complianceLogs.forEach(log => {
                this.db.run(`
                  INSERT INTO compliance_logs (entity_type, entity_id, compliance_type, status, due_date)
                  VALUES (?, ?, ?, ?, ?)
                `, log);
              });
            });
          });
        });
      }
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      } else {
        this.db.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, changes: this.changes });
          }
        });
      }
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = RealDatabase;
