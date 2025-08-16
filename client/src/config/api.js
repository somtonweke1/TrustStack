// API Configuration for TrustStack
const API_CONFIG = {
  // Local development
  development: {
    baseURL: 'http://localhost:3001',
    timeout: 10000
  },
  // Production (using working backend)
  production: {
    baseURL: 'https://truststack-api.onrender.com', // Working backend
    timeout: 15000
  }
};

// Get current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

export default config;
