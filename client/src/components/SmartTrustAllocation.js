import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Shield, Users, DollarSign, ArrowRight, CheckCircle } from 'lucide-react';

const SmartTrustAllocation = () => {
  const [userProfile, setUserProfile] = useState({
    age: 35,
    income: '75000-100000',
    familySize: 3,
    riskTolerance: 'moderate',
    goals: ['retirement', 'education', 'legacy'],
    timeHorizon: '20-30'
  });

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Mock recommendation engine
  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const recs = {
        conservative: {
          name: 'Conservative Growth',
          description: 'Focus on wealth preservation with steady, reliable growth',
          allocation: {
            'Revocable Living Trust': 60,
            'Charitable Trust': 25,
            'Special Needs Trust': 15
          },
          expectedReturn: '4-6%',
          riskLevel: 'Low',
          timeHorizon: '15-20 years',
          benefits: ['Tax efficiency', 'Flexibility', 'Charitable giving']
        },
        moderate: {
          name: 'Balanced Growth',
          description: 'Balanced approach for steady growth with moderate risk',
          allocation: {
            'Revocable Living Trust': 40,
            'Irrevocable Trust': 40,
            'Charitable Trust': 20
          },
          expectedReturn: '6-8%',
          riskLevel: 'Medium',
          timeHorizon: '20-25 years',
          benefits: ['Growth potential', 'Tax advantages', 'Asset protection']
        },
        aggressive: {
          name: 'Growth Focused',
          description: 'Maximize growth potential with higher risk tolerance',
          allocation: {
            'Revocable Living Trust': 30,
            'Irrevocable Trust': 50,
            'Special Needs Trust': 20
          },
          expectedReturn: '8-12%',
          riskLevel: 'High',
          timeHorizon: '25-30 years',
          benefits: ['Maximum growth', 'Advanced strategies', 'Legacy building']
        }
      };

      setRecommendations(recs);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecommendationForProfile = () => {
    if (!recommendations) return null;
    
    // Simple logic to determine recommendation based on profile
    if (userProfile.riskTolerance === 'conservative') return recommendations.conservative;
    if (userProfile.riskTolerance === 'aggressive') return recommendations.aggressive;
    return recommendations.moderate;
  };

  const currentRecommendation = getRecommendationForProfile();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="h-10 w-10 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Smart Trust Allocation
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          AI-powered recommendations for optimal trust portfolio allocation. 
          Get personalized strategies based on your goals and risk tolerance.
        </p>
      </div>

      {/* User Profile Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Age</p>
            <p className="font-semibold text-gray-900">{userProfile.age}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Income</p>
            <p className="font-semibold text-gray-900">${userProfile.income.split('-')[0]}k+</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Family</p>
            <p className="font-semibold text-gray-900">{userProfile.familySize}</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <Shield className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Risk</p>
            <p className="font-semibold text-gray-900 capitalize">{userProfile.riskTolerance}</p>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <Target className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Goals</p>
            <p className="font-semibold text-gray-900">{userProfile.goals.length}</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Timeline</p>
            <p className="font-semibold text-gray-900">{userProfile.timeHorizon.split('-')[0]}+y</p>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Profile</h3>
          <p className="text-gray-600">Our AI is crafting personalized trust recommendations...</p>
        </div>
      ) : currentRecommendation ? (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {currentRecommendation.name}
              </h2>
              <p className="text-gray-600">{currentRecommendation.description}</p>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              {showDetails ? 'Hide Details' : 'View Details'}
              <ArrowRight className={`h-4 w-4 ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Expected Return</p>
              <p className="text-xl font-bold text-green-600">{currentRecommendation.expectedReturn}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Risk Level</p>
              <p className={`text-xl font-bold px-3 py-1 rounded-full text-sm ${getRiskColor(currentRecommendation.riskLevel)}`}>
                {currentRecommendation.riskLevel}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Time Horizon</p>
              <p className="text-xl font-bold text-gray-900">{currentRecommendation.timeHorizon}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Trust Types</p>
              <p className="text-xl font-bold text-gray-900">{Object.keys(currentRecommendation.allocation).length}</p>
            </div>
          </div>

          {/* Allocation Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Allocation</h3>
            <div className="space-y-3">
              {Object.entries(currentRecommendation.allocation).map(([trustType, percentage]) => (
                <div key={trustType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{trustType}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentRecommendation.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-900">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              Apply This Allocation
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Customize Allocation
            </button>
          </div>
        </div>
      ) : null}

      {/* Alternative Strategies */}
      {recommendations && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(recommendations).map(([key, strategy]) => (
              <div key={key} className={`p-4 border-2 rounded-lg transition-all duration-300 ${
                currentRecommendation?.name === strategy.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}>
                <h4 className="font-semibold text-gray-900 mb-2">{strategy.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return:</span>
                    <span className="font-medium text-gray-900">{strategy.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(strategy.riskLevel)}`}>
                      {strategy.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Content */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mt-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Why Smart Allocation Matters
          </h3>
          <p className="text-gray-600 mb-4 max-w-3xl mx-auto">
            Our advanced AI analyzes your unique situation to recommend the perfect trust mix. 
            Consider your age, family size, income, and goals to create a strategy that grows with you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <p className="font-medium text-gray-900">Personalized Strategy</p>
              <p className="text-purple-600">AI-powered recommendations</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-medium text-gray-900">Risk Management</p>
              <p className="text-purple-600">Balanced approach to growth</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-medium text-gray-900">Goal Alignment</p>
              <p className="text-purple-600">Trusts that match your vision</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartTrustAllocation;
