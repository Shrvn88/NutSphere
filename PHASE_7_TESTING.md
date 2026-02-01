# Phase 7: Admin Dashboard - Testing Checklist

## ✅ Pre-Testing Setup

### Step 1: Run Database Migration
```
[ ] Open Supabase Dashboard
    [ ] Go to SQL Editor
    [ ] Create new query
    [ ] Copy supabase/migrations/010_admin_dashboard.sql
    [ ] Paste into SQL editor
    [ ] Click Run
    [ ] Wait for confirmation message
    [ ] Verify no errors
```

### Step 2: Start Dev Server
```
[ ] Terminal: npm run dev
[ ] Wait for "ready - started server on 0.0.0.0:3000"
[ ] Verify no errors in console
```

### Step 3: Verify Admin Account
```
[ ] Login with: omkar.mahajan2024.it@mmcoe.edu.in
[ ] Navigate to: /user/profile
[ ] Verify: role = "admin" in database
    [ ] Supabase → Table Editor → profiles
    [ ] Find your user row
    [ ] Check role column = "admin"
```

---

## 🧪 Dashboard Page Tests

### Dashboard Main Page (`/admin/dashboard`)
```
[ ] NAVIGATION
    [ ] Can access /admin/dashboard
    [ ] Page loads without errors
    [ ] No 404 or 403 errors

[ ] SECURITY
    [ ] Logout, try to access /admin/dashboard
    [ ] Should redirect to home page
    [ ] Non-admin user cannot access

[ ] METRICS DISPLAY
    [ ] Total Revenue card shows ₹ amount
    [ ] Total Orders card shows count
    [ ] Total Products card shows count
    [ ] Total Users card shows count
    [ ] Low Stock Products card shows count

[ ] RECENT ORDERS TABLE
    [ ] Table displays (if you have orders)
    [ ] Shows Order #, Customer, Amount, Status
    [ ] Shows max 5 recent orders
    [ ] Status badges have correct colors
    [ ] Hover effect on rows

[ ] QUICK ACTION BUTTONS
    [ ] "Products" button links to /admin/products
    [ ] "Orders" button links to /admin/orders-list
    [ ] "Coupons" button links to /admin/coupons
    [ ] "Pages" button links to /admin/pages
    [ ] "Reports" button links to /admin/reports
    [ ] All buttons navigate correctly
```

---

## 🛍️ Products Page Tests (`/admin/products`)

```
[ ] NAVIGATION
    [ ] Can access /admin/products
    [ ] Page title shows "Product Management"
    [ ] "+ Add Product" button visible

[ ] PRODUCT LIST
    [ ] Loads all products from database
    [ ] Shows columns: Product, SKU, Price, Stock, Category, Status
    [ ] Stock column shows unit count
    [ ] Low stock (< 10) shows in RED
    [ ] Normal stock shows in GREEN

[ ] PRODUCT DETAILS
    [ ] Product names display correctly
    [ ] Prices show with ₹ symbol
    [ ] SKU displays (or "-" if empty)
    [ ] Categories display correctly
    [ ] Status shows "Active" or "Inactive"

[ ] ACTION BUTTONS
    [ ] "Edit" button visible for each product
    [ ] "Delete" button visible for each product
    [ ] (These will work in Phase 7.1)

[ ] EMPTY STATE
    [ ] If no products, shows empty message
    [ ] Link to create first product visible
```

---

## 📋 Orders List Page Tests (`/admin/orders-list`)

```
[ ] NAVIGATION
    [ ] Can access /admin/orders-list
    [ ] Page title shows "Order Management"

[ ] ORDERS TABLE
    [ ] Displays all customer orders
    [ ] Shows columns: Order Number, Customer, Amount, Payment, Status, Date
    [ ] Shows correct count of orders below title

[ ] ORDER DATA
    [ ] Order numbers display (e.g., ORD-123)
    [ ] Customer names display correctly
    [ ] Customer emails display
    [ ] Amounts show with ₹ symbol and decimals
    [ ] Payment status badges show (paid/pending)
    [ ] Order status badges show correct colors:
        [ ] Pending = Yellow
        [ ] Processing = Blue
        [ ] Shipped = Purple
        [ ] Delivered = Green
        [ ] Cancelled = Red
    [ ] Dates formatted correctly (DD MMM YYYY)

[ ] NAVIGATION
    [ ] "View Details" link on each order
    [ ] Clicking link navigates to /admin/orders/[orderId]
    [ ] Back button on order detail works

[ ] EMPTY STATE
    [ ] If no orders, shows "No orders found"
```

