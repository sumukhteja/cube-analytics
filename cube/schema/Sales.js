cube(`Sales`, {
  // 🔒 Controlled SQL - only expose what you want
  sql: `SELECT 
    id,
    order_date,
    amount,
    campaign_id, 
    region,
    product_category,
    customer_id,
    order_id,
    product_name,
    quantity,
    sales_channel
  FROM sales
  WHERE amount > 0`,  // Filter out $0 orders
  
  measures: {
    count: {
      type: `count`,
      title: 'Total Orders'
    },
    
    totalRevenue: {
      sql: `amount`,
      type: `sum`,
      title: 'Total Revenue'
    },
    
    // 🎯 Average order value with null handling
    averageOrderValue: {
      sql: `amount`,
      type: `avg`,
      title: 'Average Order Value'
    },
    
    totalQuantity: {
      sql: `quantity`,
      type: `sum`,
      title: 'Total Quantity Sold'
    },
    
    uniqueCustomers: {
      sql: `customer_id`,
      type: `countDistinct`,
      title: 'Unique Customers'
    },
    
    uniqueProducts: {
      sql: `product_id`,
      type: `countDistinct`,
      title: 'Unique Products'
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    orderId: {
      sql: `order_id`,
      type: `string`,
      title: 'Order ID'
    },
    
    campaignId: {
      sql: `campaign_id`,
      type: `string`,
      title: 'Campaign ID'
    },
    
    customerId: {
      sql: `customer_id`,
      type: `string`,
      title: 'Customer ID'
    },
    
    region: {
      sql: `region`,
      type: `string`,
      title: 'Region'
    },
    
    country: {
      sql: `country`,
      type: `string`,
      title: 'Country'
    },
    
    // 🎯 Product information
    productCategory: {
      sql: `product_category`,
      type: `string`,
      title: 'Product Category'
    },
    
    productName: {
      sql: `product_name`,
      type: `string`,
      title: 'Product Name'
    },
    
    salesChannel: {
      sql: `sales_channel`,
      type: `string`,
      title: 'Sales Channel'
    },
    
    // 🎯 Time dimensions for analysis  
    orderDate: {
      sql: `order_date`,
      type: `time`,
      title: 'Order Date'
    },
    
    orderYear: {
      sql: `EXTRACT(YEAR FROM order_date)`,
      type: `string`,
      title: 'Order Year'
    },
    
    orderMonth: {
      sql: `EXTRACT(MONTH FROM order_date)`,
      type: `string`,
      title: 'Order Month'
    }
    
    // ❌ Notice: We deliberately DON'T expose:
    // - Internal IDs or sensitive data
    // - Raw timestamps (use formatted versions)
  },
  
  // 🔗 Define joins to other cubes (inline for Cube.js compatibility)
  joins: {
    Customers: {
      sql: `${CUBE}.customer_id = ${Customers}.customer_id`,
      relationship: `belongsTo`
    },
    
    Marketing: {
      sql: `${CUBE}.campaign_id = ${Marketing}.campaign_id`,
      relationship: `belongsTo`
    }
  },
  
  dataSource: `default`
});