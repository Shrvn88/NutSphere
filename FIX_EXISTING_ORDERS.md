# Fix Existing Order Data

## Problem
Existing orders have `unit_price` in order_items table stored in paisa (old format), but we've moved to storing prices directly in rupees. This causes reports to show incorrect product revenue.

## Solution

### Option 1: SQL Migration (Recommended)
Run this SQL in **Supabase SQL Editor**:

```sql
-- Fix existing order items unit prices
-- Convert from paisa to rupees (multiply by 100)
UPDATE order_items
SET unit_price = unit_price * 100
WHERE unit_price < 10000
  AND created_at < '2026-02-02 00:00:00';
```

**What this does:**
- Multiplies `unit_price` by 100 for old orders
- Only affects orders created before Feb 2, 2026
- Only affects prices less than ₹10,000 (to avoid double-converting)

**Before:**
```
unit_price: 40    (meant ₹0.40 in paisa)
Displayed as: ₹40.00 ❌ WRONG
```

**After:**
```
unit_price: 4000  (means ₹4000 in rupees)
Displayed as: ₹4000.00 ✅ CORRECT
```

### Option 2: Backup & Verify (Safe Approach)

1. **Backup first:**
```sql
-- Create backup table
CREATE TABLE order_items_backup AS 
SELECT * FROM order_items;
```

2. **Run the fix:**
```sql
UPDATE order_items
SET unit_price = unit_price * 100
WHERE unit_price < 10000
  AND created_at < '2026-02-02 00:00:00';
```

3. **Verify:**
```sql
-- Check if top products now show correct amounts
SELECT 
  p.name,
  SUM(oi.quantity) as units_sold,
  SUM(oi.unit_price * oi.quantity) as total_revenue
FROM order_items oi
JOIN products p ON p.id = oi.product_id
JOIN orders o ON o.id = oi.order_id
WHERE o.payment_status = 'paid'
GROUP BY p.name
ORDER BY total_revenue DESC
LIMIT 10;
```

4. **If something goes wrong:**
```sql
-- Restore from backup
DELETE FROM order_items;
INSERT INTO order_items SELECT * FROM order_items_backup;
```

### Option 3: Manual Check First

Before running the migration, check a few orders:

```sql
-- See some example order items
SELECT 
  o.order_number,
  o.total_amount,
  oi.product_name,
  oi.unit_price,
  oi.quantity,
  oi.unit_price * oi.quantity as line_total
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
ORDER BY o.created_at DESC
LIMIT 10;
```

**What to look for:**
- If `unit_price` is very small (like 40, 23, 10) → needs fixing
- If `line_total` doesn't match what you expect → needs fixing
- If `unit_price` looks correct (like 1500, 2500) → already fixed

## After Migration

**New orders (created after the fix) will automatically use correct format:**
- Product price: ₹1500 → Stored as: 1500
- No conversion needed ✅

**Old orders (before fix) will now match:**
- Before: 40 → After: 4000 (if product was ₹40)
- Before: 23 → After: 2300 (if product was ₹23)

## Why This Happened

1. Originally, system used paisa (₹1 = 100 paisa)
2. We removed paisa conversion to simplify
3. Fixed order creation, dashboard, reports API
4. But existing data still had old format
5. This migration updates historical data to match new format

## Run This Once

⚠️ **Important:** Only run this migration **ONCE**. Running it multiple times will multiply prices incorrectly.

## Verification After Fix

After running the migration, your reports should show:
- Total Revenue: ₹53,600 ✅
- Top Products with realistic amounts (₹4000, ₹2300, etc.) ✅
- Everything matching your actual order totals ✅
