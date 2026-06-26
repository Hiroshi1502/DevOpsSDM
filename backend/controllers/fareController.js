// ============================================
// Fare Calculation Controller
// Iteration 1: Core calculation logic
// Formula: Fare = Base Fare + (Distance × Rate per KM)
// ============================================

// Static rates used for Iteration 1 (no DB dependency yet)
// Swap these out with DB queries in Iteration 2
const BASE_RATES = {
  standard: { baseFare: 3.0,  ratePerKm: 1.10 },
  premium:  { baseFare: 5.0,  ratePerKm: 1.75 },
  van:      { baseFare: 6.0,  ratePerKm: 2.00 },
};

/**
 * GET /api/fare/rates
 * Returns all available vehicle types and their base rates
 */
const getRates = (req, res) => {
  try {
    const rates = Object.entries(BASE_RATES).map(([type, values]) => ({
      vehicleType: type,
      ...values,
    }));
    res.status(200).json({ success: true, data: rates });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch rates.' });
  }
};

/**
 * POST /api/fare/calculate
 * Body: { vehicleType: string, distanceKm: number }
 * Returns the calculated fare breakdown
 */
const calculateFare = (req, res) => {
  try {
    const { vehicleType, distanceKm } = req.body;

    // --- Validation ---
    if (!vehicleType || distanceKm === undefined) {
      return res.status(400).json({
        success: false,
        message: 'vehicleType and distanceKm are required.',
      });
    }

    const type = vehicleType.toLowerCase();
    if (!BASE_RATES[type]) {
      return res.status(400).json({
        success: false,
        message: `Unknown vehicle type: "${vehicleType}". Valid types: ${Object.keys(BASE_RATES).join(', ')}.`,
      });
    }

    const distance = parseFloat(distanceKm);
    if (isNaN(distance) || distance <= 0) {
      return res.status(400).json({
        success: false,
        message: 'distanceKm must be a positive number.',
      });
    }

    // --- Core Calculation ---
    const { baseFare, ratePerKm } = BASE_RATES[type];
    const distanceCharge = distance * ratePerKm;
    const totalFare = baseFare + distanceCharge;

    const result = {
      vehicleType: type,
      distanceKm: distance,
      baseFare: parseFloat(baseFare.toFixed(2)),
      ratePerKm: parseFloat(ratePerKm.toFixed(4)),
      distanceCharge: parseFloat(distanceCharge.toFixed(2)),
      totalFare: parseFloat(totalFare.toFixed(2)),
      currency: 'MYR',
      calculatedAt: new Date().toISOString(),
    };

    // TODO Iteration 2: persist to fare_calculations table, apply peak multiplier
    console.log(`[FareCalc] ${type} | ${distance}km | RM ${result.totalFare}`);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('[FareCalc Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { getRates, calculateFare };
