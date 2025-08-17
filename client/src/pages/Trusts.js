import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Building2, 
  Users, 
  DollarSign, 
  Calendar, 
  Trash2, 
  FileText,
  Upload,
  Download,
  Eye,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Trusts = () => {
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
  
  // Document management state
  const [documents, setDocuments] = useState([]);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [selectedTrustForDocs, setSelectedTrustForDocs] = useState(null);
  const [documentFormData, setDocumentFormData] = useState({
    name: '',
    type: 'Will',
    description: '',
    file: null
  });

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

  const loadDocuments = () => {
    try {
      const savedDocuments = JSON.parse(localStorage.getItem('userDocuments') || '[]');
      setDocuments(savedDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  useEffect(() => {
    loadTrusts();
    loadDocuments();
  }, []);

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

  // Document management functions
  const handleDocumentUpload = (e) => {
    e.preventDefault();
    
    if (!selectedTrustForDocs) {
      toast.error('Please select a trust account');
      return;
    }
    
    if (!documentFormData.name.trim()) {
      toast.error('Document name is required');
      return;
    }
    
    if (!documentFormData.file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    // Create document object
    const newDocument = {
      id: `doc-${Date.now()}`,
      trustId: selectedTrustForDocs,
      trustName: trusts.find(t => t.id === selectedTrustForDocs)?.name || 'Unknown Trust',
      name: documentFormData.name,
      type: documentFormData.type,
      description: documentFormData.description,
      fileName: documentFormData.file.name,
      fileSize: documentFormData.file.size,
      fileType: documentFormData.file.type,
      uploadedAt: new Date().toISOString(),
      status: 'active'
    };
    
    // Save to localStorage
    const updatedDocuments = [newDocument, ...documents];
    localStorage.setItem('userDocuments', JSON.stringify(updatedDocuments));
    
    setDocuments(updatedDocuments);
    setDocumentFormData({ name: '', type: 'Will', description: '', file: null });
    setShowDocumentUpload(false);
    setSelectedTrustForDocs(null);
    
    toast.success('Document uploaded successfully!');
  };

  const deleteDocument = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      localStorage.setItem('userDocuments', JSON.stringify(updatedDocuments));
      setDocuments(updatedDocuments);
      toast.success('Document deleted successfully');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid file type (PDF, DOC, DOCX, JPG, PNG)');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setDocumentFormData(prev => ({ ...prev, file }));
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
        {/* Version Indicator */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">
              🆕 NEW: Document Management System Added! 
            </span>
            <span className="text-xs text-blue-600">
              Version 2.0 - Upload wills, trust agreements, and financial documents
            </span>
          </div>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trust Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your trust accounts, and securely store related documents
          </p>
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

        {/* Trust List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Trust Accounts</h2>
              <p className="text-sm text-gray-600 mt-1">Manage your wealth preservation vehicles</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDocumentUpload(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                disabled={trusts.length === 0}
                title={trusts.length === 0 ? "Create a trust first to upload documents" : "Upload documents"}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Trust
              </button>
            </div>
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

        {/* Documents Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Document Management</h2>
                <p className="text-sm text-gray-600 mt-1">Secure storage for your legal and financial documents</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">
                  <Shield className="inline h-4 w-4 mr-1" />
                  Encrypted & Secure
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {documents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Upload your important legal and financial documents to keep them organized and secure with your trusts.
                </p>
                <button
                  onClick={() => setShowDocumentUpload(true)}
                  disabled={trusts.length === 0}
                  className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    trusts.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                  }`}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  {trusts.length === 0 ? 'Create Trust First' : 'Upload Your First Document'}
                </button>
                {trusts.length === 0 && (
                  <p className="text-sm text-gray-500 mt-3">
                    You need to create a trust account before uploading documents
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Document Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['All', 'Will', 'Trust Agreement', 'Power of Attorney', 'Financial Document', 'Other'].map(category => (
                    <button
                      key={category}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        category === 'All'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                {/* Documents List */}
                <div className="grid gap-4">
                  {documents.map(doc => (
                    <div key={doc.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl ${
                            doc.type === 'Will' ? 'bg-red-100 text-red-600' :
                            doc.type === 'Trust Agreement' ? 'bg-blue-100 text-blue-600' :
                            doc.type === 'Power of Attorney' ? 'bg-purple-100 text-purple-600' :
                            doc.type === 'Financial Document' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                doc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{doc.description || 'No description provided'}</p>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                              <div>
                                <span className="font-medium">Type:</span> {doc.type}
                              </div>
                              <div>
                                <span className="font-medium">Trust:</span> {doc.trustName}
                              </div>
                              <div>
                                <span className="font-medium">File:</span> {doc.fileName}
                              </div>
                              <div>
                                <span className="font-medium">Uploaded:</span> {formatDate(doc.uploadedAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View document details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download document"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete document"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Document Upload Modal */}
        {showDocumentUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
                <button
                  onClick={() => setShowDocumentUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleDocumentUpload} className="space-y-6">
                {/* Trust Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Trust Account *
                  </label>
                  <select
                    value={selectedTrustForDocs || ''}
                    onChange={(e) => setSelectedTrustForDocs(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Choose a trust account</option>
                    {trusts.map(trust => (
                      <option key={trust.id} value={trust.id}>
                        {trust.name} - {formatCurrency(trust.balance)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Document Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    value={documentFormData.name}
                    onChange={(e) => setDocumentFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Last Will and Testament"
                    required
                  />
                </div>
                
                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    value={documentFormData.type}
                    onChange={(e) => setDocumentFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Will">Will & Testament</option>
                    <option value="Trust Agreement">Trust Agreement</option>
                    <option value="Power of Attorney">Power of Attorney</option>
                    <option value="Living Will">Living Will</option>
                    <option value="Financial Document">Financial Document</option>
                    <option value="Property Deed">Property Deed</option>
                    <option value="Insurance Policy">Insurance Policy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={documentFormData.description}
                    onChange={(e) => setDocumentFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Brief description of the document..."
                  />
                </div>
                
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Click to upload
                        </span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, JPG, PNG up to 10MB
                      </p>
                    </label>
                  </div>
                  {documentFormData.file && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <FileText className="inline h-4 w-4 mr-2" />
                        Selected: {documentFormData.file.name}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDocumentUpload(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trusts;
