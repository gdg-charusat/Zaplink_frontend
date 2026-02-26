# Issues Found in Zaplink Frontend

## 🔴 Critical Issues

### 1. **Missing Dependency in ViewZap.tsx**
**File:** [src/components/ViewZap.tsx](src/components/ViewZap.tsx#L195)
**Severity:** High
**Issue:** The useEffect hook has an `eslint-disable-next-line` comment to suppress a missing dependency warning. The `navigate` function should be added to the dependency array.
```tsx
// Current (Line 195-201):
useEffect(() => {
  if (passwordRequired) {
    navigate(location.pathname, { /* ... */ });
  }
  // eslint-disable-next-line
}, [passwordRequired]);

// Should be:
}, [passwordRequired, navigate, location.pathname]);
```
**Impact:** Could cause stale closure bugs where the navigate function doesn't update properly.

---

### 2. **Environment Variable Access Pattern Inconsistency**
**Files Affected:**
- [src/components/ZapAnalytics.tsx](src/components/ZapAnalytics.tsx#L56)
- [src/components/DeleteZapModal.tsx](src/components/DeleteZapModal.tsx#L57)
- [src/components/Dashboard.tsx](src/components/Dashboard.tsx#L122)

**Severity:** High
**Issue:** Multiple components directly access `import.meta.env.VITE_BACKEND_URL` instead of using the centralized API service.
```tsx
// ZapAnalytics.tsx - Line 56:
const response = await axios.get(
  `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${shortId}/analytics`
);

// Should use centralized api.ts instead:
// But api.ts doesn't have this endpoint defined!
```
**Impact:** 
- Breaks consistency with error handling
- Misses timeout configuration from apiClient
- No fallback handling if VITE_BACKEND_URL is not configured
- Makes it harder to maintain and modify API endpoints

---

### 3. **Vite Configuration Uses process.env Instead of import.meta.env**
**File:** [vite.config.ts](vite.config.ts#L16)
**Severity:** High
**Issue:** Vite proxy configuration uses `process.env.VITE_BACKEND_URL` which doesn't work with Vite's environment variable system.
```typescript
// Current (vite.config.ts):
proxy: {
  "/api": {
    target: process.env.VITE_BACKEND_URL || "http://localhost:5000",
    // ...
  },
}

// Should be:
proxy: {
  "/api": {
    target: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
    // ...
  },
}
```
**Impact:** The proxy may not work correctly when VITE_BACKEND_URL is set because process.env can't access Vite environment variables. Proxy falls back to localhost:5000 regardless of .env configuration.

---

## 🟡 Major Issues

### 4. **Navigation State Dependencies Not Validated**
**Files Affected:**
- [src/components/Customize.tsx](src/components/Customize.tsx#L36-L38)
- [src/App.tsx](src/App.tsx#L24-L28)

**Severity:** Medium
**Issue:** Multiple route pages depend on `location.state` being set, but there's no validation or default fallback.
```tsx
// Customize.tsx - Line 36-38:
const state = (location.state as CustomizePageState) || null;
const qrRef = useRef<HTMLDivElement>(null);

// If user navigates directly to /customize, state is null
// Component tries to use state?.shortUrl which results in "https://zaplink.example.com/demo123"
```
**Impact:** 
- If users bookmark `/customize` or `/zaps/:shortId/analytics` and revisit, they'll see empty or placeholder data
- No error message to guide users back to the upload flow
- ViewZapWrapper relies on `location.state.passwordRequired` which may not always exist

---

### 5. **Missing Error Boundary for API Calls**
**Files Affected:**
- [src/components/AnalyticsLookup.tsx](src/components/AnalyticsLookup.tsx#L7)
- [src/components/ZapAnalytics.tsx](src/components/ZapAnalytics.tsx#L56)
- [src/components/Dashboard.tsx](src/components/Dashboard.tsx)

**Severity:** Medium
**Issue:** No error boundary components to catch and gracefully handle unexpected errors.
**Impact:** Unhandled errors could crash the entire application.

---

### 6. **Time Input Parsing Ambiguity in UploadPage**
**File:** [src/components/UploadPage.tsx](src/components/UploadPage.tsx#L256)
**Severity:** Medium
**Issue:** The self-destruct time value is parsed as hours but the UI doesn't clearly indicate this.
```tsx
// Line 256 in multiple places:
const expirationTime = new Date();
const hours = parseInt(timeValue);  // User might think this is minutes/days
if (!isNaN(hours)) {
  expirationTime.setTime(
    expirationTime.getTime() + hours * 60 * 60 * 1000,  // Always treats as hours
  );
}
```
**Impact:** Users could set wrong expiration times thinking they're setting minutes when they're actually setting hours.

---

### 7. **RecentLinks Component Has Type Mismatch**
**Files:**
- [src/types/recentLink.ts](src/types/recentLink.ts)
- [src/utils/recentLinks.ts](src/utils/recentLinks.ts)
- [src/components/RecentLinks.tsx](src/components/RecentLinks.tsx)

**Severity:** Medium
**Issue:** The `RecentLink` interface requires `id: number`, but there's no ID generation or validation logic. localStorage might contain string types or missing IDs.
```typescript
// recentLink.ts:
export interface RecentLink {
  id: number;  // How is this ID assigned when saving?
  url: string;
  createdAt: string;
}

// In recentLinks.ts saveRecentLink():
// No ID is generated or passed
```
**Impact:** When deleting recent links, the ID matching might fail silently.

---

### 8. **Weak Deletion Token Validation**
**File:** [src/components/DeleteZapModal.tsx](src/components/DeleteZapModal.tsx#L39)
**Severity:** Medium
**Issue:** The token validation only checks if it's non-empty string, not actual format validation.
```tsx
const validateTokenFormat = (token: string): boolean => {
  // Basic validation: token should not be empty and should have reasonable length
  return token.trim().length > 0;  // Any non-empty string passes!
};
```
**Impact:** User might paste an invalid token and get a generic error from the backend instead of client-side validation.

---

## 🟠 Minor Issues

### 9. **Hardcoded API URLs in Comments**
**Files:** Multiple documentation files
**Severity:** Low
**Issue:** Documentation contains example API URLs that might be outdated or conflicting with actual configuration.

---

### 10. **Missing Health Check Before Upload**
**File:** [src/lib/environment.ts](src/lib/environment.ts#L77)
**Severity:** Low
**Issue:** The `checkBackendConnection()` function is defined but never called in the application.
```typescript
export async function checkBackendConnection(
  timeout: number = 5000
): Promise<boolean> {
  // Defined but unused!
}
```
**Impact:** Users don't get warned if the backend is down before attempting uploads.

---

### 11. **useScrollRestoration Hook Memory Leak Risk**
**File:** [src/hooks/useScrollRestoration.ts](src/hooks/useScrollRestoration.ts)
**Severity:** Low
**Issue:** The global `scrollPositions` Map keeps growing indefinitely and is never cleaned up.
```typescript
const scrollPositions = new Map<string, number>();  // Never cleared
```
**Impact:** Long-running sessions with many page navigations could cause memory leaks.

---

### 12. **FileUpload Component Has Cleanup Issue**
**File:** [src/components/FileUpload.tsx](src/components/FileUpload.tsx#L160)
**Severity:** Low
**Issue:** The `isInitialMount` ref check works but is a code smell. The dependency array should be managed better.
```typescript
// eslint-disable-next-line react-hooks/exhaustive-deps
```
Comment suggests the team is suppressing a legitimate warning rather than fixing it properly.

---

### 13. **Dashboard Hard-Codes Mock Data Threshold**
**File:** [src/components/Dashboard.tsx](src/components/Dashboard.tsx#L122)
**Severity:** Low
**Issue:** When `VITE_BACKEND_URL` is not configured, the app silently uses mock data without clearly warning the user.
```typescript
const MOCK_TOTAL_ITEMS = 1500;
const USE_MOCK_ZAPS = 
  import.meta.env.VITE_USE_MOCK_ZAPS === "true" || !BACKEND_URL;
```
**Impact:** Users might think they're seeing real data when they're actually viewing mock/demo data.

---

## 📋 Summary Table

| Issue | Severity | File(s) | Type |
|-------|----------|---------|------|
| Missing dependency in useEffect | 🔴 Critical | ViewZap.tsx | React Hook |
| Inconsistent API access pattern | 🔴 Critical | Multiple | Architecture |
| Vite config uses process.env | 🔴 Critical | vite.config.ts | Configuration |
| No validation of location.state | 🟡 Major | Customize, App | Navigation |
| No error boundaries | 🟡 Major | Multiple | Error Handling |
| Time input ambiguity | 🟡 Major | UploadPage.tsx | UX |
| RecentLinks type mismatch | 🟡 Major | recentLinks.ts | Type Safety |
| Weak token validation | 🟡 Major | DeleteZapModal.tsx | Validation |
| Hardcoded API URLs in docs | 🟠 Minor | Documentation | Documentation |
| Unused backend check function | 🟠 Minor | environment.ts | Code Quality |
| scrollPositions memory leak risk | 🟠 Minor | useScrollRestoration.ts | Memory |
| FileUpload eslint-disable | 🟠 Minor | FileUpload.tsx | Code Quality |
| Mock data without warning | 🟠 Minor | Dashboard.tsx | UX |

---

## 🔧 Recommendations

1. **Add proper error boundaries** using React Error Boundary pattern
2. **Create a centralized environment configuration** validator
3. **Implement form state persistence** with validation on route changes
4. **Add backend health check** on app initialization
5. **Fix all eslint-disable comments** by properly adding dependencies
6. **Improve time input UX** with clear labeling (e.g., "Hours after...")
7. **Implement proper ID generation** for RecentLinks
8. **Add warning banner** when using mock data
9. **Clean up scrollPositions Map** periodically or implement size limits
10. **Add comprehensive error handling** for all API calls
