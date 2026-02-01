# Phase 5 - Complete Testing Flow

## Prerequisites

### 1. Run Database Migration
```sql
-- Open Supabase Dashboard → SQL Editor
-- Copy and paste contents from: supabase/migrations/007_order_tracking.sql
-- Click "Run" to execute

-- Verify migration:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('courier_name', 'tracking_id', 'tracking_url');
```

### 2. Configure Email Service (Optional for Testing)
```env
# In .env.local, add:
RESEND_API_KEY=re_YOUR_API_KEY_HERE
EMAIL_FROM=onboarding@resend.dev  # Use this for testing without domain verification
```

**Get Resend API Key:**
1. Go to https://resend.com
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Copy and paste into `.env.local`

### 3. Start Development Server
```bash
npm run dev
```

---

## Test Flow 1: User Profile Management

### Steps:
1. **Login to your account**
   - Go to http://localhost:3000/auth/login
   - Login with existing account or create new one

2. **Navigate to Profile**
   - Click on user icon/menu
   - Select "Profile" or go to http://localhost:3000/profile

3. **View Profile Page**
   - ✅ Verify: Page shows your email (from auth)
   - ✅ Verify: Full name displays (if set before)
   - ✅ Verify: Phone number displays (if set before)
   - ✅ Verify: Quick action cards show: "My Orders", "Addresses", "Cart"

