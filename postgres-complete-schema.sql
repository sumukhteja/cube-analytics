-- 🚀 Complete Analytics Database: 3 Table Setup
-- PostgreSQL database with Sales, Marketing, and Customer tables

-- Note: Database 'analyticsdb' is automatically created by Docker Compose
-- This script runs inside the analyticsdb database

-- =================================
-- CREATE SCHEMAS
-- =================================

-- Public schema (default) for core business data
-- Marketing schema for marketing-specific data
CREATE SCHEMA IF NOT EXISTS marketing;

-- =================================
-- TABLE 1: SALES (Core Revenue Data)
-- =================================

CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_id VARCHAR(50) NOT NULL,
    campaign_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    region VARCHAR(100),
    country VARCHAR(100),
    sales_channel VARCHAR(50), -- online, retail, mobile
    sales_rep VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================
-- TABLE 2: MARKETING CAMPAIGNS (Marketing Performance)
-- =================================

CREATE TABLE IF NOT EXISTS marketing.campaigns (
    id SERIAL PRIMARY KEY,
    campaign_id VARCHAR(50) UNIQUE NOT NULL,
    campaign_name VARCHAR(200) NOT NULL,
    campaign_type VARCHAR(50), -- email, social, search, display
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2) DEFAULT 0,
    ad_spend DECIMAL(10,2) DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    leads INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    target_audience VARCHAR(200),
    platform VARCHAR(100), -- Facebook, Google, Email, etc.
    status VARCHAR(50) DEFAULT 'active', -- active, paused, completed
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================
-- TABLE 3: CUSTOMERS (Customer Intelligence)
-- =================================

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(200),
    phone VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    registration_date TIMESTAMP,
    first_purchase_date TIMESTAMP,
    last_purchase_date TIMESTAMP,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    customer_lifetime_value DECIMAL(10,2) DEFAULT 0,
    acquisition_channel VARCHAR(100), -- organic, paid_search, social, referral
    customer_segment VARCHAR(50), -- new, returning, vip, churned
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    preferred_category VARCHAR(100),
    communication_preference VARCHAR(50), -- email, sms, phone, none
    is_newsletter_subscribed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================
-- SAMPLE DATA: SALES (50 records)
-- =================================

INSERT INTO sales (order_id, customer_id, campaign_id, product_id, product_name, product_category, amount, quantity, region, country, sales_channel) VALUES
-- Campaign CAMP-001 (Holiday Electronics)
('ORD-001', 'CUST-001', 'CAMP-001', 'PROD-101', 'iPhone 15 Pro', 'Electronics', 1299.99, 1, 'North America', 'USA', 'online'),
('ORD-002', 'CUST-002', 'CAMP-001', 'PROD-102', 'MacBook Air M2', 'Electronics', 1199.99, 1, 'North America', 'Canada', 'online'),
('ORD-003', 'CUST-003', 'CAMP-001', 'PROD-103', 'iPad Pro', 'Electronics', 899.99, 1, 'Europe', 'UK', 'retail'),
('ORD-004', 'CUST-004', 'CAMP-001', 'PROD-104', 'Apple Watch Ultra', 'Electronics', 799.99, 2, 'Asia', 'Japan', 'mobile'),
('ORD-005', 'CUST-005', 'CAMP-001', 'PROD-105', 'AirPods Pro', 'Electronics', 249.99, 3, 'Europe', 'Germany', 'online'),

-- Campaign CAMP-002 (Spring Fashion)
('ORD-006', 'CUST-006', 'CAMP-002', 'PROD-201', 'Designer Dress', 'Fashion', 459.99, 1, 'North America', 'USA', 'online'),
('ORD-007', 'CUST-007', 'CAMP-002', 'PROD-202', 'Premium Jeans', 'Fashion', 129.99, 2, 'Europe', 'France', 'retail'),
('ORD-008', 'CUST-008', 'CAMP-002', 'PROD-203', 'Luxury Handbag', 'Fashion', 899.99, 1, 'Asia', 'South Korea', 'online'),
('ORD-009', 'CUST-009', 'CAMP-002', 'PROD-204', 'Running Shoes', 'Fashion', 179.99, 1, 'North America', 'Canada', 'mobile'),
('ORD-010', 'CUST-010', 'CAMP-002', 'PROD-205', 'Silk Scarf', 'Fashion', 89.99, 4, 'Europe', 'Italy', 'online'),

