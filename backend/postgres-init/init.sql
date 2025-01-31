-- ============================
-- 1) Create the Customer table
-- ============================
DROP TABLE IF EXISTS customer CASCADE;
CREATE TABLE customer (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(50),
    street VARCHAR(100),
    city VARCHAR(100),
    zip VARCHAR(20),
    credit_score DOUBLE PRECISION,
    balanace DOUBLE PRECISION,         -- matches your code property
    monthly_income DOUBLE PRECISION,
    monthly_expense DOUBLE PRECISION,
    internal_assesment DOUBLE PRECISION
);

-- ============================
-- 2) Create the Loan table
-- ============================
DROP TABLE IF EXISTS loan CASCADE;
CREATE TABLE loan (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT,
    status VARCHAR(50),
    amount DOUBLE PRECISION,
    interest_rate DOUBLE PRECISION,
    monthly_payment DOUBLE PRECISION,
    term_in_months INT
);

-- =====================================
-- 3) Insert 5 sample rows in `customer`
-- =====================================
INSERT INTO customer (
    first_name, last_name, email, phone, street, city, zip,
    credit_score, balanace, monthly_income, monthly_expense, internal_assesment
) VALUES
('John',   'Doe',    'john@example.com',   '555-1000', '123 Main St', 'CityOne',   '11111', 700,  2000, 4000, 1500, 0.9),
('Jane',   'Smith',  'jane@example.com',   '555-2000', '456 Park Ave', 'CityTwo',  '22222', 720,  2500, 4500, 1400, 0.8),
('Michael','Brown',  'mike@example.com',   '555-3000', '789 Oak Rd',   'CityThree','33333', 680,  1500, 3500, 1200, 0.7),
('Sarah',  'Connor', 'sarah@example.com',  '555-4000', '101 Pine St',  'CityFour', '44444', 750,  4000, 6000, 2000, 0.95),
('Robert', 'Taylor', 'robert@example.com', '555-5000', '202 Birch Ln', 'CityFive', '55555', 650,  1000, 3000, 1000, 0.6);

-- =========================================
-- 4) Insert 5 sample rows in `loan` (PENDING)
-- =========================================
-- We'll match the customer_id to the inserted customers (1 to 5).
INSERT INTO loan (customer_id, status, amount, interest_rate, monthly_payment, term_in_months)
VALUES
(1, 'PENDING', 10000, 5.5, 200, 60),
(2, 'PENDING', 20000, 4.5, 350, 72),
(3, 'PENDING', 15000, 6.0, 300, 48),
(4, 'PENDING', 30000, 3.9, 400, 84),
(5, 'PENDING',  8000, 7.0, 150, 36);
