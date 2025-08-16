import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  Users, 
  DollarSign, 
  ArrowUpRight,
  Plus
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrusts: 0,
    totalBalance: 0,
    totalBeneficiaries: 0,
    recentTransfers: 0
  });

  useEffect(() => {
    fetchTrusts();
  }, []);

  const fetchTrusts = async () => {
    try {
      const response = await axios.get('/api/trusts');
      setTrusts(response.data.trusts);
      
      // Calculate stats
      const totalBalance = response.data.trusts.reduce((sum, trust) => sum + parseFloat(trust.currentBalance), 0);
      const totalBeneficiaries = response.data.trusts.length * 2; // Approximate for demo
      
      setStats({
        totalTrusts: response.data.trusts.length,
        totalBalance,
        totalBeneficiaries,
        recentTransfers: 2 // Demo data
      });
    } catch (error) {
      console.error('Error fetching trusts:', error);
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

  const getComplianceColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
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
            Welcome back, {user?.firstName}!
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
                <ArrowUpRight className="h-6 w-6 text-orange-600" />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/trusts"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
              >
                <Plus className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Create Trust</h3>
                  <p className="text-sm text-gray-600">Set up a new trust account</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto" />
              </Link>

              <Link
                to="/transfers"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-200"
              >
                <ArrowUpRight className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Process Transfer</h3>
                  <p className="text-sm text-gray-600">Initiate wealth transfer</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 ml-auto" />
              </Link>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                <Shield className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Compliance</h3>
                  <p className="text-sm text-gray-600">View compliance status</p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Trust Accounts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Your Trust Accounts</h2>
            <Link
              to="/trusts"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="p-6">
            {trusts.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trust accounts yet</h3>
                <p className="text-gray-600 mb-4">Create your first trust account to get started</p>
                <Link
                  to="/trusts"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Trust Account
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {trusts.map((trust) => (
                  <div
                    key={trust.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{trust.trustName}</h3>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trust.status)}`}>
                            {trust.status}
                          </span>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getComplianceColor(trust.complianceStatus)}`}>
                            {trust.complianceStatus}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{trust.trustPurpose}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>Type: {trust.trustType}</span>
                          <span>Created: {new Date(trust.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(trust.currentBalance)}</p>
                        <p className="text-sm text-gray-600">Current Balance</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link
                        to={`/trusts/${trust.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        View Details
                        <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Link>
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