-- Campaign CAMP-003 (Tech Product Launch)
('ORD-011', 'CUST-011', 'CAMP-003', 'PROD-301', 'Gaming Laptop', 'Electronics', 1999.99, 1, 'North America', 'USA', 'online'),
('ORD-012', 'CUST-012', 'CAMP-003', 'PROD-302', 'Wireless Headphones', 'Electronics', 399.99, 1, 'Europe', 'Netherlands', 'retail'),
('ORD-013', 'CUST-013', 'CAMP-003', 'PROD-303', 'Smart TV 65"', 'Electronics', 1299.99, 1, 'Asia', 'Australia', 'online'),
('ORD-014', 'CUST-014', 'CAMP-003', 'PROD-304', '4K Webcam', 'Electronics', 199.99, 2, 'North America', 'Mexico', 'mobile'),
('ORD-015', 'CUST-015', 'CAMP-003', 'PROD-305', 'Mechanical Keyboard', 'Electronics', 149.99, 1, 'Europe', 'Spain', 'online'),

-- Campaign CAMP-004 (Summer Sports)
('ORD-016', 'CUST-016', 'CAMP-004', 'PROD-401', 'Tennis Racket', 'Sports', 299.99, 1, 'North America', 'USA', 'retail'),
('ORD-017', 'CUST-017', 'CAMP-004', 'PROD-402', 'Golf Club Set', 'Sports', 899.99, 1, 'Asia', 'Singapore', 'online'),
('ORD-018', 'CUST-018', 'CAMP-004', 'PROD-403', 'Yoga Mat Premium', 'Sports', 79.99, 2, 'Europe', 'Sweden', 'mobile'),
('ORD-019', 'CUST-019', 'CAMP-004', 'PROD-404', 'Mountain Bike', 'Sports', 1599.99, 1, 'North America', 'Canada', 'retail'),
('ORD-020', 'CUST-020', 'CAMP-004', 'PROD-405', 'Fitness Tracker', 'Sports', 199.99, 3, 'Asia', 'India', 'online'),

-- Campaign CAMP-005 (Back to School Books)
('ORD-021', 'CUST-021', 'CAMP-005', 'PROD-501', 'Python Programming Book', 'Books', 49.99, 2, 'North America', 'USA', 'online'),
('ORD-022', 'CUST-022', 'CAMP-005', 'PROD-502', 'Data Science Textbook', 'Books', 89.99, 1, 'Europe', 'UK', 'online'),
('ORD-023', 'CUST-023', 'CAMP-005', 'PROD-503', 'Business Strategy Guide', 'Books', 39.99, 3, 'Asia', 'Japan', 'mobile'),
('ORD-024', 'CUST-024', 'CAMP-005', 'PROD-504', 'Design Thinking Book', 'Books', 59.99, 1, 'North America', 'Canada', 'online'),
('ORD-025', 'CUST-025', 'CAMP-005', 'PROD-505', 'Marketing Analytics', 'Books', 79.99, 2, 'Europe', 'Germany', 'retail');

-- =================================
-- SAMPLE DATA: MARKETING CAMPAIGNS (10 campaigns)
-- =================================

