-- PostgreSQL initialization script for marketingdb
\c marketingdb;

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_id VARCHAR(50) NOT NULL UNIQUE,
    ad_spend DECIMAL(10,2) NOT NULL,
    clicks INTEGER NOT NULL,
    leads INTEGER NOT NULL,
    start_date DATE NOT NULL
);

-- Insert sample data
INSERT INTO campaigns (campaign_name, campaign_id, ad_spend, clicks, leads, start_date) VALUES
('Holiday Electronics Sale', 'CAMP-001', 5000.00, 12500, 85, '2024-01-01'),
('Spring Fashion Collection', 'CAMP-002', 3500.00, 8750, 62, '2024-01-05'),
('Tech Product Launch', 'CAMP-003', 8000.00, 15200, 95, '2024-01-10'),
('Summer Sports Gear', 'CAMP-004', 2800.00, 6200, 45, '2024-01-12'),
('Back to School Books', 'CAMP-005', 1200.00, 3500, 28, '2024-01-15');

-- Create index on campaign_id for better join performance
CREATE INDEX idx_campaigns_campaign_id ON campaigns(campaign_id);

-- Display inserted data for verification
SELECT * FROM campaigns;