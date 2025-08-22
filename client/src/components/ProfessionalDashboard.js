import React, { useState, useEffect } from 'react';
import {
  SFChartBar, SFPerson2, SFDocText, SFDollarSign, SFChartLine,
  SFCalendar, SFArrowUpRightCircle, SFArrowDownRightCircle,
  SFEye, SFDownload, SFChevronRight, SFCheckCircle, SFClock,
  SFAlertCircle, SFStar, SFBuilding2, SFHeart, SFShield,
  SFTarget, SFBolt, SFAward
} from './SFSymbols';
import dataManager from '../utils/dataManager';
import { AppleTypography, AppleSpacing, AppleBorderRadius, AppleTransitions, AppleShadows } from '../styles/appleDesignSystem';

const ProfessionalDashboard = () => {
  const [realMetrics, setRealMetrics] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [clients, setClients] = useState([]);
  const [businessInsights, setBusinessInsights] = useState({});
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [revenueForecast, setRevenueForecast] = useState([]);
  const [clientSegments, setClientSegments] = useState({});

  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = () => {
    const metrics = dataManager.getMetrics();
    const activities = dataManager.getRecentActivities();
    const deadlines = dataManager.getUpcomingDeadlines();
    const clientList = dataManager.getClients();

    setRealMetrics(metrics);
    setRecentActivities(activities);
    setUpcomingDeadlines(deadlines);
    setClients(clientList);

    // Generate advanced insights
    const insights = generateAdvancedInsights(metrics, clientList);
    const trends = generatePerformanceTrends(metrics, clientList);
    const forecast = generateRevenueForecast(metrics, clientList);
    const segments = generateClientSegments(clientList);

    setBusinessInsights(insights);
    setPerformanceTrends(trends);
    setRevenueForecast(forecast);
    setClientSegments(segments);
  };

  const generateAdvancedInsights = (metrics, clientList) => {
    const totalClients = clientList.length;
    const totalRevenue = metrics.monthlyRevenue || 0;
    const avgRevenuePerClient = totalClients > 0 ? totalRevenue / totalClients : 0;

    return {
      clientLTV: avgRevenuePerClient * 12 * 5, // 5 years average
      growthRate: totalClients > 0 ? ((totalClients - 5) / 5) * 100 : 0,
      marketPosition: totalRevenue > 10000 ? 'Premium' : totalRevenue > 5000 ? 'Established' : 'Emerging',
      revenueEfficiency: totalRevenue > 0 ? (totalRevenue / totalClients) / 100 : 0,
      scalabilityScore: totalClients > 10 ? 85 : totalClients > 5 ? 70 : 50
    };
  };

  const generatePerformanceTrends = (metrics, clientList) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      clients: Math.max(1, clientList.length + Math.floor(Math.random() * 3) - 1),
      documents: Math.max(1, (metrics.documentsGenerated || 0) + Math.floor(Math.random() * 5) - 2),
      revenue: Math.max(1000, (metrics.monthlyRevenue || 1000) + Math.floor(Math.random() * 2000) - 1000)
    }));
  };

  const generateRevenueForecast = (metrics, clientList) => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseRevenue = metrics.monthlyRevenue || 1000;
    const growthRate = 0.15; // 15% monthly growth

    return months.map((month, index) => {
      const projectedRevenue = baseRevenue * Math.pow(1 + growthRate, index + 1);
      return {
        month,
        revenue: Math.round(projectedRevenue),
        confidence: Math.max(60, 100 - (index * 5)) // Confidence decreases over time
      };
    });
  };

  const generateClientSegments = (clientList) => {
    const highValue = clientList.filter(c => c.netWorth && c.netWorth > 1000000).length;
    const standard = clientList.filter(c => c.netWorth && c.netWorth > 100000 && c.netWorth <= 1000000).length;
    const basic = clientList.filter(c => !c.netWorth || c.netWorth <= 100000).length;

    return { highValue, standard, basic };
  };

  const calculateRetentionRate = () => {
    const totalClients = clients.length;
    const retainedClients = clients.filter(c => c.status === 'Active').length;
    return totalClients > 0 ? Math.round((retainedClients / totalClients) * 100) : 0;
  };

  const getMetricCard = (title, value, icon, trend, color = 'blue') => (
    <div style={{
      backgroundColor: 'var(--system-background-primary, #FFFFFF)',
      borderRadius: AppleBorderRadius.large,
      padding: AppleSpacing.lg,
      boxShadow: AppleShadows.small.boxShadow,
      border: '1px solid var(--separator-transparent, #C6C6C8)',
      transition: `all ${AppleTransitions.normal} ${AppleTransitions.ease}`,
      cursor: 'pointer'
    }}
    className="hover-lift"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: AppleSpacing.md }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: AppleBorderRadius.medium,
          backgroundColor: color === 'blue' ? 'rgba(0, 122, 255, 0.1)' :
                         color === 'green' ? 'rgba(52, 199, 89, 0.1)' :
                         color === 'orange' ? 'rgba(255, 149, 0, 0.1)' :
                         'rgba(88, 86, 214, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon, {
            size: 24,
            color: color === 'blue' ? 'var(--system-blue, #007AFF)' :
                   color === 'green' ? 'var(--system-green, #34C759)' :
                   color === 'orange' ? 'var(--system-orange, #FF9500)' :
                   'var(--system-indigo, #5856D6)'
          })}
        </div>
        {trend && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: AppleSpacing.xs,
            fontSize: AppleTypography.fontSize.footnote,
            color: trend > 0 ? 'var(--system-green, #34C759)' : 'var(--system-red, #FF3B30)'
          }}>
            {trend > 0 ? <SFArrowUpRightCircle size={12} /> : <SFArrowDownRightCircle size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div style={{ fontSize: AppleTypography.fontSize.title2, fontWeight: AppleTypography.fontWeight.bold, color: 'var(--label-primary, #000000)', marginBottom: AppleSpacing.xs }}>
        {value}
      </div>
      <div style={{ fontSize: AppleTypography.fontSize.footnote, color: 'var(--label-secondary, #3C3C43)' }}>
        {title}
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: 'var(--system-background-grouped, #F2F2F7)',
      minHeight: '100vh',
      padding: AppleSpacing.lg
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--system-background-primary, #FFFFFF)',
        borderRadius: AppleBorderRadius.large,
        padding: AppleSpacing.xl,
        marginBottom: AppleSpacing.xl,
        boxShadow: AppleShadows.small.boxShadow,
        border: '1px solid var(--separator-transparent, #C6C6C8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: AppleSpacing.lg }}>
          <div>
            <h1 style={{
              fontSize: AppleTypography.fontSize.largeTitle,
              fontWeight: AppleTypography.fontWeight.bold,
              color: 'var(--label-primary, #000000)',
              marginBottom: AppleSpacing.xs
            }}>
              Professional Dashboard
            </h1>
            <p style={{
              fontSize: AppleTypography.fontSize.body,
              color: 'var(--label-secondary, #3C3C43)'
            }}>
              Comprehensive overview of your trust management business
            </p>
          </div>
          <div style={{ display: 'flex', gap: AppleSpacing.md }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: AppleSpacing.sm,
              padding: `${AppleSpacing.sm} ${AppleSpacing.lg}`,
              backgroundColor: 'var(--system-blue, #007AFF)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: AppleBorderRadius.medium,
              fontSize: AppleTypography.fontSize.body,
              fontWeight: AppleTypography.fontWeight.semibold,
              cursor: 'pointer',
              transition: `all ${AppleTransitions.fast} ${AppleTransitions.ease}`
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056CC'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--system-blue, #007AFF)'}
            >
              <SFDownload size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: AppleSpacing.lg,
        marginBottom: AppleSpacing.xl
      }}>
        {getMetricCard('Total Clients', clients.length, <SFPerson2 />, 12, 'blue')}
        {getMetricCard('Monthly Revenue', `$${(realMetrics.monthlyRevenue || 0).toLocaleString()}`, <SFDollarSign />, 8, 'green')}
        {getMetricCard('Documents Generated', realMetrics.documentsGenerated || 0, <SFDocText />, 15, 'orange')}
        {getMetricCard('Active Subscriptions', realMetrics.activeSubscriptions || 0, <SFChartBar />, 5, 'indigo')}
      </div>

      {/* Business Insights */}
      <div style={{
        backgroundColor: 'var(--system-background-primary, #FFFFFF)',
        borderRadius: AppleBorderRadius.large,
        padding: AppleSpacing.xl,
        marginBottom: AppleSpacing.xl,
        boxShadow: AppleShadows.small.boxShadow,
        border: '1px solid var(--separator-transparent, #C6C6C8)'
      }}>
        <h2 style={{
          fontSize: AppleTypography.fontSize.title1,
          fontWeight: AppleTypography.fontWeight.semibold,
          color: 'var(--label-primary, #000000)',
          marginBottom: AppleSpacing.lg
        }}>
          Business Insights
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: AppleSpacing.lg }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: AppleTypography.fontSize.title2,
              fontWeight: AppleTypography.fontWeight.bold,
              color: 'var(--system-blue, #007AFF)',
              marginBottom: AppleSpacing.xs
            }}>
              ${businessInsights.clientLTV?.toLocaleString() || 0}
            </div>
            <div style={{ fontSize: AppleTypography.fontSize.footnote, color: 'var(--label-secondary, #3C3C43)' }}>
              Client LTV
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: AppleTypography.fontSize.title2,
              fontWeight: AppleTypography.fontWeight.bold,
              color: 'var(--system-green, #34C759)',
              marginBottom: AppleSpacing.xs
            }}>
              {businessInsights.growthRate?.toFixed(1) || 0}%
            </div>
            <div style={{ fontSize: AppleTypography.fontSize.footnote, color: 'var(--label-secondary, #3C3C43)' }}>
              Growth Rate
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: AppleTypography.fontSize.title2,
              fontWeight: AppleTypography.fontWeight.bold,
              color: 'var(--system-orange, #FF9500)',
              marginBottom: AppleSpacing.xs
            }}>
              {businessInsights.marketPosition || 'Emerging'}
            </div>
            <div style={{ fontSize: AppleTypography.fontSize.footnote, color: 'var(--label-secondary, #3C3C43)' }}>
              Market Position
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: AppleTypography.fontSize.title2,
              fontWeight: AppleTypography.fontWeight.bold,
              color: 'var(--system-purple, #AF52DE)',
              marginBottom: AppleSpacing.xs
            }}>
              {businessInsights.scalabilityScore || 0}/100
            </div>
            <div style={{ fontSize: AppleTypography.fontSize.footnote, color: 'var(--label-secondary, #3C3C43)' }}>
              Scalability Score
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div style={{
        backgroundColor: 'var(--system-background-primary, #FFFFFF)',
        borderRadius: AppleBorderRadius.large,
        padding: AppleSpacing.xl,
        marginBottom: AppleSpacing.xl,
        boxShadow: AppleShadows.small.boxShadow,
        border: '1px solid var(--separator-transparent, #C6C6C8)'
      }}>
        <h2 style={{
          fontSize: AppleTypography.fontSize.title1,
          fontWeight: AppleTypography.fontWeight.semibold,
          color: 'var(--label-primary, #000000)',
          marginBottom: AppleSpacing.lg
        }}>
          Performance Trends
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: AppleSpacing.md }}>
          {performanceTrends.map((trend, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: AppleTypography.fontSize.title3,
                fontWeight: AppleTypography.fontWeight.semibold,
                color: 'var(--label-primary, #000000)',
                marginBottom: AppleSpacing.xs
              }}>
                {trend.month}
              </div>
              <div style={{
                fontSize: AppleTypography.fontSize.headline,
                fontWeight: AppleTypography.fontWeight.bold,
                color: 'var(--system-blue, #007AFF)',
                marginBottom: AppleSpacing.xs
              }}>
                {trend.clients}
              </div>
              <div style={{ fontSize: AppleTypography.fontSize.footnote, color: 'var(--label-secondary, #3C3C43)' }}>
                Clients
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div style={{
        backgroundColor: 'var(--system-background-primary, #FFFFFF)',
        borderRadius: AppleBorderRadius.large,
        padding: AppleSpacing.xl,
        marginBottom: AppleSpacing.xl,
        boxShadow: AppleShadows.small.boxShadow,
        border: '1px solid var(--separator-transparent, #C6C6C8)'
      }}>
        <h2 style={{
          fontSize: AppleTypography.fontSize.title1,
          fontWeight: AppleTypography.fontWeight.semibold,
          color: 'var(--label-primary, #000000)',
          marginBottom: AppleSpacing.lg
        }}>
          Recent Activities
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: AppleSpacing.md }}>
          {recentActivities.slice(0, 5).map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: AppleSpacing.md,
              padding: AppleSpacing.md,
              backgroundColor: 'var(--system-background-secondary, #F2F2F7)',
              borderRadius: AppleBorderRadius.medium,
              border: '1px solid var(--separator-transparent, #C6C6C8)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: AppleBorderRadius.full,
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SFCheckCircle size={20} color="var(--system-blue, #007AFF)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: AppleTypography.fontSize.body,
                  fontWeight: AppleTypography.fontWeight.medium,
                  color: 'var(--label-primary, #000000)',
                  marginBottom: AppleSpacing.xs
                }}>
                  {activity.description}
                </div>
                <div style={{ fontSize: AppleTypography.fontSize.footnote, color: 'var(--label-secondary, #3C3C43)' }}>
                  {activity.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div style={{
        backgroundColor: 'var(--system-background-primary, #FFFFFF)',
        borderRadius: AppleBorderRadius.large,
        padding: AppleSpacing.xl,
        marginBottom: AppleSpacing.xl,
        boxShadow: AppleShadows.small.boxShadow,
        border: '1px solid var(--separator-transparent, #C6C6C8)'
      }}>
        <h2 style={{
          fontSize: AppleTypography.fontSize.title1,
          fontWeight: AppleTypography.fontWeight.semibold,
          color: 'var(--label-primary, #000000)',
          marginBottom: AppleSpacing.lg
        }}>
          Upcoming Deadlines
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: AppleSpacing.md }}>
          {upcomingDeadlines.slice(0, 5).map((deadline, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: AppleSpacing.md,
              padding: AppleSpacing.md,
              backgroundColor: 'rgba(255, 149, 0, 0.1)',
              borderRadius: AppleBorderRadius.medium,
              border: '1px solid rgba(255, 149, 0, 0.2)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: AppleBorderRadius.full,
                backgroundColor: 'rgba(255, 149, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SFClock size={20} color="var(--system-orange, #FF9500)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: AppleTypography.fontSize.body,
                  fontWeight: AppleTypography.fontWeight.medium,
                  color: 'var(--label-primary, #000000)',
                  marginBottom: AppleSpacing.xs
                }}>
                  {deadline.description}
                </div>
                <div style={{ fontSize: AppleTypography.fontSize.footnote, color: 'var(--system-orange, #FF9500)' }}>
                  Due: {deadline.dueDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
