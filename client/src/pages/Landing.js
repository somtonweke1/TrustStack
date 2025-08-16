import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Shield, 
  ArrowUpRight, 
  Users, 
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Lock
} from 'lucide-react';
            
const Landing = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);

  const companies = [
    { name: 'Stripe', color: 'from-purple-500 to-indigo-600' },
    { name: 'PayPal', color: 'from-blue-500 to-blue-600' },
    { name: 'Square', color: 'from-green-500 to-emerald-600' },
    { name: 'Adyen', color: 'from-orange-500 to-red-600' },
    { name: 'Plaid', color: 'from-teal-500 to-cyan-600' }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const companyInterval = setInterval(() => {
      setCurrentCompanyIndex((prev) => (prev + 1) % companies.length);
    }, 3000);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(companyInterval);
    };
  }, [companies.length]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-hidden">
      {/* Premium CSS Variables */}
      <style jsx>{`
        :root {
          --blue: #2563EB;
          --blue-dark: #1D4ED8;
          --glass: rgba(255, 255, 255, 0.08);
          --glass-border: rgba(255, 255, 255, 0.12);
          --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
          --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.12);
        }
        
        .premium-glass {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
        }
        
        .blue-gradient {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
        }
        
        .premium-shadow {
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.15);
        }
        
        .floating-element {
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        .fade-in-up {
          opacity: 0;
          transform: translateY(40px);
          animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        
        .parallax-card {
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .parallax-card:hover {
          transform: perspective(1000px) rotateX(8deg) rotateY(8deg) scale(1.05);
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.15);
        }
        
        .geometric-bg {
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(37, 99, 235, 0.02) 0%, transparent 50%);
        }
        
        .stripe-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          letter-spacing: -0.03em;
        }
        
        .company-underline {
          text-decoration: underline;
          text-decoration-thickness: 4px;
          text-underline-offset: 8px;
          text-decoration-color: currentColor;
        }
        
        .premium-button {
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          box-shadow: 0 20px 40px -12px rgba(37, 99, 235, 0.3);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.4);
        }
      `}</style>

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 geometric-bg pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full blur-3xl opacity-30 floating-element"
          style={{
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
            transition: 'all 0.1s ease-out'
          }}
        />
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-300 rounded-full floating-element" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-blue-500 rounded-full floating-element" style={{animationDelay: '6s'}}></div>
      </div>

      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 premium-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-light text-gray-900 tracking-tight">
                TrustStack
              </span>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-8">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 px-8 py-3 rounded-full hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 min-w-[120px] text-center"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 min-w-[120px] text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-36 px-8 relative">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`text-7xl md:text-8xl font-light text-gray-900 mb-16 leading-tight fade-in-up stagger-1`}>
            <span className={`bg-gradient-to-r ${companies[currentCompanyIndex].color} bg-clip-text text-transparent font-semibold transition-all duration-1000 company-underline`}>
              {companies[currentCompanyIndex].name}
            </span> for Inheritance Rails
          </h1>
          <p className={`text-2xl md:text-3xl font-light text-gray-600 mb-20 leading-relaxed max-w-5xl mx-auto fade-in-up stagger-2`}>
            Transform wealth transfer visions into concrete payment rails. Make inheritance and trust management as seamless as online payments.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center fade-in-up stagger-3`}>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-5 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 group border-0 min-w-[240px] text-center flex items-center justify-center"
            >
              <Zap className="mr-3 h-6 w-6" />
              Start Building Trusts
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="border-2 border-gray-300 text-gray-700 px-12 py-5 rounded-full font-medium text-lg hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 hover:scale-105 bg-white min-w-[240px] text-center flex items-center justify-center">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section className="py-36 px-8 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-5xl md:text-6xl font-light text-center text-gray-900 mb-28 fade-in-up stagger-1`}>
            Everything you need to manage wealth transfers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Trust Management */}
            <div className={`p-12 rounded-3xl premium-glass border border-white/20 hover:border-blue-200/30 transition-all duration-700 parallax-card fade-in-up stagger-2 group`}>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Trust Account Management</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Create, manage, and monitor trust accounts with full compliance tracking and real-time updates.
              </p>
            </div>

            {/* Beneficiary Management */}
            <div className={`p-12 rounded-3xl premium-glass border border-white/20 hover:border-blue-200/30 transition-all duration-700 parallax-card fade-in-up stagger-3 group`}>
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Beneficiary Management</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Add, manage, and allocate assets to beneficiaries with precise control and transparency.
              </p>
            </div>

            {/* Secure Transfers */}
            <div className={`p-12 rounded-3xl premium-glass border border-white/20 hover:border-blue-200/30 transition-all duration-700 parallax-card fade-in-up stagger-4 group`}>
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <ArrowUpRight className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Secure Wealth Transfers</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Process inheritance transfers with bank-grade security and real-time payment processing.
              </p>
            </div>

            {/* Compliance Engine */}
            <div className={`p-12 rounded-3xl premium-glass border border-white/20 hover:border-blue-200/30 transition-all duration-700 parallax-card fade-in-up stagger-5 group`}>
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Shield className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Built-in Compliance</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Automated regulatory compliance with KYC, AML, and audit trail requirements built-in.
              </p>
            </div>

            {/* Multi-Currency */}
            <div className={`p-12 rounded-3xl premium-glass border border-white/20 hover:border-blue-200/30 transition-all duration-700 parallax-card fade-in-up stagger-1 group`}>
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Globe className="h-12 w-12 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Multi-Currency Support</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Handle international wealth transfers with support for multiple currencies and exchange rates.
              </p>
            </div>

            {/* Audit Trail */}
            <div className={`p-12 rounded-3xl premium-glass border border-white/20 hover:border-blue-200/30 transition-all duration-700 parallax-card fade-in-up stagger-2 group`}>
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Lock className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Complete Audit Trail</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Full transaction history, compliance logs, and audit trails for complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium How It Works */}
      <section className="py-36 px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-5xl md:text-6xl font-light text-gray-900 mb-28 fade-in-up stagger-1`}>
            How TrustStack Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-20">
            <div className={`text-center fade-in-up stagger-2 group`}>
              <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <span className="text-white text-4xl font-light">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Create Trust Account</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Set up your trust with beneficiary details and funding allocation
              </p>
            </div>
            
            <div className={`text-center fade-in-up stagger-3 group`}>
              <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <span className="text-white text-4xl font-light">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Process Transfers</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Initiate secure wealth transfers with built-in compliance checks
              </p>
            </div>
            
            <div className={`text-center fade-in-up stagger-4 group`}>
              <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <span className="text-white text-4xl font-light">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Monitor & Manage</h3>
              <p className="text-lg font-light text-gray-600 leading-relaxed">
                Track all activities with real-time updates and comprehensive reporting
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Final CTA */}
      <section className="py-36 px-8 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 geometric-bg opacity-50"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className={`text-5xl md:text-6xl font-light text-gray-900 mb-12 fade-in-up stagger-1`}>
            Ready to transform wealth transfers?
          </h2>
          <p className={`text-2xl font-light text-gray-600 mb-20 fade-in-up stagger-2`}>
            Join the future of inheritance management with TrustStack
          </p>
          <Link 
            to="/register" 
            className={`inline-flex items-center px-16 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 fade-in-up stagger-3 border-0 min-w-[280px] justify-center`}
          >
            <Sparkles className="mr-4 h-6 w-6" />
            Get Started Free
            <ArrowRight className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-20 px-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-light text-gray-600">TrustStack</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Transform wealth transfer visions into concrete payment rails. Making inheritance and trust management as seamless as online payments.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">FDIC</span>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">SOC2</span>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">PCI</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="/trust-management" className="text-gray-600 hover:text-blue-600 transition-colors">Trust Management</a></li>
                <li><a href="/beneficiary-services" className="text-gray-600 hover:text-blue-600 transition-colors">Beneficiary Services</a></li>
                <li><a href="/wealth-transfers" className="text-gray-600 hover:text-blue-600 transition-colors">Wealth Transfers</a></li>
                <li><a href="/compliance-tools" className="text-gray-600 hover:text-blue-600 transition-colors">Compliance Tools</a></li>
                <li><a href="/api-docs" className="text-gray-600 hover:text-blue-600 transition-colors">API Documentation</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="/careers" className="text-gray-600 hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="/press" className="text-gray-600 hover:text-blue-600 transition-colors">Press</a></li>
                <li><a href="/partners" className="text-gray-600 hover:text-blue-600 transition-colors">Partners</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Legal Links */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
              <a href="/dpa" className="hover:text-blue-600 transition-colors">Data Processing Agreement</a>
              <a href="/aup" className="hover:text-blue-600 transition-colors">Acceptable Use Policy</a>
              <a href="/security" className="hover:text-blue-600 transition-colors">Security</a>
              <a href="/compliance" className="hover:text-blue-600 transition-colors">Compliance</a>
              <a href="/regulatory" className="hover:text-blue-600 transition-colors">Regulatory Disclosures</a>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-4 md:mb-0">
                © 2025 TrustStack. All rights reserved.
              </div>
              <div className="text-sm text-gray-500">
                TrustStack is a financial technology company, not a bank. Banking services provided by our partner banks, Members FDIC.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;