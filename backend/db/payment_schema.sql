-- ============================================
-- Payment Module - Iteration 1
-- ============================================

CREATE TABLE IF NOT EXISTS payment_transactions (
    id                SERIAL PRIMARY KEY,
    fare_amount       DECIMAL(10,2) NOT NULL,
    currency          VARCHAR(10) DEFAULT 'MYR',
    payment_method    VARCHAR(50) DEFAULT 'MOCK',
    status            VARCHAR(20) DEFAULT 'PENDING',
    transaction_ref   VARCHAR(100),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