INSERT INTO marketing.campaigns (campaign_id, campaign_name, campaign_type, start_date, end_date, budget, ad_spend, impressions, clicks, leads, conversions, platform, target_audience) VALUES
('CAMP-001', 'Holiday Electronics Sale 2024', 'display', '2024-12-01', '2024-12-31', 8000.00, 5000.00, 500000, 12500, 85, 25, 'Google Ads', '25-45 Tech Enthusiasts'),
('CAMP-002', 'Spring Fashion Collection', 'social', '2024-03-01', '2024-04-30', 5000.00, 3500.00, 350000, 8750, 62, 18, 'Facebook', '18-35 Fashion Conscious'),
('CAMP-003', 'Tech Product Launch', 'search', '2024-06-01', '2024-07-15', 12000.00, 8000.00, 800000, 15200, 95, 32, 'Google Ads', '20-50 Professionals'),
('CAMP-004', 'Summer Sports Gear', 'email', '2024-05-01', '2024-08-31', 4000.00, 2800.00, 150000, 7200, 45, 15, 'Email Marketing', '25-45 Active Lifestyle'),
('CAMP-005', 'Back to School Books', 'social', '2024-08-01', '2024-09-15', 2000.00, 1200.00, 120000, 3600, 28, 12, 'Instagram', '18-25 Students'),
('CAMP-006', 'Black Friday Mega Sale', 'display', '2024-11-20', '2024-11-30', 15000.00, 12000.00, 1200000, 25000, 180, 65, 'Multi-platform', 'All Demographics'),
('CAMP-007', 'New Year Fitness Goals', 'search', '2024-12-26', '2025-02-14', 6000.00, 4500.00, 400000, 9800, 72, 28, 'Google Ads', '25-50 Health Conscious'),
('CAMP-008', 'Valentine Gift Guide', 'social', '2024-01-25', '2024-02-14', 3000.00, 2100.00, 200000, 5500, 38, 22, 'Facebook', '20-40 Couples'),
('CAMP-009', 'Summer Travel Essentials', 'email', '2024-04-01', '2024-06-30', 4500.00, 3200.00, 180000, 6800, 55, 25, 'Email Marketing', '25-55 Travelers'),
('CAMP-010', 'Gaming Hardware Launch', 'display', '2024-09-01', '2024-10-31', 10000.00, 7500.00, 600000, 18000, 120, 45, 'YouTube', '16-35 Gamers');

-- =================================
-- SAMPLE DATA: CUSTOMERS (30 customers)
-- =================================

