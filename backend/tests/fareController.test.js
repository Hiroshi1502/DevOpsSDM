const request = require('supertest');
const express = require('express');
const fareRoutes = require('../routes/fareRoutes');

const app = express();
app.use(express.json());
app.use('/api/fare', fareRoutes);

describe('Fare Calculation API', () => {

  // Test 1 - Get rates
  test('GET /api/fare/rates returns all vehicle types', async () => {
    const res = await request(app).get('/api/fare/rates');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });

  // Test 2 - Standard vehicle
  test('POST /api/fare/calculate - standard 10km returns valid fare', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'standard', distanceKm: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalFare).toBeGreaterThanOrEqual(14.00);
    expect(res.body.data.baseFare).toBe(3.00);
    expect(res.body.data.distanceKm).toBe(10);
  });

  // Test 3 - Premium vehicle
  test('POST /api/fare/calculate - premium 30km returns valid fare', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'premium', distanceKm: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalFare).toBeGreaterThanOrEqual(57.50);
    expect(res.body.data.baseFare).toBe(5.00);
  });

  // Test 4 - Van vehicle
  test('POST /api/fare/calculate - van 20km returns valid fare', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'van', distanceKm: 20 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalFare).toBeGreaterThanOrEqual(46.00);
    expect(res.body.data.baseFare).toBe(6.00);
  });

  // Test 5 - Peak hour fields present
  test('POST /api/fare/calculate - response includes peak hour fields', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'standard', distanceKm: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('peakApplied');
    expect(res.body.data).toHaveProperty('peakMultiplier');
    expect(res.body.data).toHaveProperty('subtotal');
  });

  // Test 6 - Invalid vehicle type
  test('POST /api/fare/calculate - invalid vehicle returns 400', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'bicycle', distanceKm: 10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Test 7 - Missing fields
  test('POST /api/fare/calculate - missing distanceKm returns 400', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'standard' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Test 8 - Negative distance
  test('POST /api/fare/calculate - negative distance returns 400', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'standard', distanceKm: -5 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});
