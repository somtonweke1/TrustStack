# TrustStack Production Deployment Guide

## 🚨 Critical Issues Fixed

### 1. Database Schema Mismatch ✅
- **Problem**: Routes expected PostgreSQL with UUID keys, but SQLite was configured
- **Solution**: Updated `setup-db.js` to use proper PostgreSQL schema with all required tables
- **Impact**: Prevents runtime errors when creating/querying trust accounts

### 2. Deployment Configuration ✅
- **Problem**: `render.yaml` was configured for static site, not API deployment
- **Solution**: Updated to proper web service configuration with PostgreSQL database
- **Problem**: `vercel.json` had incorrect API routing
- **Solution**: Fixed to properly route API calls to server and static files to client

### 3. Environment Variables ✅
- **Problem**: Missing `.env` file and critical environment variables
- **Solution**: Created `.env` template with all required variables
- **Required Variables**:
  - `JWT_SECRET` (must be changed from default)
  - `DATABASE_URL` (PostgreSQL connection string)
  - `STRIPE_SECRET_KEY` (from Stripe dashboard)
  - `STRIPE_WEBHOOK_SECRET` (from Stripe dashboard)

### 4. Error Handling ✅
- **Problem**: Basic error logging, exposed internal errors in production
- **Solution**: Enhanced error handling with structured logging and production-safe error messages

### 5. CORS Configuration ✅
- **Problem**: Limited CORS origins for production
- **Solution**: Added comprehensive CORS configuration for all expected domains

## 🚀 Deployment Options

### Option 1: Render.com (Recommended)
1. **Setup Database**:
   ```bash
   # The render.yaml will automatically create a PostgreSQL database
   # No manual setup required
   ```

2. **Deploy**:
   ```bash
   # Connect your GitHub repo to Render
   # Render will automatically deploy using render.yaml
   ```

3. **Environment Variables**:
   - Set in Render dashboard:
     - `JWT_SECRET`: Generate a secure random string
     - `STRIPE_SECRET_KEY`: From your Stripe dashboard
     - `STRIPE_WEBHOOK_SECRET`: From your Stripe dashboard

### Option 2: Vercel
1. **Setup Database**:
   ```bash
   # You'll need to set up a PostgreSQL database separately
   # Consider using Vercel Postgres, Neon, or Supabase
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Environment Variables**:
   - Set in Vercel dashboard or via CLI:
     ```bash
     vercel env add JWT_SECRET
     vercel env add DATABASE_URL
     vercel env add STRIPE_SECRET_KEY
     vercel env add STRIPE_WEBHOOK_SECRET
     ```

### Option 3: Manual Deployment
1. **Setup Environment**:
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

2. **Deploy**:
   ```bash
   ./deploy.sh
   ```

## 🔧 Pre-Deployment Checklist

- [ ] **Environment Variables**: All required variables set with secure values
- [ ] **Database**: PostgreSQL database accessible with proper schema
- [ ] **Stripe**: API keys configured and webhooks set up
- [ ] **Domain**: CORS origins updated for your production domain
- [ ] **SSL**: Database connection uses SSL in production
- [ ] **Security**: JWT secret is cryptographically secure

## 🧪 Testing

### Health Check
```bash
curl https://your-domain.com/health
```

### API Test
```bash
# Test trust creation (requires authentication)
curl -X POST https://your-domain.com/api/trusts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"trustName":"Test Trust","trustType":"Revocable"}'
```

## 📊 Monitoring

### Logs
- **Development**: Detailed error messages with stack traces
- **Production**: Sanitized error messages, structured logging

### Database
- Connection pooling configured for production
- SSL enabled for secure connections
- Proper indexing for performance

### Security
- Rate limiting: 100 requests per 15 minutes per IP
- Helmet.js for security headers
- CORS properly configured
- JWT authentication on all protected routes

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Verify database is accessible
   - Check SSL configuration

2. **CORS Errors**
   - Verify your domain is in the CORS origins list
   - Check if credentials are being sent

3. **JWT Errors**
   - Ensure `JWT_SECRET` is set and consistent
   - Check token format in Authorization header

4. **Stripe Errors**
   - Verify API keys are correct
   - Check webhook endpoint configuration

### Debug Mode
Set `NODE_ENV=development` to enable detailed error messages and logging.

## 📈 Performance

- Database connection pooling (max 20 connections)
- Proper indexing on frequently queried columns
- Rate limiting to prevent abuse
- Efficient query patterns

## 🔒 Security

- All API routes protected with JWT authentication
- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- Rate limiting to prevent brute force attacks
- Secure headers with Helmet.js
- CORS properly configured for production domains
