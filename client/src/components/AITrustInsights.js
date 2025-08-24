import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiConfig from '../config/api';

const AITrustInsights = ({ trustId, onInsightsLoaded }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchAIInsights = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use real API call with proper base URL
      const response = await fetch(`${apiConfig.baseURL}/api/ai/trust/${trustId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI insights');
      }

      const data = await response.json();
      setInsights(data.insights);
      if (onInsightsLoaded) {
        onInsightsLoaded(data.insights);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [trustId, token, onInsightsLoaded]);

  useEffect(() => {
    if (trustId && token) {
      fetchAIInsights();
    }
  }, [trustId, token, fetchAIInsights]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading AI Insights</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchAIInsights}
          className="mt-4 bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const getHealthColor = (health) => {
    switch (health) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Fair': return 'text-yellow-600 bg-yellow-100';
      case 'Poor': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };



  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Trust Health */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-in-up">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">AI Trust Insights</h3>
              <p className="text-gray-600 mt-2">Real-time analysis and intelligent recommendations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-6 py-3 rounded-full text-lg font-semibold ${getHealthColor(insights.overallScore)}`}>
                {insights.overallHealth}
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getHealthColor(insights.overallScore)}`}>
                  {insights.overallScore}/100
                </div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Risk Analysis</h3>
              <p className="text-gray-600">Comprehensive risk assessment and mitigation strategies</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Risk Score */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-red-900">Risk Score</h4>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  insights.riskAnalysis.riskLevel === 'Critical' ? 'bg-red-500 text-white' :
                  insights.riskAnalysis.riskLevel === 'High' ? 'bg-orange-500 text-white' :
                  insights.riskAnalysis.riskLevel === 'Medium' ? 'bg-yellow-500 text-white' :
                  'bg-green-500 text-white'
                }`}>
                  {insights.riskAnalysis.riskLevel}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-900 mb-2">{insights.riskAnalysis.riskScore}/100</div>
                <div className="w-full bg-red-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${insights.riskAnalysis.riskScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h4>
              <div className="space-y-3">
                {insights.riskAnalysis.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Recommendations */}
          {insights.riskAnalysis.recommendations.length > 0 && (
            <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-red-900 mb-4">Risk Mitigation Recommendations</h4>
              <div className="space-y-3">
                {insights.riskAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-red-800">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimization Analysis */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Optimization Analysis</h3>
              <p className="text-gray-600">Efficiency improvements and potential savings</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Optimization Score */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-green-900">Optimization Score</h4>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  insights.optimizationAnalysis.optimizationLevel === 'Excellent' ? 'bg-green-500 text-white' :
                  insights.optimizationAnalysis.optimizationLevel === 'Good' ? 'bg-blue-500 text-white' :
                  insights.optimizationAnalysis.optimizationLevel === 'Fair' ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {insights.optimizationAnalysis.optimizationLevel}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-900 mb-2">{insights.optimizationAnalysis.optimizationScore}/100</div>
                <div className="w-full bg-green-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${insights.optimizationAnalysis.optimizationScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Potential Savings */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Potential Savings</h4>
              {insights.optimizationAnalysis.potentialSavings > 0 ? (
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    ${insights.optimizationAnalysis.potentialSavings.toLocaleString()}
                  </div>
                  <div className="text-gray-600">Annual potential savings</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-500 mb-2">Optimized</div>
                  <div className="text-gray-600">No additional savings identified</div>
                </div>
              )}
            </div>
          </div>

          {/* Optimization Recommendations */}
          {insights.optimizationAnalysis.recommendations.length > 0 && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-4">Optimization Recommendations</h4>
              <div className="space-y-3">
                {insights.optimizationAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-green-800">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compliance Analysis */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Compliance Analysis</h3>
              <p className="text-gray-600">Regulatory timeline and compliance planning</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Last Compliance Check */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-sm font-medium text-blue-600 mb-2">Last Compliance Check</h4>
              <div className="text-2xl font-bold text-blue-900">
                {insights.complianceAnalysis.daysSinceLastCheck} days ago
              </div>
              <div className="text-sm text-blue-600 mt-1">
                {new Date(insights.complianceAnalysis.lastComplianceCheck).toLocaleDateString()}
              </div>
            </div>

            {/* Next Compliance Check */}
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
              <h4 className="text-sm font-medium text-indigo-600 mb-2">Next Compliance Check</h4>
              <div className="text-2xl font-bold text-indigo-900">
                {insights.complianceAnalysis.daysUntilNextCheck} days
              </div>
              <div className="text-sm text-indigo-600 mt-1">
                {new Date(insights.complianceAnalysis.nextComplianceCheck).toLocaleDateString()}
              </div>
            </div>

            {/* Compliance Priority */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Priority Level</h4>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold text-center ${
                insights.complianceAnalysis.compliancePriority === 'high' ? 'bg-red-100 text-red-800' :
                insights.complianceAnalysis.compliancePriority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {insights.complianceAnalysis.compliancePriority.charAt(0).toUpperCase() + insights.complianceAnalysis.compliancePriority.slice(1)}
              </div>
            </div>
          </div>

          {/* Compliance Recommendations */}
          {insights.complianceAnalysis.recommendations.length > 0 && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-4">Compliance Recommendations</h4>
              <div className="space-y-3">
                {insights.complianceAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-blue-800">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Priority Actions */}
      {insights.priorityActions && insights.priorityActions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Priority Actions</h3>
                <p className="text-gray-600">Immediate next steps and timelines</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-4">
              {insights.priorityActions.map((action, index) => (
                <div key={index} className={`flex items-center justify-between p-6 rounded-xl border ${
                  action.priority === 'High' ? 'bg-red-50 border-red-200' :
                  action.priority === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      action.priority === 'High' ? 'bg-red-500' :
                      action.priority === 'Medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{action.action}</h4>
                      <p className="text-gray-600 text-sm">{action.description}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    action.priority === 'High' ? 'bg-red-100 text-red-800' :
                    action.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {action.timeline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generated Timestamp */}
      <div className="text-center text-sm text-gray-500">
        Insights generated on {new Date(insights.generatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default AITrustInsights;
