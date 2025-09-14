cube(`Marketing`, {
  sql: `SELECT 
    id,
    campaign_id,
    campaign_name,
    campaign_type,
    budget,
    start_date,
    end_date,
    status,
    platform,
    target_audience,
    ad_spend,
    impressions,
    clicks,
    leads,
    conversions
  FROM marketing.campaigns`,
  
  dataSource: 'default',  // 🎯 Updated to use single PostgreSQL datasource
  
  measures: {
    count: {
      type: `count`,
      title: 'Total Campaigns'
    },
    
    totalBudget: {
      sql: `budget`,
      type: `sum`,
      title: 'Total Budget'
    },
    
    averageBudget: {
      sql: `budget`,
      type: `avg`,
      title: 'Average Budget per Campaign'
    },
    
    totalAdSpend: {
      sql: `ad_spend`,
      type: `sum`,
      title: 'Total Ad Spend'
    },
    
    totalImpressions: {
      sql: `impressions`,
      type: `sum`,
      title: 'Total Impressions'
    },
    
    totalClicks: {
      sql: `clicks`,
      type: `sum`,
      title: 'Total Clicks'
    },
    
    totalLeads: {
      sql: `leads`,
      type: `sum`,
      title: 'Total Leads'
    },
    
    totalConversions: {
      sql: `conversions`,
      type: `sum`,
      title: 'Total Conversions'
    },
    
    // 🎯 Campaign performance measures with null handling
    activeCampaigns: {
      sql: `CASE WHEN status = 'active' THEN 1 END`,
      type: `count`,
      title: 'Active Campaigns'
    },
    
    completedCampaigns: {
      sql: `CASE WHEN status = 'completed' THEN 1 END`,
      type: `count`,
      title: 'Completed Campaigns'
    },
    
    // 🎯 Calculated metrics with safe division
    averageCostPerClick: {
      sql: `ad_spend / NULLIF(clicks, 0)`,
      type: `avg`,
      title: 'Average Cost Per Click'
    },
    
    averageCostPerLead: {
      sql: `ad_spend / NULLIF(leads, 0)`,
      type: `avg`,
      title: 'Average Cost Per Lead'
    },
    
    clickToLeadRate: {
      sql: `(leads::float / NULLIF(clicks, 0)) * 100`,
      type: `avg`,
      title: 'Click to Lead Rate (%)'
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    campaignId: {
      sql: `campaign_id`,
      type: `string`,
      title: 'Campaign ID'
    },
    
    campaignName: {
      sql: `campaign_name`,
      type: `string`,
      title: 'Campaign Name'
    },
    
    campaignType: {
      sql: `campaign_type`,
      type: `string`,
      title: 'Campaign Type'
    },
    
    status: {
      sql: `status`,
      type: `string`,
      title: 'Status'
    },
    
    platform: {
      sql: `platform`,
      type: `string`,
      title: 'Platform'
    },
    
    targetAudience: {
      sql: `target_audience`,
      type: `string`,
      title: 'Target Audience'
    },
    
    // 🎯 Time dimensions for campaign analysis
    startDate: {
      sql: `start_date`,
      type: `time`,
      title: 'Start Date'
    },
    
    endDate: {
      sql: `end_date`,
      type: `time`,
      title: 'End Date'
    },
    
    campaignYear: {
      sql: `EXTRACT(YEAR FROM start_date)`,
      type: `string`,
      title: 'Campaign Year'
    },
    
    campaignMonth: {
      sql: `EXTRACT(MONTH FROM start_date)`,
      type: `string`,
      title: 'Campaign Month'
    }
  }
  
  // 🔗 No joins needed for dimension table (Sales handles the relationship)
});