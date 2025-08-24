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

      // Database is ready for real data
      console.log('✅ Database initialized successfully');
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
