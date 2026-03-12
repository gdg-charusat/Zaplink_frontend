# 🎯 Setup Verification Flowchart-testing

```
START: npm run dev
    ↓
┌─────────────────────────┐
│ App Initializes         │
│ validateEnvironment()   │
│ is called              │
└────────────┬────────────┘
             ↓
    ┌────────────────────┐
    │ Check if Backend   │
    │ URL is configured  │
    └───┬──────────────┬─┘
        │              │
    YES │              │ NO
        ↓              ↓
   ┌─────────┐   ┌──────────────┐
   │ Using   │   │ Using Vite   │
   │ explicit│   │ proxy to     │
   │ backend │   │localhost:5000│
   └────┬────┘   └──────┬───────┘
        │               │
        └───────┬───────┘
                ↓
        ┌──────────────────┐
        │ Console Message  │
        │ Displayed        │
        └────────┬─────────┘
                 ↓
           ┌──────────────┐
           │ User uploads │
           │ a file       │
           └────┬─────────┘
                ↓
        ┌──────────────────┐
        │ POST /api/zaps/  │
        │ upload sent      │
        └────────┬─────────┘
                 ↓
    ┌──────────────────────┐
    │ Vite proxy           │
    │ intercepts request   │
    │ forwards to backend  │
    └────────┬─────────────┘
             ↓
    ┌────────────────────┐
    │ Is backend running?│
    └──┬──────────────┬──┘
       │              │
     YES              NO
       ↓              ↓
   ┌──────┐    ┌─────────────┐
   │ ✅   │    │ ❌ ECONNREFUSED
   │ File │    │ 404 Error
   │Upload│    │ Check console
   │Works │    └─────────────┘
   └──────┘

┌─────────────────────────────────────┐
│ Visual Request Flow                 │
├─────────────────────────────────────┤
│                                     │
│  Browser                            │
│  http://localhost:5173              │
│         │                           │
│         ├─ POST /api/zaps/upload    │
│         │                           │
│         ▼                           │
│  Vite Dev Server                    │
│  (vite.config.ts proxy)             │
│         │                           │
│         ├─ Intercept /api/*         │
│         │                           │
│         ├─ Forward to backend       │
│         │                           │
│         ▼                           │
│  Backend API                        │
│  http://localhost:5000              │
│         │                           │
│         ├─ Process upload           │
│         │                           │
│         ├─ Return response          │
│         │                           │
│         ▼                           │
│  Browser                            │
│  Display result                     │
│                                     │
└─────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Setup Checklist                      │
├──────────────────────────────────────┤
│                                      │
│ ✅ Is backend cloned?                │
│    cd ../Zaplink_backend             │
│                                      │
│ ✅ Is npm installed in backend?      │
│    npm install                       │
│                                      │
│ ✅ Is backend running?               │
│    npm start                         │
│    → Server running on port 5000     │
│                                      │
│ ✅ Is frontend running?              │
│    npm run dev                       │
│    → Local: http://localhost:5173   │
│                                      │
│ ✅ Can you upload?                   │
│    http://localhost:5173/upload     │
│    → Try uploading a file           │
│                                      │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ If Upload Fails                      │
├──────────────────────────────────────┤
│                                      │
│ 1. Open browser console (F12)        │
│                                      │
│ 2. Check for errors:                 │
│    ❌ ECONNREFUSED  → Backend not    │
│                       running        │
│    ❌ 404 Error    → Wrong URL or    │
│                       path           │
│    ❌ CORS Error   → Backend doesn't │
│                       allow frontend │
│                                      │
│ 3. Check backend terminal:           │
│    - Is it still running?            │
│    - Any error messages?             │
│                                      │
│ 4. Restart both servers:             │
│    - Stop backend (Ctrl+C)           │
│    - Stop frontend (Ctrl+C)          │
│    - Start backend again             │
│    - Start frontend again            │
│                                      │
│ 5. Check .env file:                  │
│    - Does it exist?                  │
│    - Is VITE_BACKEND_URL correct?    │
│                                      │
│ 6. Still not working?                │
│    → See TROUBLESHOOTING.md          │
│                                      │
└──────────────────────────────────────┘
```

## 📊 Directory Structure After Setup

```
Zaplink/
├── Zaplink_frontend/           ← You are here
│   ├── .env                    ← Create this (copy from .env.example)
│   ├── .env.example            ← Configuration template
│   ├── QUICK_START.md          ← Start here!
│   ├── BACKEND_SETUP.md        ← Backend help
│   ├── TROUBLESHOOTING.md      ← Problem solving
│   ├── README.md               ← Project info
│   ├── vite.config.ts          ← Has proxy config
│   ├── src/
│   │   ├── App.tsx             ← Has environment validation
│   │   ├── lib/
│   │   │   ├── environment.ts  ← Validation logic
│   │   │   └── apiClient.ts    ← API utilities
│   │   └── components/
│   │       ├── UploadPage.tsx  ← Fixed API calls
│   │       ├── ViewZap.tsx     ← Fixed API calls
│   │       └── UrlShortenerPage.tsx ← Fixed API call
│   └── package.json
│
└── Zaplink_backend/            ← Backend (sibling directory)
    ├── server.js (or main.py)  ← Start this with npm start
    ├── .env                    ← Backend config
    ├── package.json
    └── ... other files
```

## 🚀 Quick Reference Commands

```bash
# Start Backend (Terminal 1)
cd ../Zaplink_backend
npm install
npm start

# Start Frontend (Terminal 2)  
cd ../Zaplink_frontend
npm install
npm run dev

# Test Upload
Open http://localhost:5173/upload and upload a file

# View Logs
Browser: F12 (DevTools)
Backend: Check Terminal 1 output

# Troubleshoot
See: TROUBLESHOOTING.md
See: BACKEND_SETUP.md
```
