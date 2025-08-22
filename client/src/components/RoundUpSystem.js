import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Target, Users, Shield, ArrowUpRight } from 'lucide-react';

const RoundUpSystem = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [roundUpAmount, setRoundUpAmount] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [selectedTrust, setSelectedTrust] = useState('');
  const [roundUpHistory, setRoundUpHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockTrusts = [
    { id: '1', name: 'Smith Family Trust', type: 'Revocable', balance: 125000 },
    { id: '2', name: 'Education Fund', type: 'Irrevocable', balance: 75000 },
    { id: '3', name: 'Charitable Giving', type: 'Charitable', balance: 50000 }
  ];

  const mockTransactions = [
    { id: 1, amount: 23.45, roundUp: 0.55, date: '2025-01-17', trust: 'Smith Family Trust' },
    { id: 2, amount: 67.89, roundUp: 0.11, date: '2025-01-16', trust: 'Education Fund' },
    { id: 3, amount: 12.99, roundUp: 0.01, date: '2025-01-15', trust: 'Smith Family Trust' },
    { id: 4, amount: 89.50, roundUp: 0.50, date: '2025-01-14', trust: 'Charitable Giving' }
  ];

  useEffect(() => {
    // Calculate total round-ups from mock data
    const total = mockTransactions.reduce((sum, tx) => sum + tx.roundUp, 0);
    setRoundUpAmount(total);
    setMonthlySavings(total * 30); // Estimate monthly savings
  }, []);

  const handleToggleRoundUp = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEnabled(!isEnabled);
      
      if (!isEnabled) {
        // Enable round-ups
        console.log('Round-up system enabled');
      } else {
        // Disable round-ups
        console.log('Round-up system disabled');
      }
    } catch (error) {
      console.error('Error toggling round-up system:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrustSelection = (trustId) => {
    setSelectedTrust(trustId);
  };

  const getTrustById = (id) => {
    return mockTrusts.find(trust => trust.id === id);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Round-Up System
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Automatically fund your trusts by rounding up everyday purchases. 
          Turn spare change into meaningful wealth for your family's future.
        </p>
      </div>

      {/* Main Control Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Round-Up Control</h2>
          <button
            onClick={handleToggleRoundUp}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isEnabled
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
            ) : isEnabled ? (
              'Disable Round-Ups'
            ) : (
              'Enable Round-Ups'
            )}
          </button>
        </div>

        {/* Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total Round-Ups</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(roundUpAmount)}</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Monthly Estimate</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlySavings)}</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`text-lg font-semibold ${isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
              {isEnabled ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>

      {/* Trust Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Trust for Round-Ups</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTrusts.map((trust) => (
            <div
              key={trust.id}
              onClick={() => handleTrustSelection(trust.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedTrust === trust.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{trust.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trust.type === 'Revocable' ? 'bg-blue-100 text-blue-800' :
                  trust.type === 'Irrevocable' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {trust.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Current Balance</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(trust.balance)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Round-Ups */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Round-Ups</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View All
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Round-up from {formatCurrency(transaction.amount)} purchase
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.date} • {transaction.trust}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">
                  +{formatCurrency(transaction.roundUp)}
                </p>
                <p className="text-sm text-gray-500">Added to trust</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mt-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            How Round-Ups Work
          </h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            When you make a purchase, we automatically round up to the nearest dollar and 
            invest the difference in your selected trust. Small amounts add up quickly!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <p className="font-medium text-gray-900">Coffee: $4.75</p>
              <p className="text-green-600">Round-up: $0.25</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-medium text-gray-900">Lunch: $12.30</p>
              <p className="text-green-600">Round-up: $0.70</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-medium text-gray-900">Gas: $45.67</p>
              <p className="text-green-600">Round-up: $0.33</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundUpSystem;
