# Variant Persistence Fix - Complete Solution

## Problem
Product variants were being created in the admin dashboard but disappeared when navigating back to the edit page. The variants were saved to the database but not loaded back into the form.

## Root Causes Identified

1. **Data Mapping Issue**: Database variants had slightly different structure than the form expected
2. **State Update Issue**: Form wasn't updating when `initialVariants` prop changed on navigation
3. **Error Silencing**: Variant save errors were being logged but not thrown, hiding potential issues

## Changes Made

### 1. Fixed Variant Data Mapping ✅
**File**: [app/admin/products/[productId]/edit/page.tsx](app/admin/products/[productId]/edit/page.tsx)

Added proper mapping of database variants to form interface:
```typescript
// Map database variants to Variant interface for the form
const formVariants = (existingVariants || []).map(v => ({
  id: v.id,
  name: v.name,
  weight_grams: v.weight_grams || 0,
  price: v.price,
  compare_at_price: v.compare_at_price || undefined,
  sku: v.sku || undefined,
  stock_quantity: v.stock_quantity,
  is_default: v.is_default,
  is_active: v.is_active,
  display_order: v.display_order,
}))
```

Changed from:
```typescript
variants={existingVariants || []}
```

To:
```typescript
variants={formVariants}
```

### 2. Added Error Throwing for Variant Failures ✅
**Files**: 
- [app/admin/products/[productId]/edit/page.tsx](app/admin/products/[productId]/edit/page.tsx)
- [app/admin/products/new/page.tsx](app/admin/products/new/page.tsx)

Changed from:
```typescript
if (variantsError) {
  console.error('Failed to update variants:', variantsError)
  // Error was silently logged
}
```

To:
```typescript
if (variantsError) {
  console.error('Failed to update variants:', variantsError)
  throw new Error(`Failed to update variants: ${variantsError.message}`)
}
```

Now errors will be shown to the admin instead of silently failing.

### 3. Fixed Form State Updates ✅
**File**: [app/admin/products/product-form.tsx](app/admin/products/product-form.tsx)

Added `useEffect` to update variants when the prop changes:
```typescript
// Update variants when initialVariants prop changes (on page navigation)
useEffect(() => {
  setVariants(initialVariants)
}, [initialVariants])
```

This ensures when you navigate to the edit page, the form loads the existing variants from the database.

## How It Works Now

### Flow Diagram
```
Admin Edits Product
    ↓
Clicks "Add Variant"
    ↓
Fills in variant details (500g, ₹1000, etc.)
    ↓
Clicks "Add" → Variant added to state
    ↓
Clicks "Update Product"
    ↓
Variants saved to database
    ↓
Page redirects/reloads
    ↓
Edit page fetches variants from database
    ↓
Maps database variants to form format
    ↓
Passes to ProductForm as initialVariants
    ↓
useEffect detects prop change
    ↓
Updates local state with variants
    ↓
VariantsEditor displays saved variants ✅
```

## Testing Steps

### Test 1: Create New Variants
1. Go to `/admin/products`
2. Click "Edit" on any product
3. Scroll to "Product Variants" section
4. Click "Add Variant"
5. Enter:
   - Name: `500g`
   - Weight: `500`
   - Price: `10.00` (will be stored as 1000 paisa)
   - Stock: `100`
6. Check "Set as default"
7. Click "Add"
8. Click "Update Product"
9. **Expected**: Success message, redirect to products list
10. Go back to edit the same product
11. **Expected**: Variant `500g` is displayed in the list ✅

### Test 2: Edit Existing Variants
1. Open product edit page with existing variants
2. Click "Edit" on a variant
3. Change the price or stock
4. Click "Update"
5. Click "Update Product"
6. Navigate away and back
7. **Expected**: Changes are persisted ✅

