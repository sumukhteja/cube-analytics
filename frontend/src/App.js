import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, Alert } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './App.css';

const CUBE_API_URL = 'http://localhost:4000/cubejs-api/v1';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U'; // Default dev token

function App() {
  const [kpiData, setKpiData] = useState(null);
  const [marketingData, setMarketingData] = useState(null);
  const [campaignData, setCampaignData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 🎯 SALES DATA (MySQL)
      const salesKpiQuery = {
        measures: [
          "Sales.totalRevenue",
          "Sales.count",
          "Sales.averageOrderValue"
        ]
      };

      // 🎯 MARKETING DATA (PostgreSQL) 
      const marketingKpiQuery = {
        measures: [
          "Marketing.totalAdSpend",
          "Marketing.campaignCount",
          "Marketing.totalClicks",
          "Marketing.totalLeads",
          "Marketing.averageCostPerClick",
          "Marketing.averageCostPerLead"
        ]
      };

      // 🎯 CAMPAIGN BREAKDOWN (Sales by Campaign)
      const campaignSalesQuery = {
        measures: [
          "Sales.totalRevenue",
          "Sales.count"
        ],
        dimensions: [
          "Sales.campaignId",
          "Sales.region"
        ],
        order: {
          "Sales.totalRevenue": "desc"
        }
      };

      // 🎯 MARKETING BREAKDOWN (Marketing by Campaign)
      const campaignMarketingQuery = {
        measures: [
          "Marketing.totalAdSpend",
          "Marketing.totalClicks",
          "Marketing.totalLeads"
        ],
        dimensions: [
          "Marketing.campaignId",
          "Marketing.campaignName"
        ],
        order: {
          "Marketing.totalAdSpend": "desc"
        }
      };

      // Execute all 4 queries in parallel
      const [salesKpiResponse, marketingKpiResponse, campaignSalesResponse, campaignMarketingResponse] = await Promise.all([
        fetch(`${CUBE_API_URL}/load?query=${encodeURIComponent(JSON.stringify(salesKpiQuery))}`),
        fetch(`${CUBE_API_URL}/load?query=${encodeURIComponent(JSON.stringify(marketingKpiQuery))}`),
        fetch(`${CUBE_API_URL}/load?query=${encodeURIComponent(JSON.stringify(campaignSalesQuery))}`),
        fetch(`${CUBE_API_URL}/load?query=${encodeURIComponent(JSON.stringify(campaignMarketingQuery))}`)
      ]);

      const salesKpiResult = await salesKpiResponse.json();
      const marketingKpiResult = await marketingKpiResponse.json();
      const campaignSalesResult = await campaignSalesResponse.json();
      const campaignMarketingResult = await campaignMarketingResponse.json();

      if (salesKpiResult.error) throw new Error(salesKpiResult.error);
      if (marketingKpiResult.error) throw new Error(marketingKpiResult.error);
      if (campaignSalesResult.error) throw new Error(campaignSalesResult.error);
      if (campaignMarketingResult.error) throw new Error(campaignMarketingResult.error);

      setKpiData(salesKpiResult.data[0] || {});
      setMarketingData(marketingKpiResult.data[0] || {});
      
      // Process sales data by campaign
      setCampaignData(campaignSalesResult.data.map(item => ({
        key: item['Sales.campaignId'] + '_' + item['Sales.region'],
        campaignId: item['Sales.campaignId'],
        region: item['Sales.region'],
        revenue: parseFloat(item['Sales.totalRevenue']) || 0,
        orders: parseInt(item['Sales.count']) || 0
      })));

      // Combine marketing data for visualization
      setCombinedData(campaignMarketingResult.data.map(item => ({
        campaignId: item['Marketing.campaignId'],
        campaignName: item['Marketing.campaignName'],
        adSpend: parseFloat(item['Marketing.totalAdSpend']) || 0,
        clicks: parseInt(item['Marketing.totalClicks']) || 0,
        leads: parseInt(item['Marketing.totalLeads']) || 0
      })));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <Spin size="large" />
          <p className="loading-title">Loading analytics data from MySQL and PostgreSQL...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error-container">
          <Alert
            message="Error Loading Data"
            description={`Failed to fetch data from Cube.js API: ${error}`}
            type="error"
            showIcon
          />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Analytics Dashboard</h1>
          <p className="dashboard-subtitle">
            Real-time insights from MySQL Sales Database and PostgreSQL Marketing Platform
          </p>
        </div>
        
        {/* Sales KPI Cards */}
        <div className="section-header sales-kpi">
          <span className="section-icon">💰</span>
          <span>Sales Performance (MySQL)</span>
        </div>
        <Row gutter={[24, 24]} className="kpi-row">
          <Col xs={24} sm={8}>
            <Card className="kpi-card">
              <Statistic
                title="Total Revenue"
                value={kpiData['Sales.totalRevenue'] || 0}
                formatter={(value) => formatCurrency(value)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="kpi-card">
              <Statistic
                title="Total Orders"
                value={kpiData['Sales.count'] || 0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="kpi-card">
              <Statistic
                title="Average Order Value"
                value={kpiData['Sales.averageOrderValue'] || 0}
                formatter={(value) => formatCurrency(value)}
              />
            </Card>
          </Col>
        </Row>

        {/* Marketing KPI Cards */}
        <div className="section-header marketing-kpi">
          <span className="section-icon">📈</span>
          <span>Marketing Analytics (PostgreSQL)</span>
        </div>
        <Row gutter={[24, 24]} className="kpi-row">
          <Col xs={24} sm={12} lg={8}>
            <Card className="kpi-card">
              <Statistic
                title="Total Ad Spend"
                value={marketingData['Marketing.totalAdSpend'] || 0}
                formatter={(value) => formatCurrency(value)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="kpi-card">
              <Statistic
                title="Total Campaigns"
                value={marketingData['Marketing.campaignCount'] || 0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="kpi-card">
              <Statistic
                title="Total Clicks"
                value={marketingData['Marketing.totalClicks'] || 0}
                formatter={(value) => value.toLocaleString()}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="kpi-card">
              <Statistic
                title="Total Leads"
                value={marketingData['Marketing.totalLeads'] || 0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="kpi-card">
              <Statistic
                title="Cost per Click"
                value={marketingData['Marketing.averageCostPerClick'] || 0}
                formatter={(value) => formatCurrency(value)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="kpi-card">
              <Statistic
                title="Cost per Lead"
                value={marketingData['Marketing.averageCostPerLead'] || 0}
                formatter={(value) => formatCurrency(value)}
              />
            </Card>
          </Col>
        </Row>

        {/* Combined Analytics */}
        <div className="section-header combined-kpi">
          <span className="section-icon">🔗</span>
          <span>Cross-Database Analytics</span>
        </div>
        <Row gutter={[24, 24]} className="kpi-row">
          <Col xs={24} md={8}>
            <Card className="kpi-card">
              <Statistic
                title="🎯 Campaign ROI"
                value={
                  ((kpiData['Sales.totalRevenue'] || 0) - (marketingData['Marketing.totalAdSpend'] || 0)) / 
                  (marketingData['Marketing.totalAdSpend'] || 1) * 100
                }
                formatter={(value) => `${value.toFixed(2)}%`}
                valueStyle={{ 
                  color: ((kpiData['Sales.totalRevenue'] || 0) - (marketingData['Marketing.totalAdSpend'] || 0)) > 0 ? '#10b981' : '#ef4444' 
                }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="kpi-card">
              <Statistic
                title="Revenue per Lead"
                value={
                  (kpiData['Sales.totalRevenue'] || 0) / (marketingData['Marketing.totalLeads'] || 1)
                }
                formatter={(value) => formatCurrency(value)}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="kpi-card">
              <Statistic
                title="Cost per Lead"
                value={marketingData['Marketing.averageCostPerLead'] || 0}
                formatter={(value) => formatCurrency(value)}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <div className="section-header">
          <span className="section-icon">📊</span>
          <span>Performance Analytics</span>
        </div>
        <Row gutter={[24, 24]} className="dashboard-row">
          <Col xs={24} lg={12}>
            <Card className="chart-card" title={<span className="chart-title">Sales Revenue by Campaign (MySQL)</span>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="campaignId" tick={{ fontSize: 12, fill: '#666666' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#666666' }} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#333333" 
                    name="Revenue ($)" 
                    radius={[2, 2, 0, 0]}
                    animationBegin={0}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card className="chart-card" title={<span className="chart-title">Marketing Spend by Campaign (PostgreSQL)</span>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="campaignId" tick={{ fontSize: 12, fill: '#666666' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#666666' }} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="adSpend" 
                    fill="#666666" 
                    name="Ad Spend ($)" 
                    radius={[2, 2, 0, 0]}
                    animationBegin={400}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Combined Analytics Chart */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Card title="🎯 Cross-Database Analysis: Revenue vs Ad Spend by Campaign">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={combinedData.map(marketing => {
                  const sales = campaignData.find(s => s.campaignId === marketing.campaignId);
                  return {
                    campaignId: marketing.campaignId,
                    campaignName: marketing.campaignName,
                    adSpend: marketing.adSpend,
                    revenue: sales ? sales.revenue : 0,
                    roi: sales ? ((sales.revenue - marketing.adSpend) / marketing.adSpend * 100) : 0
                  };
                })}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="campaignId" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'roi' ? `${value.toFixed(2)}%` : formatCurrency(value), 
                      name === 'adSpend' ? 'Ad Spend (PostgreSQL)' : 
                      name === 'revenue' ? 'Revenue (MySQL)' : 'ROI'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="adSpend" fill="#52c41a" name="Ad Spend (PostgreSQL)" />
                  <Bar dataKey="revenue" fill="#1890ff" name="Revenue (MySQL)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Combined Performance Table */}
        <div className="section-header">
          <span className="section-icon">�</span>
          <span>Detailed Campaign Analysis</span>
        </div>
        <Row gutter={[24, 24]} className="dashboard-row">
          <Col span={24}>
            <Card className="chart-card">
              <Table
                dataSource={combinedData.map((marketing, index) => {
                  const sales = campaignData.filter(s => s.campaignId === marketing.campaignId);
                  const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
                  const totalOrders = sales.reduce((sum, s) => sum + s.orders, 0);
                  
                  return {
                    key: marketing.campaignId,
                    campaignId: marketing.campaignId,
                    campaignName: marketing.campaignName,
                    adSpend: marketing.adSpend,
                    clicks: marketing.clicks,
                    leads: marketing.leads,
                    revenue: totalRevenue,
                    orders: totalOrders,
                    roi: totalRevenue > 0 ? ((totalRevenue - marketing.adSpend) / marketing.adSpend * 100) : 0,
                    costPerLead: marketing.leads > 0 ? (marketing.adSpend / marketing.leads) : 0
                  };
                })}
                columns={[
                  {
                    title: 'Campaign ID',
                    dataIndex: 'campaignId',
                    key: 'campaignId',
                    render: (text) => <strong style={{ color: '#1e293b' }}>{text}</strong>,
                    width: 120,
                  },
                  {
                    title: 'Campaign Name',
                    dataIndex: 'campaignName',
                    key: 'campaignName',
                    render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
                  },
                  {
                    title: '💰 Revenue (MySQL)',
                    dataIndex: 'revenue',
                    key: 'revenue',
                    render: (value) => <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{formatCurrency(value)}</span>,
                    sorter: (a, b) => a.revenue - b.revenue,
                  },
                  {
                    title: '📦 Orders (MySQL)',
                    dataIndex: 'orders',
                    key: 'orders',
                    render: (value) => <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{value}</span>,
                    align: 'center',
                  },
                  {
                    title: '📈 Ad Spend (PostgreSQL)',
                    dataIndex: 'adSpend',
                    key: 'adSpend',
                    render: (value) => <span style={{ color: '#10b981', fontWeight: 600 }}>{formatCurrency(value)}</span>,
                    sorter: (a, b) => a.adSpend - b.adSpend,
                  },
                  {
                    title: '👆 Clicks (PostgreSQL)',
                    dataIndex: 'clicks',
                    key: 'clicks',
                    render: (value) => <span style={{ color: '#10b981', fontWeight: 600 }}>{value.toLocaleString()}</span>,
                    align: 'center',
                  },
                  {
                    title: '🎯 Leads (PostgreSQL)',
                    dataIndex: 'leads',
                    key: 'leads',
                    render: (value) => <span style={{ color: '#10b981', fontWeight: 600 }}>{value}</span>,
                    align: 'center',
                  },
                  {
                    title: '📊 ROI %',
                    dataIndex: 'roi',
                    key: 'roi',
                    render: (value) => (
                      <span style={{ 
                        color: value > 0 ? '#10b981' : value < 0 ? '#ef4444' : '#64748b',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: value > 0 ? '#dcfce7' : value < 0 ? '#fef2f2' : '#f1f5f9'
                      }}>
                        {value.toFixed(2)}%
                      </span>
                    ),
                    sorter: (a, b) => a.roi - b.roi,
                    align: 'center',
                  },
                  {
                    title: '💸 Cost per Lead',
                    dataIndex: 'costPerLead',
                    key: 'costPerLead',
                    render: (value) => <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{formatCurrency(value)}</span>,
                    sorter: (a, b) => a.costPerLead - b.costPerLead,
                  }
                ]}
                pagination={false}
                scroll={{ x: 1200 }}
                size="middle"
              />
              <div className="info-box" style={{ marginTop: '16px' }}>
                <strong>🔗 Cross-Database Analysis:</strong>
                <br />• <span style={{ color: '#0ea5e9', fontWeight: 600 }}>Blue metrics</span> sourced from <strong>MySQL</strong> sales database
                <br />• <span style={{ color: '#10b981', fontWeight: 600 }}>Green metrics</span> sourced from <strong>PostgreSQL</strong> marketing database  
                <br />• <strong>ROI calculation</strong> combines data from both databases: (Revenue - Ad Spend) / Ad Spend × 100
                <br />• Real-time analytics powered by <strong>Cube.js</strong> multi-database architecture
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;