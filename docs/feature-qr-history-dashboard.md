# Feature Specification: QR Code History/Management Dashboard

**Feature ID:** #16 | **Priority:** HIGH | **Effort:** 3-4 weeks | **Phase:** 2

---

## 🎯 Problem Statement

**Current State:** Users create QR codes but have no way to view, manage, or retrieve them later. All competitors have this essential feature.

**User Pain Points:**
- "I created a QR code last week but can't find it"
- "Need to recreate QR codes from scratch"
- "Can't track active vs expired QR codes"

**Impact:** Poor retention, competitive disadvantage, lost revenue opportunity

---

## 🎨 Core Features (MVP)

1. **View All QR Codes** - Grid/list of previously created QR codes
2. **Search** - Find QR codes by name, type, or date
3. **Filter** - By status (active/expired), type, password protection
4. **Sort** - By date, name, or view count
5. **Download** - Re-download QR codes from history
6. **Delete** - Remove unwanted QR codes
7. **Details Modal** - View metadata (views, expiry, security)
8. **Bulk Actions** - Select multiple for delete/download
9. **Copy Link** - Quick copy of short URLs

---

## 🔧 Technical Implementation

### Frontend Components
```
src/
├── pages/Dashboard.tsx
└── components/Dashboard/
    ├── QRCardGrid.tsx       // Grid layout
    ├── QRCard.tsx           // Individual card
    ├── QRDetailModal.tsx    // Detail view
    ├── SearchBar.tsx
    ├── FilterPanel.tsx
    └── BulkActions.tsx
```

### API Endpoints
```typescript
GET    /api/user/qr-codes           // List with pagination/filters
GET    /api/user/qr-codes/:zapId    // Detailed info
DELETE /api/user/qr-codes/:zapId    // Delete QR code
POST   /api/user/qr-codes/bulk-delete
PUT    /api/user/qr-codes/:zapId/archive
GET    /api/user/qr-codes/export    // CSV export
```

### Database Schema
```sql
-- Add to zaps table
ALTER TABLE zaps ADD COLUMN user_id VARCHAR(255);
ALTER TABLE zaps ADD COLUMN archived BOOLEAN DEFAULT FALSE;
ALTER TABLE zaps ADD COLUMN tags JSON;
ALTER TABLE zaps ADD INDEX idx_user_id (user_id);
```

### Data Types
```typescript
interface QRCodeHistory {
  id: string;
  zapId: string;
  name: string;
  type: FileType;
  shortUrl: string;
  qrCodeDataUrl: string;
  createdAt: Date;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'limited';
  viewCount: number;
  viewLimit?: number;
  passwordProtected: boolean;
}
```

---

## 🔐 Authentication

**Requirement:** User session tracking (anonymous + registered users)

- **Anonymous:** Generate session ID → localStorage/cookie → 30-day expiry
- **Registered:** Email/password or OAuth → JWT tokens
- **Security:** HttpOnly cookies, rate limiting (100 req/min), parameterized queries

---

## 📅 Implementation Timeline

| Week | Milestone | Tasks |
|------|-----------|-------|
| 1-2 | Backend + Basic UI | Auth system, API endpoints, Dashboard page, QR cards, Search |
| 3 | Advanced Features | Filters, Sort, Detail modal, Pagination |
| 4 | Polish + Launch | Bulk actions, CSV export, Testing, Mobile responsive |

**Launch Date:** March 23, 2026

---

## 🎨 UI Design

**Layout:** Responsive grid (4 cols desktop → 1 col mobile)  
**Card Style:** Rounded corners, hover effects, status badges  
**Status Colors:** Green (active), Red (expired), Orange (limited), Blue (password)  
**Animations:** 300ms transitions, skeleton loading states

---

## 📊 Success Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Dashboard Visit Rate | - | 60%+ users |
| Return User Rate | - | 40%+ within 7 days |
| QR Re-downloads | - | 25%+ of downloads |
| Avg QR per User | 1.2 | 3.5+ |
| Session Duration | 2 min | 5+ min |
| Conversion to Paid | 2% | 5%+ |

---

## 🧪 Testing

**Unit:** Component rendering, hooks, filters  
**Integration:** Create → View → Download → Delete flow  
**E2E:** Full user journey with search/filter/bulk actions  
**Performance:** < 2s load time, < 200ms search response

---

## 🚀 Deployment

**Strategy:** Phased rollout with feature flags
- Week 1: 5% beta users → collect feedback
- Week 2: 25% users → monitor metrics
- Week 3: 100% users → full launch

---

## ✅ Acceptance Criteria

**Must Have:**
- ✅ View all QR codes in grid/list
- ✅ Search by name
- ✅ Filter by status and type
- ✅ Delete QR codes
- ✅ Download from history
- ✅ Mobile responsive
- ✅ Loading states

**Should Have:**
- ✅ Sort functionality
- ✅ Detail modal
- ✅ Bulk actions
- ✅ Copy link button

---

## 💰 Business Case

**Development Cost:** $13,000 (240 hours)  
**Expected ROI:** 450%+ in 12 months  
**Break-even:** 2-3 months  
**Impact:** +100% user retention, +150% conversions, -80% support tickets

---

## 🔮 Future Enhancements (Phase 3)

- Folders/collections for organization
- Custom tags
- Team collaboration
- Advanced analytics (heatmaps, geo-data)
- Trash/recovery (30-day)
- Auto-archive rules

---

**Last Updated:** February 23, 2026  
**Status:** Ready for Implementation
