# 🧪 PHASE 5 TESTING GUIDE - Step by Step

## ⚠️ CRITICAL: Fix Issues First

### Issue 1: Profile Update Failing ❌
**Problem:** `profiles` table doesn't exist

**Fix:**
1. Open Supabase Dashboard: https://app.supabase.com
2. Go to SQL Editor
3. Copy the entire content from: `supabase/migrations/008_profiles_table.sql`
4. Paste and click "Run"
5. ✅ Verify: Should show "Success. No rows returned"

### Issue 2: Email Not Sending ❌
**Problem:** Resend requires verified domain or testing email

**Fix (Option A - Quick Testing):**
1. Open `.env.local`
2. Find line: `EMAIL_FROM=onboarding@resend.dev`
3. ✅ This is already correct for testing!
4. **Important:** Emails will ONLY be sent to your own email address
5. When testing checkout, use: `omkarmahajan2024.it@mmcoe.edu.in`

**Fix (Option B - Production):**
1. Go to https://resend.com/domains
2. Add your domain (e.g., yourdomain.com)
3. Add DNS records they provide
4. Verify domain
5. Update `.env.local`: `EMAIL_FROM=noreply@yourdomain.com`

### Issue 3: PDF Download Fixed ✅
**Fix:** Already fixed in the code above! Just restart your dev server:

```bash
# Press Ctrl+C in terminal to stop
npm run dev
```

---

## 📝 COMPLETE TESTING CHECKLIST

### ✅ Test 1: Profile Management (5 minutes)

**Step 1.1: Navigate to Profile**
```
1. Click your avatar (O) in top-right corner
2. Click "My Profile" from dropdown
3. URL should be: http://localhost:3000/profile
```
✅ **Verify:** Profile page loads with your email

**Step 1.2: Update Profile**
```
1. Change "Full Name" to: "Omkar Mahajan"
2. Change "Phone" to: "9876543210"
3. Click "Save Changes"
```
✅ **Verify:** Green success message appears: "Profile updated successfully"
✅ **Verify:** Form shows new values immediately

**Step 1.3: Confirm Changes Persist**
```
1. Click "Categories" or any other link
2. Click avatar → "My Profile" again
```
✅ **Verify:** Name is still "Omkar Mahajan" and phone "9876543210"

---

### ✅ Test 2: Address Management (10 minutes)

**Step 2.1: View Address Book**
```
1. Click avatar → "My Addresses"
2. URL: http://localhost:3000/profile/addresses
```
✅ **Verify:** Shows your existing addresses OR empty state

**Step 2.2: Add New Address**
```
1. Click "Add New Address" button
2. Fill form:
   Full Name: Omkar Mahajan
   Phone: 9876543210
   Address Line 1: ABC Building, Karve Nagar
   Address Line 2: Near KP College
   City: Pune
   State: Maharashtra
   Postal Code: 411052
   Country: India
   ✓ Set as default address (checked)
3. Click "Add Address"
```
✅ **Verify:** Address card appears with blue "Default" badge

**Step 2.3: Add Second Address**
```
1. Click "Add New Address" again
2. Fill different address:
   Full Name: Omkar Mahajan
   Phone: 9876543210
   Address Line 1: XYZ Complex, MG Road
   Address Line 2: Shop No 5
   City: Mumbai
   State: Maharashtra
   Postal Code: 400001
   Country: India
   ☐ Set as default address (unchecked)
3. Click "Add Address"
```
✅ **Verify:** Second address appears WITHOUT "Default" badge
✅ **Verify:** First address still has "Default" badge

**Step 2.4: Edit Address**
```
1. On second address, click "Edit" button
2. Change City to: "Navi Mumbai"
3. Change Postal Code to: "400614"
4. Click "Save Changes"
```
✅ **Verify:** Address updates immediately with new values

**Step 2.5: Change Default**
```
1. On second address, click "Set as Default" button
```
✅ **Verify:** "Default" badge moves from first to second address

**Step 2.6: Delete Address**
```
1. On first address, click "Delete" button
2. Click "OK" in confirmation dialog
```
✅ **Verify:** First address disappears
✅ **Verify:** Only second address remains

---

### ✅ Test 3: Complete Order Flow with Email (15 minutes)

