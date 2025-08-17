import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Plus,
  ArrowUpRight,
  Activity,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [trusts, setTrusts] = useState([]);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(() => {
    try {
      // Load user data from localStorage
      const savedTrusts = JSON.parse(localStorage.getItem('userTrusts') || '[]');
      const savedTransfers = JSON.parse(localStorage.getItem('userTransfers') || '[]');
      
      // Filter out any obvious dummy data (very old data or data with suspicious patterns)
      const realTrusts = savedTrusts.filter(trust => {
        // Keep data that's not obviously fake
        if (!trust.created_at) return true; // Keep data without dates for now
        
        const trustDate = new Date(trust.created_at);
        const now = new Date();
        const daysDiff = (now - trustDate) / (1000 * 60 * 60 * 24);
        
        // Remove data older than 30 days (likely old dummy data)
        return daysDiff <= 30;
      });
      
      const realTransfers = savedTransfers.filter(transfer => {
        // Keep data that's not obviously fake
        if (!transfer.created_at) return true; // Keep data without dates for now
        
        const transferDate = new Date(transfer.created_at);
        const now = new Date();
        const daysDiff = (now - transferDate) / (1000 * 60 * 60 * 24);
        
        // Remove data older than 30 days (likely old dummy data)
        return daysDiff <= 30;
      });
      
      setTrusts(realTrusts);
      setRecentTransfers(realTransfers);
    } catch (error) {
      console.error('Error loading user data:', error);
      setTrusts([]);
      setRecentTransfers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
    
    // Set up real-time data refresh
    const interval = setInterval(() => {
      loadUserData();
    }, 5000); // Refresh every 5 seconds
    
    // Listen for storage changes (when data is updated in other components)
    const handleStorageChange = () => {
      loadUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUserData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransferStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Calculate real-time stats from actual user data
  const stats = useMemo(() => {
    const totalTrusts = trusts.length;
    const totalBalance = trusts.reduce((sum, trust) => sum + (trust.balance || 0), 0);
    const totalBeneficiaries = trusts.reduce((sum, trust) => sum + (trust.beneficiaryCount || 0), 0);
    
    // Calculate transfers in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTransfers = recentTransfers.filter(transfer => 
      new Date(transfer.date) >= thirtyDaysAgo
    ).length;
    
    return {
      totalTrusts,
      totalBalance,
      totalBeneficiaries,
      recentTransfers
    };
  }, [trusts, recentTransfers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}! 🚀
          </h1>
          <p className="text-gray-600 mt-2">
            Your wealth management command center
          </p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-sm text-blue-100">Last Login</span>
              <p className="font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-sm text-blue-100">Platform Status</span>
              <p className="font-semibold text-green-300">● Active</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trusts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTrusts}</p>
                <p className="text-xs text-blue-600 font-medium">Active accounts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalBalance)}</p>
                <p className="text-xs text-green-600 font-medium">Combined value</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Beneficiaries</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBeneficiaries}</p>
                <p className="text-xs text-blue-600 font-medium">Protected by TrustStack</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Transfers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.recentTransfers}</p>
                <p className="text-xs text-orange-600 font-medium">Last 30 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/trusts"
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Create Trust</h3>
                <p className="text-sm text-gray-600">Set up a new trust account</p>
              </div>
            </div>
          </Link>

          <Link
            to="/transfers"
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl group-hover:scale-110 transition-transform">
                <ArrowUpRight className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Process Transfer</h3>
                <p className="text-sm text-gray-600">Send wealth to beneficiaries</p>
              </div>
            </div>
          </Link>

          <Link
            to="/trusts"
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Add Beneficiary</h3>
                <p className="text-sm text-gray-600">Manage trust beneficiaries</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">View Reports</h3>
                <p className="text-sm text-gray-600">Analytics & insights</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Testing Guide - Show when no data exists */}
        {trusts.length === 0 && recentTransfers.length === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 Ready to Test TrustStack?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Your dashboard is empty because you haven't created any trusts or transfers yet. Here's how to test the platform:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                  <div className="text-3xl mb-2">1️⃣</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Create a Trust</h4>
                  <p className="text-sm text-gray-600">Go to Trusts page and create your first trust account</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                  <div className="text-3xl mb-2">2️⃣</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Add Beneficiaries</h4>
                  <p className="text-sm text-gray-600">Add family members or loved ones to your trust</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                  <div className="text-3xl mb-2">3️⃣</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Process Transfers</h4>
                  <p className="text-sm text-gray-600">Start transferring wealth to see your dashboard come alive</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/trusts"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Trust
                </Link>
                <Link
                  to="/transfers"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <ArrowUpRight className="mr-2 h-5 w-5" />
                  Start Transferring Wealth
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Trust Accounts */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Trust Accounts</h2>
              <p className="text-sm text-gray-600 mt-1">Manage and monitor your wealth preservation vehicles</p>
            </div>
            <Link
              to="/trusts"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="p-6">
            {trusts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Building Your Legacy</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Create your first trust account to begin your wealth preservation journey. TrustStack makes it simple and secure.</p>
                <Link
                  to="/trusts"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Trust
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {trusts.slice(0, 3).map((trust) => (
                  <div key={trust.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4">
                          <Building2 className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{trust.name}</h3>
                          <p className="text-gray-600">{trust.purpose || 'No description provided'}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(trust.status)}`}>
                        {trust.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <DollarSign className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500">Balance</span>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(trust.balance)}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Users className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500">Beneficiaries</span>
                        <p className="text-lg font-semibold text-gray-900">{trust.beneficiaryCount}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Building2 className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500">Type</span>
                        <p className="text-sm font-semibold text-gray-900">{trust.type}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500">Created</span>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(trust.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Last activity: {formatDate(trust.last_activity)}
                      </div>
                      <Link
                        to={`/trusts/${trust.id}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        View Details
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Transfers</h2>
              <p className="text-sm text-gray-600 mt-1">Monitor your latest wealth transfer activities</p>
            </div>
            <Link
              to="/transfers"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="p-6">
            {recentTransfers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Transfer Wealth?</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Once you create trusts, you can start processing wealth transfers to beneficiaries. Every transfer is secure and tracked.</p>
                <Link
                  to="/transfers"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Start Your First Transfer
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransfers.slice(0, 3).map((transfer) => (
                  <div key={transfer.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-xl mr-4 ${transfer.type === 'outgoing' ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-green-600'}`}>
                          <ArrowUpRight className={`h-6 w-6 text-white ${transfer.type === 'outgoing' ? 'rotate-45' : ''}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{transfer.description || 'Wealth Transfer'}</h3>
                          <p className="text-sm text-gray-600">
                            {transfer.trustName} → {transfer.beneficiaryName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(transfer.amount)}</p>
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getTransferStatusColor(transfer.status)}`}>
                          {getStatusIcon(transfer.status)}
                          <span className="ml-2">{transfer.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">{transfer.trustName}</span>
                      </div>
                      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">{transfer.beneficiaryName}</span>
                      </div>
                      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">{formatDate(transfer.date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Transfer ID: {transfer.id}
                      </div>
                      <div className="flex space-x-2">
                        {transfer.status === 'pending' && (
                          <>
                            <button className="inline-flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete
                            </button>
                            <button className="inline-flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                              <XCircle className="h-4 w-4 mr-2" />
                              Mark Failed
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

