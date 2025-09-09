const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { setupDatabase } = require('./database/setup-db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for rate limiting behind load balancers
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://trust-stack.vercel.app', 
        'https://truststack.com', 
        'https://app.truststack.com',
        'https://truststack.vercel.app',
        'https://www.truststack.com'
      ]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database
let dbPool = null;
setupDatabase().then(pool => {
  dbPool = pool;
  if (pool) {
    console.log('✅ Database initialized successfully');
  } else {
    console.log('⚠️ Database not available - some features may not work');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'TrustStack API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: dbPool ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trusts', require('./routes/trusts'));
app.use('/api/beneficiaries', require('./routes/beneficiaries'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/webhooks', require('./routes/webhooks'));
app.use('/api/ai', require('./routes/ai-insights'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TrustStack API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
});

module.exports = app; 