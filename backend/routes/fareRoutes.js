const express = require('express');
const router = express.Router();
const { getRates, calculateFare } = require('../controllers/fareController');

// GET  /api/fare/rates      → all vehicle types + rates
// POST /api/fare/calculate  → calculate fare for a trip
router.get('/rates', getRates);
router.post('/calculate', calculateFare);

module.exports = router;