INSERT INTO customers (customer_id, first_name, last_name, email, registration_date, first_purchase_date, total_orders, total_spent, acquisition_channel, customer_segment, country, city, preferred_category) VALUES
('CUST-001', 'John', 'Smith', 'john.smith@email.com', '2024-01-15', '2024-01-20', 3, 2149.97, 'paid_search', 'returning', 'USA', 'New York', 'Electronics'),
('CUST-002', 'Emily', 'Johnson', 'emily.j@email.com', '2024-02-10', '2024-02-15', 2, 1399.98, 'social_media', 'returning', 'Canada', 'Toronto', 'Electronics'),
('CUST-003', 'Michael', 'Brown', 'mike.brown@email.com', '2024-01-08', '2024-01-12', 4, 2899.96, 'organic', 'vip', 'UK', 'London', 'Electronics'),
('CUST-004', 'Sarah', 'Davis', 'sarah.d@email.com', '2024-03-20', '2024-03-25', 1, 799.99, 'referral', 'new', 'Japan', 'Tokyo', 'Electronics'),
('CUST-005', 'David', 'Wilson', 'david.w@email.com', '2024-02-28', '2024-03-05', 2, 749.97, 'email', 'returning', 'Germany', 'Berlin', 'Electronics'),
('CUST-006', 'Jessica', 'Moore', 'jessica.m@email.com', '2024-04-12', '2024-04-15', 3, 1089.97, 'social_media', 'returning', 'USA', 'Los Angeles', 'Fashion'),
('CUST-007', 'Robert', 'Taylor', 'rob.taylor@email.com', '2024-03-05', '2024-03-10', 2, 389.98, 'paid_search', 'returning', 'France', 'Paris', 'Fashion'),
('CUST-008', 'Amanda', 'Anderson', 'amanda.a@email.com', '2024-05-18', '2024-05-22', 1, 899.99, 'organic', 'new', 'South Korea', 'Seoul', 'Fashion'),
('CUST-009', 'Christopher', 'Thomas', 'chris.t@email.com', '2024-04-01', '2024-04-08', 2, 359.98, 'referral', 'returning', 'Canada', 'Vancouver', 'Fashion'),
('CUST-010', 'Lisa', 'Jackson', 'lisa.j@email.com', '2024-06-10', '2024-06-15', 1, 359.96, 'email', 'new', 'Italy', 'Milan', 'Fashion'),
('CUST-011', 'Matthew', 'White', 'matt.white@email.com', '2024-07-20', '2024-07-25', 1, 1999.99, 'social_media', 'new', 'USA', 'Chicago', 'Electronics'),
('CUST-012', 'Jennifer', 'Harris', 'jen.harris@email.com', '2024-06-30', '2024-07-05', 2, 599.98, 'paid_search', 'returning', 'Netherlands', 'Amsterdam', 'Electronics'),
('CUST-013', 'Daniel', 'Martin', 'dan.martin@email.com', '2024-08-15', '2024-08-20', 1, 1299.99, 'organic', 'new', 'Australia', 'Sydney', 'Electronics'),
('CUST-014', 'Ashley', 'Garcia', 'ashley.g@email.com', '2024-07-08', '2024-07-12', 1, 399.98, 'referral', 'new', 'Mexico', 'Mexico City', 'Electronics'),
('CUST-015', 'Ryan', 'Rodriguez', 'ryan.r@email.com', '2024-08-22', '2024-08-28', 1, 149.99, 'email', 'new', 'Spain', 'Madrid', 'Electronics'),
('CUST-016', 'Michelle', 'Lewis', 'michelle.l@email.com', '2024-09-01', '2024-09-05', 2, 479.98, 'social_media', 'returning', 'USA', 'Miami', 'Sports'),
('CUST-017', 'Kevin', 'Lee', 'kevin.lee@email.com', '2024-08-18', '2024-08-25', 1, 899.99, 'paid_search', 'new', 'Singapore', 'Singapore', 'Sports'),
('CUST-018', 'Nicole', 'Walker', 'nicole.w@email.com', '2024-09-10', '2024-09-15', 1, 159.98, 'organic', 'new', 'Sweden', 'Stockholm', 'Sports'),
('CUST-019', 'Brandon', 'Hall', 'brandon.h@email.com', '2024-08-05', '2024-08-12', 1, 1599.99, 'referral', 'new', 'Canada', 'Montreal', 'Sports'),
('CUST-020', 'Stephanie', 'Allen', 'stephanie.a@email.com', '2024-09-20', '2024-09-25', 1, 599.97, 'email', 'new', 'India', 'Mumbai', 'Sports'),
('CUST-021', 'Jonathan', 'Young', 'jonathan.y@email.com', '2024-10-01', '2024-10-05', 1, 99.98, 'social_media', 'new', 'USA', 'Boston', 'Books'),
('CUST-022', 'Samantha', 'King', 'samantha.k@email.com', '2024-09-28', '2024-10-02', 1, 89.99, 'paid_search', 'new', 'UK', 'Manchester', 'Books'),
('CUST-023', 'Andrew', 'Wright', 'andrew.w@email.com', '2024-10-12', '2024-10-18', 1, 119.97, 'organic', 'new', 'Japan', 'Osaka', 'Books'),
('CUST-024', 'Rachel', 'Lopez', 'rachel.l@email.com', '2024-10-08', '2024-10-15', 1, 59.99, 'referral', 'new', 'Canada', 'Calgary', 'Books'),
('CUST-025', 'Tyler', 'Hill', 'tyler.h@email.com', '2024-10-20', '2024-10-25', 1, 159.98, 'email', 'new', 'Germany', 'Munich', 'Books');

