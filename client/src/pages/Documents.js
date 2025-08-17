import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Shield,
  Search,
  Filter,
  FolderOpen,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [trusts, setTrusts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [selectedTrustForDocs, setSelectedTrustForDocs] = useState(null);
  const [documentFormData, setDocumentFormData] = useState({
    name: '',
    type: 'Will',
    description: '',
    file: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedDocuments = JSON.parse(localStorage.getItem('userDocuments') || '[]');
      const savedTrusts = JSON.parse(localStorage.getItem('userTrusts') || '[]');
      setDocuments(savedDocuments);
      setTrusts(savedTrusts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter documents based on search and type
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.trustName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-2">
            Securely store and manage your legal and financial documents
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Types</option>
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
              
              <button
                onClick={() => setShowDocumentUpload(true)}
                disabled={trusts.length === 0}
                className={`inline-flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  trusts.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                }`}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Document
              </button>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Documents</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
                </p>
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
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {documents.length === 0 ? 'No Documents Yet' : 'No Documents Match Your Search'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {documents.length === 0 
                    ? 'Upload your important legal and financial documents to keep them organized and secure with your trusts.'
                    : 'Try adjusting your search terms or filter criteria.'
                  }
                </p>
                {documents.length === 0 && (
                  <button
                    onClick={() => setShowDocumentUpload(true)}
                    disabled={trusts.length === 0}
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      trusts.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                    }`}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    {trusts.length === 0 ? 'Create Trust First' : 'Upload Your First Document'}
                  </button>
                )}
                {trusts.length === 0 && (
                  <p className="text-sm text-gray-500 mt-3">
                    You need to create a trust account before uploading documents
                  </p>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredDocuments.map(doc => (
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
                              <span className="font-medium">Size:</span> {formatFileSize(doc.fileSize)}
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            Uploaded: {formatDate(doc.uploadedAt)}
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
                        {trust.name}
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

export default Documents;
