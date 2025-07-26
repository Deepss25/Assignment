const sqlite3 = require('better-sqlite3');

try {
  const db = new sqlite3('./loans.db');
  console.log('Connected to SQLite DB');

  db.prepare(`
    CREATE TABLE IF NOT EXISTS customers (
      customer_id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS loans (
      loan_id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      amount REAL,
      interest_rate REAL,
      term INTEGER,
      status TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loan_id TEXT,
      amount REAL,
      payment_date TEXT,
      FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
    )
  `).run();

  console.log('Tables created successfully.');
  db.close();
} catch (err) {
  console.error('Error setting up database:', err.message);
}
