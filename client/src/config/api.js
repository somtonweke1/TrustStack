// API Configuration for TrustStack
const API_CONFIG = {
  // Local development
  development: {
    baseURL: 'http://localhost:3001',
    timeout: 10000
  },
  // Production (Vercel)
  production: {
    baseURL: 'https://truststack-api.onrender.com', // We'll deploy here
    timeout: 15000
  }
};

// Get current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

export default config;