### Test 3: Multiple Variants
1. Add multiple variants (e.g., 250g, 500g, 1kg)
2. Set different prices for each
3. Mark one as default
4. Save product
5. Revisit edit page
6. **Expected**: All variants appear with correct values ✅

### Test 4: Delete Variants
1. Open product with variants
2. Click "Delete" on a variant
3. Click "Update Product"
4. Revisit edit page
5. **Expected**: Deleted variant is gone ✅

## Troubleshooting

### Issue: Variants still not showing

**Possible Causes:**

1. **Browser Cache**
   - Solution: Hard refresh (Ctrl+Shift+R or Ctrl+F5)
   - Or clear browser cache

2. **Variants marked as inactive**
   - Solution: Check `is_active` field in database
   ```sql
   SELECT name, is_active FROM product_variants WHERE product_id = 'YOUR_ID';
   ```

3. **Database Connection**
   - Check server logs for errors
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly

4. **RLS Policies**
   - Verify admin can read all variants:
   ```sql
   -- Should return your variants
   SELECT * FROM product_variants WHERE product_id = 'YOUR_ID';
   ```

### Issue: "Failed to update variants" error

**Possible Causes:**

1. **Invalid Data**
   - Check that all required fields are filled
   - Price must be > 0
   - Name must not be empty

2. **Database Constraint Violation**
   - Check if variant name is too long (max 100 chars)
   - Verify product_id exists

3. **Permission Issue**
   - Verify admin role is correctly set
   - Check RLS policies allow insert/update

### Issue: Variants save but product page doesn't show them

This is a different issue from the admin dashboard. If variants appear in admin but not on the product page:

1. Check if variants are marked as `is_active = true`
2. Verify the product detail page is fetching variants (it should be after our previous fix)
3. Check browser console for errors
4. See [VARIANT_FIX_GUIDE.md](VARIANT_FIX_GUIDE.md) for product page troubleshooting

## Database Verification

### Check if variants are actually saved:
```sql
-- View all variants for a product
SELECT 
  id,
  name,
  price / 100.0 as price_rupees,
  stock_quantity,
  is_default,
  is_active,
  display_order
FROM product_variants
WHERE product_id = 'YOUR_PRODUCT_ID'
ORDER BY display_order;
```

### Check if admin has permission:
```sql
-- Check your profile role
SELECT id, email, role 
FROM profiles 
WHERE id = auth.uid();
```

### Verify RLS policies:
```sql
-- Check policies on product_variants table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'product_variants';
```

## Key Files Modified

```
app/admin/products/
  ├── [productId]/edit/page.tsx   # Added variant mapping
  ├── new/page.tsx                # Added error throwing
  └── product-form.tsx            # Added useEffect for state sync
```

## Technical Details

### Variant Data Structure

**Database Schema:**
```typescript
{
  id: string
  product_id: string
  name: string
  weight_grams: number | null
  price: number              // in paisa (multiply by 100)
  compare_at_price: number | null
  sku: string | null
  stock_quantity: number
  is_default: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}
```

**Form Interface:**
```typescript
{
  id?: string
  name: string
  weight_grams: number
  price: number
  compare_at_price?: number
  sku?: string
  stock_quantity: number
  is_default: boolean
  is_active: boolean
  display_order: number
}
```

### Price Handling

- **Storage**: Prices are stored in paisa (₹1.00 = 100 paisa)
- **Display**: Divided by 100 and formatted (e.g., `1000 → ₹10.00`)
- **Input**: Multiplied by 100 before saving (e.g., `10.00 → 1000`)

## Related Documentation

- [VARIANT_FIX_GUIDE.md](VARIANT_FIX_GUIDE.md) - Frontend display of variants
- [supabase/migrations/023_create_product_variants.sql](supabase/migrations/023_create_product_variants.sql) - Database schema

---

**Issue**: Variants not persisting in admin edit page  
**Status**: ✅ **RESOLVED**  
**Date Fixed**: February 2, 2026  
**Tested**: ✅ Working correctly
