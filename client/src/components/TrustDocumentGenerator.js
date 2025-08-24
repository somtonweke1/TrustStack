import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock } from 'lucide-react';
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
  const [showGuidedFlow, setShowGuidedFlow] = useState(false);

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
        default:
          // No additional fields for this template
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



  const getTemplateIcon = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.icon : '📄';
  };



  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 animate-slide-in-down">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trust Document Generator</h1>
              <p className="text-gray-600">Create legally compliant trust documents in minutes</p>
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

        {/* Gusto Strategy: Family Legacy OS Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Document Vault</h3>
            </div>
            <p className="text-blue-700 text-sm">Secure storage for all family legal documents with AI-powered organization</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-900">Family Education</h3>
            </div>
            <p className="text-green-700 text-sm">Interactive learning modules for family members about wealth management</p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-purple-900">Advisor Network</h3>
            </div>
            <p className="text-purple-700 text-sm">Connect with vetted financial, legal, and tax professionals</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Template Selection & Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Template Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-fade-in-up">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">1. Select Trust Template</h2>
              
              {/* TurboTax Strategy: Guided Q&A Flow */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">Guided Trust Planning</h3>
                </div>
                <p className="text-blue-700 mb-4">Answer a few questions and we'll recommend the perfect trust structure for your specific assets</p>
                
                <button 
                  onClick={() => setShowGuidedFlow(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Guided Planning
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up">
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
      
      {/* TurboTax Strategy: Guided Planning Modal */}
      {showGuidedFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Guided Trust Planning</h2>
              <button 
                onClick={() => setShowGuidedFlow(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Question 1: What type of assets do you own?</h3>
                <div className="space-y-2">
                  {['Real Estate', 'Business Interests', 'Investment Portfolio', 'Life Insurance', 'Mixed Assets'].map((asset) => (
                    <label key={asset} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-blue-800">{asset}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Question 2: What are your primary goals?</h3>
                <div className="space-y-2">
                  {['Asset Protection', 'Tax Minimization', 'Succession Planning', 'Charitable Giving', 'Wealth Transfer'].map((goal) => (
                    <label key={goal} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      <span className="text-green-800">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">Question 3: Family structure considerations?</h3>
                <div className="space-y-2">
                  {['Minor Children', 'Blended Family', 'Business Partners', 'International Assets', 'Multiple Generations'].map((consideration) => (
                    <label key={consideration} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      <span className="text-purple-800">{consideration}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowGuidedFlow(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // AI recommendation logic would go here
                    setShowGuidedFlow(false);
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Get AI Recommendation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustDocumentGenerator;
