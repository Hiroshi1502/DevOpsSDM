-- ============================================
-- Fare Calculation Module - Database Schema
-- Iteration 1: Core & Basic Implementation
-- ============================================

-- Base fare configuration per vehicle type
CREATE TABLE IF NOT EXISTS fare_base_rates (
    id            SERIAL PRIMARY KEY,
    vehicle_type  VARCHAR(50) NOT NULL,
    base_fare     DECIMAL(10, 2) NOT NULL,
    rate_per_km   DECIMAL(10, 4) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Peak hour windows
CREATE TABLE IF NOT EXISTS fare_peak_hours (
    id          SERIAL PRIMARY KEY,
    label       VARCHAR(50) NOT NULL,
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    multiplier  DECIMAL(4, 2) NOT NULL DEFAULT 1.00,
    is_active   BOOLEAN DEFAULT TRUE
);

-- Fare calculation history / audit log
CREATE TABLE IF NOT EXISTS fare_calculations (
    id              SERIAL PRIMARY KEY,
    vehicle_type    VARCHAR(50) NOT NULL,
    distance_km     DECIMAL(10, 3) NOT NULL,
    base_fare       DECIMAL(10, 2) NOT NULL,
    calculated_fare DECIMAL(10, 2) NOT NULL,
    peak_applied    BOOLEAN DEFAULT FALSE,
    peak_multiplier DECIMAL(4, 2) DEFAULT 1.00,
    calculated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Seed Data
-- ============================================
INSERT INTO fare_base_rates (vehicle_type, base_fare, rate_per_km) VALUES
    ('standard', 3.00, 1.10),
    ('premium',  5.00, 1.75),
    ('van',      6.00, 2.00);

INSERT INTO fare_peak_hours (label, start_time, end_time, multiplier) VALUES
    ('Morning Rush', '07:00:00', '09:00:00', 1.50),
    ('Evening Rush', '17:00:00', '19:30:00', 1.50);