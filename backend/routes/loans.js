const express = require('express');
const router = express.Router();
const controller = require('../controllers/loanController');

// Create loan
router.post('/', controller.createLoan);

// Record payment
router.post('/loans/:loan_id/payment', controller.recordPayment); // ✅ updated to match your call

// View ledger
router.get('/loans/:loan_id/ledger', controller.getLedger);

// View all loans
router.get('/loans', controller.getAllLoans);
module.exports = router;
