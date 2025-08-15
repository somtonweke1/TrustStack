#!/bin/bash

echo "🚀 Starting TrustStack Demo..."
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    echo "   On macOS: brew services start postgresql"
    echo "   On Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database and Stripe credentials"
    echo "   - Set DATABASE_URL to your PostgreSQL connection string"
    echo "   - Set STRIPE_SECRET_KEY to your Stripe test key"
    echo "   - Set JWT_SECRET to a random string"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Create database if it doesn't exist
echo "🗄️  Setting up database..."
psql -c "CREATE DATABASE truststack;" postgres 2>/dev/null || echo "Database already exists"

# Run database migration
echo "🔄 Running database migration..."
npm run db:migrate

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Start the application
echo "🎉 Starting TrustStack..."
echo "   Backend: http://localhost:3001"
echo "   Frontend: http://localhost:3000"
echo "   Health check: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop"
echo "================================"

npm run dev

