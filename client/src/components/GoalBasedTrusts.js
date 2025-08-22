import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, DollarSign, Users, Gift, GraduationCap, Heart, Home, Car, CheckCircle, Plus } from 'lucide-react';

const GoalBasedTrusts = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Children\'s Education Fund',
      type: 'education',
      targetAmount: 100000,
      currentAmount: 45000,
      targetDate: '2030-06-15',
      priority: 'high',
      trustType: 'Irrevocable',
      icon: GraduationCap,
      color: 'blue',
      milestones: [
        { amount: 25000, reached: true, date: '2024-03-15' },
        { amount: 50000, reached: false, date: '2026-06-15' },
        { amount: 75000, reached: false, date: '2028-09-15' },
        { amount: 100000, reached: false, date: '2030-06-15' }
      ]
    },
    {
      id: 2,
      name: 'Retirement Legacy Trust',
      type: 'retirement',
      targetAmount: 500000,
      currentAmount: 125000,
      targetDate: '2040-12-31',
      priority: 'medium',
      trustType: 'Revocable',
      icon: Heart,
      color: 'green',
      milestones: [
        { amount: 100000, reached: true, date: '2023-08-20' },
        { amount: 250000, reached: false, date: '2030-06-15' },
        { amount: 375000, reached: false, date: '2035-03-20' },
        { amount: 500000, reached: false, date: '2040-12-31' }
      ]
    },
    {
      id: 3,
      name: 'Family Vacation Home',
      type: 'property',
      targetAmount: 750000,
      currentAmount: 180000,
      targetDate: '2035-08-15',
      priority: 'low',
      trustType: 'Revocable',
      icon: Home,
      color: 'purple',
      milestones: [
        { amount: 150000, reached: true, date: '2024-01-10' },
        { amount: 300000, reached: false, date: '2028-06-15' },
        { amount: 525000, reached: false, date: '2032-03-20' },
        { amount: 750000, reached: false, date: '2035-08-15' }
      ]
    }
  ]);

  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    type: 'education',
    targetAmount: '',
    targetDate: '',
    priority: 'medium',
    trustType: 'Revocable'
  });

  const goalTypes = [
    { value: 'education', label: 'Education', icon: GraduationCap, color: 'blue' },
    { value: 'retirement', label: 'Retirement', icon: Heart, color: 'green' },
    { value: 'property', label: 'Property', icon: Home, color: 'purple' },
    { value: 'business', label: 'Business', icon: TrendingUp, color: 'orange' },
    { value: 'charity', label: 'Charity', icon: Gift, color: 'red' },
    { value: 'vehicle', label: 'Vehicle', icon: Car, color: 'indigo' }
  ];

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTimeRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGoalTypeIcon = (type) => {
    const goalType = goalTypes.find(gt => gt.value === type);
    return goalType ? goalType.icon : Target;
  };

  const getGoalTypeColor = (type) => {
    const goalType = goalTypes.find(gt => gt.value === type);
    return goalType ? goalType.color : 'gray';
  };

  const handleCreateGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetDate) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        icon: getGoalTypeIcon(newGoal.type),
        color: getGoalTypeColor(newGoal.type),
        milestones: [
          { amount: newGoal.targetAmount * 0.25, reached: false, date: '' },
          { amount: newGoal.targetAmount * 0.5, reached: false, date: '' },
          { amount: newGoal.targetAmount * 0.75, reached: false, date: '' },
          { amount: newGoal.targetAmount, reached: false, date: '' }
        ]
      };
      
      setGoals([...goals, goal]);
      setNewGoal({ name: '', type: 'education', targetAmount: '', targetDate: '', priority: 'medium', trustType: 'Revocable' });
      setShowCreateGoal(false);
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

  const totalGoals = goals.length;
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = (totalCurrentAmount / totalTargetAmount) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-10 w-10 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Goal-Based Trusts
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Set financial goals and watch your trusts grow toward them. 
          Set specific targets and watch your wealth grow systematically toward your family's future.
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Overall Progress</h2>
          <button
            onClick={() => setShowCreateGoal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Active Goals</p>
            <p className="text-2xl font-bold text-gray-900">{totalGoals}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Target</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalTargetAmount)}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Current Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentAmount)}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-2xl font-bold text-gray-900">{overallProgress.toFixed(1)}%</p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {goals.map((goal) => {
          const IconComponent = goal.icon;
          const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
          const timeRemaining = getTimeRemaining(goal.targetDate);
          
          return (
            <div key={goal.id} className="bg-white rounded-xl shadow-lg p-6">
              {/* Goal Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-${goal.color}-100 rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`h-6 w-6 text-${goal.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-sm text-gray-600">{goal.trustType} Trust</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
              </div>

              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${goal.color}-500 h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{progress.toFixed(1)}% complete</p>
              </div>

              {/* Goal Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Target Date</p>
                  <p className="font-medium text-gray-900">{new Date(goal.targetDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time Remaining</p>
                  <p className={`font-medium ${timeRemaining === 'Overdue' ? 'text-red-600' : 'text-gray-900'}`}>
                    {timeRemaining}
                  </p>
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Milestones</h4>
                <div className="space-y-2">
                  {goal.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {milestone.reached ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                        )}
                        <span className="text-sm text-gray-600">
                          {formatCurrency(milestone.amount)}
                        </span>
                      </div>
                      {milestone.reached && (
                        <span className="text-xs text-green-600">
                          {milestone.date ? new Date(milestone.date).toLocaleDateString() : 'Reached'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Add Funds
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Goal Modal */}
      {showCreateGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Children's Education Fund"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {goalTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trust Type</label>
                  <select
                    value={newGoal.trustType}
                    onChange={(e) => setNewGoal({ ...newGoal, trustType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Revocable">Revocable</option>
                    <option value="Irrevocable">Irrevocable</option>
                    <option value="Charitable">Charitable</option>
                    <option value="Special Needs">Special Needs</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateGoal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Educational Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Why Goal-Based Trusts Work
          </h3>
          <p className="text-gray-600 mb-4 max-w-3xl mx-auto">
            Setting specific financial goals helps you stay focused and motivated. 
            Our intelligent system tracks your progress and celebrates milestones 
            along the way to building lasting family wealth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <p className="font-medium text-gray-900">Clear Vision</p>
              <p className="text-orange-600">Specific targets to aim for</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-medium text-gray-900">Progress Tracking</p>
              <p className="text-orange-600">See your wealth grow over time</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-medium text-gray-900">Milestone Celebrations</p>
              <p className="text-orange-600">Stay motivated with achievements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalBasedTrusts;
