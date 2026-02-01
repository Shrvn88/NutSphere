# Admin Dashboard Guide

## Quick Start

### 1. Run Database Migration
This is **REQUIRED** before using the admin dashboard.

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to SQL Editor → New Query
3. Copy the entire contents of `supabase/migrations/010_admin_dashboard.sql`
4. Paste into SQL editor
5. Click **Run**
6. Verify success (tables created)

### 2. Access Admin Dashboard
1. Login with your admin account
2. Visit: `http://localhost:3000/admin/dashboard`
3. You should see the analytics dashboard

---

## Admin Pages Overview

### 📊 Dashboard (`/admin/dashboard`)
Your hub for all admin operations.

**What you see:**
- 5 metric cards (total revenue, orders, products, users, low stock items)
- 5 quick action buttons (Products, Orders, Coupons, Pages, Reports)
- Table of 5 most recent orders

**What it does:**
- Shows real-time business metrics
- Provides quick navigation to all admin sections
- Displays recent activity

---

### 📦 Products (`/admin/products`)
Manage your product catalog.

**Features:**
- List all products with details
- See stock levels (red alert if < 10 units)
- View price, SKU, category, status
- Edit product button (for later)
- Delete product button (for later)

**How to use:**
1. Go to `/admin/products`
2. Browse your products
3. Click "Edit" to modify (feature coming soon)
4. Click "Delete" to remove (feature coming soon)
5. Click "+ Add Product" to create new (feature coming soon)

---

### 📋 Orders (`/admin/orders-list`)
View and manage all customer orders.

**Features:**
- List all customer orders
- See customer name & email
- Order amount and payment status
- Order status (pending, processing, shipped, delivered, cancelled)
- Date placed

**How to use:**
1. Go to `/admin/orders-list`
2. See all orders in a table
3. Click "View Details" to see full order info
4. From order details, update the status

---

### 🎯 Order Details (`/admin/orders/[orderId]`)
Manage individual orders.

**What you see:**
- Complete order information
- List of items ordered (with prices)
- Customer contact details
- Shipping address
- Billing address
- Order total
- Payment & order status

**What you can do:**
- Update order status (pending → processing → shipped → delivered)
- View customer addresses
- See exact items ordered
- Track payment status

**How to update status:**
1. Open order details
2. Scroll to "Order Status" section (right sidebar)
3. Select new status from dropdown
4. Click "Update Status"
5. Status updates immediately in database

---

### 🏷️ Coupons (`/admin/coupons`)
Create and manage discount codes.

**Features:**
- View all active coupons
- See discount code, type, value
- Track usage (current uses / max uses)
- View validity dates
- Create new coupons

**How to create a coupon:**
1. Click "+ New Coupon" button
2. Fill in the form:
   - **Coupon Code**: e.g., "SAVE20" (must be unique)
   - **Discount Type**: 
     - Percentage (%) - e.g., 20% off
     - Fixed Amount (₹) - e.g., ₹500 off
   - **Discount Value**: 20 or 500 (depending on type)
   - **Min Order Amount**: Optional (e.g., ₹1000 minimum)
   - **Valid From**: Start date
   - **Valid Until**: End date (optional for unlimited)
   - **Max Uses**: Total uses allowed (optional for unlimited)

3. Click "Create Coupon"
4. Coupon appears in list immediately

**Example:**
- Code: `WELCOME50`
- Type: Fixed Amount
- Value: ₹50
- Min Order: ₹500
- Uses: Max 100
- Valid: Jan 2024 - Dec 2024
→ Gives ₹50 off orders ≥₹500, limited to 100 uses

---

### 📄 Pages (`/admin/pages`)
Create static CMS pages (About Us, Terms, Privacy, etc).

**Features:**
- View all pages
- See page title, slug, status
- Track last updated date
- Create new pages
- Edit pages (coming soon)
- Delete pages (coming soon)

**How to create a page:**
1. Click "+ New Page" button
2. Fill in the form:
   - **Page Title**: e.g., "About Us"
   - **Slug**: Auto-generated from title (e.g., "about-us")
   - **Content**: Your page content (supports HTML)
   - **Meta Description**: For SEO (appears in search results)
   - **Meta Keywords**: For SEO (comma-separated)
   - **Publish**: Check to make it live

3. Click "Create Page"
4. Page is immediately accessible at `/pages/[slug]`

**Example:**
- Title: "Privacy Policy"
- Slug: "privacy-policy" (auto)
- Content: "We take your privacy seriously..."
- Meta Description: "Read our privacy policy"
- Publish: Yes
→ Page accessible at `/pages/privacy-policy`

---

### 📈 Reports (`/admin/reports`)
Analyze sales and revenue.