4. **Edit Profile**
   - Click "Edit Profile" button
   - Change "Full Name" to: `Test User Updated`
   - Change "Phone" to: `9876543210`
   - Click "Save Changes"
   - ✅ Verify: Green success message appears: "Profile updated successfully"
   - ✅ Verify: Form shows updated values immediately
   - ✅ Verify: Email field is disabled (can't edit)

5. **Refresh Page**
   - Press F5 or refresh browser
   - ✅ Verify: Updated name and phone persist after refresh

---

## Test Flow 2: Address Book Management

### Part A: Add First Address (Default)

1. **Navigate to Addresses**
   - From profile page, click "Addresses" card
   - Or go to http://localhost:3000/profile/addresses

2. **View Empty State**
   - ✅ Verify: Empty state shows location icon
   - ✅ Verify: Message: "No saved addresses"
   - ✅ Verify: "Add New Address" button visible

3. **Add First Address**
   - Click "Add New Address" button
   - Modal should open
   - Fill in form:
     ```
     Full Name: John Doe
     Phone: 9123456789
     Address Line 1: 123 MG Road
     Address Line 2: Near City Mall
     City: Mumbai
     State: Maharashtra
     Postal Code: 400001
     Country: India
     ✓ Set as default address (checked)
     ```
   - Click "Add Address"
   - ✅ Verify: Modal closes
   - ✅ Verify: Address card appears
   - ✅ Verify: Blue "Default" badge visible in top-right corner

### Part B: Add Second Address (Not Default)

4. **Add Second Address**
   - Click "Add New Address" button (top-right)
   - Fill in different address:
     ```
     Full Name: John Doe
     Phone: 9123456789
     Address Line 1: 456 Park Street
     Address Line 2: Apartment 5B
     City: Delhi
     State: Delhi
     Postal Code: 110001
     Country: India
     ☐ Set as default address (unchecked)
     ```
   - Click "Add Address"
   - ✅ Verify: Second address card appears
   - ✅ Verify: No "Default" badge on second address
   - ✅ Verify: First address still has "Default" badge

### Part C: Edit Address

5. **Edit Second Address**
   - On second address card, click "Edit" button
   - Change City from `Delhi` to `New Delhi`
   - Change Postal Code to `110002`
   - Click "Save Changes"
   - ✅ Verify: Modal closes
   - ✅ Verify: Address card shows updated city and postal code

### Part D: Change Default Address

6. **Make Second Address Default**
   - On second address card, click "Set as Default" button
   - ✅ Verify: "Default" badge moves from first to second address
   - ✅ Verify: First address now shows "Set as Default" button
   - ✅ Verify: Second address no longer shows "Set as Default" button

### Part E: Delete Address

7. **Delete First Address**
   - On first address card, click "Delete" button
   - Browser confirmation dialog appears
   - Click "OK" to confirm
   - ✅ Verify: First address card disappears
   - ✅ Verify: Only second address remains (with Default badge)

8. **Verify in Checkout**
   - Add items to cart
   - Go to checkout
   - ✅ Verify: Saved addresses section shows only the remaining address
   - ✅ Verify: Default address is pre-selected

---

## Test Flow 3: Order Placement with Email

### Steps:

1. **Add Items to Cart**
   - Go to http://localhost:3000/products
   - Add 2-3 different products to cart
   - Click cart icon to view cart

2. **Go to Checkout**
   - Click "Proceed to Checkout"
   - ✅ Verify: Your saved address appears in "Saved Addresses" section
   - Select saved address or enter new address manually

3. **Complete Order**
   - Fill in all required fields (if not using saved address)
   - Click "Place Order & Pay" button
   - Razorpay modal opens
   - **Test Payment:**
     ```
     Card: 5267 3181 8797 5449
     Expiry: Any future date (e.g., 12/28)
     CVV: 123
     Name: Test User
     ```
   - Click "Pay"
   - ✅ Verify: Success modal/page appears
   - ✅ Verify: Order number displayed (e.g., ORD-20260125-001)
   - ✅ Verify: Order details shown (items, total, address)

4. **Check Email (if configured)**
   - Open email inbox for the email used in checkout
   - ✅ Verify: Order confirmation email received
   - ✅ Verify: Email shows:
     - "Order Confirmed!" header with ✓
     - Order number
     - Order date
     - Total amount
     - Product list with quantities
     - Shipping address
   - ✅ Verify: Email is professionally formatted (not plain text)

5. **View Order in History**
   - Click "View All Orders" or go to http://localhost:3000/orders
   - ✅ Verify: New order appears at top
   - ✅ Verify: Shows order number, date, total, status badges
   - ✅ Verify: Payment status shows "Paid" with green dot

---

## Test Flow 4: Invoice Download (PDF)

### Steps:

1. **Navigate to Order Detail**
   - From orders list, click on any completed order
   - Or use URL: http://localhost:3000/orders/{your-order-id}

2. **Download Invoice**
   - Click "Download Invoice" button (top-right of Order Details section)
   - ✅ Verify: Button shows "Generating..." briefly
   - ✅ Verify: PDF file downloads automatically
   - ✅ Verify: Filename format: `Invoice-ORD-20260125-001.pdf`

3. **Open PDF and Verify Contents**
   - Open downloaded PDF
   - ✅ Verify Header:
     - Company name: "E-COMMERCE STORE"
     - Address: 123 Business Street, New Delhi
     - Email: support@ecommerce.com
     - GSTIN: 07AABCU9603R1ZV
   - ✅ Verify Invoice Title:
     - "TAX INVOICE" (large, right side)
     - Invoice number matches order number
     - Date matches order date
     - Payment status shown
   - ✅ Verify Bill To & Ship To:
     - Customer name and contact details
     - Full shipping address
   - ✅ Verify Product Table:
     - Column headers: Item, Qty, Price, Discount, Total
     - All order items listed
     - Quantities correct
     - Prices formatted properly (₹)
   - ✅ Verify Summary Section:
     - Subtotal
     - Discount (if applicable)
     - Shipping (or "FREE" if over ₹500)
     - Tax (GST 18%)
     - Grand Total in bold
   - ✅ Verify Footer:
     - "This is a computer-generated invoice..."
     - "Thank you for your business!"

4. **Test Multiple Downloads**
   - Click "Download Invoice" again
   - ✅ Verify: PDF downloads again without errors

---

## Test Flow 5: Order Tracking & Shipment Email

### Part A: Setup Tracking Info (Admin Action)

1. **Get Order ID**
   - From order detail page URL: `/orders/{copy-this-id}`
   - Or from Supabase: 
     ```sql
     SELECT id, order_number FROM orders ORDER BY created_at DESC LIMIT 5;
     ```

2. **Update Tracking (Option 1: Manual SQL)**
   ```sql
   -- Open Supabase SQL Editor
   UPDATE orders
   SET 
     courier_name = 'Blue Dart',
     tracking_id = 'BD1234567890',
     tracking_url = 'https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890',
     status = 'shipped',
     updated_at = NOW()
   WHERE id = 'paste-order-id-here';
   ```
   - Run the query
   - ✅ Verify: Returns "Success. 1 rows affected."

   **Note:** This method won't send email. Use Option 2 for email.

3. **Update Tracking (Option 2: API Route with Email)**
   
   First, create admin API route:
   
   Create file: `app/api/admin/update-tracking/route.ts`
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'
   import { updateOrderTracking } from '@/lib/data/orders'

   export async function POST(request: NextRequest) {
     try {
       const body = await request.json()
       const { orderId, courierName, trackingId, trackingUrl } = body
       
       if (!orderId || !courierName || !trackingId) {
         return NextResponse.json(
           { error: 'Missing required fields' },
           { status: 400 }
         )
       }
       
       const result = await updateOrderTracking(
         orderId,
         courierName,
         trackingId,
         trackingUrl
       )
       
       return NextResponse.json(result)
     } catch (error) {
       console.error('Error:', error)
       return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
       )
     }
   }
   ```

   Then use Postman or curl:
   ```bash
   curl -X POST http://localhost:3000/api/admin/update-tracking \
     -H "Content-Type: application/json" \
     -d '{
       "orderId": "your-order-id-here",
       "courierName": "Blue Dart",
       "trackingId": "BD1234567890",
       "trackingUrl": "https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890"
     }'
   ```

### Part B: Verify Tracking Display

4. **View Order Detail Page**
   - Go to order detail page: http://localhost:3000/orders/{order-id}
   - ✅ Verify: Blue "Shipment Tracking" section appears
   - ✅ Verify: Shows courier name: "Blue Dart"
   - ✅ Verify: Shows tracking ID: "BD1234567890" (in monospace font)
   - ✅ Verify: "Track Your Order" button visible with external link icon

5. **Click Tracking Link**
   - Click "Track Your Order" button
   - ✅ Verify: Opens courier website in new tab
   - ✅ Verify: URL contains tracking ID

6. **Check Shipment Email (if API route used)**
   - Open customer email inbox
   - ✅ Verify: "Your Order Has Been Shipped" email received
   - ✅ Verify: Email shows:
     - "Your Order is on the Way!" header with 📦
     - Order number
     - Courier name: Blue Dart
     - Tracking ID: BD1234567890
     - Blue "Track Your Order" button
   - Click email button
   - ✅ Verify: Opens tracking URL

### Part C: Verify Order Status Updated

7. **Check Orders List**
   - Go to http://localhost:3000/orders
   - ✅ Verify: Order status badge shows "Shipped" (indigo color)
   - ✅ Verify: Payment status shows green dot "Paid"

---

## Test Flow 6: Full User Journey (End-to-End)

### Complete Flow:

```
1. Create Account → 2. Update Profile → 3. Add Address → 
4. Browse Products → 5. Add to Cart → 6. Checkout → 
7. Pay with Razorpay → 8. Receive Email → 9. Download Invoice → 
10. Track Shipment → 11. Receive Delivery
```

### Detailed Steps:

**Step 1-3: Account Setup (5 minutes)**
- Register new account
- Update full name and phone
- Add default delivery address

**Step 4-7: Shopping & Payment (5 minutes)**
- Browse products
- Add 2-3 items to cart
- Go to checkout
- Complete Razorpay payment
- ✅ Verify: Order confirmation page shows

**Step 8: Email Verification (2 minutes)**
- Check email inbox
- ✅ Verify: Order confirmation received within 1 minute
- ✅ Verify: Email content is correct

**Step 9: Invoice Download (2 minutes)**
- Go to order detail page
- Download invoice PDF
- ✅ Verify: PDF contains all order details

**Step 10: Admin Updates Tracking (3 minutes)**
- Admin runs SQL or API to add tracking
- ✅ Verify: Tracking appears on order page
- ✅ Verify: Shipment email sent

**Step 11: Customer Checks Status (2 minutes)**
- Customer views order detail
- Clicks "Track Your Order"
- ✅ Verify: Opens courier tracking page

**Total Time: ~20 minutes for complete flow**

---

## Troubleshooting Guide

### Issue: Email Not Sending

**Symptoms:**
- No order confirmation email received
- No shipment notification email

**Solutions:**
1. Check `.env.local` has `RESEND_API_KEY`
2. Verify API key is valid in Resend dashboard
3. Check server terminal for errors:
   ```
   Failed to send order confirmation email: ...
   ```
4. For testing, use `EMAIL_FROM=onboarding@resend.dev`
5. Check spam/junk folder
6. Verify email in checkout form is correct

### Issue: Invoice Download Fails

**Symptoms:**
- Button shows "Generating..." but no download
- Console errors about pdfkit

**Solutions:**
1. Check browser console for errors
2. Verify `pdfkit` installed:
   ```bash
   npm list pdfkit
   ```
3. Try different browser (Chrome/Firefox)
4. Check server logs for PDF generation errors

### Issue: Tracking Section Not Showing

**Symptoms:**
- Order detail page doesn't show tracking info

**Solutions:**
1. Verify migration 007 ran successfully:
   ```sql
   SELECT courier_name, tracking_id FROM orders WHERE id = 'your-order-id';
   ```
2. Check database has values (not NULL)
3. Refresh browser (Ctrl + F5)
4. Check order status is "shipped"

### Issue: Address Not Saving

**Symptoms:**
- Address modal closes but address doesn't appear
- Error message in modal

**Solutions:**
1. Check browser console for errors
2. Verify RLS policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'addresses';
   ```
