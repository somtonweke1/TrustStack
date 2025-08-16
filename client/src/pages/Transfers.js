import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Calendar,
  Filter,
  Search,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  User
} from 'lucide-react';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    trustId: '',
    beneficiaryId: '',
    amount: '',
    description: '',
    transferType: 'outgoing'
  });

  useEffect(() => {
    // Mock data instead of API calls
    const mockTrusts = [
      { id: '1', name: 'Family Trust Fund' },
      { id: '2', name: 'Education Trust' },
      { id: '3', name: 'Retirement Trust' }
    ];
    
    const mockTransfers = [
      {
        id: '1',
        trustName: 'Family Trust Fund',
        beneficiaryName: 'John Smith',
        amount: 5000,
        type: 'outgoing',
        status: 'completed',
        date: '2024-01-20',
        description: 'Monthly distribution'
      },
      {
        id: '2',
        trustName: 'Education Trust',
        beneficiaryName: 'Sarah Johnson',
        amount: 2500,
        type: 'outgoing',
        status: 'pending',
        date: '2024-01-18',
        description: 'Tuition payment'
      },
      {
        id: '3',
        trustName: 'Family Trust Fund',
        beneficiaryName: 'Mike Wilson',
        amount: 10000,
        type: 'incoming',
        status: 'completed',
        date: '2024-01-15',
        description: 'Additional funding'
      }
    ];
    
    setTrusts(mockTrusts);
    setTransfers(mockTransfers);
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mock creation instead of API call
    const newTransfer = {
      id: `transfer-${Date.now()}`,
      trustName: trusts.find(t => t.id === formData.trustId)?.name || 'Unknown Trust',
      beneficiaryName: 'New Beneficiary',
      amount: parseFloat(formData.amount),
      type: formData.transferType,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      description: formData.description
    };
    
    setTransfers([newTransfer, ...transfers]);
    setFormData({ trustId: '', beneficiaryId: '', amount: '', description: '', transferType: 'outgoing' });
    setShowCreateForm(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
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
            <h1 className="text-3xl font-bold text-gray-900">Wealth Transfers</h1>
            <p className="text-gray-600 mt-2">
              Manage and track wealth transfers to beneficiaries
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Initiate Transfer
          </button>
        </div>

        {/* Create Transfer Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Initiate New Transfer</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="trustId" className="block text-sm font-medium text-gray-700">
                    Trust Account *
                  </label>
                  <select
                    id="trustId"
                    name="trustId"
                    required
                    value={formData.trustId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a trust account</option>
                    {trusts.map((trust) => (
                      <option key={trust.id} value={trust.id}>
                        {trust.name} - {formatCurrency(trust.currentBalance)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the purpose of this transfer..."
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
                  Initiate Transfer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transfers List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Transfer History</h2>
          </div>
          <div className="p-6">
            {transfers.length === 0 ? (
              <div className="text-center py-8">
                <ArrowUpRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers yet</h3>
                <p className="text-gray-600 mb-4">Initiate your first wealth transfer to get started</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Initiate Transfer
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          {getStatusIcon(transfer.status)}
                          <h3 className="text-lg font-semibold text-gray-900 ml-3">
                            {formatCurrency(transfer.amount)}
                          </h3>
                          <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transfer.status)}`}>
                            {transfer.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{transfer.description || 'No description provided'}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium text-gray-700">Trust:</span>
                            <span className="ml-2">{transfer.trustName}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium text-gray-700">Beneficiary:</span>
                            <span className="ml-2">{transfer.beneficiaryName}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium text-gray-700">Date:</span>
                            <span className="ml-2">{new Date(transfer.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {transfer.stripePaymentIntentId && (
                          <div className="mt-3 text-xs text-gray-500">
                            Payment ID: {transfer.stripePaymentIntentId}
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

export default Transfers;
