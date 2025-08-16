import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Plus,
  ArrowUpRight,
  TrendingUp,
  Shield,
  Activity,
  Calendar,
  PieChart
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [trusts, setTrusts] = useState([]);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user's actual data from localStorage
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      // Load trusts from localStorage
      const savedTrusts = JSON.parse(localStorage.getItem('userTrusts') || '[]');
      const savedTransfers = JSON.parse(localStorage.getItem('userTransfers') || '[]');
      
      // If no trusts exist, create some demo trusts for the user
      if (savedTrusts.length === 0) {
        const demoTrusts = [
          {
            id: '1',
            name: `${user?.firstName || 'Family'} Trust Fund`,
            type: 'Revocable Living Trust',
            balance: 250000,
            beneficiaries: 3,
            status: 'active',
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            last_activity: new Date().toISOString(),
            purpose: 'Multi-generational family wealth preservation'
          },
          {
            id: '2',
            name: `${user?.firstName || 'Education'} Trust`,
            type: 'Education Trust',
            balance: 75000,
            beneficiaries: 2,
            status: 'active',
            created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            last_activity: new Date().toISOString(),
            purpose: 'Funding for children\'s education expenses'
          },
          {
            id: '3',
            name: `${user?.firstName || 'Retirement'} Trust`,
            type: 'Retirement Trust',
            balance: 500000,
            beneficiaries: 1,
            status: 'pending',
            created_at: new Date().toISOString(),
            last_activity: new Date().toISOString(),
            purpose: 'Secure retirement income stream'
          }
        ];
        localStorage.setItem('userTrusts', JSON.stringify(demoTrusts));
        setTrusts(demoTrusts);
      } else {
        setTrusts(savedTrusts);
      }

      // If no transfers exist, create some demo transfers
      if (savedTransfers.length === 0) {
        const demoTransfers = [
          {
            id: '1',
            trustName: 'Family Trust Fund',
            beneficiaryName: 'John Smith',
            amount: 5000,
            type: 'outgoing',
            status: 'completed',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Monthly distribution'
          },
          {
            id: '2',
            trustName: 'Education Trust',
            beneficiaryName: 'Sarah Johnson',
            amount: 2500,
            type: 'outgoing',
            status: 'pending',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            description: 'Tuition payment'
          }
        ];
        localStorage.setItem('userTransfers', JSON.stringify(demoTransfers));
        setRecentTransfers(demoTransfers);
      } else {
        setRecentTransfers(savedTransfers);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Calculate stats from actual data
  const stats = {
    totalTrusts: trusts.length,
    totalBalance: trusts.reduce((sum, trust) => sum + (trust.balance || 0), 0),
    totalBeneficiaries: trusts.reduce((sum, trust) => sum + (trust.beneficiaries || 0), 0),
    recentTransfers: recentTransfers.length
  };

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
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your trust accounts and monitor wealth transfers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trusts</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTrusts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalBalance)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Beneficiaries</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBeneficiaries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Transfers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.recentTransfers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Link
                to="/trusts"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <Building2 className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Create Trust Account</h3>
                  <p className="text-sm text-gray-600">Set up a new trust account</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto" />
              </Link>

              <Link
                to="/transfers"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <ArrowUpRight className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Process Transfer</h3>
                  <p className="text-sm text-gray-600">Initiate wealth transfer</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto" />
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Accounts */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Your Trust Accounts</h2>
            <Link
              to="/trusts"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {trusts.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No trust accounts</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first trust account.</p>
                <div className="mt-6">
                  <Link
                    to="/trusts"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create Trust Account
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {trusts.slice(0, 3).map((trust) => (
                  <div key={trust.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{trust.name}</h3>
                          <p className="text-sm text-gray-600">{trust.purpose}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trust.status)}`}>
                        {trust.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 font-medium text-gray-900">{trust.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatDate(trust.created_at)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Balance:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatCurrency(trust.balance)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {trust.beneficiaries} beneficiary{trust.beneficiaries !== 1 ? 'ies' : ''}
                      </div>
                      <Link
                        to={`/trusts/${trust.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Recent Transfers</h2>
            <Link
              to="/transfers"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {recentTransfers.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transfers yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start processing wealth transfers to see activity here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransfers.slice(0, 3).map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${transfer.type === 'outgoing' ? 'bg-red-100' : 'bg-green-100'}`}>
                        <ArrowUpRight className={`h-4 w-4 ${transfer.type === 'outgoing' ? 'text-red-600' : 'text-green-600'}`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{transfer.description}</p>
                        <p className="text-sm text-gray-500">{transfer.trustName} → {transfer.beneficiaryName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(transfer.amount)}</p>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTransferStatusColor(transfer.status)}`}>
                        {transfer.status}
                      </span>
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

