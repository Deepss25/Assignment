
const db = require('../db');

// CREATE loan
exports.createLoan = (req, res) => {
  const { customer_id, amount, interest_rate, term } = req.body;
  const query = `INSERT INTO loans (customer_id, amount, interest_rate, term) VALUES (?, ?, ?, ?)`;
  db.run(query, [customer_id, amount, interest_rate, term], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ loan_id: this.lastID });
  });
};

// RECORD payment
exports.recordPayment = (req, res) => {
  const loan_id = req.params.loan_id;
  const { amount, payment_date } = req.body;
  const query = `INSERT INTO payments (loan_id, amount, payment_date) VALUES (?, ?, ?)`;
  db.run(query, [loan_id, amount, payment_date], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ payment_id: this.lastID });
  });
};

// GET ledger
exports.getLedger = (req, res) => {
  const loan_id = req.params.loan_id;
  const loanQuery = `SELECT * FROM loans WHERE id = ?`;
  const paymentQuery = `SELECT * FROM payments WHERE loan_id = ?`;

  db.get(loanQuery, [loan_id], (err, loan) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    db.all(paymentQuery, [loan_id], (err, payments) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ loan, payments });
    });
  });
};

// ✅ GET all loans
exports.getAllLoans = (req, res) => {
  const query = `SELECT * FROM loans`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ loans: rows });
  });
};
// GET payments for a specific loan
exports.getPayments = (req, res) => {
  const loan_id = req.params.loan_id;
  const query = `SELECT * FROM payments WHERE loan_id = ?`;

  db.all(query, [loan_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ message: 'No payments found for this loan.' });
    res.json({ payments: rows });
  });
};

