import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowRight,
  Edit,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Trusts = () => {
  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    trustName: '',
    trustType: 'revocable',
    trustPurpose: '',
    initialFundingAmount: ''
  });

  useEffect(() => {
    fetchTrusts();
  }, []);

  const fetchTrusts = async () => {
    try {
      const response = await axios.get('/api/trusts');
      setTrusts(response.data.trusts);
    } catch (error) {
      console.error('Error fetching trusts:', error);
      toast.error('Failed to load trust accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.trustName.trim()) {
      toast.error('Trust name is required');
      return;
    }

    try {
      const response = await axios.post('/api/trusts', formData);
      toast.success('Trust account created successfully!');
      setShowCreateForm(false);
      setFormData({
        trustName: '',
        trustType: 'revocable',
        trustPurpose: '',
        initialFundingAmount: ''
      });
      fetchTrusts();
    } catch (error) {
      console.error('Error creating trust:', error);
      toast.error('Failed to create trust account');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trust Accounts</h1>
            <p className="text-gray-600 mt-2">
              Manage your trust accounts and beneficiaries
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Trust
          </button>
        </div>

        {/* Create Trust Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Create New Trust Account</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="trustName" className="block text-sm font-medium text-gray-700">
                    Trust Name *
                  </label>
                  <input
                    type="text"
                    id="trustName"
                    name="trustName"
                    required
                    value={formData.trustName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Family Legacy Trust"
                  />
                </div>
                <div>
                  <label htmlFor="trustType" className="block text-sm font-medium text-gray-700">
                    Trust Type *
                  </label>
                  <select
                    id="trustType"
                    name="trustType"
                    required
                    value={formData.trustType}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="revocable">Revocable</option>
                    <option value="irrevocable">Irrevocable</option>
                    <option value="charitable">Charitable</option>
                    <option value="special_needs">Special Needs</option>
                    <option value="life_insurance">Life Insurance</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="trustPurpose" className="block text-sm font-medium text-gray-700">
                  Trust Purpose
                </label>
                <textarea
                  id="trustPurpose"
                  name="trustPurpose"
                  rows={3}
                  value={formData.trustPurpose}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the purpose of this trust..."
                />
              </div>
              <div>
                <label htmlFor="initialFundingAmount" className="block text-sm font-medium text-gray-700">
                  Initial Funding Amount
                </label>
                <input
                  type="number"
                  id="initialFundingAmount"
                  name="initialFundingAmount"
                  min="0"
                  step="0.01"
                  value={formData.initialFundingAmount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Trust
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Trust Accounts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Trust Accounts</h2>
          </div>
          <div className="p-6">
            {trusts.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trust accounts yet</h3>
                <p className="text-gray-600 mb-4">Create your first trust account to get started</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Trust Account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {trusts.map((trust) => (
                  <div
                    key={trust.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <Building2 className="h-6 w-6 text-blue-600 mr-3" />
                          <h3 className="text-xl font-semibold text-gray-900">{trust.trustName}</h3>
                          <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trust.status)}`}>
                            {trust.status}
                          </span>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getComplianceColor(trust.complianceStatus)}`}>
                            {trust.complianceStatus}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{trust.trustPurpose || 'No description provided'}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700">Type:</span>
                            <span className="ml-2 capitalize">{trust.trustType.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700">Created:</span>
                            <span className="ml-2">{new Date(trust.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700">Balance:</span>
                            <span className="ml-2 text-lg font-semibold text-gray-900">{formatCurrency(trust.currentBalance)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/trusts/${trust.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          View
                        </Link>
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

export default Trusts;
