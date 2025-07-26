const sqlite3 = require('better-sqlite3');

let db;
try {
  db = new sqlite3('./loans.db');
  console.log('Connected to SQLite DB');
} catch (err) {
  console.error('Failed to connect to SQLite DB:', err.message);
}

module.exports = db;
