import React, { useState, useEffect, useCallback } from 'react';
import {
  SFChartBar, SFPerson2, SFDocText, SFDollarSign,
  SFArrowUpRightCircle, SFArrowDownRightCircle,
  SFDownload, SFCheckCircle, SFClock
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


  const loadRealData = useCallback(() => {
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
    setBusinessInsights(insights);
    setPerformanceTrends(trends);
  }, []);

  useEffect(() => {
    loadRealData();
  }, [loadRealData]);

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
      clients: clientList.length,
      documents: metrics.documentsGenerated || 0,
      revenue: metrics.monthlyRevenue || 0
    }));
  };





  const getMetricCard = (title, value, icon, trend, color = 'blue') => (
    <div style={{
      backgroundColor: 'var(--system-background-primary, #FFFFFF)',
      borderRadius: AppleBorderRadius.large,
      padding: AppleSpacing.lg,
      boxShadow: AppleShadows.small.boxShadow,
      border: '1px solid var(--separator-transparent, #C6C6C8)',
      transition: `all ${AppleTransitions.normal} ${AppleTransitions.ease}`,
      cursor: 'pointer',
      transform: 'translateY(0)',
      opacity: 1
    }}
    className="metric-card animate-fade-in-up hover:scale-105 hover:shadow-xl transition-all duration-500 ease-out"
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
    }}
    className="animate-fade-in"
    >
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--system-background-primary, #FFFFFF)',
        borderRadius: AppleBorderRadius.large,
        padding: AppleSpacing.xl,
        marginBottom: AppleSpacing.xl,
        boxShadow: AppleShadows.small.boxShadow,
        border: '1px solid var(--separator-transparent, #C6C6C8)'
      }}
      className="animate-slide-in-down"
      >
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
      }}
      className="animate-fade-in-up"
      >
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {getMetricCard('Total Clients', clients.length, <SFPerson2 />, 12, 'blue')}
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {getMetricCard('Monthly Revenue', `$${(realMetrics.monthlyRevenue || 0).toLocaleString()}`, <SFDollarSign />, 8, 'green')}
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {getMetricCard('Documents Generated', realMetrics.documentsGenerated || 0, <SFDocText />, 15, 'orange')}
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {getMetricCard('Active Subscriptions', realMetrics.activeSubscriptions || 0, <SFChartBar />, 5, 'indigo')}
        </div>
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
