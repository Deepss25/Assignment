
const sqlite3 = require('better-sqlite3').verbose();
const db = new sqlite3.Database('./loans.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite DB');
});

module.exports = db;
