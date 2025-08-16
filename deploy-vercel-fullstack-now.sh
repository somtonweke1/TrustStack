#!/bin/bash

echo "🚀 Deploying TrustStack FULL-STACK to Vercel NOW!"
echo "📋 This will give you frontend + backend on the same domain!"

echo ""
echo "🔧 Step 1: Set Environment Variables in Vercel"
echo "Go to: https://vercel.com/dashboard/trust-stack/settings/environment-variables"
echo "Add these variables:"
echo "DATABASE_URL=your_production_database_url"
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production"

echo ""
echo "🗄️ Step 2: Quick Database Setup"
echo "Option A: Use Vercel Postgres (5 minutes)"
echo "  - Vercel Dashboard → Storage → Create Database → PostgreSQL"
echo "  - Copy connection string to DATABASE_URL"

echo ""
echo "Option B: Use External PostgreSQL (3 minutes)"
echo "  - Go to https://supabase.com (free)"
echo "  - Create project → Database → Connection string"
echo "  - Copy to DATABASE_URL"

echo ""
echo "🚀 Step 3: Deploy Full-Stack"
echo "Run: vercel --prod"

echo ""
echo "✅ Result: Single website with everything working!"
echo "🔗 Your domain: https://trust-stack.vercel.app"
echo "📱 Frontend: Landing page, forms, UI"
echo "🔌 Backend: API endpoints, registration, database"
echo "🎯 Registration: Will work perfectly!"

echo ""
echo "💡 Pro tip: Use Supabase - it's free and takes 3 minutes!"
