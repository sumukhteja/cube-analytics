// 🎯 Business Intelligence Views - Pre-built joined queries
// These create virtual "tables" that PowerBI can consume directly
// 🔒 CLIENTS ONLY GET URLs - No access to join logic or raw data

// 📊 View 1: Marketing Performance Dashboard
cube(`MarketingDashboard`, {
  sql: `
    SELECT 
      s.region as sales_region,
      c.customer_segment,
      m.campaign_type,
      m.platform,
      SUM(s.amount) as total_revenue,
      COUNT(s.id) as total_orders,
      SUM(m.budget) as total_budget,
      SUM(m.ad_spend) as total_ad_spend,
      COUNT(DISTINCT c.customer_id) as customer_count,
      COUNT(DISTINCT m.campaign_id) as active_campaigns
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.customer_id  
    LEFT JOIN marketing.campaigns m ON s.campaign_id = m.campaign_id
    GROUP BY s.region, c.customer_segment, m.campaign_type, m.platform
  `,
  
  measures: {
    totalRevenue: {
      sql: `total_revenue`,
      type: `sum`,
      title: 'Total Revenue'
    },
    
    totalOrders: {
      sql: `total_orders`,
      type: `sum`, 
      title: 'Total Orders'
    },
    
    totalBudget: {
      sql: `total_budget`,
      type: `sum`,
      title: 'Marketing Budget'
    },
    
    totalAdSpend: {
      sql: `total_ad_spend`,
      type: `sum`,
      title: 'Ad Spend'
    },
    
    customerCount: {
      sql: `customer_count`,
      type: `sum`,
      title: 'Customer Count'
    },
    
    activeCampaigns: {
      sql: `active_campaigns`, 
      type: `sum`,
      title: 'Active Campaigns'
    },
    
    // 🎯 Calculated measures built-in
    roi: {
      sql: `CASE WHEN ${CUBE}.total_ad_spend > 0 THEN 
              ((${CUBE}.total_revenue - ${CUBE}.total_ad_spend) / ${CUBE}.total_ad_spend) * 100 
            ELSE NULL END`,
      type: `avg`,
      title: 'ROI Percentage'
    },
    
    costPerOrder: {
      sql: `CASE WHEN ${CUBE}.total_orders > 0 THEN 
              ${CUBE}.total_ad_spend / ${CUBE}.total_orders 
            ELSE NULL END`,
      type: `avg`,
      title: 'Cost Per Order'
    }
  },
  
  dimensions: {
    salesRegion: {
      sql: `sales_region`,
      type: `string`,
      title: 'Sales Region'
    },
    
    customerSegment: {
      sql: `customer_segment`,
      type: `string`,
      title: 'Customer Segment'
    },
    
    campaignType: {
      sql: `campaign_type`,
      type: `string`,
      title: 'Campaign Type'
    },
    
    platform: {
      sql: `platform`,
      type: `string`, 
      title: 'Marketing Platform'
    }
  },
  
  dataSource: `default`
});

// 📈 View 2: Customer Analytics Dashboard
cube(`CustomerAnalytics`, {
  sql: `
    SELECT 
      c.customer_segment,
      c.acquisition_channel,
      c.country,
      s.region as sales_region,
      SUM(s.amount) as total_revenue,
      COUNT(s.id) as total_orders,
      COUNT(DISTINCT s.customer_id) as unique_customers,
      AVG(s.amount) as avg_order_value,
      SUM(c.total_spent) as lifetime_value
    FROM customers c
    LEFT JOIN sales s ON c.customer_id = s.customer_id
    GROUP BY c.customer_segment, c.acquisition_channel, c.country, s.region
  `,
  
  measures: {
    totalRevenue: {
      sql: `total_revenue`,
      type: `sum`,
      title: 'Total Revenue'
    },
    
    totalOrders: {
      sql: `total_orders`, 
      type: `sum`,
      title: 'Total Orders'
    },
    
    uniqueCustomers: {
      sql: `unique_customers`,
      type: `sum`,
      title: 'Unique Customers'
    },
    
    avgOrderValue: {
      sql: `avg_order_value`,
      type: `avg`,
      title: 'Average Order Value'
    },
    
    lifetimeValue: {
      sql: `lifetime_value`,
      type: `sum`,
      title: 'Customer Lifetime Value'
    },
    
    // 🎯 Advanced customer metrics
    avgLifetimeValuePerCustomer: {
      sql: `CASE WHEN ${CUBE}.unique_customers > 0 THEN 
              ${CUBE}.lifetime_value / ${CUBE}.unique_customers 
            ELSE NULL END`,
      type: `avg`,
      title: 'Avg LTV per Customer'
    }
  },
  
  dimensions: {
    customerSegment: {
      sql: `customer_segment`,
      type: `string`,
      title: 'Customer Segment'
    },
    
    acquisitionChannel: {
      sql: `acquisition_channel`,
      type: `string`,
      title: 'Acquisition Channel'
    },
    
    country: {
      sql: `country`,
      type: `string`,
      title: 'Country'
    },
    
    salesRegion: {
      sql: `sales_region`,
      type: `string`,
      title: 'Sales Region'
    }
  },
  
  dataSource: `default`
});