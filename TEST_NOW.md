# 🧪 Testing Guide - Issue #88 Solution

## ✅ Pre-Testing Checklist

Before testing, verify:
- [ ] You have 2 terminals ready
- [ ] Backend repo cloned at `../Zaplink_backend`
- [ ] Frontend dependencies installed (`npm install` already done)
- [ ] You can see all the new documentation files
- [ ] Browser with DevTools (F12) ready

---

## 🚀 Step 1: Start the Backend (Terminal 1)

```bash
cd ../Zaplink_backend
npm install
npm start
```

### Expected Output:
```
> npm start
listening on port 5000
Server running on http://localhost:5000
Connected to database
```

**If you see this ✅ → Backend is ready!**

**If you see errors:**
- Check port 5000 isn't already in use
- Verify .env file is configured in backend
- Check Node.js version is 18+

⏸️ **Wait here** until you see "Server running on http://localhost:5000"

---

## 🎨 Step 2: Start the Frontend (Terminal 2)

```bash
cd ../Zaplink_frontend
npm run dev
```

### Expected Output:
```
VITE v6.3.5  ready in 323 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### MOST IMPORTANT - Check Console for Validation Message:
You should see a helpful message like:

```
ℹ Development Mode: Using Vite proxy for /api routes
📍 Proxy target: http://localhost:5000
```

**✅ If you see this → Configuration is correct!**

**❌ If you DON'T see this → Something is wrong**

---

## 🌐 Step 3: Open Browser & Check Console

1. Open browser: `http://localhost:5173`
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for the validation message (from Step 2)

### What You Should See:
```
ℹ Development Mode: Using Vite proxy for /api routes
📍 Proxy target: http://localhost:5000
```

**✅ Good** → Proxy is configured
**❌ Bad** → Check that backend is running

---

## 📤 Step 4: Test File Upload

### Navigate to Upload Page
- Go to: `http://localhost:5173/upload`
- Check the page loads without errors

### Upload a Test File
1. Click on a file type (e.g., "PDF")
2. Select an actual file from your computer
3. Enter a QR name (e.g., "Test Upload")
4. Click "Upload" button

### Watch for Errors
Keep DevTools open (F12) and watch:
- **Network tab**: Should see POST request to `/api/zaps/upload`
- **Console tab**: Should NOT see `404` errors

### Expected Result:
✅ Upload completes  
✅ Redirects to customize page  
✅ Shows success message  
✅ No 404 errors in console  

---

## ✅ Test Results Interpretation

### Scenario 1: Upload Works ✅
```
✅ File uploaded
✅ Redirects to customize page
✅ No errors in console
✅ Backend terminal shows request

Result: PASS - Solution is working!
```

### Scenario 2: 404 Error ❌
```
❌ "Failed to load resource: status of 404"
❌ File upload fails
❌ Backend not responding

Causes:
- Backend not running (check Terminal 1)
- Wrong port in vite.config.ts
- Backend not actually started

Fix: Restart Terminal 1 and verify connection
```

### Scenario 3: Connection Refused ❌
```
❌ "ECONNREFUSED"
❌ "Cannot connect to backend"

Causes:
- Backend not started yet
- Backend crashed
- Port 5000 blocked

Fix: Kill process on 5000 and restart backend
```

### Scenario 4: No Validation Message ❌
```
❌ Don't see "Development Mode" message
❌ Console empty or different messages

Causes:
- Frontend loaded cached version
- Package.json not updated

Fix: Hard refresh browser (Ctrl+Shift+R)
```

---

## 🔍 Additional Tests

### Test 1: Check Network Tab
1. Press F12 → Network tab
2. Try uploading file
3. Should see: `POST  /api/zaps/upload`
4. Status should be: `200` or similar success code

**NOT 404 ✅**

### Test 2: Test Other Pages
1. Visit: http://localhost:5173/how-it-works
2. Visit: http://localhost:5173/about
3. Visit: http://localhost:5173/

