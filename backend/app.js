const express = require('express');
const app = express();
const cors = require('cors');
const loanRoutes = require('./routes/loans');
const customerRoutes = require('./routes/customers');
const paymentRoutes = require('./routes/payments'); // 👈 correct path


app.use(cors({origin: 'http://localhost:8080'}));
app.use(express.json());

app.use('/api/loans', loanRoutes);
app.use('/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);


app.listen(5000, () => {
  console.log('Backend server running on port 5000');
});
