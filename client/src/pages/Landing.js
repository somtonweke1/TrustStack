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
  Sparkles
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* CSS Variables for Theming */}
      <style jsx>{`
        :root {
          --blue: #2563EB;
          --blue-dark: #1D4ED8;
          --glass: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
          --shadow: 0 8px 32px rgba(37, 99, 235, 0.12);
          --shadow-hover: 0 12px 48px rgba(37, 99, 235, 0.2);
        }
        
        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .blue-gradient {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
        }
        
        .blue-glow {
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .parallax-tilt {
          transition: transform 0.3s ease;
        }
        
        .parallax-tilt:hover {
          transform: perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.02);
        }
        
        .stripe-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
      `}</style>

      {/* Fixed Glass-Morphism Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-light text-gray-900 tracking-tight">
                TrustStack
              </span>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 font-light transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="blue-gradient text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full floating-animation"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-blue-300 rounded-full floating-animation" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-blue-500 rounded-full floating-animation" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center">
          <h1 className={`text-6xl md:text-7xl font-light text-gray-900 mb-8 leading-tight fade-in`} style={{animationDelay: '0.2s'}}>
            <span className="stripe-text">Stripe</span> for Inheritance Rails
          </h1>
          <p className={`text-2xl md:text-3xl font-light text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto fade-in`} style={{animationDelay: '0.4s'}}>
            Transform wealth transfer visions into concrete payment rails. 
            Make inheritance and trust management as seamless as online payments.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center fade-in`} style={{animationDelay: '0.6s'}}>
            <Link 
              to="/register" 
              className="blue-gradient text-white px-10 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:blue-glow group"
            >
              Start Building Trusts
              <ArrowRight className="ml-3 h-5 w-5 inline transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="border border-gray-200 text-gray-700 px-10 py-4 rounded-full font-light text-lg hover:border-blue-300 hover:text-blue-600 transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-light text-center text-gray-900 mb-20 fade-in`} style={{animationDelay: '0.8s'}}>
            Everything you need to manage wealth transfers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trust Management */}
            <div className={`p-8 rounded-2xl glass-morphism border border-white/20 hover:border-blue-200/30 transition-all duration-500 parallax-tilt fade-in`} style={{animationDelay: '1s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Trust Account Management</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Create, manage, and monitor trust accounts with full compliance tracking and real-time updates.
              </p>
            </div>

            {/* Beneficiary Management */}
            <div className={`p-8 rounded-2xl glass-morphism border border-white/20 hover:border-blue-200/30 transition-all duration-500 parallax-tilt fade-in`} style={{animationDelay: '1.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Beneficiary Management</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Add, manage, and allocate assets to beneficiaries with precise control and transparency.
              </p>
            </div>

            {/* Secure Transfers */}
            <div className={`p-8 rounded-2xl glass-morphism border border-white/20 hover:border-blue-200/30 transition-all duration-500 parallax-tilt fade-in`} style={{animationDelay: '1.4s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
                <ArrowUpRight className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Secure Wealth Transfers</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Process inheritance transfers with bank-grade security and real-time payment processing.
              </p>
            </div>

            {/* Compliance Engine */}
            <div className={`p-8 rounded-2xl glass-morphism border border-white/20 hover:border-blue-200/30 transition-all duration-500 parallax-tilt fade-in`} style={{animationDelay: '1.6s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Built-in Compliance</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Automated regulatory compliance with KYC, AML, and audit trail requirements built-in.
              </p>
            </div>

            {/* Multi-Currency */}
            <div className={`p-8 rounded-2xl glass-morphism border border-white/20 hover:border-blue-200/30 transition-all duration-500 parallax-tilt fade-in`} style={{animationDelay: '1.8s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Multi-Currency Support</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Handle international wealth transfers with support for multiple currencies and exchange rates.
              </p>
            </div>

            {/* Audit Trail */}
            <div className={`p-8 rounded-2xl glass-morphism border border-white/20 hover:border-blue-200/30 transition-all duration-500 parallax-tilt fade-in`} style={{animationDelay: '2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Complete Audit Trail</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Full transaction history, compliance logs, and audit trails for complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-light text-gray-900 mb-20 fade-in`} style={{animationDelay: '2.2s'}}>
            How TrustStack Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className={`text-center fade-in`} style={{animationDelay: '2.4s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl font-light">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create Trust Account</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Set up your trust with beneficiary details and funding allocation
              </p>
            </div>
            
            <div className={`text-center fade-in`} style={{animationDelay: '2.6s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-light">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Process Transfers</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Initiate secure wealth transfers with built-in compliance checks
              </p>
            </div>
            
            <div className={`text-center fade-in`} style={{animationDelay: '2.8s'}}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl font-light">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Monitor & Manage</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Track all activities with real-time updates and comprehensive reporting
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
        {/* Particle Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-1 h-1 bg-blue-400 rounded-full floating-animation"></div>
          <div className="absolute top-32 right-32 w-2 h-2 bg-blue-300 rounded-full floating-animation" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-blue-500 rounded-full floating-animation" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className={`text-4xl md:text-5xl font-light text-gray-900 mb-8 fade-in`} style={{animationDelay: '3s'}}>
            Ready to transform wealth transfers?
          </h2>
          <p className={`text-2xl font-light text-gray-600 mb-12 fade-in`} style={{animationDelay: '3.2s'}}>
            Join the future of inheritance management with TrustStack
          </p>
          <Link 
            to="/register" 
            className={`inline-flex items-center px-12 py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-medium rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:blue-glow fade-in`} style={{animationDelay: '3.4s'}}
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Get Started Free
            <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Ultra-Minimal Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-light text-gray-600">TrustStack</span>
            </div>
            <div className="text-sm font-light text-gray-500">
              © 2024 TrustStack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;