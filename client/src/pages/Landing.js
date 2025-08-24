import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Shield, 
  Users, 
  Sparkles,
  FileText,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
            
const Landing = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-hidden animate-fade-in">
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
        
        .feature-underline {
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
        
        .animated-text {
          background: linear-gradient(-45deg, #2563EB, #7C3AED, #EC4899, #EF4444, #F59E0B, #10B981, #06B6D4, #2563EB);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
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
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8 relative pt-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8 fade-in-up tracking-tight leading-tight">
            Your Business Legacy, 
            <span className="animated-text block mt-2"> Executed.</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto fade-in-up stagger-1 font-light">
            Stop losing sleep over business succession. Get a clear plan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in-up stagger-2 mb-12">
            <Link 
              to="/register" 
              className="premium-button text-white px-12 py-4 rounded-full font-medium text-lg transform hover:scale-105 transition-all duration-300"
            >
              Start My Assessment
            </Link>
          </div>
          
          {/* Core Value Proposition */}
          <div className="fade-in-up stagger-3">
            <div className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl px-8 py-4 shadow-xl">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-medium text-lg">
                "What happens to my business when I'm gone?"
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Value Proposition */}
      <section className="py-32 px-8 bg-white fade-in-up stagger-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
                        <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Why <span className="stripe-text">TrustStack?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              70% of family businesses fail during transition. We fix that.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Value 1 */}
            <div className="parallax-card bg-white/50 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">The $500K Mistake</h3>
              <p className="text-gray-600 leading-relaxed mb-6 font-light">
                Unprepared exits cost hundreds of thousands. We prevent that.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-700">Avoid devastating tax bills</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Prevent family conflicts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Maximize exit value</span>
            </div>
              </div>
            </div>

            {/* Value 2 */}
            <div className="parallax-card bg-white/50 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">One Platform</h3>
              <p className="text-gray-600 leading-relaxed mb-6 font-light">
                Stop juggling 5 different experts. Get one unified solution.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-700">All experts in sync</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Cut coordination costs by 60%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Eliminate miscommunication</span>
            </div>
              </div>
            </div>

            {/* Value 3 */}
            <div className="parallax-card bg-white/50 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">30x ROI</h3>
              <p className="text-gray-600 leading-relaxed mb-6 font-light">
                $15K annual cost. $500K+ in savings. The math is simple.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-700">30x ROI minimum</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Costs less than hourly rates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Save hundreds of thousands</span>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: The Three-Phase Product Journey */}
      <section className="py-32 px-8 bg-gradient-to-br from-blue-50 to-indigo-50 fade-in-up stagger-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
                        <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              How It <span className="stripe-text">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Three phases. One goal. Your business legacy secured.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Phase 1: Discovery & Dashboard */}
            <div className="parallax-card bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Phase 1: Discovery</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                <span className="font-semibold text-gray-900">See your risks</span> — 15-minute diagnostic reveals your biggest threats.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">15-minute diagnostic reveals your biggest risks</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Visual dashboard shows tax exposure</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Calculate your liquidity crisis score</span>
                </div>
              </div>
            </div>
            
            {/* Phase 2: Strategy Builder */}
            <div className="parallax-card bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Phase 2: Strategy</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                <span className="font-semibold text-gray-900">Get your plan</span> — customized roadmap with steps and timelines.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Family Transfer: Keep it in the bloodline</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Strategic Sale: Maximize your payday</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Employee Buyout: Reward loyalty</span>
                </div>
              </div>
            </div>
            
            {/* Phase 3: Execution Hub */}
            <div className="parallax-card bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                                <h3 className="text-2xl font-semibold text-gray-900">Phase 3: Execute</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                <span className="font-semibold text-gray-900">Make it happen</span> — we handle paperwork and coordinate your team.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Auto-generate legal documents</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Connect with pre-screened experts</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Secure vault for everything important</span>
                </div>
              </div>
            </div>
            
            {/* Business Model */}
            <div className="parallax-card bg-white rounded-3xl p-10 shadow-xl border border-gray-200">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                                <h3 className="text-2xl font-semibold text-gray-900">Pricing</h3>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                <span className="font-semibold text-gray-900">Simple tiers</span> — from assessment to full execution.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Assess: $1K (less than one lawyer meeting)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Execute: $5K/year (vs. $50K+ piecemeal)</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Concierge: $15K/year (full done-for-you)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-8 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-light mb-8 tracking-tight">
            Ready to <span className="stripe-text">Start?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed font-light">
            Get your business exit plan in 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                      <Link 
              to="/register" 
              className="premium-button text-white px-12 py-4 rounded-full font-medium text-xl"
            >
              Get My Exit Plan Now
            </Link>
            <button className="border-2 border-white/30 text-white px-12 py-4 rounded-full font-medium text-xl hover:border-white hover:bg-white/10 transition-all duration-300 hover:scale-105">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-light tracking-tight">TrustStack</span>
              </div>
              <p className="text-gray-400 leading-relaxed font-light">
                Your Business Legacy, Executed.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">Trust Management</button></li>
                <li><button className="hover:text-white transition-colors text-left">Professional Tools</button></li>
                <li><button className="hover:text-white transition-colors text-left">AI Insights</button></li>
                <li><button className="hover:text-white transition-colors text-left">Document Generation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">Documentation</button></li>
                <li><button className="hover:text-white transition-colors text-left">API Reference</button></li>
                <li><button className="hover:text-white transition-colors text-left">Help Center</button></li>
                <li><button className="hover:text-white transition-colors text-left">Community</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors text-left">About</button></li>
                <li><button className="hover:text-white transition-colors text-left">Blog</button></li>
                <li><button className="hover:text-white transition-colors text-left">Careers</button></li>
                <li><button className="hover:text-white transition-colors text-left">Contact</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TrustStack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;