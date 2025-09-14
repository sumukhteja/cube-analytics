module.exports = {
  driverFactory: ({ dataSource }) => {
    // All datasources now use PostgreSQL
    return {
      type: 'postgres',
      host: process.env.CUBEJS_DB_HOST || 'postgres-analytics',
      database: process.env.CUBEJS_DB_NAME || 'analyticsdb',
      port: process.env.CUBEJS_DB_PORT || 5432,
      user: process.env.CUBEJS_DB_USER || 'postgres',
      password: process.env.CUBEJS_DB_PASS || 'postgres',
    };
  }
};