3. Check user is authenticated
4. Try logging out and back in
5. Check all required fields are filled

### Issue: Profile Update Not Working

**Symptoms:**
- Success message shows but values don't update
- Error message appears

**Solutions:**
1. Check `profiles` table exists
2. Verify user has profile row:
   ```sql
   SELECT * FROM profiles WHERE id = auth.uid();
   ```
3. Check RLS policies allow user updates
4. Refresh page after update

---

## Test Results Checklist

Use this checklist to track your testing:

### Profile Management
- [ ] Profile page loads with user data
- [ ] Can update full name
- [ ] Can update phone number
- [ ] Email field is disabled
- [ ] Changes persist after refresh
- [ ] Success message shows after save

### Address Book
- [ ] Empty state shows correctly
- [ ] Can add first address
- [ ] Default badge appears
- [ ] Can add second address
- [ ] Can edit address
- [ ] Can change default address
- [ ] Can delete address
- [ ] Addresses show in checkout

### Order History
- [ ] Orders list shows all orders
- [ ] Order cards display correctly
- [ ] Status badges show correct colors
- [ ] Payment status visible
- [ ] Click order opens detail page

### Invoice Download
- [ ] Download button works
- [ ] PDF generates correctly
- [ ] PDF contains all sections
- [ ] Can download multiple times
- [ ] Filename format correct

