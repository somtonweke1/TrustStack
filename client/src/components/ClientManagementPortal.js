import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit, Trash2, Calendar, DollarSign, CheckCircle, Search, Download } from 'lucide-react';
import dataManager from '../utils/dataManager';

const ClientManagementPortal = () => {
  const [clients, setClients] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [actionStatus, setActionStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTrustType, setFilterTrustType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder] = useState('asc');
  const [validationErrors, setValidationErrors] = useState({});
  
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    trustType: '',
    riskTolerance: '',
    investmentGoals: '',
    annualIncome: '',
    netWorth: '',
    familySize: '',
    nextReview: '',
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    try {
      const clientList = dataManager.getClients();
      setClients(clientList);
    } catch (error) {
      console.error('Error loading clients:', error);
      setActionStatus('Error loading clients. Please refresh the page.');
    }
  };

  const validateClientForm = (clientData) => {
    const errors = {};
    
    if (!clientData.name || clientData.name.trim() === '') {
      errors.name = 'Client name is required';
    }
    
    if (!clientData.email || clientData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (clientData.phone && !/^[+]?[1-9]\d{0,15}$/.test(clientData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (clientData.netWorth && isNaN(parseFloat(clientData.netWorth))) {
      errors.netWorth = 'Net worth must be a valid number';
    }
    
    if (clientData.annualIncome && isNaN(parseFloat(clientData.annualIncome))) {
      errors.annualIncome = 'Annual income must be a valid number';
    }
    
    if (clientData.familySize && (isNaN(parseInt(clientData.familySize)) || parseInt(clientData.familySize) < 1)) {
      errors.familySize = 'Family size must be a positive number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddClient = () => {
    if (!validateClientForm(newClient)) {
      setActionStatus('Please fix the errors above before adding the client');
      return;
    }

    try {
      const client = {
        ...newClient,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'Active',
        trustDocuments: [],
        lastContact: new Date().toISOString(),
        tags: [],
        priority: 'Medium'
      };

      dataManager.addClient(client);
      setClients(prev => [...prev, client]);
      
      // Reset form
      setNewClient({
        name: '', email: '', phone: '', address: '', trustType: '', riskTolerance: '', 
        investmentGoals: '', annualIncome: '', netWorth: '', familySize: '', nextReview: '', notes: ''
      });
      setShowAddForm(false);
      setActionStatus('Client added successfully!');
      setValidationErrors({});
      
      setTimeout(() => setActionStatus(''), 3000);
    } catch (error) {
      console.error('Error adding client:', error);
      setActionStatus('Error adding client. Please try again.');
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setNewClient(client);
    setShowAddForm(true);
    setValidationErrors({});
  };

  const handleUpdateClient = () => {
    if (!editingClient) return;

    if (!validateClientForm(newClient)) {
      setActionStatus('Please fix the errors above before updating the client');
      return;
    }

    try {
      const updatedClient = { 
        ...editingClient, 
        ...newClient,
        updatedAt: new Date().toISOString()
      };
      
      dataManager.updateClient(updatedClient.id, updatedClient);
      setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
      
      // Reset form
      setEditingClient(null);
      setNewClient({
        name: '', email: '', phone: '', address: '', trustType: '', riskTolerance: '', 
        investmentGoals: '', annualIncome: '', netWorth: '', familySize: '', nextReview: '', notes: ''
      });
      setShowAddForm(false);
      setActionStatus('Client updated successfully!');
      setValidationErrors({});
      
      setTimeout(() => setActionStatus(''), 3000);
    } catch (error) {
      console.error('Error updating client:', error);
      setActionStatus('Error updating client. Please try again.');
    }
  };

  const deleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        dataManager.deleteClient(clientId);
        setClients(prev => prev.filter(c => c.id !== clientId));
        setActionStatus('Client deleted successfully!');
        setTimeout(() => setActionStatus(''), 3000);
      } catch (error) {
        console.error('Error deleting client:', error);
        setActionStatus('Error deleting client. Please try again.');
      }
    }
  };

  const scheduleReview = (clientId) => {
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + 30);
    
    try {
      const deadline = {
        id: Date.now().toString(),
        clientId,
        type: 'Client Review',
        dueDate: reviewDate.toISOString(),
        priority: 'Medium',
        status: 'Pending'
      };
      
      // Add to data manager
      const currentDeadlines = dataManager.getUpcomingDeadlines();
      currentDeadlines.push(deadline);
      
      // Update client
      const client = clients.find(c => c.id === clientId);
      if (client) {
        const updatedClient = {
          ...client,
          nextReview: reviewDate.toISOString(),
          updatedAt: new Date().toISOString()
        };
        dataManager.updateClient(clientId, updatedClient);
        setClients(prev => prev.map(c => c.id === clientId ? updatedClient : c));
      }
      
      setActionStatus('Review scheduled successfully!');
      setTimeout(() => setActionStatus(''), 3000);
    } catch (error) {
      console.error('Error scheduling review:', error);
      setActionStatus('Error scheduling review. Please try again.');
    }
  };



  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrustTypeColor = (trustType) => {
    switch (trustType?.toLowerCase()) {
      case 'revocable living': return 'bg-blue-100 text-blue-800';
      case 'irrevocable': return 'bg-purple-100 text-purple-800';
      case 'special needs': return 'bg-pink-100 text-pink-800';
      case 'charitable': return 'bg-green-100 text-green-800';
      case 'qualified personal residence': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (field, value) => {
    setNewClient(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const filteredAndSortedClients = () => {
    let filtered = clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (client.trustType && client.trustType.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
      const matchesTrustType = filterTrustType === 'all' || client.trustType === filterTrustType;
      
      return matchesSearch && matchesStatus && matchesTrustType;
    });

    // Sort clients
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'netWorth' || sortBy === 'annualIncome') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const exportClients = () => {
    try {
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Trust Type', 'Status', 'Net Worth', 'Annual Income', 'Family Size', 'Next Review'],
        ...filteredAndSortedClients().map(client => [
          client.name,
          client.email,
          client.phone || '',
          client.trustType || '',
          client.status || '',
          client.netWorth || '',
          client.annualIncome || '',
          client.familySize || '',
          client.nextReview || ''
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clients_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setActionStatus('Client list exported successfully!');
      setTimeout(() => setActionStatus(''), 3000);
    } catch (error) {
      console.error('Error exporting clients:', error);
      setActionStatus('Error exporting clients. Please try again.');
    }
  };

  const upcomingReviews = clients.filter(c => c.nextReview && new Date(c.nextReview) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Client Management Portal</h1>
                <p className="text-gray-600">Manage your entire client portfolio with professional tools and insights</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={exportClients}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingClient(null);
                  setNewClient({
                    name: '', email: '', phone: '', address: '', trustType: '', riskTolerance: '', 
                    investmentGoals: '', annualIncome: '', netWorth: '', familySize: '', nextReview: '', notes: ''
                  });
                  setValidationErrors({});
                }}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Client</span>
              </button>
            </div>
          </div>
          
          {/* Status Message */}
          {actionStatus && (
            <div className={`p-4 rounded-xl border ${
              actionStatus.includes('Error') 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : actionStatus.includes('successfully') 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              {actionStatus}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.filter(c => c.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingReviews}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${clients.reduce((sum, c) => sum + (parseFloat(c.netWorth) || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search clients..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trust Type</label>
              <select
                value={filterTrustType}
                onChange={(e) => setFilterTrustType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Revocable Living">Revocable Living</option>
                <option value="Irrevocable">Irrevocable</option>
                <option value="Special Needs">Special Needs</option>
                <option value="Charitable">Charitable</option>
                <option value="Qualified Personal Residence">Qualified Personal Residence</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="createdAt">Date Added</option>
                <option value="netWorth">Net Worth</option>
                <option value="annualIncome">Annual Income</option>
                <option value="nextReview">Next Review</option>
              </select>
            </div>
          </div>
        </div>

        {/* Client Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Full legal name"
                  />
                  {validationErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={newClient.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Full address"
                  />
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Financial Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trust Type
                  </label>
                  <select
                    value={newClient.trustType}
                    onChange={(e) => handleInputChange('trustType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select trust type...</option>
                    <option value="Revocable Living">Revocable Living</option>
                    <option value="Irrevocable">Irrevocable</option>
                    <option value="Special Needs">Special Needs</option>
                    <option value="Charitable">Charitable</option>
                    <option value="Qualified Personal Residence">Qualified Personal Residence</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Net Worth
                  </label>
                  <input
                    type="text"
                    value={newClient.netWorth}
                    onChange={(e) => handleInputChange('netWorth', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.netWorth ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="$1,000,000"
                  />
                  {validationErrors.netWorth && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.netWorth}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <input
                    type="text"
                    value={newClient.annualIncome}
                    onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.annualIncome ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="$150,000"
                  />
                  {validationErrors.annualIncome && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.annualIncome}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family Size
                  </label>
                  <input
                    type="number"
                    value={newClient.familySize}
                    onChange={(e) => handleInputChange('familySize', e.target.value)}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationErrors.familySize ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="1"
                    placeholder="2"
                  />
                  {validationErrors.familySize && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.familySize}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Review Date
                  </label>
                  <input
                    type="date"
                    value={newClient.nextReview}
                    onChange={(e) => handleInputChange('nextReview', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={newClient.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Additional notes about the client..."
              />
            </div>
            
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingClient(null);
                  setNewClient({
                    name: '', email: '', phone: '', address: '', trustType: '', riskTolerance: '', 
                    investmentGoals: '', annualIncome: '', netWorth: '', familySize: '', nextReview: '', notes: ''
                  });
                  setValidationErrors({});
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={editingClient ? handleUpdateClient : handleAddClient}
                className="px-8 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {editingClient ? 'Update Client' : 'Add Client'}
              </button>
            </div>
          </div>
        )}

        {/* Clients List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trust Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Worth</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Review</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedClients().map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.trustType && (
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTrustTypeColor(client.trustType)}`}>
                          {client.trustType}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {client.netWorth ? `$${parseFloat(client.netWorth).toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {client.nextReview ? new Date(client.nextReview).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => scheduleReview(client.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Schedule Review"
                        >
                          <Calendar className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteClient(client.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAndSortedClients().length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterTrustType !== 'all' 
                    ? 'Try adjusting your search or filters.' 
                    : 'Get started by adding your first client.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManagementPortal;
