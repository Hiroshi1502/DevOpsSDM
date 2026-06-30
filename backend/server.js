const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const fareRoutes = require('./routes/fareRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/fare', fareRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/system', systemRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'DevOpsSDM API running ✅' }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));