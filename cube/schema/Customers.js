cube(`Customers`, {
  sql: `SELECT * FROM customers`,
  
  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started
  },
  
  measures: {
    count: {
      type: `count`,
      title: 'Total Customers'
    },
    
    totalLifetimeValue: {
      sql: `total_spent`,
      type: `sum`,
      title: 'Total Customer LTV'
    },
    
    averageLifetimeValue: {
      sql: `total_spent`,
      type: `avg`,
      title: 'Average Customer LTV'
    },
    
    averageOrderValue: {
      sql: `average_order_value`,
      type: `avg`,
      title: 'Average Order Value'
    },
    
    totalOrders: {
      sql: `total_orders`,
      type: `sum`,
      title: 'Total Orders by Customers'
    },
    
    // 🧮 Calculated metrics
    averageOrdersPerCustomer: {
      sql: `total_orders`,
      type: `avg`,
      title: 'Average Orders per Customer'
    },
    
    newCustomers: {
      sql: `CASE WHEN customer_segment = 'new' THEN 1 ELSE 0 END`,
      type: `sum`,
      title: 'New Customers'
    },
    
    returningCustomers: {
      sql: `CASE WHEN customer_segment = 'returning' THEN 1 ELSE 0 END`,
      type: `sum`,
      title: 'Returning Customers'
    },
    
    vipCustomers: {
      sql: `CASE WHEN customer_segment = 'vip' THEN 1 ELSE 0 END`,
      type: `sum`,
      title: 'VIP Customers'
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    customerId: {
      sql: `customer_id`,
      type: `string`,
      title: 'Customer ID'
    },
    
    firstName: {
      sql: `first_name`,
      type: `string`,
      title: 'First Name'
    },
    
    lastName: {
      sql: `last_name`,
      type: `string`,
      title: 'Last Name'
    },
    
    fullName: {
      sql: `CONCAT(first_name, ' ', last_name)`,
      type: `string`,
      title: 'Full Name'
    },
    
    email: {
      sql: `email`,
      type: `string`,
      title: 'Email Address'
    },
    
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
    
    city: {
      sql: `city`,
      type: `string`,
      title: 'City'
    },
    
    preferredCategory: {
      sql: `preferred_category`,
      type: `string`,
      title: 'Preferred Product Category'
    },
    
    // 🎯 Time dimensions for customer lifecycle analysis
    registrationDate: {
      sql: `registration_date`,
      type: `time`,
      title: 'Registration Date'
    },
    
    firstPurchaseDate: {
      sql: `first_purchase_date`,
      type: `time`,
      title: 'First Purchase Date'
    },
    
    lastPurchaseDate: {
      sql: `last_purchase_date`,
      type: `time`,
      title: 'Last Purchase Date'
    },
    
    // 🎯 Calculated dimensions
    customerAge: {
      sql: `DATE_PART('year', AGE(CURRENT_DATE, date_of_birth))`,
      type: `number`,
      title: 'Customer Age'
    },
    
    ageGroup: {
      sql: `
        CASE 
          WHEN DATE_PART('year', AGE(CURRENT_DATE, date_of_birth)) < 25 THEN '18-24'
          WHEN DATE_PART('year', AGE(CURRENT_DATE, date_of_birth)) < 35 THEN '25-34'
          WHEN DATE_PART('year', AGE(CURRENT_DATE, date_of_birth)) < 45 THEN '35-44'
          WHEN DATE_PART('year', AGE(CURRENT_DATE, date_of_birth)) < 55 THEN '45-54'
          ELSE '55+'
        END
      `,
      type: `string`,
      title: 'Age Group'
    },
    
    daysSinceLastPurchase: {
      sql: `DATE_PART('day', CURRENT_DATE - last_purchase_date)`,
      type: `number`,
      title: 'Days Since Last Purchase'
    },
    
    isNewsletterSubscribed: {
      sql: `is_newsletter_subscribed`,
      type: `boolean`,
      title: 'Newsletter Subscribed'
    }
  },
  
  // 🔗 No joins needed for dimension table (Sales handles the relationship)
  
  dataSource: `default`
});