---

## 🔍 Order Detail Page Tests (`/admin/orders/[orderId]`)

```
[ ] NAVIGATION
    [ ] Can access /admin/orders/[orderId]
    [ ] "← Back to Orders" link visible
    [ ] Clicking back returns to orders list

[ ] ORDER INFORMATION
    [ ] Order number displays correctly
    [ ] Shows all order items in table
    [ ] Item table shows: Product, Qty, Price, Subtotal

[ ] ORDER ITEMS
    [ ] Product names are clickable links
    [ ] Links point to /products/[slug]
    [ ] Quantities display correctly
    [ ] Unit prices show with ₹
    [ ] Subtotals calculated correctly
    [ ] Total amount shows at bottom

[ ] CUSTOMER DETAILS (Right Sidebar)
    [ ] Customer full name displays
    [ ] Customer email displays
    [ ] Customer phone displays (or "N/A")

[ ] ADDRESSES
    [ ] Shipping address section visible
    [ ] Billing address section visible
    [ ] Both show: name, phone, address lines, city, state, pincode, country

[ ] ORDER STATUS SECTION
    [ ] Payment status badge shows (paid/pending)
    [ ] Order status dropdown shows current status
    [ ] Dropdown options: pending, processing, shipped, delivered, cancelled
    [ ] "Update Status" button visible
    [ ] Selecting new status and clicking button:
        [ ] Status updates in database
        [ ] Page refreshes with new status
        [ ] No errors shown
    [ ] Order date displays formatted
```

---

## 🏷️ Coupons Page Tests (`/admin/coupons`)

```
[ ] NAVIGATION
    [ ] Can access /admin/coupons
    [ ] Page title shows "Coupon Management"

[ ] INITIAL STATE
    [ ] "+ New Coupon" button visible
    [ ] Form is hidden initially
    [ ] Coupon list visible (or empty state)

[ ] SHOW/HIDE FORM
    [ ] Click "+ New Coupon" → form appears
    [ ] Click "Cancel" → form hides
    [ ] Toggle works multiple times

[ ] CREATE COUPON FORM
    [ ] All fields present:
        [ ] Coupon Code input
        [ ] Discount Type dropdown (percentage/fixed)
        [ ] Discount Value input
        [ ] Min Order Amount input (optional)
        [ ] Valid From date picker
        [ ] Valid Until date picker (optional)
        [ ] Max Uses input (optional)
    [ ] Can fill all fields
    [ ] Validation works (required fields)

[ ] CREATE COUPON - SUCCESSFUL
    [ ] Fill form with valid data:
        Code: "TEST20"
        Type: "percentage"
        Value: 20
        Min Order: 500
        Valid From: Today
        Valid Until: Next month
        Max Uses: 100
    [ ] Click "Create Coupon"
    [ ] Success (no error message)
    [ ] Form clears
    [ ] Form hides
    [ ] New coupon appears in list

[ ] COUPON LIST
    [ ] All coupons display in table
    [ ] Columns show:
        [ ] Code (bold, monospace font)
        [ ] Discount (shows "20%" or "₹500")
        [ ] Min Order (shows "₹500" or "-")
        [ ] Uses (shows "0/100" or "0/Unlimited")
        [ ] Valid Until date (or "No limit")
        [ ] Status badge (Active/Inactive)

[ ] COUPON STATUS
    [ ] Active coupons show green badge
    [ ] Inactive coupons show gray badge

[ ] EMPTY STATE
    [ ] If no coupons, shows empty message
    [ ] Link to create coupon visible
```

---

## 📄 Pages (CMS) Tests (`/admin/pages`)

