// Real Data Management System - No More Hardcoded Data!
class DataManager {
  constructor() {
    this.storagePrefix = 'truststack_';
    this.initializeStorage();
  }

  // Initialize storage with default structure if first time
  initializeStorage() {
    if (!this.getData('initialized')) {
      const defaultData = {
        initialized: true,
        user: {
          id: this.generateId(),
          name: 'Professional User',
          email: 'advisor@truststack.com',
          subscription: 'professional',
          joinDate: new Date().toISOString(),
          settings: {
            notifications: true,
            theme: 'light',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        },
        clients: [],
        documents: [],
        activities: [],
        metrics: {
          revenue: { monthly: [], targets: { monthly: 20000, annual: 240000 } },
          clients: { growth: [], retention: 94.2 },
          documents: { generated: [], templates: [] }
        },
        deadlines: [],
        templates: this.getDefaultTemplates()
      };
      
      Object.keys(defaultData).forEach(key => {
        this.setData(key, defaultData[key]);
      });
    }
  }

  // Core data operations
  getData(key) {
    try {
      const data = localStorage.getItem(`${this.storagePrefix}${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  }

  setData(key, value) {
    try {
      localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting data:', error);
      return false;
    }
  }

  // Client Management
  addClient(clientData) {
    const clients = this.getData('clients') || [];
    const newClient = {
      id: this.generateId(),
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      documents: [],
      activities: [],
      nextReview: this.calculateNextReview(clientData.trustType)
    };
    
    clients.push(newClient);
    this.setData('clients', clients);
    this.logActivity('client_added', `New client added: ${newClient.name}`, newClient.id);
    return newClient;
  }

  updateClient(clientId, updates) {
    const clients = this.getData('clients') || [];
    const index = clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates, updatedAt: new Date().toISOString() };
      this.setData('clients', clients);
      this.logActivity('client_updated', `Client updated: ${clients[index].name}`, clientId);
      return clients[index];
    }
    return null;
  }

  getClients() {
    return this.getData('clients') || [];
  }

  // Document Management
  generateDocument(templateId, clientId, formData) {
    const documents = this.getData('documents') || [];
    const client = this.getClients().find(c => c.id === clientId);
    const template = this.getDefaultTemplates().find(t => t.id === templateId);
    
    const newDocument = {
      id: this.generateId(),
      templateId,
      clientId,
      clientName: client?.name || 'Unknown Client',
      templateName: template?.name || 'Unknown Template',
      formData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      size: this.calculateDocumentSize(formData),
      downloadCount: 0
    };
    
    documents.push(newDocument);
    this.setData('documents', documents);
    this.logActivity('document_generated', `Document generated: ${template?.name}`, clientId);
    this.updateMetrics('documents', 1);
    return newDocument;
  }

  getDocuments() {
    return this.getData('documents') || [];
  }

  // Activity Logging
  logActivity(type, description, clientId = null) {
    const activities = this.getData('activities') || [];
    const activity = {
      id: this.generateId(),
      type,
      description,
      clientId,
      timestamp: new Date().toISOString(),
      status: type.includes('error') ? 'error' : 'completed'
    };
    
    activities.unshift(activity); // Add to beginning
    activities.splice(50); // Keep only last 50 activities
    this.setData('activities', activities);
  }

  getRecentActivities(limit = 10) {
    const activities = this.getData('activities') || [];
    return activities.slice(0, limit);
  }

  // Metrics and Analytics
  updateMetrics(category, value) {
    const metrics = this.getData('metrics') || {};
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    switch (category) {
      case 'revenue':
        if (!metrics.revenue) metrics.revenue = { monthly: [], targets: { monthly: 20000, annual: 240000 } };
        const existingMonth = metrics.revenue.monthly.find(m => m.month === currentMonth);
        if (existingMonth) {
          existingMonth.amount += value;
        } else {
          metrics.revenue.monthly.push({ month: currentMonth, amount: value });
        }
        break;
        
      case 'documents':
        if (!metrics.documents) metrics.documents = { generated: [] };
        const docMonth = metrics.documents.generated.find(m => m.month === currentMonth);
        if (docMonth) {
          docMonth.count += value;
        } else {
          metrics.documents.generated.push({ month: currentMonth, count: value });
        }
        break;
      default:
        // No action for unknown categories
        break;
    }
    
    this.setData('metrics', metrics);
  }

  getMetrics() {
    const metrics = this.getData('metrics') || {};
    const clients = this.getClients();
    const documents = this.getDocuments();
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Calculate real metrics
    return {
      clients: {
        total: clients.length,
        active: clients.filter(c => c.status === 'active').length,
        thisMonth: clients.filter(c => c.createdAt?.slice(0, 7) === currentMonth).length
      },
      documents: {
        total: documents.length,
        thisMonth: documents.filter(d => d.createdAt?.slice(0, 7) === currentMonth).length
      },
      revenue: metrics.revenue || { monthly: [], targets: { monthly: 20000, annual: 240000 } }
    };
  }

  // Deadline Management
  addDeadline(clientId, type, dueDate, priority = 'medium') {
    const deadlines = this.getData('deadlines') || [];
    const client = this.getClients().find(c => c.id === clientId);
    
    const deadline = {
      id: this.generateId(),
      clientId,
      clientName: client?.name || 'Unknown Client',
      type,
      dueDate,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    deadlines.push(deadline);
    this.setData('deadlines', deadlines);
    return deadline;
  }

  getUpcomingDeadlines(days = 30) {
    const deadlines = this.getData('deadlines') || [];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return deadlines
      .filter(d => d.status === 'pending' && new Date(d.dueDate) <= futureDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  // Utility functions
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  calculateNextReview(trustType) {
    const months = {
      'Revocable Living Trust': 12,
      'Irrevocable Life Insurance Trust': 6,
      'Special Needs Trust': 3,
      'Charitable Remainder Trust': 6,
      'Qualified Personal Residence Trust': 12
    };
    
    const reviewMonths = months[trustType] || 12;
    const nextReview = new Date();
    nextReview.setMonth(nextReview.getMonth() + reviewMonths);
    return nextReview.toISOString();
  }

  calculateDocumentSize(formData) {
    // Estimate document size based on form data complexity
    const baseSize = 2.1; // MB
    const complexityFactor = Object.keys(formData).length * 0.1;
    return `${(baseSize + complexityFactor).toFixed(1)} MB`;
  }

  getDefaultTemplates() {
    return [
      {
        id: 'revocable-living-trust',
        name: 'Revocable Living Trust',
        description: 'Standard revocable trust for estate planning',
        category: 'Estate Planning',
        complexity: 'medium',
        estimatedTime: '15-20 minutes'
      },
      {
        id: 'irrevocable-life-insurance',
        name: 'Irrevocable Life Insurance Trust',
        description: 'For life insurance policy management',
        category: 'Life Insurance',
        complexity: 'high',
        estimatedTime: '25-30 minutes'
      },
      {
        id: 'charitable-remainder',
        name: 'Charitable Remainder Trust',
        description: 'For charitable giving with income benefits',
        category: 'Charitable Giving',
        complexity: 'high',
        estimatedTime: '20-25 minutes'
      },
      {
        id: 'special-needs',
        name: 'Special Needs Trust',
        description: 'For beneficiaries with disabilities',
        category: 'Special Needs',
        complexity: 'high',
        estimatedTime: '30-35 minutes'
      },
      {
        id: 'qualified-personal-residence',
        name: 'Qualified Personal Residence Trust',
        description: 'For primary residence transfer',
        category: 'Real Estate',
        complexity: 'high',
        estimatedTime: '20-25 minutes'
      }
    ];
  }

  // Export/Import functionality for data portability
  exportData() {
    const allData = {};
    const keys = ['clients', 'documents', 'activities', 'metrics', 'deadlines', 'user'];
    
    keys.forEach(key => {
      allData[key] = this.getData(key);
    });
    
    return JSON.stringify(allData, null, 2);
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      Object.keys(data).forEach(key => {
        this.setData(key, data[key]);
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Search functionality
  searchClients(query) {
    const clients = this.getClients();
    const lowerQuery = query.toLowerCase();
    
    return clients.filter(client => 
      client.name?.toLowerCase().includes(lowerQuery) ||
      client.email?.toLowerCase().includes(lowerQuery) ||
      client.trustType?.toLowerCase().includes(lowerQuery) ||
      client.notes?.toLowerCase().includes(lowerQuery)
    );
  }

  // Business Intelligence
  getBusinessInsights() {
    const clients = this.getClients();
    const documents = this.getDocuments();
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    return {
      clientAcquisition: {
        thisMonth: clients.filter(c => c.createdAt?.slice(0, 7) === currentMonth).length,
        averagePerMonth: clients.length / Math.max(1, this.getMonthsSinceStart())
      },
      documentEfficiency: {
        averagePerClient: documents.length / Math.max(1, clients.length),
        thisMonth: documents.filter(d => d.createdAt?.slice(0, 7) === currentMonth).length
      },
      upcomingDeadlines: this.getUpcomingDeadlines(7).length,
      recentActivity: this.getRecentActivities(5)
    };
  }

  getMonthsSinceStart() {
    const user = this.getData('user');
    if (!user?.joinDate) return 1;
    
    const start = new Date(user.joinDate);
    const now = new Date();
    return Math.max(1, Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 30)));
  }
}

// Singleton instance
const dataManagerInstance = new DataManager();
export default dataManagerInstance;
