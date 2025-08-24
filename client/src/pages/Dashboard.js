import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  TrendingUp, 
  Calculator,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Empty state - no hardcoded data
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [transitionData, setTransitionData] = useState(null);
  
  useEffect(() => {
    // Check if user has completed business assessment
    const assessmentData = localStorage.getItem('businessAssessment');
    if (assessmentData) {
      setHasCompletedAssessment(true);
      setTransitionData(JSON.parse(assessmentData));
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    const now = new Date();
    const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Yesterday';
    if (daysDiff < 7) return `${daysDiff} days ago`;
    return date.toLocaleDateString();
  };

  const getReadinessColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getReadinessLevel = (score) => {
    if (score >= 80) return 'Ready';
    if (score >= 60) return 'Getting There';
    if (score >= 40) return 'Needs Work';
    return 'Critical';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  TrustStack Dashboard
              </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.firstName || 'Business Owner'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                Help
              </button>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: Building2 },
              { id: 'strategy', name: 'Strategy Builder', icon: Calculator },
              { id: 'documents', name: 'Documents', icon: FileText },
              { id: 'network', name: 'Professional Network', icon: Users },
              { id: 'assessment', name: 'Assessment', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {!hasCompletedAssessment ? (
              // Empty State - No Assessment Completed
              <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-xl text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-6">Start Your Business Assessment</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Take our 15-minute diagnostic to discover your business transition risks and get a personalized readiness score.
                </p>
                <button 
                  onClick={() => setActiveTab('assessment')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Start Assessment
                </button>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-green-600" />
                </div>
                    <h3 className="font-semibold text-gray-900 mb-2">15 Minutes</h3>
                    <p className="text-sm text-gray-600">Quick and comprehensive assessment</p>
              </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calculator className="w-6 h-6 text-blue-600" />
              </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
                    <p className="text-sm text-gray-600">Get your readiness score immediately</p>
            </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-purple-600" />
          </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personalized Plan</h3>
                    <p className="text-sm text-gray-600">Custom roadmap for your business</p>
                </div>
                </div>
              </div>
            ) : (
              // Show Assessment Results
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Transition Readiness Score</h2>
                  <span className={`text-3xl font-bold ${getReadinessColor(transitionData?.readinessScore || 0)}`}>
                    {transitionData?.readinessScore || 0}/100
                  </span>
                </div>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        (transitionData?.readinessScore || 0) >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        (transitionData?.readinessScore || 0) >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        (transitionData?.readinessScore || 0) >= 40 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${transitionData?.readinessScore || 0}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Status: <span className="font-medium">{getReadinessLevel(transitionData?.readinessScore || 0)}</span>
                </p>
              </div>
            )}

            {hasCompletedAssessment && transitionData && (
              /* Key Metrics Grid - Only show if assessment completed */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tax Liability</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(transitionData.taxLiability || 0)}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center shadow-md">
                      <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
                  <div className="mt-4">
                    <span className="text-sm text-red-600 font-medium">{transitionData.taxRisk || 'Unknown'}</span>
          </div>
        </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
            <div>
                      <p className="text-sm font-medium text-gray-600">Liquidity Gap</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(transitionData.liquidityGap || 0)}</p>
            </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-md">
                      <Calculator className="h-6 w-6 text-orange-600" />
              </div>
            </div>
                  <div className="mt-4">
                    <span className="text-sm text-orange-600 font-medium">{transitionData.liquidityRisk || 'Unknown'}</span>
          </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                        <div>
                      <p className="text-sm font-medium text-gray-600">Successor Readiness</p>
                      <p className="text-2xl font-bold text-gray-900">{transitionData.successorReadiness || 0}%</p>
                        </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center shadow-md">
                      <Users className="h-6 w-6 text-yellow-600" />
                    </div>
                      </div>
                  <div className="mt-4">
                    <span className="text-sm text-yellow-600 font-medium">{transitionData.successorStatus || 'Unknown'}</span>
                      </div>
                    </div>
                    
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Document Completion</p>
                      <p className="text-2xl font-bold text-gray-900">{transitionData.documentCompletion || 0}%</p>
                      </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-blue-600 font-medium">{transitionData.documentStatus || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            )}

            {hasCompletedAssessment && transitionData?.activities && transitionData.activities.length > 0 && (
              /* Recent Activities - Only show if assessment completed and activities exist */
              <div className="bg-white rounded-xl border border-gray-200 shadow-xl">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Activities</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {transitionData.activities.map((activity) => (
                    <div key={activity.id} className="px-8 py-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(activity.status).split(' ')[1]} shadow-md`}>
                            {getStatusIcon(activity.status)}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                            <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                            {activity.status.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(new Date(activity.date))}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                      </div>
                      </div>
            )}

            {/* Quick Actions - Always show, but change based on assessment status */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {!hasCompletedAssessment ? (
                  <>
                    <button 
                      onClick={() => setActiveTab('assessment')}
                      className="flex items-center justify-center space-x-3 p-6 border-2 border-blue-200 bg-blue-50 rounded-xl hover:border-blue-300 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <FileText className="w-6 h-6 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Start Business Assessment</span>
                    </button>
                    <div className="flex items-center justify-center space-x-3 p-6 border-2 border-gray-200 bg-gray-50 rounded-xl opacity-50 cursor-not-allowed shadow-md">
                      <Calculator className="w-6 h-6 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Strategy Builder (Complete Assessment First)</span>
                      </div>
                    <div className="flex items-center justify-center space-x-3 p-6 border-2 border-gray-200 bg-gray-50 rounded-xl opacity-50 cursor-not-allowed shadow-md">
                      <Users className="w-6 h-6 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Professional Network (Complete Assessment First)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setActiveTab('strategy')}
                      className="flex items-center justify-center space-x-3 p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <Calculator className="w-6 h-6 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">Build Exit Strategy</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('documents')}
                      className="flex items-center justify-center space-x-3 p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <FileText className="w-6 h-6 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Generate Documents</span>
                            </button>
                    <button 
                      onClick={() => setActiveTab('network')}
                      className="flex items-center justify-center space-x-3 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <Users className="w-6 h-6 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Find Experts</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
        )}

                {activeTab === 'assessment' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Business Assessment</h2>
              <p className="text-gray-600 mb-8">Take our comprehensive 15-minute assessment to understand your business transition readiness.</p>
              
              {/* Assessment Form */}
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select revenue range</option>
                        <option value="under-1m">Under $1M</option>
                        <option value="1m-5m">$1M - $5M</option>
                        <option value="5m-25m">$5M - $25M</option>
                        <option value="over-25m">Over $25M</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Age</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select business age</option>
                        <option value="under-5">Under 5 years</option>
                        <option value="5-15">5-15 years</option>
                        <option value="15-30">15-30 years</option>
                        <option value="over-30">Over 30 years</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Succession Planning</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Do you have identified successors?</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="radio" name="successors" value="family" className="mr-3" />
                          <span>Yes, family members</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="successors" value="employees" className="mr-3" />
                          <span>Yes, key employees</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="successors" value="none" className="mr-3" />
                          <span>No identified successors</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Exit Timeline</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">When do you plan to exit?</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">Select timeline</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="uncertain">Uncertain</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    Complete Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Strategy Builder</h2>
              {!hasCompletedAssessment ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Assessment First</h3>
                  <p className="text-gray-600 mb-6">Take the business assessment to unlock personalized exit strategies.</p>
                  <button 
                    onClick={() => setActiveTab('assessment')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    Start Assessment
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-600 mb-8">Choose your exit pathway based on your assessment results.</p>
                  
                  {/* Three Strategy Paths */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="border border-blue-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Family Transfer</h3>
                      <p className="text-gray-600 mb-4">Keep it in the bloodline with proper governance and training.</p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Valuation discounts</li>
                        <li>• Training programs</li>
                        <li>• Family governance</li>
                      </ul>
                    </div>

                    <div className="border border-green-200 rounded-xl p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Strategic Sale</h3>
                      <p className="text-gray-600 mb-4">Maximize your payday with a third-party acquisition.</p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Business optimization</li>
                        <li>• M&A preparation</li>
                        <li>• Buyer identification</li>
                      </ul>
                    </div>

                    <div className="border border-purple-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Employee Buyout</h3>
                      <p className="text-gray-600 mb-4">Reward loyalty through ESOP or management buyout.</p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• ESOP feasibility</li>
                        <li>• Employee communication</li>
                        <li>• Financing structure</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Document Suite</h2>
              {!hasCompletedAssessment ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Assessment First</h3>
                  <p className="text-gray-600 mb-6">Take the business assessment to unlock document generation tools.</p>
                  <button 
                    onClick={() => setActiveTab('assessment')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    Start Assessment
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-600 mb-8">Generate essential legal documents for your business transition.</p>
                  
                  {/* Document Categories */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Estate Planning</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Business Will</span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Generate</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Trust Agreement</span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Generate</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Power of Attorney</span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Generate</button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Documents</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Buy-Sell Agreement</span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Generate</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Succession Plan</span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Generate</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">Employment Agreement</span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Generate</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            )}
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Professional Network</h2>
              {!hasCompletedAssessment ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Assessment First</h3>
                  <p className="text-gray-600 mb-6">Take the business assessment to access our vetted professional network.</p>
                  <button 
                    onClick={() => setActiveTab('assessment')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    Start Assessment
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-600 mb-8">Connect with pre-screened experts for your business transition.</p>
                  
                  {/* Professional Categories */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-xl p-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Calculator className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Valuation Experts</h3>
                      <p className="text-gray-600 text-sm mb-4">Certified business appraisers for accurate valuation.</p>
                      <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm">
                        Find Valuators
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">M&A Attorneys</h3>
                      <p className="text-gray-600 text-sm mb-4">Specialized lawyers for business transactions.</p>
                      <button className="w-full bg-green-50 text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm">
                        Find Attorneys
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tax Specialists</h3>
                      <p className="text-gray-600 text-sm mb-4">CPAs specializing in business exit tax strategy.</p>
                      <button className="w-full bg-purple-50 text-purple-600 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm">
                        Find Tax Experts
                      </button>
                    </div>
                  </div>
                </div>
              )}
        </div>
      </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

