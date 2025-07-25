import React, { useState } from 'react';
import axios from 'axios';

function RecordPaymentForm() {
  const [loanId, setLoanId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/loans/${loanId}/payments`, {
        amount,
        payment_date: paymentDate
      });
      alert(`Payment recorded! Payment ID: ${res.data.payment_id}`);
    } catch (err) {
      alert('Error: ' + err.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Record Payment</h2>

      <input value={loanId} onChange={(e) => setLoanId(e.target.value)} placeholder="Loan ID" className="block w-full mb-2 border p-2 rounded" />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Payment Amount" className="block w-full mb-2 border p-2 rounded" />
      <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="block w-full mb-4 border p-2 rounded" />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit Payment</button>
    </form>
  );
}

export default RecordPaymentForm;
