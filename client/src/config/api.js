// API Configuration for TrustStack
const API_CONFIG = {
  // Local development
  development: {
    baseURL: 'http://localhost:3001',
    timeout: 10000
  },
  // Production (Vercel - same domain)
  production: {
    baseURL: '', // Same domain as frontend for Vercel API routes
    timeout: 15000
  }
};

// Use production mode for Vercel deployment
const isDevelopment = process.env.NODE_ENV === 'development';
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

console.log('🔧 API Config Debug:');
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
console.log('🔧 isDevelopment:', isDevelopment);
console.log('🔧 Selected config:', config);

export default config;
