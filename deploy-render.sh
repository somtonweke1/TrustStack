#!/bin/bash

echo "🚀 Deploying TrustStack Backend to Render.com..."

echo "📋 Steps to deploy:"
echo "1. Go to https://render.com and sign up/login"
echo "2. Click 'New +' and select 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure the service:"
echo "   - Name: truststack-api"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Plan: Free"

echo ""
echo "🔧 Environment Variables to set in Render:"
echo "NODE_ENV=production"
echo "PORT=10000"
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production"
echo "DATABASE_URL=(Render will provide this)"
echo "BCRYPT_ROUNDS=12"

echo ""
echo "📁 Make sure your server/index.js has:"
echo "- app.set('trust proxy', 1);"
echo "- CORS configured for your Vercel domain"

echo ""
echo "✅ After deployment, update client/src/config/api.js with your Render URL"