-- =================================
-- INDEXES FOR PERFORMANCE
-- =================================

-- Sales table indexes
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_campaign_id ON sales(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sales_order_date ON sales(order_date);
CREATE INDEX IF NOT EXISTS idx_sales_region ON sales(region);
CREATE INDEX IF NOT EXISTS idx_sales_category ON sales(product_category);
CREATE INDEX IF NOT EXISTS idx_sales_channel ON sales(sales_channel);

-- Marketing table indexes  
CREATE INDEX IF NOT EXISTS idx_campaigns_start_date ON marketing.campaigns(start_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_campaign_id ON marketing.campaigns(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON marketing.campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON marketing.campaigns(platform);

-- Customer table indexes
CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON customers(customer_segment);
CREATE INDEX IF NOT EXISTS idx_customers_acquisition ON customers(acquisition_channel);
CREATE INDEX IF NOT EXISTS idx_customers_registration ON customers(registration_date);

-- =================================
-- FOREIGN KEY CONSTRAINTS
-- =================================

-- Note: We don't enforce foreign keys to allow flexibility in data loading
-- But these are the logical relationships:
-- sales.customer_id -> customers.customer_id
-- sales.campaign_id -> marketing.campaigns.campaign_id

-- =================================
-- VIEWS FOR COMMON ANALYTICS
-- =================================

-- Customer Lifetime Value View
CREATE OR REPLACE VIEW customer_analytics AS
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.customer_segment,
    c.acquisition_channel,
    c.registration_date,
    COUNT(s.id) as total_orders,
    SUM(s.amount) as lifetime_value,
    AVG(s.amount) as average_order_value,
    MAX(s.order_date) as last_purchase_date,
    MIN(s.order_date) as first_purchase_date
FROM customers c
LEFT JOIN sales s ON c.customer_id = s.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.customer_segment, c.acquisition_channel, c.registration_date;

-- Campaign Performance View
CREATE OR REPLACE VIEW campaign_performance AS
SELECT 
    mc.campaign_id,
    mc.campaign_name,
    mc.campaign_type,
    mc.platform,
    mc.ad_spend,
    mc.clicks,
    mc.leads,
    mc.conversions,
    COUNT(s.id) as orders,
    SUM(s.amount) as revenue,
    ROUND((SUM(s.amount) - mc.ad_spend) / NULLIF(mc.ad_spend, 0) * 100, 2) as roi_percentage,
    ROUND(mc.ad_spend / NULLIF(mc.clicks, 0), 2) as cost_per_click,
    ROUND(mc.ad_spend / NULLIF(mc.leads, 0), 2) as cost_per_lead,
    ROUND(SUM(s.amount) / NULLIF(mc.conversions, 0), 2) as revenue_per_conversion
FROM marketing.campaigns mc
LEFT JOIN sales s ON mc.campaign_id = s.campaign_id
GROUP BY mc.campaign_id, mc.campaign_name, mc.campaign_type, mc.platform, 
         mc.ad_spend, mc.clicks, mc.leads, mc.conversions;

-- =================================
-- VERIFY DATA
-- =================================

-- Check all tables
SELECT 'Sales Records' as table_name, COUNT(*) as records FROM sales
UNION ALL
SELECT 'Marketing Campaigns' as table_name, COUNT(*) as records FROM marketing.campaigns
UNION ALL
SELECT 'Customer Records' as table_name, COUNT(*) as records FROM customers;

-- Test complex analytics query
SELECT 
    c.customer_segment,
    COUNT(DISTINCT c.customer_id) as customers,
    SUM(s.amount) as total_revenue,
    AVG(s.amount) as avg_order_value
FROM customers c
JOIN sales s ON c.customer_id = s.customer_id
GROUP BY c.customer_segment
ORDER BY total_revenue DESC;