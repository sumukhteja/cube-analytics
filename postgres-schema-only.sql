-- 🚀 Analytics Database Schema (PostgreSQL)
-- Schema-only version for production deployment
-- Run this to create empty tables, then populate with your client's data

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
-- GRANTS (if needed for specific user)
-- =================================

-- Grant permissions to postgres user (adjust if using different user)
GRANT ALL PRIVILEGES ON DATABASE analyticsdb TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA marketing TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA marketing TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA marketing TO postgres;

-- =================================
-- VERIFY SCHEMA CREATED SUCCESSFULLY
-- =================================

-- Check that all tables exist
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname IN ('public', 'marketing')
ORDER BY schemaname, tablename;

-- =================================
-- INSTRUCTIONS FOR POPULATING DATA:
-- =================================

-- After running this schema, populate your tables with:
-- 1. Your client's sales data → sales table
-- 2. Your client's marketing campaigns → marketing.campaigns table  
-- 3. Your client's customer data → customers table
--
-- Or use the sample data from postgres-complete-schema.sql for testing