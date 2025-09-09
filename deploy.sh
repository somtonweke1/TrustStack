#!/bin/bash

# TrustStack Production Deployment Script
echo "🚀 Starting TrustStack production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy env.example to .env and configure your environment variables."
    exit 1
fi

# Check if required environment variables are set
source .env

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-super-secret-jwt-key-change-this-in-production" ]; then
    echo "❌ Error: JWT_SECRET must be set to a secure value in production!"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL must be set!"
    exit 1
fi

if [ -z "$STRIPE_SECRET_KEY" ] || [ "$STRIPE_SECRET_KEY" = "sk_test_..." ]; then
    echo "❌ Error: STRIPE_SECRET_KEY must be set!"
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build client
echo "🏗️ Building client..."
cd client
npm install
npm run build
cd ..

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Test database connection
echo "🔍 Testing database connection..."
node -e "
const { query } = require('./server/database/connection');
query('SELECT NOW()')
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
"

if [ $? -eq 0 ]; then
    echo "✅ Database connection test passed"
else
    echo "❌ Database connection test failed"
    exit 1
fi

# Start the server
echo "🚀 Starting TrustStack server..."
npm start
