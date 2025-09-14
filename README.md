# 🚀 Analytics Semantic Layer - Backend API

A production-ready **backend semantic layer** built with **Cube.js** and **PostgreSQL** for secure business intelligence. Provides clean business metrics via REST API without direct database access.

> **Note**: This is the backend API only. Frontend applications connect to this via REST API endpoints.

## 🏗️ Architecture

```
Frontend App ◄──► Cube.js API ◄──► PostgreSQL
(Your App)       (Port 4000)      (Port 5432)
```

**Features**: JWT Authentication | REST API | Automatic Table Joins | Business Metrics

## 📊 Data Model (3 Joined Tables)

- **Sales**: Revenue, orders, regions (joins to Customers & Marketing)
- **Marketing**: Campaigns, budget, ad spend, ROI (joins to Sales)  
- **Customers**: Lifetime value, segmentation (joins to Sales)

**Auto-Joins Example**: Query Sales + Marketing + Customers in one API call

## � Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- 8GB+ RAM recommended

### 1. Clone & Start
```bash
git clone https://github.com/sumukhteja/cube-analytics.git
cd cube-analytics
npm run start
```

### 2. Access Points
- **API**: http://localhost:4000
- **Playground**: http://localhost:4000/build  
- **Health Check**: http://localhost:4000/readyz

### 3. Test API
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     "http://localhost:4000/cubejs-api/v1/load?query={\"measures\":[\"Sales.totalRevenue\"]}"
```

## 📁 Project Structure (Backend Only)

```
cube-analytics/
├── README.md                       # This documentation  
├── package.json                    # Backend scripts & metadata
├── .gitignore                      # Git ignore rules
├── docker-compose.yml              # PostgreSQL + Cube.js setup
├── postgres-complete-schema.sql    # Database with sample data
├── postgres-schema-only.sql        # Production empty tables
├── cube/
│   ├── cube.js                     # Database connection config
│   └── schema/                     # Business metrics & logic
│       ├── Sales.js                # Sales analytics (fact table)
│       ├── Marketing.js            # Marketing metrics (dimension)
│       └── Customers.js            # Customer intelligence (dimension)
├── init/postgres/                  # Database initialization scripts
└── *.md                           # Documentation files
```

> **🎯 Pure Backend**: No frontend included. Connect any frontend framework to the REST API.

## 🗄️ Database Setup

**Development (with sample data)**:
```bash
docker-compose up -d  # Uses postgres-complete-schema.sql
```

**Production (empty tables)**:
```bash
# Edit docker-compose.yml: change to postgres-schema-only.sql
docker-compose up -d --force-recreate
```

## ☁️ Cloud Deployment

**Render Platform** (~$7/month):
- PostgreSQL: Free tier (1GB)
- Cube.js API: Free tier
- SSL/HTTPS: Automatic

See: [`render-3table-deployment.md`](./render-3table-deployment.md) for detailed guide

## 🔌 API Endpoints

### Business Analytics Endpoints
```bash
# Sales Analytics
GET /cubejs-api/v1/load?query={"measures":["Sales.totalRevenue","Sales.count"]}

# Marketing Performance  
GET /cubejs-api/v1/load?query={"measures":["Marketing.totalBudget","Marketing.activeCampaigns"]}

# Customer Analytics
GET /cubejs-api/v1/load?query={"measures":["Customers.count","Customers.averageLifetimeValue"]}

# Multi-table Query (Auto-joins)
GET /cubejs-api/v1/load?query={"measures":["Sales.totalRevenue","Marketing.totalBudget","Customers.count"],"dimensions":["Sales.region","Customers.customerSegment"]}
```

### Frontend Integration
```javascript
// Example API call from any frontend
const response = await fetch('http://localhost:4000/cubejs-api/v1/load?query={"measures":["Sales.totalRevenue"]}', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
const data = await response.json();
```

## �️ Available Metrics

```
my-cube-app/
├── postgres-complete-schema.sql    # With sample data
├── postgres-schema-only.sql        # Production empty tables
├── docker-compose.yml              # PostgreSQL + Cube.js setup
├── cube/
│   ├── cube.js                     # DB connection
│   └── schema/                     # Business logic
│       ├── joins.js                # Centralized join definitions
│       ├── Sales.js                # Sales metrics (fact table)
│       ├── Marketing.js            # Marketing analytics (dimension)
│       └── Customers.js            # Customer intelligence (dimension)
└── render-3table-deployment.md     # Cloud deployment guide
```

## 🛠️ Available Metrics

### Sales Analytics
- `Sales.totalRevenue`, `Sales.averageOrderValue`, `Sales.count`
- `Sales.totalQuantity`, `Sales.uniqueCustomers`

### Marketing Performance  
- `Marketing.totalBudget`, `Marketing.totalAdSpend`, `Marketing.activeCampaigns`
- `Marketing.totalLeads`, `Marketing.totalConversions`, `Marketing.averageCostPerLead`

### Customer Intelligence
- `Customers.totalLifetimeValue`, `Customers.averageLifetimeValue`, `Customers.count`
- `Customers.newCustomers`, `Customers.returningCustomers`, `Customers.vipCustomers`

## 🔐 Security Features

- **JWT Authentication**: All endpoints secured
- **HTTPS Ready**: SSL/TLS in production
- **No Direct DB Access**: Clients use semantic layer only
- **Controlled Metrics**: Only approved business measures exposed

## 🚦 Troubleshooting

**Database Connection Issues**:
```bash
docker-compose ps                    # Check status
docker logs postgres-analytics      # Check DB logs
docker logs cube-analytics          # Check API logs
docker-compose restart              # Restart services
```

**API Returns Empty**:
```bash
# Verify sample data
docker exec postgres-analytics psql -U postgres -d analyticsdb -c "SELECT COUNT(*) FROM sales;"
```

**API Issues**:
- ✅ Verify JWT token in Authorization header
- ✅ Check HTTPS endpoints in production
- ✅ Use correct content-type headers
- ✅ Handle CORS for web applications

## 🎯 Why This Architecture?

### For Data Teams
- Single source of truth in Cube.js
- Version-controlled schema definitions
- Built-in caching and optimization

### For Clients  
- No database credentials needed
- Easy REST API integration
- Business-friendly metrics only

### For IT/Security
- Database protected behind semantic layer
- JWT authentication required
- All queries logged and controlled

## 🚀 Production Checklist

1. ✅ Test locally with sample data
2. ✅ Deploy to cloud (Render/AWS/Azure)
3. ✅ Configure production database
4. ✅ Set up client API connections
5. ✅ Train users on available metrics

---

**🎉 Ready for enterprise clients!** Secure, scalable, and API-ready.

**Perfect for**: Enterprise analytics without database access | **Security**: ✅ **Performance**: ✅ **Scalability**: ✅