import React from 'react';
import AIDashboard from '../components/AIDashboard';
import { Brain, TrendingUp, Shield, Target, Zap, BarChart3 } from 'lucide-react';

const AIInsights = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Trust Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage advanced artificial intelligence to optimize your trust portfolio, 
            predict risks, and maximize wealth preservation efficiency.
          </p>
        </div>

        {/* AI Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Risk Intelligence</h3>
            </div>
            <p className="text-gray-600">
              AI-powered risk assessment that continuously monitors your trust portfolio 
              and alerts you to potential issues before they become problems.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Optimization Engine</h3>
            </div>
            <p className="text-gray-600">
              Smart algorithms that identify inefficiencies and recommend strategies 
              to save thousands annually in taxes and fees.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Compliance Predictor</h3>
            </div>
            <p className="text-gray-600">
              Never miss a compliance deadline again. AI predicts when you need 
              to take action and prioritizes tasks by urgency.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Smart Allocation</h3>
            </div>
            <p className="text-gray-600">
              AI-optimized beneficiary allocation strategies that balance 
              family harmony with tax efficiency and risk management.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Real-time Alerts</h3>
            </div>
            <p className="text-gray-600">
              Instant notifications for urgent actions, market opportunities, 
              and compliance deadlines that require immediate attention.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Portfolio Analytics</h3>
            </div>
            <p className="text-gray-600">
              Comprehensive portfolio health scoring and performance metrics 
              that give you a complete picture of your wealth preservation strategy.
            </p>
          </div>
        </div>

        {/* AI Dashboard */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Live AI Portfolio Analysis</h2>
              <p className="text-gray-600">Real-time insights powered by advanced machine learning</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold rounded-full">
                AI Powered
              </div>
              <div className="px-3 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                Live Data
              </div>
            </div>
          </div>
          <AIDashboard />
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Why AI-Powered Trust Management?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Traditional trust management is reactive and manual. Our AI platform is proactive, 
              intelligent, and continuously optimizing your wealth preservation strategy.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">23%</div>
                <div className="text-purple-100">Average Tax Savings</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">40%</div>
                <div className="text-purple-100">Risk Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-purple-100">Compliance Success</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience AI-Powered Trust Management?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the future of wealth preservation. Our AI platform continuously learns 
            and adapts to provide you with the most intelligent trust management available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
              Start AI Analysis
            </button>
            <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
