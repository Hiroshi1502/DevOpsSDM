# Fare Calculation Module — Documentation

**Project:** DevOps SDM  
**Iteration:** 1 — Core & Basic Implementation  
**Stack:** React (Vite) + Node.js/Express + PostgreSQL

---

## Overview

The Fare Calculation Module estimates trip costs based on vehicle type and distance travelled. It applies a fixed base fare plus a per-kilometre rate depending on the selected vehicle category.

**Formula:**
```
Total Fare = Base Fare + (Distance × Rate per KM)
```

---

## Database Tables

### `fare_base_rates`
Stores the base fare and rate per km for each vehicle type.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| vehicle_type | VARCHAR(50) | e.g. standard, premium, van |
| base_fare | DECIMAL(10,2) | Flat starting fee (RM) |
| rate_per_km | DECIMAL(10,4) | RM charged per kilometre |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### `fare_peak_hours`
Defines peak hour windows for surge pricing (used in Iteration 2).

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| label | VARCHAR(50) | e.g. Morning Rush |
| start_time | TIME | Peak period start |
| end_time | TIME | Peak period end |
| multiplier | DECIMAL(4,2) | Fare multiplier (e.g. 1.50) |
| is_active | BOOLEAN | Toggle on/off |

### `fare_calculations`
Audit log of every fare calculated.

| Column | Type | Description |
|---|---|---|
| id | SERIAL | Primary key |
| vehicle_type | VARCHAR(50) | Selected vehicle type |
| distance_km | DECIMAL(10,3) | Trip distance in km |
| base_fare | DECIMAL(10,2) | Base fare applied |
| calculated_fare | DECIMAL(10,2) | Final total fare |
| peak_applied | BOOLEAN | Whether peak pricing was used |
| peak_multiplier | DECIMAL(4,2) | Multiplier applied |
| calculated_at | TIMESTAMP | Calculation timestamp |

---

## Seed Data (Default Rates)

| Vehicle Type | Base Fare | Rate per KM |
|---|---|---|
| Standard | RM 3.00 | RM 1.10 |
| Premium | RM 5.00 | RM 1.75 |
| Van | RM 6.00 | RM 2.00 |

---

## API Endpoints

### `GET /api/fare/rates`
Returns all available vehicle types and their rates.

**Response:**
```json
{
  "success": true,
  "data": [
    { "vehicleType": "standard", "baseFare": 3.00, "ratePerKm": 1.10 },
    { "vehicleType": "premium",  "baseFare": 5.00, "ratePerKm": 1.75 },
    { "vehicleType": "van",      "baseFare": 6.00, "ratePerKm": 2.00 }
  ]
}
```

---

### `POST /api/fare/calculate`
Calculates the fare for a trip.

**Request Body:**
```json
{
  "vehicleType": "premium",
  "distanceKm": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vehicleType": "premium",
    "distanceKm": 30,
    "baseFare": 5.00,
    "ratePerKm": 1.75,
    "distanceCharge": 52.50,
    "totalFare": 57.50,
    "currency": "MYR",
    "calculatedAt": "2026-06-26T10:00:00.000Z"
  }
}
```

---

## File Structure

```
DevOpsSDM/
├── backend/
│   ├── controllers/
│   │   └── fareController.js     # Core calculation logic
│   ├── db/
│   │   ├── pool.js               # PostgreSQL connection
│   │   └── fare_schema.sql       # DB schema + seed data
│   ├── routes/
│   │   └── fareRoutes.js         # API route definitions
│   ├── .env                      # Environment variables
│   └── server.js                 # Express server entry point
└── frontend/
    └── src/
        ├── pages/
        │   └── FareCalculator.jsx  # Fare calculator UI
        └── App.jsx                 # Root component
```

---

## How to Run

### Prerequisites
- Node.js v20+
- PostgreSQL 17+

### Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

### Database Setup
1. Create a database named `devopssdm` in pgAdmin
2. Open Query Tool and run `backend/db/fare_schema.sql`

---

## Iteration Roadmap

| Iteration | Feature |
|---|---|
| ✅ Iteration 1 | Core fare calculation, static rates, basic UI |
| 🔲 Iteration 2 | Peak hour surcharges, dynamic DB rates, payment integration |
| 🔲 Iteration 3 | Promo codes, GPS/map distance, security hardening |