**Features:**
- Time range selector (7, 30, 90, 365 days)
- Total revenue & order count cards
- Daily revenue chart (bar chart)
- Top 5 products by revenue
- Detailed daily breakdown table
- CSV export button

**What the chart shows:**
- Each bar = one day's revenue
- Height = amount (₹)
- Date on x-axis
- Quick visual of sales trends

**What the table shows:**
- Date
- Number of orders that day
- Total revenue that day
- Average order value (revenue ÷ orders)

**How to use:**
1. Go to `/admin/reports`
2. Select time range (Last 7/30/90 days or year)
3. Review summary cards at top
4. Check the revenue chart
5. See top 5 selling products
6. Review daily breakdown below
7. Click "↓ Export CSV" to download data

**Exporting CSV:**
1. Click "Export CSV" button
2. File downloads as `sales-report-[date].csv`
3. Open in Excel/Google Sheets
4. Analyze with pivot tables, etc

---

## Common Tasks

### Update an Order Status
1. Go to `/admin/orders-list`
2. Find the order
3. Click "View Details"
4. Scroll to right sidebar
5. In "Order Status" section:
   - Select new status from dropdown
   - Click "Update Status"
6. ✓ Done! Order updated in database

### Create a Discount Coupon
1. Go to `/admin/coupons`
2. Click "+ New Coupon"
3. Fill in code, discount, dates
4. Click "Create Coupon"
5. ✓ Done! Coupon is live immediately
6. Customers can use it at checkout

### Create a Static Page
1. Go to `/admin/pages`
2. Click "+ New Page"
3. Enter title, content, meta tags
4. Click "Create Page"
5. ✓ Done! Page accessible at `/pages/[slug]`

### Check Sales Performance
1. Go to `/admin/reports`
2. Select time range you want
3. Review metrics & charts
4. See top 5 products
5. Export CSV if needed

### Check Product Stock
1. Go to `/admin/products`
2. Look at "Stock" column
3. Red items = low stock (< 10 units)
4. Green items = sufficient stock

---

## Important Notes

### Security
- ✅ All admin pages are protected - only accessible if role='admin'
- ✅ If you try to access admin while not logged in as admin, you're redirected to home
- ✅ All API calls verify admin role on server
- ✅ Passwords never stored in plain text

### Coupon Rules
- Codes are case-insensitive (SAVE20 = save20)
- Min order amount is optional
- Max uses is optional (leave empty for unlimited)
- Dates are checked automatically
- Customer can use once per order (unless max per user is set)

### Page URLs
- Pages are accessible at `/pages/[slug]`
- Slug is auto-generated from title
- Only published pages are visible to customers
- Draft pages (publish unchecked) are not visible

### Reports
- Data updates real-time
- Includes only paid orders
- Time ranges are in days (7 = last 7 days)
- CSV export includes all data shown in table
- Charts are for visualization only

---

## Troubleshooting

### Admin Dashboard Shows "Access Denied"
- Solution: Make sure your user account has `role='admin'` in the database
- Check: Supabase → Table Editor → profiles → find your row → role column

### Pages/Coupons Not Appearing After Create
- Solution: Refresh page (Ctrl+R or Cmd+R)
- Or: Check if pagination is moving to next page

### Reports Show No Data
- Solution: Make sure you have orders with `payment_status='paid'`
- Check: Time range selected is valid (recent orders)

### Can't Access /admin Routes
- Solution: Login first, make sure you're admin
- Check: Verify role='admin' in profiles table

---

## API Documentation

All admin APIs are at `/api/admin/*` and require authentication + admin role.

### GET /api/admin/analytics
Returns dashboard metrics.
```json
{
  "totalRevenue": 50000.00,
  "totalOrders": 125,
  "totalProducts": 50,
  "totalUsers": 200,
  "lowStockProducts": 3,
  "recentOrders": [...]
}
```

### GET /api/admin/reports?days=30
Returns sales report data.
```json
{
  "totalRevenue": 50000.00,
  "totalOrders": 125,
  "salesData": [{...}],
  "topProducts": [{...}]
}
```

### GET /api/admin/coupons
Returns list of all coupons.

### POST /api/admin/coupons
Creates new coupon (requires form data).

### GET /api/admin/pages
Returns list of all CMS pages.

### POST /api/admin/pages
Creates new CMS page (requires form data).

### GET /api/admin/orders
Returns list of all orders.

---

## Support

If you encounter issues:
1. Check this guide for troubleshooting
2. Verify database migration 010 was run
3. Check Supabase logs for errors
4. Verify your account is admin
5. Clear browser cache and try again

---

**Phase 7 Admin Dashboard Ready to Use! 🚀**
