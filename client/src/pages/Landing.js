import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Shield, 
  ArrowUpRight, 
  Users, 
  DollarSign, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Lock
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">TrustStack</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/login" 
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Stripe</span> for Inheritance Rails
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Transform wealth transfer visions into concrete payment rails. 
            Make inheritance and trust management as seamless as online payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center"
            >
              Start Building Trusts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-semibold text-lg">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Everything you need to manage wealth transfers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trust Management */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust Account Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Create, manage, and monitor trust accounts with full compliance tracking and real-time updates.
              </p>
            </div>

            {/* Beneficiary Management */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Beneficiary Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Add, manage, and allocate assets to beneficiaries with precise control and transparency.
              </p>
            </div>

            {/* Secure Transfers */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <ArrowUpRight className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Wealth Transfers</h3>
              <p className="text-gray-600 leading-relaxed">
                Process inheritance transfers with bank-grade security and real-time payment processing.
              </p>
            </div>

            {/* Compliance Engine */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Built-in Compliance</h3>
              <p className="text-gray-600 leading-relaxed">
                Automated regulatory compliance with KYC, AML, and audit trail requirements built-in.
              </p>
            </div>

            {/* Multi-Currency */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Currency Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Handle international wealth transfers with support for multiple currencies and exchange rates.
              </p>
            </div>

            {/* Audit Trail */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Audit Trail</h3>
              <p className="text-gray-600 leading-relaxed">
                Full transaction history, compliance logs, and audit trails for complete transparency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
            How TrustStack Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Trust Account</h3>
              <p className="text-gray-600">
                Set up your trust with beneficiary details and funding allocation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Process Transfers</h3>
              <p className="text-gray-600">
                Initiate secure wealth transfers with built-in compliance checks
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Monitor & Manage</h3>
              <p className="text-gray-600">
                Track all activities with real-time updates and comprehensive reporting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform wealth transfers?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the future of inheritance management with TrustStack
          </p>
          <Link 
            to="/register" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-flex items-center"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Building2 className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold text-white">TrustStack</span>
            </div>
            <div className="text-sm">
              © 2024 TrustStack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
