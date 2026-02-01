# 🎯 TRACKING UPDATE FOR YOUR ORDER: ORD-20260125-7436

## Step 1: Find Your Order ID

Run this in Supabase SQL Editor:

```sql
SELECT id, order_number, customer_name, total_amount, status
FROM orders 
WHERE order_number = 'ORD-20260125-7436';
```

**What this does:** Shows your order with its ID (the long UUID)

**Expected result:** You'll see something like:
```
id: 16c6b4cb-5d11-4107-808c-273bcea447db
order_number: ORD-20260125-7436
customer_name: om mahajan
total_amount: 75636
status: confirmed
```

**Copy the `id` value** (the long text with dashes)

---

## Step 2: Add Tracking Information

Now run this (replace `PASTE_YOUR_ID_HERE` with the ID from Step 1):

```sql
UPDATE orders
SET 
  courier_name = 'Blue Dart',
  tracking_id = 'BD1234567890',
  tracking_url = 'https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890',
  status = 'shipped',
  updated_at = NOW()
WHERE id = 'PASTE_YOUR_ID_HERE';
```

**Example (with real ID):**
```sql
UPDATE orders
SET 
  courier_name = 'Blue Dart',
  tracking_id = 'BD1234567890',
  tracking_url = 'https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890',
  status = 'shipped',
  updated_at = NOW()
WHERE id = '16c6b4cb-5d11-4107-808c-273bcea447db';
```

**Expected result:** "Success. 1 rows affected." ✅

---

## Step 3: Verify Tracking Was Added

Run this to confirm:

```sql
SELECT order_number, courier_name, tracking_id, tracking_url, status
FROM orders 
WHERE order_number = 'ORD-20260125-7436';
```

**Expected result:**
```
order_number: ORD-20260125-7436
courier_name: Blue Dart
tracking_id: BD1234567890
tracking_url: https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890
status: shipped
```

---

## Step 4: View on Website

1. Go to: http://localhost:3000/orders
2. Click on order: **ORD-20260125-7436**
3. Refresh page (F5)
4. You should now see a **blue box** with:
   - 📦 Shipment Tracking
   - Courier: Blue Dart
   - Tracking ID: BD1234567890
   - "Track Your Order" button

---

## 🎨 Want Different Courier?

### For Delhivery:
```sql
UPDATE orders
SET 
  courier_name = 'Delhivery',
  tracking_id = 'DEL987654321',
  tracking_url = 'https://www.delhivery.com/track/package/DEL987654321',
  status = 'shipped',
  updated_at = NOW()
WHERE order_number = 'ORD-20260125-7436';
```

### For DTDC:
```sql
UPDATE orders
SET 
  courier_name = 'DTDC',
  tracking_id = 'DTDC123456789',
  tracking_url = 'https://www.dtdc.in/tracking.asp?Ttype=0&strCnno=DTDC123456789',
  status = 'shipped',
  updated_at = NOW()
WHERE order_number = 'ORD-20260125-7436';
```

### For FedEx:
```sql
UPDATE orders
SET 
  courier_name = 'FedEx',
  tracking_id = 'FX123456789012',
  tracking_url = 'https://www.fedex.com/fedextrack/?tracknumbers=FX123456789012',
  status = 'shipped',
  updated_at = NOW()
WHERE order_number = 'ORD-20260125-7436';
```

---

## 🚨 SIMPLE VERSION (If Above Seems Hard)

**EASIEST WAY - Copy/Paste This Entire Block:**

```sql
-- Step 1: Get Order ID
SELECT id FROM orders WHERE order_number = 'ORD-20260125-7436';

-- Step 2: Copy the ID result from above, then run this (replace YOUR_ID):
UPDATE orders
SET 
  courier_name = 'Blue Dart',
  tracking_id = 'BD1234567890',
  tracking_url = 'https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890',
  status = 'shipped',
  updated_at = NOW()
WHERE order_number = 'ORD-20260125-7436';

-- Step 3: Verify it worked
SELECT order_number, courier_name, tracking_id, status 
FROM orders 
WHERE order_number = 'ORD-20260125-7436';
```

**Instructions:**
1. Open Supabase → SQL Editor
2. Copy the ENTIRE block above
3. Paste it
4. Click "Run" (or press Ctrl+Enter)
5. Done! ✅

---

## 📸 Visual Guide

**Where to paste SQL:**
1. Go to: https://app.supabase.com
2. Click your project
3. Left sidebar → Click "SQL Editor" 
4. Click "+ New Query" button (top left)
5. Paste SQL in the big text box
6. Click green "Run" button (or press Ctrl+Enter)
7. Look at bottom for result

---

## ✅ Success Checklist

After running the SQL:
- [ ] Saw "Success. 1 rows affected."
- [ ] Ran verify query - shows courier name
- [ ] Went to order page on website
- [ ] Refreshed page (F5)
- [ ] See blue "Shipment Tracking" box
- [ ] Tracking ID is BD1234567890
- [ ] "Track Your Order" button visible
- [ ] Button opens tracking URL

---

**Try it now!** Copy the "SIMPLE VERSION" block and paste it in Supabase SQL Editor! 🚀
