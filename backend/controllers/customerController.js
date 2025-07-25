
const db = require('../db');

exports.getOverview = (req, res) => {
  const customer_id = req.params.customer_id;

  db.all("SELECT * FROM Loans WHERE customer_id = ?", [customer_id], (err, loans) => {
    if (err || loans.length === 0) return res.status(404).json({ error: 'Customer or loans not found' });

    const loanData = [];
    let processed = 0;

    loans.forEach(loan => {
      db.all("SELECT SUM(amount) as paid FROM Payments WHERE loan_id = ?", [loan.loan_id], (err, rows) => {
        const amount_paid = rows[0].paid || 0;
        const emis_left = Math.ceil((loan.total_amount - amount_paid) / loan.monthly_emi);

        loanData.push({
          loan_id: loan.loan_id,
          principal: loan.principal_amount,
          total_amount: loan.total_amount,
          total_interest: loan.total_amount - loan.principal_amount,
          emi_amount: loan.monthly_emi,
          amount_paid,
          emis_left
        });

        processed++;
        if (processed === loans.length) {
          res.status(200).json({
            customer_id,
            total_loans: loans.length,
            loans: loanData
          });
        }
      });
    });
  });
};