**Step 3.1: Add Items to Cart**
```
1. Go to: http://localhost:3000/products
2. Click on any 2-3 products
3. Click "Add to Cart" on each
4. Click cart icon (should show count)
```
✅ **Verify:** Cart icon shows correct item count

**Step 3.2: Go to Checkout**
```
1. Click cart icon
2. Click "Proceed to Checkout"
3. URL: http://localhost:3000/checkout
```
✅ **Verify:** Your saved address appears in "Saved Addresses" section
✅ **Verify:** Default address is pre-selected

**Step 3.3: Complete Payment**
```
1. Scroll down to payment section
2. Click "Place Order & Pay" button
3. Razorpay modal opens
4. Enter test card:
   Card Number: 5267 3181 8797 5449
   Expiry: 12/28
   CVV: 123
   Name: Test User
5. Click "Pay"
```
✅ **Verify:** Payment succeeds (green checkmark in Razorpay)

**Step 3.4: Check Order Confirmation**
```
Wait for redirect to order confirmation page
```
✅ **Verify:** Green success box shows "Order Placed Successfully!"
✅ **Verify:** Order number displayed (e.g., ORD-20260125-9986)
✅ **Verify:** Order details show (items, address, total)

**Step 3.5: Check Email (IMPORTANT)**
```
1. Open Gmail/email app
2. Check inbox for: omkarmahajan2024.it@mmcoe.edu.in
3. Look for email from: onboarding@resend.dev
4. Subject: "Order Confirmation - ORD-XXXXXXXX-XXXX"
```
✅ **Verify:** Email received within 1-2 minutes
✅ **Verify:** Email shows:
   - Green header "✓ Order Confirmed!"
   - Your order number
   - Order date and total amount
   - Product list with quantities
   - Shipping address
✅ **Verify:** Email is HTML formatted (not plain text)

**Step 3.6: View Order in History**
```
1. Click "View All Orders" or go to /orders
```
✅ **Verify:** New order appears at top of list
✅ **Verify:** Shows correct order number and total
✅ **Verify:** Payment status: Green dot + "Paid"
✅ **Verify:** Order status badge shows color

---

### ✅ Test 4: Invoice Download (5 minutes)

**Step 4.1: Navigate to Order Detail**
```
1. From orders list, click on your recent order
2. URL: http://localhost:3000/orders/{order-id}
```
✅ **Verify:** Order details page loads

**Step 4.2: Download Invoice**
```
1. Look for "Download Invoice" button (top-right of Order Details)
2. Click button
3. Wait 2-3 seconds
```
✅ **Verify:** Button shows "Generating..." briefly
✅ **Verify:** PDF file downloads automatically
✅ **Verify:** Filename: `Invoice-ORD-20260125-9986.pdf`

**Step 4.3: Open and Verify PDF**
```
1. Open downloaded PDF
2. Check contents:
```

✅ **Verify Header Section:**
- Company: "E-COMMERCE STORE"
- Address: 123 Business Street, New Delhi
- Email: support@ecommerce.com
- GSTIN: 07AABCU9603R1ZV

✅ **Verify Invoice Details:**
- "TAX INVOICE" title (top-right)
- Invoice No: matches order number
- Date: matches order date
- Payment: PAID (or status)

✅ **Verify Customer Details:**
- Bill To: Shows your name, email, phone
- Ship To: Shows complete shipping address

✅ **Verify Product Table:**
- Columns: Item | Qty | Price | Discount | Total
- All your ordered items listed
- Quantities correct
- Prices in ₹ (rupees)

✅ **Verify Summary:**
- Subtotal amount
- Discount (if any)
- Shipping (FREE if over ₹500)
- Tax (GST 18%): calculated amount
- Grand Total: matches order total

✅ **Verify Footer:**
- "This is a computer-generated invoice..."
- "Thank you for your business!"

**Step 4.4: Test Multiple Downloads**
```
1. Click "Download Invoice" button again
```
✅ **Verify:** PDF downloads again without errors

---

### ✅ Test 5: Order Tracking (Admin - 10 minutes)

**Step 5.1: Get Order ID**
```
1. From order detail page, copy order ID from URL
   Example URL: /orders/1c6cb4cb-5d1f-4107-808c-273bcea447cb
   Order ID: 1c6cb4cb-5d1f-4107-808c-273bcea447cb
```

