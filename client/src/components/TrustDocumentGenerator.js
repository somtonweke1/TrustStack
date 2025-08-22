import React, { useState, useEffect } from 'react';
import { FileText, Eye, Download, Trash2, Plus, ChevronRight, CheckCircle, Clock, AlertCircle, User, Building2, DollarSign, Calendar, Shield } from 'lucide-react';
import dataManager from '../utils/dataManager';
import pdfGenerator from '../utils/pdfGenerator';

const TrustDocumentGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({});
  const [generationStatus, setGenerationStatus] = useState('');
  const [documents, setDocuments] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadDocuments();
    loadClients();
  }, []);

  const loadDocuments = () => {
    try {
      const docs = dataManager.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      setGenerationStatus('Error loading documents. Please refresh the page.');
    }
  };

  const loadClients = () => {
    try {
      const clientList = dataManager.getClients();
      setClients(clientList);
    } catch (error) {
      console.error('Error loading clients:', error);
      setGenerationStatus('Error loading clients. Please refresh the page.');
    }
  };

  const templates = [
    {
      id: 'revocable-living-trust',
      name: 'Revocable Living Trust',
      description: 'Flexible trust that can be modified or revoked during your lifetime',
      icon: '🏠',
      color: 'from-blue-500 to-blue-600',
      requiredFields: ['grantorName', 'grantorAddress', 'trustAmount', 'beneficiaries']
    },
    {
      id: 'irrevocable-life-insurance-trust',
      name: 'Irrevocable Life Insurance Trust',
      description: 'Protect life insurance proceeds from estate taxes',
      icon: '🛡️',
      color: 'from-green-500 to-green-600',
      requiredFields: ['grantorName', 'grantorAddress', 'trustAmount', 'beneficiaries', 'insurancePolicy']
    },
    {
      id: 'special-needs-trust',
      name: 'Special Needs Trust',
      description: 'Provide for loved ones with special needs without affecting benefits',
      icon: '❤️',
      color: 'from-purple-500 to-purple-600',
      requiredFields: ['grantorName', 'grantorAddress', 'beneficiaryName', 'specialNeedsDescription']
    },
    {
      id: 'charitable-remainder-trust',
      name: 'Charitable Remainder Trust',
      description: 'Generate income while supporting your favorite charity',
      icon: '🤝',
      color: 'from-orange-500 to-orange-600',
      requiredFields: ['grantorName', 'grantorAddress', 'trustAmount', 'charityName', 'incomePercentage']
    },
    {
      id: 'qualified-personal-residence-trust',
      name: 'Qualified Personal Residence Trust',
      description: 'Transfer your home while retaining use during your lifetime',
      icon: '🏡',
      color: 'from-red-500 to-red-600',
      requiredFields: ['grantorName', 'grantorAddress', 'propertyAddress', 'propertyValue', 'retentionPeriod']
    }
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setFormData({});
    setGenerationStatus('');
    setValidationErrors({});
    
    // Pre-fill form with selected client data if available
    if (selectedClient) {
      const client = clients.find(c => c.id === selectedClient);
      if (client) {
        prefillFormWithClient(client);
      }
    }
  };

  const prefillFormWithClient = (client) => {
    const baseData = {
      grantorName: client.name || '',
      grantorAddress: client.address || '',
      grantorPhone: client.phone || '',
      grantorEmail: client.email || '',
      trustAmount: client.netWorth ? `$${client.netWorth.toLocaleString()}` : '',
      beneficiaries: client.familySize ? client.familySize.toString() : '1'
    };

    // Add template-specific fields
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      switch (template.id) {
        case 'special-needs-trust':
          baseData.beneficiaryName = client.name || '';
          baseData.specialNeedsDescription = '';
          break;
        case 'charitable-remainder-trust':
          baseData.charityName = '';
          baseData.incomePercentage = '5';
          break;
        case 'qualified-personal-residence-trust':
          baseData.propertyAddress = client.address || '';
          baseData.propertyValue = client.netWorth ? `$${client.netWorth.toLocaleString()}` : '';
          baseData.retentionPeriod = '10';
          break;
      }
    }

    setFormData(baseData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
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

  const handleClientSelect = (clientId) => {
    setSelectedClient(clientId);
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        prefillFormWithClient(client);
      }
    } else {
      setFormData({});
    }
  };

  const validateForm = () => {
    const errors = {};
    const template = templates.find(t => t.id === selectedTemplate);
    
    if (!selectedTemplate) {
      errors.template = 'Please select a trust template';
    }
    
    if (!selectedClient) {
      errors.client = 'Please select a client';
    }
    
    if (template) {
      template.requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
          errors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
        }
      });
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateDocument = async () => {
    if (!validateForm()) {
      setGenerationStatus('Please fix the errors above before generating the document');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('Generating your trust document...');

    try {
      const client = clients.find(c => c.id === selectedClient);
      if (!client) {
        throw new Error('Client not found');
      }

      // Generate PDF
      const pdf = pdfGenerator.generateTrustDocument(selectedTemplate, formData, client);
      
      // Create document record
      const document = {
        id: Date.now().toString(),
        templateId: selectedTemplate,
        clientId: selectedClient,
        clientName: client.name,
        formData: formData,
        generatedAt: new Date().toISOString(),
        status: 'Generated',
        fileName: `${selectedTemplate.replace(/-/g, '_')}_${client.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      };

      // Save document
      dataManager.generateDocument(document);
      
      // Update documents list
      setDocuments(prev => [document, ...prev]);
      
      // Set success status
      setGenerationStatus('Document generated successfully!');
      
      // Auto-download the PDF
      pdf.save(document.fileName);
      
      // Clear form after successful generation
      setTimeout(() => {
        setFormData({});
        setSelectedTemplate('');
        setSelectedClient('');
        setGenerationStatus('');
      }, 3000);

    } catch (error) {
      console.error('Error generating document:', error);
      setGenerationStatus('Error generating document. Please try again or contact support.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewDocument = async () => {
    if (!validateForm()) {
      setGenerationStatus('Please fix the errors above before previewing the document');
      return;
    }

    try {
      const client = clients.find(c => c.id === selectedClient);
      if (!client) {
        throw new Error('Client not found');
      }

      // Generate preview (this could be a simplified version)
      setPreviewDocument({
        templateId: selectedTemplate,
        clientName: client.name,
        formData: formData,
        preview: true
      });
      setShowPreview(true);
    } catch (error) {
      console.error('Error previewing document:', error);
      setGenerationStatus('Error previewing document. Please try again.');
    }
  };

  const getTemplateIcon = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.icon : '📄';
  };

  const getTemplateColor = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.color : 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trust Document Generator</h1>
              <p className="text-gray-600">Create legally compliant trust documents in minutes, not weeks</p>
            </div>
          </div>
          
          {/* Status Message */}
          {generationStatus && (
            <div className={`p-4 rounded-xl border ${
              generationStatus.includes('Error') 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : generationStatus.includes('successfully') 
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              {generationStatus}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Template Selection & Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Template Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">1. Select Trust Template</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {validationErrors.template && (
                <p className="text-red-600 text-sm mt-2">{validationErrors.template}</p>
              )}
            </div>

            {/* Client Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">2. Select Client</h2>
              <div className="space-y-4">
                <select
                  value={selectedClient}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.trustType || 'No trust type specified'}
                    </option>
                  ))}
                </select>
                {validationErrors.client && (
                  <p className="text-red-600 text-sm">{validationErrors.client}</p>
                )}
              </div>
            </div>

            {/* Document Form */}
            {selectedTemplate && selectedClient && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">3. Document Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Basic Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grantor Name *
                      </label>
                      <input
                        type="text"
                        value={formData.grantorName || ''}
                        onChange={(e) => handleInputChange('grantorName', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.grantorName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Full legal name"
                      />
                      {validationErrors.grantorName && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.grantorName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grantor Address *
                      </label>
                      <textarea
                        value={formData.grantorAddress || ''}
                        onChange={(e) => handleInputChange('grantorAddress', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.grantorAddress ? 'border-red-300' : 'border-gray-300'
                        }`}
                        rows={3}
                        placeholder="Full legal address"
                      />
                      {validationErrors.grantorAddress && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.grantorAddress}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trust Amount *
                      </label>
                      <input
                        type="text"
                        value={formData.trustAmount || ''}
                        onChange={(e) => handleInputChange('trustAmount', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.trustAmount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="$100,000"
                      />
                      {validationErrors.trustAmount && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.trustAmount}</p>
                      )}
                    </div>
                  </div>

                  {/* Additional Fields */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Additional Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Beneficiaries *
                      </label>
                      <input
                        type="number"
                        value={formData.beneficiaries || ''}
                        onChange={(e) => handleInputChange('beneficiaries', e.target.value)}
                        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.beneficiaries ? 'border-red-300' : 'border-gray-300'
                        }`}
                        min="1"
                        placeholder="1"
                      />
                      {validationErrors.beneficiaries && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.beneficiaries}</p>
                      )}
                    </div>

                    {/* Template-specific fields */}
                    {selectedTemplate === 'irrevocable-life-insurance-trust' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Insurance Policy Number
                        </label>
                        <input
                          type="text"
                          value={formData.insurancePolicy || ''}
                          onChange={(e) => handleInputChange('insurancePolicy', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Policy number"
                        />
                      </div>
                    )}

                    {selectedTemplate === 'special-needs-trust' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Beneficiary Name *
                          </label>
                          <input
                            type="text"
                            value={formData.beneficiaryName || ''}
                            onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              validationErrors.beneficiaryName ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Beneficiary's full name"
                          />
                          {validationErrors.beneficiaryName && (
                            <p className="text-red-600 text-sm mt-1">{validationErrors.beneficiaryName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Special Needs Description *
                          </label>
                          <textarea
                            value={formData.specialNeedsDescription || ''}
                            onChange={(e) => handleInputChange('specialNeedsDescription', e.target.value)}
                            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              validationErrors.specialNeedsDescription ? 'border-red-300' : 'border-gray-300'
                            }`}
                            rows={3}
                            placeholder="Describe the special needs or disabilities"
                          />
                          {validationErrors.specialNeedsDescription && (
                            <p className="text-red-600 text-sm mt-1">{validationErrors.specialNeedsDescription}</p>
                          )}
                        </div>
                      </>
                    )}

                    {selectedTemplate === 'charitable-remainder-trust' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Charity Name *
                          </label>
                          <input
                            type="text"
                            value={formData.charityName || ''}
                            onChange={(e) => handleInputChange('charityName', e.target.value)}
                            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              validationErrors.charityName ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Charity or organization name"
                          />
                          {validationErrors.charityName && (
                            <p className="text-red-600 text-sm mt-1">{validationErrors.charityName}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Income Percentage *
                          </label>
                          <input
                            type="number"
                            value={formData.incomePercentage || ''}
                            onChange={(e) => handleInputChange('incomePercentage', e.target.value)}
                            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              validationErrors.incomePercentage ? 'border-red-300' : 'border-gray-300'
                            }`}
                            min="1"
                            max="20"
                            placeholder="5"
                          />
                          {validationErrors.incomePercentage && (
                            <p className="text-red-600 text-sm mt-1">{validationErrors.incomePercentage}</p>
                          )}
                        </div>
                      </>
                    )}

                    {selectedTemplate === 'qualified-personal-residence-trust' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Property Address *
                          </label>
                          <textarea
                            value={formData.propertyAddress || ''}
                            onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              validationErrors.propertyAddress ? 'border-red-300' : 'border-gray-300'
                            }`}
                            rows={2}
                            placeholder="Property address"
                          />
                          {validationErrors.propertyAddress && (
                            <p className="text-red-600 text-sm mt-1">{validationErrors.propertyAddress}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Property Value *
                          </label>
                          <input
                            type="text"
                            value={formData.propertyValue || ''}
                            onChange={(e) => handleInputChange('propertyValue', e.target.value)}
                            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              validationErrors.propertyValue ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="$500,000"
                          />
                          {validationErrors.propertyValue && (
                            <p className="text-red-600 text-sm mt-1">{validationErrors.propertyValue}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={handlePreviewDocument}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                  
                  <button
                    onClick={generateDocument}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    {isGenerating ? (
                      <>
                        <Clock className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        <span>Generate Document</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recent Documents & Quick Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Documents</span>
                  <span className="font-semibold text-gray-900">{documents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Clients</span>
                  <span className="font-semibold text-gray-900">{clients.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-gray-900">
                    {documents.filter(d => {
                      const docDate = new Date(d.generatedAt);
                      const now = new Date();
                      return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
              <div className="space-y-3">
                {documents.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="text-2xl">{getTemplateIcon(doc.templateId)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doc.clientName}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {templates.find(t => t.id === doc.templateId)?.name || 'Unknown Template'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          // Re-download functionality
                          const client = clients.find(c => c.id === doc.clientId);
                          if (client) {
                            const pdf = pdfGenerator.generateTrustDocument(doc.templateId, doc.formData, client);
                            pdf.save(doc.fileName);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No documents generated yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustDocumentGenerator;
