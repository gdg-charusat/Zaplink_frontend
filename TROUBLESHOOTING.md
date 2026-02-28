# 🔧 Troubleshooting Checklist

## Issue: Upload Returns 404 Error

### ✅ Step 1: Verify Backend is Running
```bash
# Make sure backend is running in a separate terminal
cd ../Zaplink_backend
npm start

# Should show: Server running on http://localhost:5000
```

**Not working?** → Go to [Issue: Backend Won't Start](#issue-backend-wont-start)

---

### ✅ Step 2: Check Browser Console (F12)

Open DevTools → Console tab. You should see:
```
ℹ Development Mode: Using Vite proxy for /api routes
📍 Proxy target: http://localhost:5000
```

**Don't see this?** → Your frontend isn't configured properly
- Restart frontend: `npm run dev`
- Check next step

---

### ✅ Step 3: Verify .env Configuration

In `Zaplink_frontend` directory:
```bash
# Check if .env file exists
ls -la .env

# If not, create it:
cp .env.example .env

# Verify content:
cat .env
# Should contain: VITE_BACKEND_URL=http://localhost:5000
```

---

### ✅ Step 4: Test Upload

1. Go to `http://localhost:5173/upload`
2. Try uploading a file
3. Check browser console (F12) for errors

**Still 404?** → Check [Issue: Module Not Found](#issue-module-not-found)

---

## Issue: Backend Won't Start

### Cause: Node.js or npm Not Installed

```bash
node --version    # Should be v18+
npm --version     # Should be 9+
```

**Not installed?** → [Download Node.js](https://nodejs.org/)

---

### Cause: Dependencies Not Installed

```bash
cd ../Zaplink_backend
npm install
npm start
```

---

### Cause: Port 5000 Already in Use

**Find what's using port 5000:**

**Linux/Mac:**
```bash
lsof -i :5000
# Kill it:
kill -9 <PID>
```

**Windows:**
```powershell
netstat -ano | findstr :5000
# Kill it:
taskkill /PID <PID> /F
```

**Then restart backend:**
```bash
cd ../Zaplink_backend
npm start
```

---

### Cause: Missing Environment Variables

```bash
cd ../Zaplink_backend

# Check for .env.example
ls .env.example

# Create .env if needed:
cp .env.example .env

# Edit and fill in required variables
nano .env
```

---

## Issue: "Cannot Connect to Backend"

### Check Network Connection

```bash
# Ping the backend
curl http://localhost:5000/health

# Should return some response (200, 404, 500, etc.)
# Not connection errors
```

---

## Issue: Module Not Found

### In Frontend (node_modules)

```bash
cd ../Zaplink_frontend
rm -rf node_modules
npm install
npm run dev
```

---

### In Backend (node_modules)

```bash
cd ../Zaplink_backend
rm -rf node_modules
npm install
npm start
```

---

## Issue: Port Conflicts

### Find What's Using Ports

**Check port 5000 (Backend):**
```bash
# Linux/Mac
lsof -i :5000

# Windows
netstat -ano | findstr :5000
```

**Check port 5173 (Frontend):**
```bash
# Linux/Mac
lsof -i :5173

# Windows
netstat -ano | findstr :5173
```

### Solution: Use Different Ports

**For custom backend port:**
```bash
# In Zaplink_backend, start on different port
PORT=3000 npm start

# In Zaplink_frontend, create .env:
VITE_BACKEND_URL=http://localhost:3000
```

---

## Issue: CORS Errors

If you see errors like:
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...'
from origin 'http://localhost:5173'
has been blocked by CORS policy
```

### Solution

**Backend should handle CORS. Check backend repository for:**
- `cors` package installation
- CORS middleware configuration
- Allowed origin configuration

---

## Issue: "ECONNREFUSED" Error

This means the frontend tried to connect to backend but failed.

### Checklist
- [ ] Backend running? (`npm start` in backend directory)
- [ ] Backend on correct port? (default 5000)
- [ ] VITE_BACKEND_URL correct? (matches backend port)
- [ ] Backend API responding? (`curl http://localhost:5000/health`)
- [ ] No firewall blocking localhost connections?

---

## Issue: Changes Not Applying

### Frontend Changes Not Updating

```bash
# Frontend hot-reloads automatically
# If not working:
1. Stop: Ctrl+C
2. Restart: npm run dev
3. Hard refresh browser: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

---

### Backend Changes Not Updating

```bash
# Backend doesn't hot-reload by default
# You must manually restart:
1. Stop: Ctrl+C  
2. Restart: npm start
```

---

## Complete Reset (Nuclear Option)

If nothing works, start from scratch:

```bash
# Frontend
cd ../Zaplink_frontend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Backend (in different terminal)
cd ../Zaplink_backend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## Debug Mode

Enable debug logging in `.env`:
```env
VITE_DEBUG=true
```

Then check browser console for detailed information.

---

## Get Help

1. **Check this guide first** ← You are here
2. **Check BACKEND_SETUP.md** for setup issues
3. **Check QUICK_START.md** for simple setup
4. **Check GitHub Issues** for similar problems
5. **Ask in community channels** with:
   - What you did
   - What error you got
   - Console logs (screenshot or copy-paste)
   - Your OS and Node.js version

---

## Useful Commands Reference

```bash
# Check versions
node --version
npm --version

# Kill a process on port
lsof -ti:5000 | xargs kill -9    # Linux/Mac
netstat -ano | findstr :5000      # Windows

# Reinstall dependencies
rm -rf node_modules package-lock.json && npm install

# Start with specific port
PORT=3000 npm start

# Clear npm cache
npm cache clean --force

# Check npm global packages
npm list -g
```

---

**Last Updated**: February 2026