**Step 5.2: Update Tracking in Database**
```
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run this query (replace YOUR_ORDER_ID):

UPDATE orders
SET 
  courier_name = 'Blue Dart',
  tracking_id = 'BD1234567890',
  tracking_url = 'https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890',
  status = 'shipped',
  updated_at = NOW()
WHERE id = 'YOUR_ORDER_ID';

4. Click "Run"
```
✅ **Verify:** "Success. 1 rows affected."

**Step 5.3: View Tracking on Order Page**
```
1. Go back to order detail page
2. Refresh page (F5)
```
✅ **Verify:** Blue "Shipment Tracking" section appears
✅ **Verify:** Shows:
   - Courier: Blue Dart
   - Tracking ID: BD1234567890 (monospace font)
   - Blue "Track Your Order" button

**Step 5.4: Test Tracking Link**
```
1. Click "Track Your Order" button
```
✅ **Verify:** Opens courier website in new tab
✅ **Verify:** URL contains tracking ID

**Step 5.5: Check Order Status**
```
1. Go to: http://localhost:3000/orders
```
✅ **Verify:** Order status badge shows "Shipped" (indigo color)

---

## 🎯 QUICK TEST SUMMARY (If Time Limited)

### Fast Test (10 minutes):
1. ✅ Update profile → Save → Verify success
2. ✅ Add one address → Verify appears
3. ✅ Place one order → Check email received
4. ✅ Download invoice → Open PDF
5. ✅ Update tracking in SQL → View on page

---

## 🐛 TROUBLESHOOTING

### Profile Update Still Failing?
```bash
# Check if migration ran:
# In Supabase SQL Editor:
SELECT * FROM profiles LIMIT 1;

# If error "relation profiles does not exist":
# Re-run migration 008_profiles_table.sql
```

### Email Not Received?
```bash
# Check these:
1. Email used in checkout is: omkarmahajan2024.it@mmcoe.edu.in
2. .env.local has: EMAIL_FROM=onboarding@resend.dev
3. Server terminal shows no email errors
4. Check spam/junk folder
5. Wait 2-3 minutes (Resend can be slow)

# To verify email config:
# Check .env.local file has:
RESEND_API_KEY=re_EMtwGqEQ_7b9mAg8Rs8CAVzUdPr7fbzzV
EMAIL_FROM=onboarding@resend.dev
```

### PDF Still Not Downloading?
```bash
# Restart dev server:
# Press Ctrl+C in terminal
npm run dev

# Clear browser cache:
# Press Ctrl+Shift+Delete → Clear cached files
# Or try different browser
```

### Tracking Not Showing?
```bash
# Verify SQL ran successfully
# In Supabase SQL Editor:
SELECT courier_name, tracking_id, tracking_url 
FROM orders 
WHERE id = 'your-order-id';

# Should return row with values
# If NULL, re-run UPDATE query
```

---

## ✅ FINAL CHECKLIST

Before considering Phase 5 complete:

- [ ] Migration 008 ran successfully (profiles table exists)
- [ ] Profile page loads without errors
- [ ] Can update name and phone successfully
- [ ] Success message shows after profile update
- [ ] Can add new address
- [ ] Can edit existing address
- [ ] Can delete address
- [ ] Can change default address
- [ ] Addresses show in checkout
- [ ] Can complete full order with payment
- [ ] Order confirmation email received
- [ ] Email is professionally formatted
- [ ] Can download invoice PDF
- [ ] PDF contains all required sections
- [ ] Can update tracking via SQL
- [ ] Tracking displays on order page
- [ ] Tracking link opens courier website
- [ ] Order status updates to "Shipped"

---

## 🎉 SUCCESS CRITERIA

Phase 5 is COMPLETE when:
1. ✅ Profile updates work without errors
2. ✅ Address CRUD operations all work
3. ✅ Order confirmation email arrives
4. ✅ PDF invoice downloads and opens
5. ✅ Tracking info displays correctly

---

## ⚡ RESTART DEV SERVER NOW

**Before starting tests:**
```bash
# In your terminal, press Ctrl+C to stop
# Then restart:
npm run dev
```

This ensures all code fixes are loaded!

---

**Start testing from Test 1 above! Good luck! 🚀**
