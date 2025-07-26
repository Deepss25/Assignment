const express = require('express');
const app = express();
const cors = require('cors');
const loanRoutes = require('./routes/loans');
const customerRoutes = require('./routes/customers');
const paymentRoutes = require('./routes/payments');

// ✅ Allow frontend on Render (edit origin later if needed)
app.use(cors({ origin: '*' }));
app.use(express.json());

// ✅ API route handlers
app.use('/api/loans', loanRoutes);
app.use('/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);

// ✅ Root route to test deployment
app.get('/', (req, res) => {
  res.send('✅ Bank Lending System Backend is running');
});

// ✅ Use dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
});
