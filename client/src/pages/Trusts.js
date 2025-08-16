import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Building2, ArrowRight, Users, DollarSign, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Trusts = () => {
  const { user } = useAuth();
  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Revocable Living Trust',
    initialAmount: '',
    beneficiaryCount: '',
    purpose: ''
  });

  useEffect(() => {
    loadTrusts();
  }, []);

  const loadTrusts = () => {
    try {
      const savedTrusts = JSON.parse(localStorage.getItem('userTrusts') || '[]');
      setTrusts(savedTrusts);
    } catch (error) {
      console.error('Error loading trusts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Trust name is required');
      return;
    }

    if (!formData.initialAmount || parseFloat(formData.initialAmount) <= 0) {
      toast.error('Initial amount must be greater than 0');
      return;
    }

    // Create new trust
    const newTrust = {
      id: `trust-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      balance: parseFloat(formData.initialAmount),
      beneficiaryCount: parseInt(formData.beneficiaryCount) || 0,
      purpose: formData.purpose,
      status: 'active',
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      beneficiaries: []
    };
    
    // Save to localStorage
    const updatedTrusts = [newTrust, ...trusts];
    localStorage.setItem('userTrusts', JSON.stringify(updatedTrusts));
    
    setTrusts(updatedTrusts);
    setFormData({ name: '', description: '', type: 'Revocable Living Trust', initialAmount: '', beneficiaryCount: '', purpose: '' });
    setShowCreateForm(false);
    
    toast.success('Trust account created successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const deleteTrust = (trustId) => {
    if (window.confirm('Are you sure you want to delete this trust account? This action cannot be undone.')) {
      const updatedTrusts = trusts.filter(trust => trust.id !== trustId);
      localStorage.setItem('userTrusts', JSON.stringify(updatedTrusts));
      setTrusts(updatedTrusts);
      toast.success('Trust account deleted successfully');
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trust Management</h1>
              <p className="text-gray-600 mt-2">
                Create and manage your trust accounts for wealth preservation
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Create Trust
            </button>
          </div>
        </div>

        {/* Create Trust Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Create New Trust Account</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Trust Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Family Trust Fund"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Trust Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Revocable Living Trust">Revocable Living Trust</option>
                    <option value="Irrevocable Trust">Irrevocable Trust</option>
                    <option value="Education Trust">Education Trust</option>
                    <option value="Charitable Trust">Charitable Trust</option>
                    <option value="Special Needs Trust">Special Needs Trust</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="initialAmount" className="block text-sm font-medium text-gray-700">
                    Initial Funding Amount *
                  </label>
                  <input
                    type="number"
                    name="initialAmount"
                    min="0"
                    step="0.01"
                    value={formData.initialAmount}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="beneficiaryCount" className="block text-sm font-medium text-gray-700">
                    Number of Beneficiaries
                  </label>
                  <input
                    type="number"
                    name="beneficiaryCount"
                    min="0"
                    value={formData.beneficiaryCount}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                  Trust Purpose
                </label>
                <textarea
                  name="purpose"
                  rows={3}
                  value={formData.purpose}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the purpose of this trust..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              <div className="text-center py-12">
                <Building2 className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No trust accounts yet</h3>
                <p className="mt-2 text-gray-600">Create your first trust account to get started with wealth preservation.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Create Trust Account
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {trusts.map((trust) => (
                  <div key={trust.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Building2 className="h-10 w-10 text-blue-600 mr-4" />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{trust.name}</h3>
                          <p className="text-gray-600">{trust.purpose || 'No description provided'}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(trust.status)}`}>
                        {trust.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">Balance:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatCurrency(trust.balance)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">Beneficiaries:</span>
                        <span className="ml-2 font-medium text-gray-900">{trust.beneficiaryCount}</span>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-2 font-medium text-gray-900">{trust.type}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 font-medium text-gray-900">{formatDate(trust.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Last activity: {formatDate(trust.last_activity)}
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/trusts/${trust.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                        <button
                          onClick={() => deleteTrust(trust.id)}
                          className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
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
