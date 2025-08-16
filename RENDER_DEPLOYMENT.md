# 🚀 Render.com Backend Deployment Guide

## **Quick Deploy to Render.com**

### **Step 1: Go to Render.com**
1. Visit [https://render.com](https://render.com)
2. Sign up/Login with GitHub

### **Step 2: Create New Web Service**
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your **GitHub repository**: `somtonweke1/TrustStack`

### **Step 3: Configure Service**
- **Name**: `truststack-api`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Plan**: `Free`

### **Step 4: Set Environment Variables**
Click **"Environment"** tab and add:
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
BCRYPT_ROUNDS=12
```

### **Step 5: Add PostgreSQL Database**
1. Go back to dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Name: `truststack-db`
4. Plan: `Free`
5. Copy the **Internal Database URL**
6. Add to your web service environment variables:
   ```
   DATABASE_URL=postgresql://... (the URL from step 5)
   ```

### **Step 6: Deploy**
1. Click **"Create Web Service"**
2. Wait for build to complete (2-3 minutes)
3. Copy your service URL (e.g., `https://truststack-api.onrender.com`)

### **Step 7: Update Frontend**
Update `client/src/config/api.js`:
```javascript
production: {
  baseURL: 'https://YOUR-RENDER-URL.onrender.com',
  timeout: 15000
}
```

### **Step 8: Redeploy Frontend to Vercel**
```bash
vercel --prod
```

## **✅ Result**
Your Vercel link will now work completely with registration! 🎉
