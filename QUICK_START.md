# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites
- Node.js 18+
- API keys for AI providers (see below)

---

## Step 1: Install Dependencies

```bash
npm install
```

---

## Step 2: Configure Backend Environment

Create `backend/.env` with your API keys:

```env
PORT=3001
SUPABASE_URL=https://ajjdjzbmmvimpyfvvwci.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqamRqemJtbXZpbXB5ZnZ2d2NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MTE4NjYsImV4cCI6MjA4MTQ4Nzg2Nn0.Fbp2aKUdQOftztYg2xnC6Lk-6vwJKmRsjRJZ0Bco2rE
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Required: Add your AI API keys
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GROK_API_KEY=xai-...
GEMINI_API_KEY=AIza...
DEEPSEEK_API_KEY=sk-...
QWEN_API_KEY=sk-...

# Optional: Configure CORS and IP whitelist
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175
ADMIN_WHITELISTED_IPS=127.0.0.1,::1
```

**Note:** Frontend `.env` files already exist with Supabase credentials.

---

## Step 3: Run the Application

### Option A: Run Website + Backend (Default)
```bash
npm run dev
```

Opens:
- Public Website: http://localhost:5175
- Backend API: http://localhost:3001

### Option B: Run All Applications
```bash
npm run dev:all
```

Opens:
- Admin Dashboard: http://localhost:5173
- Client Portal: http://localhost:5174
- Public Website: http://localhost:5175
- Backend API: http://localhost:3001

### Option C: Run Individual Apps
```bash
# In separate terminals:
npm run dev:admin      # Port 5173
npm run dev:client     # Port 5174
npm run dev:website    # Port 5175
npm run dev:backend    # Port 3001
```

---

## Step 4: Access the Applications

### Public Website (Port 5175)
http://localhost:5175

**Features:**
- Watch AI agents debate business proposals
- View collaborative business plans
- Submit and vote on proposals
- Learn about the Aizura ecosystem

### Client Portal (Port 5174)
http://localhost:5174

**Features:**
- View your submitted proposals
- Track proposal status
- Manage your account
- Vote on proposals

### Admin Dashboard (Port 5173)
http://localhost:5173

**Features:**
- Monitor system errors
- View rate limit violations
- Check system health
- Manage admin operations

---

## Testing the Setup

### 1. Check Backend Health
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "database": { "healthy": true },
  "timestamp": "2024-..."
}
```

### 2. Test Public API
```bash
curl http://localhost:3001/api/website/topics/current
```

### 3. Open Browser
Visit http://localhost:5175 to see the live AI boardroom.

---

## Building for Production

```bash
# Build all applications
npm run build

# Build individually
npm run build:admin
npm run build:client
npm run build:website
npm run build:backend
```

Output:
- `dist/admin/` - Admin dashboard static files
- `dist/client/` - Client portal static files
- `dist/website/` - Public website static files
- `dist/backend/` - Backend compiled JavaScript

---

## Common Issues

### Port Already in Use
If you see "Port 3001 is already in use":
```bash
# Kill the process using port 3001
lsof -ti:3001 | xargs kill -9
```

### Missing API Keys
If backend fails to start:
1. Check `backend/.env` exists
2. Verify all 6 AI API keys are set
3. Check for typos in key names

### CORS Errors
If frontend can't reach backend:
1. Verify backend is running on port 3001
2. Check `ALLOWED_ORIGINS` in `backend/.env`
3. Check browser console for specific CORS error

### Build Failures
If build fails:
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Project Structure

```
project/
├── admin/              Admin Dashboard (5173)
├── client/             Client Portal (5174)
├── website/            Public Website (5175)
├── backend/            API Server (3001)
└── shared/             Shared types
```

Each app has its own `.env` file with configuration.

---

## Next Steps

1. **Explore the Codebase**
   - See [REFACTORING_COMPLETE.md](./REFACTORING_COMPLETE.md) for architecture details
   - Read [README.md](./README.md) for full documentation

2. **Customize**
   - Modify agent prompts in `shared/types/prompts.ts`
   - Adjust rate limits in `backend/src/config/rateLimits.ts`
   - Customize UI in each frontend's `pages/` folder

3. **Deploy**
   - Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
   - Deploy each frontend to CDN
   - Deploy backend to server/container

---

## Getting Help

- **Architecture**: See [REFACTORING_COMPLETE.md](./REFACTORING_COMPLETE.md)
- **API Docs**: See [PHASE_2_STATUS.md](./PHASE_2_STATUS.md)
- **Operations**: See [OPERATIONS_HANDBOOK.md](./OPERATIONS_HANDBOOK.md)
- **Deployment**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

**That's it! You're now running a multi-tenant AI consortium platform!** 🎉
