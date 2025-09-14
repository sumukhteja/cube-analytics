// 🔗 PowerBI Connection URLs for Joined Cube Queries
// This file contains pre-built URLs for PowerBI integration with automatic table joins

const CUBE_API_BASE = process.env.CUBE_API_URL || 'http://localhost:4000';
const JWT_TOKEN = process.env.CUBEJS_API_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U';

// 🎯 PowerBI Connection URLs for Joined Data
const powerbiJoinedQueries = {
  
  // 🔥 MOST POPULAR: Sales + Customer Intelligence (Auto-Join)
  salesWithCustomers: {
    name: "Sales Revenue by Customer Segment",
    url: `${CUBE_API_BASE}/cubejs-api/v1/load?query={"measures":["Sales.totalRevenue","Sales.count","Customers.count","Customers.averageLifetimeValue"],"dimensions":["Customers.customerSegment","Sales.region"]}`,
    description: "Revenue and order count by customer segment and region",
    tables: ["Sales", "Customers"],
    autoJoin: "customer_id"
  },

  // 🚀 PERFORMANCE: Sales + Marketing Attribution (Auto-Join)
  salesWithMarketing: {
    name: "Sales Performance by Marketing Campaign",
    url: `${CUBE_API_BASE}/cubejs-api/v1/load?query={"measures":["Sales.totalRevenue","Sales.count","Marketing.totalBudget","Marketing.totalAdSpend"],"dimensions":["Marketing.campaignType","Marketing.campaignName","Sales.region"]}`,
    description: "Revenue attribution to marketing campaigns with ROI analysis",
    tables: ["Sales", "Marketing"],
    autoJoin: "campaign_id"
  },

  // 🎯 COMPLETE: All 3 Tables Joined (Triple Auto-Join)
  salesMarketingCustomers: {
    name: "Complete Business Intelligence (3 Tables)",
    url: `${CUBE_API_BASE}/cubejs-api/v1/load?query={"measures":["Sales.totalRevenue","Marketing.totalBudget","Customers.count","Marketing.activeCampaigns"],"dimensions":["Sales.region","Customers.customerSegment","Marketing.campaignType"]}`,
    description: "Full business view: Sales + Marketing + Customer data in one query",
    tables: ["Sales", "Marketing", "Customers"],
    autoJoin: "customer_id + campaign_id"
  },

  // 📊 TIME SERIES: Daily Sales with Campaign Attribution
  dailySalesWithCampaigns: {
    name: "Daily Sales Trends by Campaign",
    url: `${CUBE_API_BASE}/cubejs-api/v1/load?query={"measures":["Sales.totalRevenue","Marketing.totalAdSpend"],"dimensions":["Sales.orderDate","Marketing.campaignName"],"timeDimensions":[{"dimension":"Sales.orderDate","granularity":"day"}]}`,
    description: "Daily sales trends with marketing campaign attribution",
    tables: ["Sales", "Marketing"],
    autoJoin: "campaign_id"
  },

  // 🎯 CUSTOMER ANALYSIS: Customer Lifetime Value by Acquisition Channel
  customerValueAnalysis: {
    name: "Customer LTV by Acquisition Source",
    url: `${CUBE_API_BASE}/cubejs-api/v1/load?query={"measures":["Customers.averageLifetimeValue","Customers.count","Sales.totalRevenue","Sales.averageOrderValue"],"dimensions":["Customers.acquisitionChannel","Customers.customerSegment"]}`,
    description: "Customer lifetime value analysis by acquisition channel",
    tables: ["Sales", "Customers"],
    autoJoin: "customer_id"
  },

  // 🚀 ROI ANALYSIS: Marketing ROI by Customer Segment
  marketingROIbySegment: {
    name: "Marketing ROI by Customer Segment",
    url: `${CUBE_API_BASE}/cubejs-api/v1/load?query={"measures":["Sales.totalRevenue","Marketing.totalBudget","Marketing.totalAdSpend","Customers.count"],"dimensions":["Customers.customerSegment","Marketing.campaignType","Marketing.platform"]}`,
    description: "Marketing return on investment analysis by customer segments",
    tables: ["Sales", "Marketing", "Customers"],
    autoJoin: "customer_id + campaign_id"
  }
};

// 🎯 PowerBI M Code Generator
const generatePowerBIM = (queryKey) => {
  const query = powerbiJoinedQueries[queryKey];
  if (!query) return null;

  return `let
    // ${query.description}
    // Auto-joins: ${query.tables.join(' → ')} via ${query.autoJoin}
    Source = Json.Document(Web.Contents("${query.url}", [Headers=[Authorization="Bearer ${JWT_TOKEN}"]])),
    Data = Source[data],
    ConvertedToTable = Table.FromRecords(Data)
in
    ConvertedToTable`;
};

// 🔧 PowerBI Setup Instructions Generator
const generatePowerBIInstructions = (queryKey) => {
  const query = powerbiJoinedQueries[queryKey];
  if (!query) return null;

  return `
📊 PowerBI Setup: ${query.name}

1. Open PowerBI Desktop
2. Get Data → Web
3. URL: ${query.url}
4. Advanced → Headers:
   - Name: Authorization
   - Value: Bearer ${JWT_TOKEN}
5. Navigate: data → List
6. Convert to Table

🔗 Auto-Joins: ${query.tables.join(' + ')}
📈 Description: ${query.description}
`;
};

// 📋 Get All Available Queries for Documentation
const getAllQueries = () => {
  return Object.keys(powerbiJoinedQueries).map(key => ({
    key,
    name: powerbiJoinedQueries[key].name,
    description: powerbiJoinedQueries[key].description,
    tables: powerbiJoinedQueries[key].tables,
    url: powerbiJoinedQueries[key].url
  }));
};

// 🎯 Quick Access Links (for documentation)
const quickLinks = {
  // Most popular combinations
  popular: [
    'salesWithCustomers',
    'salesWithMarketing', 
    'salesMarketingCustomers'
  ],
  
  // Advanced analysis
  advanced: [
    'dailySalesWithCampaigns',
    'customerValueAnalysis',
    'marketingROIbySegment'
  ]
};

module.exports = {
  powerbiJoinedQueries,
  generatePowerBIM,
  generatePowerBIInstructions,
  getAllQueries,
  quickLinks,
  CUBE_API_BASE,
  JWT_TOKEN
};