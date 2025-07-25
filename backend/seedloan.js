const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('loans.db');

// Insert sample customer and loan
db.serialize(() => {
  db.run(`
    INSERT OR IGNORE INTO customers (customer_id, name)
    VALUES ('CUST001', 'John Doe');
  `);

  db.run(`
    INSERT OR IGNORE INTO loans (
      loan_id, customer_id, amount,interest_rate, term, status
    ) VALUES (
      'LOAN001', 'CUST001', 50000, 0.1, 12, 'ACTIVE'
    );
  `);
});

db.close(() => {
  console.log("✅ Sample customer and loan inserted.");
});