### Order Tracking
- [ ] Tracking section appears when data exists
- [ ] Courier name displays
- [ ] Tracking ID displays
- [ ] Track button opens URL
- [ ] Order status updates to "shipped"

### Email Notifications
- [ ] Order confirmation email sent
- [ ] Confirmation email content correct
- [ ] Shipment email sent (if API used)
- [ ] Shipment email content correct
- [ ] Emails arrive within 1 minute
- [ ] Email links work

### End-to-End Flow
- [ ] Can complete full purchase journey
- [ ] All features work together
- [ ] No errors in console
- [ ] Performance is acceptable
- [ ] Mobile responsive (test on phone)

---

## Performance Checklist

Test on different devices:
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Mobile Safari (iPhone)
- [ ] Mobile Chrome (Android)

Check loading times:
- [ ] Profile page loads < 2 seconds
- [ ] Address page loads < 2 seconds
- [ ] Order detail page loads < 2 seconds
- [ ] Invoice generates < 5 seconds
- [ ] Email sends < 10 seconds

---

## Next Steps After Testing

Once all tests pass:

1. **Production Setup**
   - Run migration on production database
   - Configure production Resend API key
   - Update EMAIL_FROM to your domain
   - Test payment with live Razorpay keys

2. **Optional Enhancements**
   - Build admin dashboard for tracking updates
   - Add SMS notifications
   - Create delivery confirmation trigger
   - Add order filters and search

3. **Monitor & Iterate**
   - Check email delivery rates
   - Monitor PDF generation performance
   - Collect user feedback
   - Fix any edge cases

---

**Happy Testing! 🧪**
