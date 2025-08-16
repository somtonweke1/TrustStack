import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Plus, 
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TrustDetail = () => {
  const { id } = useParams();
  const [trust, setTrust] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [beneficiaryForm, setBeneficiaryForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: '',
    allocationPercentage: ''
  });

  useEffect(() => {
    fetchTrustDetails();
  }, [fetchTrustDetails]);

  const fetchTrustDetails = async () => {
    try {
      const response = await axios.get(`/api/trusts/${id}`);
      setTrust(response.data.trust);
      setBeneficiaries(response.data.beneficiaries);
    } catch (error) {
      console.error('Error fetching trust details:', error);
      toast.error('Failed to load trust details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    
    if (!beneficiaryForm.firstName.trim() || !beneficiaryForm.lastName.trim()) {
      toast.error('First and last name are required');
      return;
    }

    try {
      await axios.post('/api/beneficiaries', {
        ...beneficiaryForm,
        trustId: id
      });
      toast.success('Beneficiary added successfully!');
      setShowAddBeneficiary(false);
      setBeneficiaryForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        relationship: '',
        allocationPercentage: ''
      });
      fetchTrustDetails();
    } catch (error) {
      console.error('Error adding beneficiary:', error);
      toast.error('Failed to add beneficiary');
    }
  };

  const handleChange = (e) => {
    setBeneficiaryForm({
      ...beneficiaryForm,
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

  if (!trust) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trust not found</h2>
          <Link
            to="/trusts"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Trusts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/trusts"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trusts
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trust.trustName}</h1>
              <p className="text-gray-600 mt-2">{trust.trustPurpose}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(trust.status)}`}>
                {trust.status}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getComplianceColor(trust.complianceStatus)}`}>
                {trust.complianceStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Trust Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trust Type</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{trust.trustType.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Balance</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(trust.currentBalance)}</p>
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
                <p className="text-lg font-semibold text-gray-900">{beneficiaries.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Details */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Trust Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Trust Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-700">Trust Name</dt>
                    <dd className="text-sm text-gray-900">{trust.trustName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-700">Trust Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">{trust.trustType.replace('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-700">Purpose</dt>
                    <dd className="text-sm text-gray-900">{trust.trustPurpose || 'Not specified'}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Financial Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-700">Initial Funding</dt>
                    <dd className="text-sm text-gray-900">{formatCurrency(trust.initialFundingAmount)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-700">Current Balance</dt>
                    <dd className="text-sm text-gray-900">{formatCurrency(trust.currentBalance)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-700">Created</dt>
                    <dd className="text-sm text-gray-900">{new Date(trust.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficiaries */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Beneficiaries</h2>
            <button
              onClick={() => setShowAddBeneficiary(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Beneficiary
            </button>
          </div>
          <div className="p-6">
            {showAddBeneficiary && (
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Beneficiary</h3>
                <form onSubmit={handleAddBeneficiary} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={beneficiaryForm.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={beneficiaryForm.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={beneficiaryForm.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={beneficiaryForm.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                        Relationship
                      </label>
                      <input
                        type="text"
                        id="relationship"
                        name="relationship"
                        value={beneficiaryForm.relationship}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Son, Daughter, Charity"
                      />
                    </div>
                    <div>
                      <label htmlFor="allocationPercentage" className="block text-sm font-medium text-gray-700">
                        Allocation %
                      </label>
                      <input
                        type="number"
                        id="allocationPercentage"
                        name="allocationPercentage"
                        min="0"
                        max="100"
                        step="0.01"
                        value={beneficiaryForm.allocationPercentage}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="50.00"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddBeneficiary(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add Beneficiary
                    </button>
                  </div>
                </form>
              </div>
            )}

            {beneficiaries.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No beneficiaries yet</h3>
                <p className="text-gray-600 mb-4">Add beneficiaries to this trust account</p>
                <button
                  onClick={() => setShowAddBeneficiary(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Beneficiary
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {beneficiaries.map((beneficiary) => (
                  <div
                    key={beneficiary.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {beneficiary.firstName} {beneficiary.lastName}
                          </h3>
                          <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                            beneficiary.kycStatus === 'verified' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                          }`}>
                            {beneficiary.kycStatus}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="ml-2">{beneficiary.email || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Phone:</span>
                            <span className="ml-2">{beneficiary.phone || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Relationship:</span>
                            <span className="ml-2">{beneficiary.relationship || 'Not specified'}</span>
                          </div>
                        </div>
                        {beneficiary.allocationPercentage && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">Allocation: </span>
                            <span className="text-sm text-gray-900">{beneficiary.allocationPercentage}%</span>
                          </div>
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

export default TrustDetail;
