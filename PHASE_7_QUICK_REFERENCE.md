# Phase 7: Admin Dashboard - Quick Reference Card

## 🗺️ ADMIN PAGES MAP

```
/admin/
├── dashboard          → Main hub (analytics)
├── products           → Manage products
├── orders-list        → View all orders
├── orders/[id]        → Order details + status update
├── coupons            → Create discount codes
├── pages              → Create static pages
└── reports            → Sales analytics & CSV export
```

---

## ⚡ QUICK NAVIGATION

| Path | Purpose | Key Feature |
|------|---------|-------------|
| `/admin/dashboard` | Central hub | Real-time metrics |
| `/admin/products` | Product list | Stock indicators |
| `/admin/orders-list` | Order list | Customer info |
| `/admin/orders/123` | Order detail | Status updates |
| `/admin/coupons` | Create codes | Usage tracking |
| `/admin/pages` | CMS editor | Auto-slug generation |
| `/admin/reports` | Sales data | CSV export |

---

## 🔗 API ENDPOINTS

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/analytics` | GET/POST | Dashboard metrics |
| `/api/admin/coupons` | GET/POST | Coupon management |
| `/api/admin/pages` | GET/POST | Pages management |
| `/api/admin/orders` | GET/PUT | Order management |
| `/api/admin/reports` | GET | Sales reports |

---

## 🔐 SECURITY CHECKLIST

```
✓ All pages check role='admin' server-side
✓ All APIs verify admin role before data access
✓ Database RLS policies enforce admin-only operations
✓ Service role key never exposed to client
✓ Session JWT validated on every request
✓ No hardcoded credentials anywhere
```

---

## 📊 DATABASE TABLES

### coupons
- `code` (TEXT, UNIQUE) - "SAVE20"
- `discount_type` (ENUM) - 'percentage' | 'fixed'
- `discount_value` (DECIMAL) - 20 or 500
- `min_order_amount` (nullable)
- `max_uses` (nullable)
- `uses_count` (INTEGER)
- `valid_from`, `valid_until`
- `is_active` (BOOLEAN)

### cms_pages
- `slug` (TEXT, UNIQUE) - "about-us"
- `title` (TEXT)
- `content` (TEXT) - HTML supported
- `meta_description`, `meta_keywords`
- `is_published` (BOOLEAN)

### coupon_usage
- `coupon_id` (FK)
- `user_id` (FK)
- `order_id` (FK)
- `used_at` (TIMESTAMP)

---

## 🎯 COMMON TASKS

### Create Coupon
1. → `/admin/coupons`
2. Click "+ New Coupon"
3. Fill: Code, Type, Value, Dates
4. Click "Create"

### Create CMS Page
1. → `/admin/pages`
2. Click "+ New Page"
3. Fill: Title, Content, Meta
4. Click "Create"

### Update Order Status
1. → `/admin/orders-list`
2. Click order
3. Select status
4. Click "Update Status"

### Check Sales
1. → `/admin/reports`
2. Select time range
3. View charts
4. Export CSV

---

## 📁 FILE LOCATIONS

**Admin Pages:**
```
app/admin/dashboard/page.tsx
app/admin/products/page.tsx
app/admin/orders-list/page.tsx
app/admin/orders/[orderId]/page.tsx
app/admin/coupons/page.tsx
app/admin/pages/page.tsx
app/admin/reports/page.tsx
```

**API Routes:**
```
app/api/admin/analytics/route.ts
app/api/admin/coupons/route.ts
app/api/admin/pages/route.ts
app/api/admin/orders/route.ts
app/api/admin/reports/route.ts
```

**Database:**
```
supabase/migrations/010_admin_dashboard.sql
```

---

## 🚀 QUICK START

1. **Run Migration** (Supabase SQL Editor)
   ```
   Copy: supabase/migrations/010_admin_dashboard.sql
   Paste: SQL Editor
   Click: Run
   ```

2. **Start Server**
   ```bash
   npm run dev
   ```

3. **Visit Dashboard**
   ```
   http://localhost:3000/admin/dashboard
   ```

---

## 📖 DOCUMENTATION

| File | What It Is |
|------|-----------|
| `README_PHASE_7.md` | Start here (quick overview) |
| `ADMIN_DASHBOARD_GUIDE.md` | How to use each page |
| `PHASE_7_IMPLEMENTATION.md` | Complete feature reference |
| `PHASE_7_ARCHITECTURE.md` | Technical details |
| `PHASE_7_TESTING.md` | Testing procedures |
| `PHASE_7_CHECKLIST.md` | Implementation status |
| `PHASE_7_SUMMARY.md` | Full summary |

---

## ✨ KEY FEATURES

**Dashboard**
- Revenue metric
- Order count
- Product count
- User count
- Low stock alert
- Recent orders

**Products**
- List all products
- Stock indicators
- Category display
- Edit/Delete buttons

**Orders**
- Complete list
- Customer info
- Status tracking
- Status updates
- Address display

**Coupons**
- Create codes
- Set discounts (% or ₹)
- Min order amount
- Validity dates
- Usage limits
- Auto-tracking

**Pages**
- Create pages
- Auto-slug generation
- SEO meta tags
- Publish/Draft toggle
- HTML support

**Reports**
- Daily revenue chart
- Top 5 products
- Sales breakdown
- Time range filter
- CSV export

---

## 🔧 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| "Access Denied" | Check role='admin' in database |
| 404 on admin pages | Run migration first |
| Data not showing | Refresh page (Ctrl+R) |
| Forms not saving | Check browser console for errors |
| CSV blank | Ensure you have order data |
| Slow loading | Check database indexes |

---

## 📊 PERFORMANCE TARGETS

- Dashboard: < 500ms
- Products: < 500ms
- Orders list: < 500ms
- Order detail: < 500ms
- Coupons: < 500ms
- Reports: < 1000ms
- API responses: < 200ms

---

## 🎨 COLOR CODES

**Status Badges:**
- Green = Active/Delivered/Success
- Yellow = Pending/Draft
- Blue = Processing
- Purple = Shipped
- Red = Cancelled/Inactive
- Gray = Inactive

**Stock Levels:**
- Green = Sufficient (≥10 units)
- Red = Low (<10 units)

---

## 🔑 KEYBOARD SHORTCUTS

| Shortcut | Action |
|----------|--------|
| Ctrl+R | Refresh page |
| F12 | Open developer console |
| Ctrl+Shift+I | Inspect element |
| Tab | Navigate form fields |
| Enter | Submit form |

---

## 📋 CHECKLIST

Before going to production:

- [ ] Migration 010 run in Supabase
- [ ] Can access /admin/dashboard
- [ ] Role='admin' verified in database
- [ ] Create test coupon successfully
- [ ] Create test page successfully
- [ ] Update order status successfully
- [ ] Export CSV successfully
- [ ] Non-admin redirect verified
- [ ] All pages load without errors
- [ ] No console errors

---

## 🆘 GET HELP

1. **Read documentation** (in order)
   - README_PHASE_7.md
   - ADMIN_DASHBOARD_GUIDE.md
   - PHASE_7_TESTING.md

2. **Check database** (Supabase)
   - Verify tables created
   - Check RLS policies
   - Review data

3. **Check logs**
   - Browser console (F12)
   - Terminal output
   - Supabase logs

---

## 📞 CONTACT SUPPORT

- Documentation: See README files
- Code issues: Check /app/admin folder
- Database issues: Check Supabase dashboard
- Testing: Follow PHASE_7_TESTING.md

---

## ⭐ PRO TIPS

✨ **Tip 1**: Bookmark admin pages for quick access
✨ **Tip 2**: Review reports weekly for insights
✨ **Tip 3**: Use coupons for marketing campaigns
✨ **Tip 4**: Create CMS pages for legal disclaimers
✨ **Tip 5**: Export reports for investor meetings

---

## ✅ STATUS

```
Phase 7: Admin Dashboard

Status:  ✅ COMPLETE
Code:    ✅ ALL FILES CREATED
Database: ✅ MIGRATION READY
Security: ✅ IMPLEMENTED
Testing: ✅ PROCEDURES PROVIDED
Docs:    ✅ COMPREHENSIVE

Ready: YES - Just run migration!
```

---

**Phase 7 Admin Dashboard - Ready to Deploy! 🚀**

Print this card and keep it handy while using the admin dashboard!
