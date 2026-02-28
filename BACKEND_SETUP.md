# Backend Setup Guide for Zaplink Frontend

> **IMPORTANT**: The Zaplink frontend requires a running backend server to function properly. This guide will help you set it up.

## 🚨 Why Do I Need the Backend?

The backend server handles:
- ✅ File uploads
- ✅ QR code generation
- ✅ Data storage
- ✅ API requests for all features

**Without the backend, upload functionality will fail with 404 errors.**

---

## 🎯 Quick Setup (5 minutes)

### If Backend is in Sibling Directory (Recommended)

```bash
# Terminal 1: Start the backend
cd ../Zaplink_backend
npm install
npm start

# Terminal 2: Start the frontend (in different terminal)
cd ../Zaplink_frontend
npm run dev
```

That's it! ✅

---

## 🐳 Option 1: Docker (Easiest)

### Prerequisites
- Docker installed ([Download Docker](https://www.docker.com/products/docker-desktop))

### Steps
```bash
# Build the Docker image
cd ../Zaplink_backend
docker build -t zaplink-backend .

# Run the container
docker run -p 5000:5000 zaplink-backend
```

✅ Backend is now running on `http://localhost:5000`

---

## 📦 Option 2: Local Installation

### Prerequisites
- Node.js v18+ installed
- npm package manager

### Steps

1. **Clone the backend repository**
   ```bash
   cd ..
   git clone https://github.com/gdg-charusat/Zaplink_backend.git
   cd Zaplink_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (if needed)
   - Check `Zaplink_backend/.env.example` for required variables
   - Copy and configure: `cp .env.example .env`

4. **Start the backend**
   ```bash
   npm start
   ```

   ✅ You should see:
   ```
   Server running on http://localhost:5000
   ```

---

## 🔧 Custom Port Configuration

If your backend runs on a different port (e.g., 3000, 8000):

### In Frontend Directory

1. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

2. **Update the backend URL**
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

3. **Restart frontend**
   ```bash
   npm run dev
   ```

---

## ✅ Verify Backend is Running

### Browser Check
1. Open browser DevTools (F12)
2. Open Console tab
3. You should see:
   ```
   ℹ Development Mode: Using Vite proxy for /api routes
   📍 Proxy target: http://localhost:5000
   ```

### Direct URL Check
Open in browser: `http://localhost:5000/health` (or similar health endpoint)

### Upload Test
1. Go to `http://localhost:5173/upload`
2. Try uploading a file
3. If it works → ✅ Backend is connected!
4. If upload fails → ❌ See troubleshooting below

---

## 🚨 Troubleshooting

### Error: "ECONNREFUSED"

**Cause**: Backend not running

**Solution**:
```bash
# Make sure you're in the backend directory
cd ../Zaplink_backend

# Start the backend
npm start

# Should show: Server running on http://localhost:5000
```

### Error: "Port 5000 already in use"

**Cause**: Another process is using port 5000

**Solution**:
```bash
# Option A: Kill the process (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Option B: Use a different port in .env
VITE_BACKEND_URL=http://localhost:3000

# Option C: Restart your system
```

### Error: "Cannot find module" in backend

**Cause**: Dependencies not installed

**Solution**:
```bash
cd ../Zaplink_backend
npm install
npm start
```

### Frontend can't reach backend

**Cause**: Wrong backend URL configuration

**Solution**:
```bash
# Check your .env file
cat .env

# Should have:
VITE_BACKEND_URL=http://localhost:YOUR_BACKEND_PORT

# If using Docker:
VITE_BACKEND_URL=http://localhost:5000
```

---

## 📊 Development Environment Setup

### Recommended Setup (2 Terminals)

**Terminal 1 - Backend**
```
cd ../Zaplink_backend
npm start
↓
Listening on http://localhost:5000
```

**Terminal 2 - Frontend**
```
cd ../Zaplink_frontend
npm run dev
↓
Local: http://localhost:5173
```

### Browser
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Proxy: `/api/*` → automatically routed to backend

---

## 🔄 Workflow During Development

1. **Backend changes**: Restart backend (Ctrl+C, then `npm start`)
2. **Frontend changes**: Auto-refresh in browser
3. **Both changes**: Restart backend, frontend auto-refreshes

---

## 📚 Additional Resources

- [Zaplink Backend Repository](https://github.com/gdg-charusat/Zaplink_backend)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Guide](https://nodejs.org/)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)

---

## ❓ Still Having Issues?

1. **Check the console logs** (F12 in browser)
2. **Verify backend is running** (check terminal where you started it)
3. **Verify using .env.example** (copy and customize as needed)
4. **Restart both servers** (kill and restart)
5. **Check GitHub Issues** for similar problems
6. **Ask for help** in the Discord/community channels

---

**Happy coding! 🚀**
