import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowUpRight, 
  Calendar,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  User,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Transfers = () => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    trustId: '',
    beneficiaryName: '',
    amount: '',
    description: '',
    transferType: 'outgoing',
    scheduledDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Load trusts and transfers from localStorage
      const savedTrusts = JSON.parse(localStorage.getItem('userTrusts') || '[]');
      const savedTransfers = JSON.parse(localStorage.getItem('userTransfers') || '[]');
      
      setTrusts(savedTrusts);
      setTransfers(savedTransfers);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.trustId) {
      toast.error('Please select a trust account');
      return;
    }

    if (!formData.beneficiaryName.trim()) {
      toast.error('Beneficiary name is required');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    // Find the selected trust
    const selectedTrust = trusts.find(t => t.id === formData.trustId);
    if (!selectedTrust) {
      toast.error('Selected trust not found');
      return;
    }

    // Check if trust has sufficient balance
    if (formData.transferType === 'outgoing' && parseFloat(formData.amount) > selectedTrust.balance) {
      toast.error('Insufficient trust balance for this transfer');
      return;
    }

    // Create new transfer
    const newTransfer = {
      id: `transfer-${Date.now()}`,
      trustId: formData.trustId,
      trustName: selectedTrust.name,
      beneficiaryName: formData.beneficiaryName,
      amount: parseFloat(formData.amount),
      type: formData.transferType,
      status: 'pending',
      date: formData.scheduledDate || new Date().toISOString(),
      description: formData.description,
      created_at: new Date().toISOString()
    };
    
    // Update trust balance
    const updatedTrusts = trusts.map(trust => {
      if (trust.id === formData.trustId) {
        const balanceChange = formData.transferType === 'outgoing' ? -parseFloat(formData.amount) : parseFloat(formData.amount);
        return {
          ...trust,
          balance: trust.balance + balanceChange,
          last_activity: new Date().toISOString()
        };
      }
      return trust;
    });
    
    // Save to localStorage
    localStorage.setItem('userTrusts', JSON.stringify(updatedTrusts));
    localStorage.setItem('userTransfers', JSON.stringify([newTransfer, ...transfers]));
    
    setTrusts(updatedTrusts);
    setTransfers([newTransfer, ...transfers]);
    setFormData({ trustId: '', beneficiaryName: '', amount: '', description: '', transferType: 'outgoing', scheduledDate: '' });
    setShowCreateForm(false);
    
    toast.success('Transfer created successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateTransferStatus = (transferId, newStatus) => {
    const updatedTransfers = transfers.map(transfer => {
      if (transfer.id === transferId) {
        return { ...transfer, status: newStatus };
      }
      return transfer;
    });
    
    localStorage.setItem('userTransfers', JSON.stringify(updatedTransfers));
    setTransfers(updatedTransfers);
    toast.success(`Transfer status updated to ${newStatus}`);
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
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
              <h1 className="text-3xl font-bold text-gray-900">Wealth Transfers</h1>
              <p className="text-gray-600 mt-2">
                Process and manage wealth transfers between trusts and beneficiaries
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Transfer
            </button>
          </div>
        </div>

        {/* Create Transfer Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Create New Transfer</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="trustId" className="block text-sm font-medium text-gray-700">
                    Trust Account *
                  </label>
                  <select
                    name="trustId"
                    value={formData.trustId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a trust account</option>
                    {trusts.map(trust => (
                      <option key={trust.id} value={trust.id}>
                        {trust.name} - Balance: {formatCurrency(trust.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="transferType" className="block text-sm font-medium text-gray-700">
                    Transfer Type
                  </label>
                  <select
                    name="transferType"
                    value={formData.transferType}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="outgoing">Outgoing (From Trust)</option>
                    <option value="incoming">Incoming (To Trust)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="beneficiaryName" className="block text-sm font-medium text-gray-700">
                    Beneficiary Name *
                  </label>
                  <input
                    type="text"
                    name="beneficiaryName"
                    value={formData.beneficiaryName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter beneficiary name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Transfer Description
                </label>
                <textarea
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Transfer
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
              <div className="text-center py-12">
                <ArrowUpRight className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No transfers yet</h3>
                <p className="mt-2 text-gray-600">Start processing wealth transfers to see activity here.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Create Transfer
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${transfer.type === 'outgoing' ? 'bg-red-100' : 'bg-green-100'}`}>
                          <ArrowUpRight className={`h-5 w-5 ${transfer.type === 'outgoing' ? 'text-red-600' : 'text-green-600'}`} />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{transfer.description || 'Wealth Transfer'}</h3>
                          <p className="text-sm text-gray-600">
                            {transfer.trustName} → {transfer.beneficiaryName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-gray-900">{formatCurrency(transfer.amount)}</p>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transfer.status)}`}>
                          {getStatusIcon(transfer.status)}
                          <span className="ml-1">{transfer.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Trust: {transfer.trustName}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Beneficiary: {transfer.beneficiaryName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Date: {formatDate(transfer.date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(transfer.created_at)}
                      </div>
                      <div className="flex space-x-2">
                        {transfer.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateTransferStatus(transfer.id, 'completed')}
                              className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete
                            </button>
                            <button
                              onClick={() => updateTransferStatus(transfer.id, 'failed')}
                              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                            >
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

export default Transfers;
