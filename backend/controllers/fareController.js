// ============================================
// Fare Calculation Controller
// Iteration 2: Dynamic DB rates + Peak Hour surcharges
// Formula: Fare = (Base Fare + (Distance × Rate per KM)) × Peak Multiplier
// ============================================

const pool = require('../db/pool');

/**
 * GET /api/fare/rates
 * Returns all vehicle types and rates from the database
 */
const getRates = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT vehicle_type, base_fare, rate_per_km FROM fare_base_rates ORDER BY id'
    );
    const rates = result.rows.map(row => ({
      vehicleType: row.vehicle_type,
      baseFare: parseFloat(row.base_fare),
      ratePerKm: parseFloat(row.rate_per_km),
    }));
    res.status(200).json({ success: true, data: rates });
  } catch (err) {
    console.error('[GetRates Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch rates.' });
  }
};

/**
 * Helper: Check if current time falls in a peak hour window
 * Returns { isPeak, multiplier, label }
 */
const checkPeakHour = async () => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS

    const result = await pool.query(
      `SELECT label, multiplier FROM fare_peak_hours
       WHERE is_active = TRUE
         AND start_time <= $1::time
         AND end_time >= $1::time
       LIMIT 1`,
      [currentTime]
    );

    if (result.rows.length > 0) {
      return {
        isPeak: true,
        multiplier: parseFloat(result.rows[0].multiplier),
        label: result.rows[0].label,
      };
    }
    return { isPeak: false, multiplier: 1.00, label: null };
  } catch (err) {
    console.error('[PeakHour Check Error]', err);
    return { isPeak: false, multiplier: 1.00, label: null };
  }
};

/**
 * POST /api/fare/calculate
 * Body: { vehicleType: string, distanceKm: number }
 * Returns full fare breakdown including peak hour surcharge if applicable
 */
const calculateFare = async (req, res) => {
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
    const distance = parseFloat(distanceKm);

    if (isNaN(distance) || distance <= 0) {
      return res.status(400).json({
        success: false,
        message: 'distanceKm must be a positive number.',
      });
    }

    // --- Fetch rates from DB ---
    const rateResult = await pool.query(
      'SELECT base_fare, rate_per_km FROM fare_base_rates WHERE vehicle_type = $1',
      [type]
    );

    if (rateResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Unknown vehicle type: "${vehicleType}".`,
      });
    }

    const { base_fare, rate_per_km } = rateResult.rows[0];
    const baseFare = parseFloat(base_fare);
    const ratePerKm = parseFloat(rate_per_km);

    // --- Check peak hours ---
    const peak = await checkPeakHour();

    // --- Core Calculation ---
    const distanceCharge = distance * ratePerKm;
    const subtotal = baseFare + distanceCharge;
    const totalFare = subtotal * peak.multiplier;

    const result = {
      vehicleType: type,
      distanceKm: distance,
      baseFare: parseFloat(baseFare.toFixed(2)),
      ratePerKm: parseFloat(ratePerKm.toFixed(4)),
      distanceCharge: parseFloat(distanceCharge.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      peakApplied: peak.isPeak,
      peakMultiplier: peak.multiplier,
      peakLabel: peak.label,
      totalFare: parseFloat(totalFare.toFixed(2)),
      currency: 'MYR',
      calculatedAt: new Date().toISOString(),
    };

    // --- Persist to DB ---
    await pool.query(
      `INSERT INTO fare_calculations
        (vehicle_type, distance_km, base_fare, calculated_fare, peak_applied, peak_multiplier)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [type, distance, baseFare, result.totalFare, peak.isPeak, peak.multiplier]
    );

    console.log(`[FareCalc] ${type} | ${distance}km | RM ${result.totalFare} | Peak: ${peak.isPeak}`);
    res.status(200).json({ success: true, data: result });

  } catch (err) {
    console.error('[FareCalc Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { getRates, calculateFare };
