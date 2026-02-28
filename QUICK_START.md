# 🚀 Quick Start Reference

## The Problem
You need **2 servers running** for local development:
1. **Backend API** - handles uploads and data
2. **Frontend Dev Server** - runs your React app

## The Solution (Copy-Paste Ready)

### Terminal 1: Start Backend
```bash
cd ../Zaplink_backend
npm install
npm start
```

Wait for: `Server running on http://localhost:5000` ✅

### Terminal 2: Start Frontend
```bash
cd ../Zaplink_frontend
npm install  # only on first time
npm run dev
```

Open: `http://localhost:5173` 🎉

## How It Works

```
Browser
  ↓
Frontend (http://localhost:5173)
  ↓
Vite Proxy (automatically routes /api to backend)
  ↓
Backend API (http://localhost:5000)
  ↓
Uploads & Data Processing
```

## Troubleshooting

| What | Where | Fix |
|------|-------|-----|
| Upload fails with 404 | Edit `.env` in frontend | Add: `VITE_BACKEND_URL=http://localhost:5000` |
| Backend won't start | Backend terminal | Check port 5000 isn't in use, or change in `.env` |
| "Cannot connect" | Browser console | Backend not running - check Terminal 1 |
| Port in use | Terminal | Change backend port in `.env` |

## Need Help?

📖 See [BACKEND_SETUP.md](BACKEND_SETUP.md) for detailed guides
