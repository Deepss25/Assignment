// backend/routes/payments.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // This is your SQLite connection

// GET /api/payments
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM payments';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching payments:', err.message);
      return res.status(500).json({ message: 'Error fetching payments' });
    }
    res.json(rows); // rows = array of payments
  });
});

module.exports = router;
