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
    expect(res.body.data.length).toBe(3);
  });

  // Test 2 - Standard vehicle
  test('POST /api/fare/calculate - standard 10km = RM 14.00', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'standard', distanceKm: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.totalFare).toBe(14.00);
  });

  // Test 3 - Premium vehicle
  test('POST /api/fare/calculate - premium 30km = RM 57.50', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'premium', distanceKm: 30 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.totalFare).toBe(57.50);
  });

  // Test 4 - Van vehicle
  test('POST /api/fare/calculate - van 20km = RM 46.00', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'van', distanceKm: 20 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.totalFare).toBe(46.00);
  });

  // Test 5 - Invalid vehicle type
  test('POST /api/fare/calculate - invalid vehicle returns 400', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'bicycle', distanceKm: 10 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Test 6 - Missing fields
  test('POST /api/fare/calculate - missing distanceKm returns 400', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'standard' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Test 7 - Negative distance
  test('POST /api/fare/calculate - negative distance returns 400', async () => {
    const res = await request(app)
      .post('/api/fare/calculate')
      .send({ vehicleType: 'standard', distanceKm: -5 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});