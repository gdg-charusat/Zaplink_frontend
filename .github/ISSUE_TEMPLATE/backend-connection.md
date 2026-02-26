---
name: Backend Connection Issue
about: Report issues with backend connection, 404 errors, or upload failures
title: "[BUG] Upload/API failing with "
labels: ["bug", "backend-connection"]
---

## 🚨 Issue Description
<!-- Describe the issue you're experiencing -->

## 🔧 Environment
- **Node.js version**: (run `node --version`)
- **npm version**: (run `npm --version`)
- **OS**: Windows / Mac / Linux
- **Backend location**: Local / Docker / Remote URL

## 📋 Steps to Reproduce
1. 
2. 
3. 

## ❌ What's Happening
<!-- Describe the error -->

## ✅ What Should Happen
<!-- Describe expected behavior -->

## 🖼️ Screenshots
<!-- Add screenshots of error messages, console logs, etc. -->

## 📝 Console Output
<!-- Paste error from browser console (F12 > Console tab) -->
```
Paste your error here
```

## ✅ Checklist (Before Submitting!)

Please ensure you've completed the [QUICK_START.md](../../QUICK_START.md):

- [ ] I've read [QUICK_START.md](../../QUICK_START.md)
- [ ] I've read [BACKEND_SETUP.md](../../BACKEND_SETUP.md)
- [ ] I've read [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md)
- [ ] Backend is running (`npm start` in Zaplink_backend directory)
- [ ] Frontend is running (`npm run dev` in Zaplink_frontend directory)
- [ ] I've checked that `.env` file is configured correctly
- [ ] I've cleared browser cache and done hard refresh (Ctrl+Shift+R)
- [ ] I've restarted both frontend and backend servers

## 🔍 Additional Info
<!-- Anything else that might help us understand the issue -->

---

**IMPORTANT**: Most issues are caused by the backend not running. Please verify:
1. Two terminals are open
2. Terminal 1: Backend running on `http://localhost:5000`
3. Terminal 2: Frontend running on `http://localhost:5173`
4. `.env` file exists with correct backend URL
