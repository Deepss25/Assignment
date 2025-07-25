// src/pages/PaymentsPage.tsx
import React, { useEffect, useState } from 'react';
import { Payment } from '@/types/banking';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/payments') // Adjust port if needed
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch payments');
        }
        return res.json();
      })
      .then(data => {
        console.log("👉 Payments from backend:", data);
        
        setPayments(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading recent payments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Recent Payments</h1>
      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Payment ID</th>
              <th className="border px-4 py-2">Loan ID</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
  <tr key={`${payment.payment_id}-${index}`}>
    <td>{payment.payment_id}</td>
    <td>{payment.loan_id}</td>
    <td>₹{payment.amount}</td>
    <td>{payment.payment_type}</td>
    <td>{payment.payment_date}</td>
  </tr>
))}


          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentsPage;