```
[ ] NAVIGATION
    [ ] Can access /admin/pages
    [ ] Page title shows "CMS Pages"

[ ] SHOW/HIDE FORM
    [ ] "+ New Page" button visible
    [ ] Click button → form appears
    [ ] Click "Cancel" → form hides

[ ] CREATE PAGE FORM
    [ ] All fields present:
        [ ] Page Title input
        [ ] Slug input (disabled/auto-generated)
        [ ] Content textarea
        [ ] Meta Description input
        [ ] Meta Keywords input
        [ ] Publish checkbox
    [ ] Title field is required
    [ ] Content field is required

[ ] SLUG AUTO-GENERATION
    [ ] Type "About Us" in title
    [ ] Slug auto-fills as "about-us"
    [ ] Slug updates when title changes
    [ ] Spaces convert to dashes
    [ ] Special characters removed
    [ ] Slug is lowercase

[ ] CREATE PAGE - SUCCESSFUL
    [ ] Fill form:
        Title: "About Us"
        Content: "Our story..."
        Meta: "About our company"
        Keywords: "about, company"
        Publish: Checked
    [ ] Click "Create Page"
    [ ] Success (no error)
    [ ] Form clears
    [ ] Form hides
    [ ] New page appears in list

[ ] PAGES TABLE
    [ ] All pages display
    [ ] Columns show:
        [ ] Title
        [ ] Slug (with leading /)
        [ ] Last Updated date
        [ ] Status (Published/Draft)
    [ ] Edit button visible
    [ ] Delete button visible

[ ] PAGE STATUS
    [ ] Published pages show green badge
    [ ] Draft pages show yellow badge

[ ] EMPTY STATE
    [ ] If no pages, shows empty message
    [ ] Link to create page visible
```

---

## 📊 Reports Page Tests (`/admin/reports`)

```
[ ] NAVIGATION
    [ ] Can access /admin/reports
    [ ] Page title shows "Reports & Analytics"

[ ] CONTROLS
    [ ] Time range dropdown visible
    [ ] Default shows "Last 30 days"
    [ ] Options: 7, 30, 90, 365 days
    [ ] "↓ Export CSV" button visible

[ ] SUMMARY CARDS
    [ ] Total Revenue card shows ₹ amount
    [ ] Total Orders card shows count
    [ ] Both update when time range changes

[ ] DAILY REVENUE CHART
    [ ] Chart displays with bars
    [ ] Each bar represents one day
    [ ] Bar height represents revenue amount
    [ ] Dates show on x-axis
    [ ] Hover shows tooltip with revenue

[ ] TOP PRODUCTS SECTION
    [ ] Shows up to 5 top products
    [ ] Each product shows: name, units sold, revenue
    [ ] Products sorted by revenue (highest first)
    [ ] Shows "No sales data available" if empty

[ ] DAILY BREAKDOWN TABLE
    [ ] Table shows all daily data
    [ ] Columns: Date, Orders, Revenue, Avg Order Value
    [ ] Dates formatted nicely
    [ ] Revenue shows with ₹ and 2 decimals
    [ ] Avg Order Value = Revenue ÷ Orders

[ ] TIME RANGE CHANGES
    [ ] Select "Last 7 days"
        [ ] Chart updates
        [ ] Table updates
        [ ] Metrics update
    [ ] Select "Last 90 days"
        [ ] Chart updates
        [ ] More data points appear
    [ ] Select "Last year"
        [ ] All data appears

[ ] CSV EXPORT
    [ ] Click "↓ Export CSV"
    [ ] File downloads: sales-report-YYYY-MM-DD.csv
    [ ] Open CSV file
    [ ] Headers: Date, Revenue, Orders
    [ ] Data rows match table display
    [ ] Can open in Excel without errors
```

---

## 🔐 Security Tests