**All pages should load without errors ✅**

### Test 3: Test Different File Types
- Try uploading a PDF
- Try uploading an image
- Try uploading a document

**All should work ✅**

### Test 4: Check .env Configuration
```bash
# View your environment
cat .env.example

# Should have:
VITE_BACKEND_URL=http://localhost:5000
```

**Matches backend port ✅**

---

## 🐛 Debugging If Something's Wrong

### Problem: "Failed to load resource: the server responded with a status of 404"

**Diagnosis Checklist:**
```
☐ Is backend running in Terminal 1?
  → If not, the problem is here!
  
☐ Does backend Terminal 1 show "Server running"?
  → If not, check for errors
  
☐ Is port 5000 really in use?
  Run: netstat -ano | findstr :5000 (Windows)
  Run: lsof -i :5000 (Mac/Linux)
  
☐ Did you restart frontend after starting backend?
  → Try: Hard refresh browser (Ctrl+Shift+R)
```

### Problem: "ECONNREFUSED"

**This means:** Backend connection failed

**Solutions:**
```bash
# 1. Check if backend REALLY started
# Look at Terminal 1, should show "Server running on http://localhost:5000"

# 2. If not showing, there's an error in backend
# Check backend logs for issues

# 3. Make sure port 5000 isn't in use by something else:
lsof -i :5000    # Mac/Linux
netstat -ano | findstr :5000  # Windows

# 4. Kill process and restart:
kill -9 <PID>     # Mac/Linux
taskkill /PID <PID> /F  # Windows

# 5. Restart backend:
cd ../Zaplink_backend
npm start
```

### Problem: Still 404 Even With Backend Running

**Solutions:**
```bash
# 1. Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# 2. Clear node_modules and reinstall
cd ../Zaplink_frontend
rm -rf node_modules package-lock.json
npm install
npm run dev

# 3. Check vite.config.ts has proxy section
grep -A 5 "server:" vite.config.ts

# 4. Make sure no other app on port 5173
lsof -i :5173
```

---

## 📊 Success Criteria

### All tests pass when:

✅ Console shows validation message  
✅ Upload completes without 404  
✅ File redirects to customize page  
✅ No errors in browser console  
✅ Network tab shows successful requests  
✅ Backend terminal shows requests  
✅ Other pages work normally  

---

## 🎉 If All Tests Pass

Great! Your solution is working perfectly! ✅

Next steps:
1. Commit your changes
2. Push to GitHub
3. Open a Pull Request
4. Reference Issue #88
5. Include test results in PR description

---

## 📝 What to Include in PR Description

```markdown
## 🐛 Fixes Issue #88 - Upload API 404 Error

### Testing Done
- [x] Backend running on localhost:5000
- [x] Frontend proxy configured
- [x] File upload successful (no 404 error)
- [x] No errors in browser console
- [x] Network requests show success
- [x] Other pages work normally
- [x] No breaking changes

### Test Results
- Upload returns: 200 OK (not 404)
- File successfully processed by backend
- Redirects to customize page
- All features functional

### How to Test
1. Terminal 1: `cd ../Zaplink_backend && npm start`
2. Terminal 2: `cd ../Zaplink_frontend && npm run dev`
3. Browser: http://localhost:5173/upload
4. Upload a file → Should work! ✅
```

---

## ⏱️ Time Estimate

- Backend startup: 15-30 seconds
- Frontend startup: 5-10 seconds
- Test execution: 2-3 minutes
- **Total: ~5 minutes**

---

## 🆘 Still Having Issues?

1. **Check TROUBLESHOOTING.md** in frontend directory
2. **Read BACKEND_SETUP.md** for detailed setup
3. **Check browser console** (F12) for error messages
4. **Verify backend is really running** (check Terminal 1)
5. **Check vite.config.ts** has proxy configuration

---

**Ready? Start with Backend in Terminal 1! 🚀**
