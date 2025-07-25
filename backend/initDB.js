const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./loans.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite DB');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    customer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS loans (
    loan_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    amount REAL,
    interest_rate REAL,
    term INTEGER,
    status TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    loan_id TEXT,
    amount REAL,
    payment_date TEXT,
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
  )`);

  console.log('Tables created successfully.');
});

db.close();
