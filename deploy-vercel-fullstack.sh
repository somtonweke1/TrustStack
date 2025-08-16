#!/bin/bash

echo "🚀 Deploying TrustStack as FULL-STACK to Vercel..."
echo "📋 This will deploy both frontend AND backend to the same domain!"

echo ""
echo "🔧 Step 1: Set Environment Variables in Vercel Dashboard"
echo "Go to: https://vercel.com/dashboard/trust-stack/settings/environment-variables"
echo "Add these variables:"
echo "DATABASE_URL=your_production_database_url"
echo "JWT_SECRET=your-super-secret-jwt-key"
echo "BCRYPT_ROUNDS=12"
echo "NODE_ENV=production"

echo ""
echo "🗄️ Step 2: Set up Database"
echo "Option A: Use Vercel Postgres (recommended)"
echo "  - Go to Vercel Dashboard > Storage > Create Database"
echo "  - Choose PostgreSQL"
echo "  - Copy the connection string to DATABASE_URL"

echo ""
echo "Option B: Use External PostgreSQL"
echo "  - Deploy to Railway/Render/Heroku"
echo "  - Copy connection string to DATABASE_URL"

echo ""
echo "🚀 Step 3: Deploy Full-Stack"
echo "Run: vercel --prod"

echo ""
echo "✅ Result: Single website with frontend + backend working together!"
echo "🔗 Your domain: https://trust-stack.vercel.app"
echo "📱 Frontend: Landing page, forms, UI"
echo "🔌 Backend: API endpoints, registration, database"