```
[ ] ROLE-BASED ACCESS
    [ ] Login as admin
        [ ] Can access /admin/dashboard ✓
        [ ] Can access all /admin/* pages ✓
    [ ] Create test non-admin user
    [ ] Login as non-admin
        [ ] Try /admin/dashboard
        [ ] Should redirect to home page
        [ ] No error page, clean redirect
    [ ] Try other admin pages
        [ ] All redirect to home page

[ ] API ENDPOINT SECURITY
    [ ] Call /api/admin/analytics without auth
        [ ] Should return 401 Unauthorized
    [ ] Call with non-admin user auth
        [ ] Should return 403 Forbidden
    [ ] Call with admin auth
        [ ] Should return 200 OK with data

[ ] DATABASE RLS
    [ ] In Supabase, verify RLS enabled:
        [ ] coupons table has RLS
        [ ] cms_pages table has RLS
        [ ] coupon_usage table has RLS
    [ ] Policies exist for each table
    [ ] Admin can insert/update
    [ ] Users cannot insert/update
    [ ] Users can only read published items

[ ] NO SENSITIVE DATA EXPOSURE
    [ ] Service role key never in:
        [ ] Browser console
        [ ] Network requests
        [ ] Page source
        [ ] Local storage
    [ ] Only in server-side .env files
```

---

## 🚀 Performance Tests

```
[ ] PAGE LOAD TIMES
    [ ] Dashboard loads in < 1 second
    [ ] Products page loads in < 1 second
    [ ] Orders list loads in < 1 second
    [ ] Reports page loads in < 2 seconds
    [ ] No "Loading..." spinners on page load

[ ] API RESPONSE TIMES
    [ ] /api/admin/analytics < 200ms
    [ ] /api/admin/coupons < 200ms
    [ ] /api/admin/pages < 200ms
    [ ] /api/admin/orders < 200ms
    [ ] /api/admin/reports < 500ms

[ ] CSV EXPORT
    [ ] Generates in < 2 seconds
    [ ] File size reasonable (< 5MB)
    [ ] No timeouts

[ ] BROWSER PERFORMANCE
    [ ] No console errors
    [ ] No network errors
    [ ] No JavaScript warnings
    [ ] DOM interactive time < 1s
```

---

## 📱 Responsiveness Tests

```
[ ] DESKTOP (1920x1080)
    [ ] All pages layout correctly
    [ ] Tables readable
    [ ] Forms layout properly
    [ ] No content overflow

[ ] TABLET (768x1024)
    [ ] Navigation adapts
    [ ] Tables still readable
    [ ] Stacking works correctly
    [ ] Forms responsive

[ ] MOBILE (375x667)
    [ ] Navigation works
    [ ] Tables stack properly
    [ ] Forms fill width
    [ ] Buttons tappable (40px+ minimum)
    [ ] No horizontal scroll
```

---

## 🐛 Error Handling Tests

```
[ ] FORM ERRORS
    [ ] Submit empty coupon form
        [ ] Shows validation error
        [ ] Required fields highlighted
    [ ] Submit empty page form
        [ ] Shows validation error
    [ ] Submit invalid date range
        [ ] Shows error message

[ ] API ERRORS
    [ ] Server offline → graceful error message
    [ ] Database error → friendly message
    [ ] Invalid input → specific error

[ ] DATABASE ERRORS
    [ ] Duplicate coupon code
        [ ] Shows error: "Code already exists"
    [ ] Duplicate page slug
        [ ] Shows error appropriately
```

---

## 📝 Final Checklist

```
[ ] All 7 admin pages accessible
[ ] All 5 API endpoints working
[ ] Database migration run successfully
[ ] No security issues
[ ] No console errors
[ ] All tests passed
[ ] Documentation complete
[ ] Ready for production

SIGN OFF
Date: ________
Tested By: ___________
Issues Found: ________
```

---

## Common Issues & Fixes

### Issue: "Access Denied" on admin pages
**Fix:** 
1. Verify login
2. Check role in profiles table
3. Make sure role = 'admin' (not 'user')

### Issue: 404 on admin pages
**Fix:**
1. Make sure dev server is running
2. Check URL spelling
3. Verify pages directory structure

### Issue: Form submit does nothing
**Fix:**
1. Check browser console for errors
2. Verify API endpoint responding
3. Ensure role='admin' on auth

### Issue: Data not appearing after create
**Fix:**
1. Refresh page (Ctrl+R)
2. Check Supabase tables directly
3. Verify no errors in form submission

### Issue: CSV export blank
**Fix:**
1. Check if you have order data
2. Verify time range is correct
3. Try different date range

---

**Phase 7 Testing Complete! ✅**

All tests passing → Admin Dashboard Ready for Production! 🚀
