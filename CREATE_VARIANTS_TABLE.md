# 🚨 URGENT: Create Product Variants Table

## The Problem
Your Supabase database doesn't have the `product_variants` table yet. That's why you're getting the error:
> "Could not find the table 'public.product_variants' in the schema cache"

## Quick Fix (2 minutes)

### Option 1: Using Supabase Dashboard (RECOMMENDED)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy & Paste This SQL**
   ```sql
   -- Create product variants table
   CREATE TABLE IF NOT EXISTS product_variants (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
     name VARCHAR(100) NOT NULL,
     weight_grams INTEGER,
     price INTEGER NOT NULL,
     compare_at_price INTEGER,
     sku VARCHAR(50),
     stock_quantity INTEGER DEFAULT 0,
     is_default BOOLEAN DEFAULT false,
     is_active BOOLEAN DEFAULT true,
     display_order INTEGER DEFAULT 0,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Create indexes
   CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
   CREATE INDEX idx_product_variants_active ON product_variants(product_id, is_active);

   -- Enable RLS
   ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

   -- Policy: Anyone can read active variants
   CREATE POLICY "Anyone can read active variants"
     ON product_variants FOR SELECT
     USING (is_active = true);

   -- Policy: Admins can manage variants
   CREATE POLICY "Admins can manage variants"
     ON product_variants FOR ALL
     USING (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE profiles.id = auth.uid()
         AND profiles.role = 'admin'
       )
     );

   -- Trigger to update updated_at
   CREATE OR REPLACE FUNCTION update_variant_updated_at()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER trigger_update_variant_timestamp
     BEFORE UPDATE ON product_variants
     FOR EACH ROW
     EXECUTE FUNCTION update_variant_updated_at();

   -- Add variant_id to order_items table
   ALTER TABLE order_items 
   ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id);

   -- Add variant_id to cart_items table
   ALTER TABLE cart_items
   ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id);
   ```

4. **Run the Query**
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for "Success" message

5. **Verify It Worked**
   - Go to "Table Editor" in left sidebar
   - Look for `product_variants` table
   - ✅ If you see it, you're done!

6. **Refresh Your App**
   - Go back to your browser
   - Refresh the admin page (F5)
   - Try adding a variant again

### Option 2: Using Supabase CLI (If you have it installed)

```bash
# Run the migration
npx supabase db push

# Or if you have migrations folder
npx supabase migration up
```

## After Creating the Table

1. **Refresh your browser** (F5 or Ctrl+R)
2. **Try adding a variant again**:
   - Go to `/admin/products`
   - Edit a product
   - Add a variant (500g, ₹10.00, stock 100)
   - Click "Update Product"
   - ✅ Should work now!

## Verify Table Was Created

### Method 1: Table Editor
1. Go to Supabase Dashboard → Table Editor
2. Look for `product_variants` in the list
3. Should show columns: id, product_id, name, price, etc.

### Method 2: SQL Query
Run this in SQL Editor:
```sql
SELECT * FROM product_variants LIMIT 1;
```
Should return empty result (no error)

### Method 3: Check Columns
Run this in SQL Editor:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'product_variants'
ORDER BY ordinal_position;
```
Should show all columns

## Troubleshooting

### Error: "relation already exists"
**Good news!** The table already exists. Just refresh your app.

### Error: "must be owner of table products"
**Solution**: Use the service role key. Make sure your `.env.local` has:
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Error: "syntax error"
**Solution**: Make sure you copied the entire SQL script correctly

### Still getting "table not found" error after creating table
1. Hard refresh browser (Ctrl+Shift+R)
2. Restart Next.js dev server:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

## What This Table Does

The `product_variants` table allows you to:
- ✅ Offer different weights (250g, 500g, 1kg)
- ✅ Set different prices for each weight
- ✅ Track stock for each variant
- ✅ Show discount prices
- ✅ Set a default variant
- ✅ Enable/disable specific variants

## Example Data After Setup

After creating the table and adding variants, it will look like:

| id | product_id | name | price | stock_quantity | is_default |
|----|------------|------|-------|----------------|------------|
| uuid-1 | product-xyz | 250g | 50000 | 100 | false |
| uuid-2 | product-xyz | 500g | 100000 | 50 | true |
| uuid-3 | product-xyz | 1kg | 200000 | 25 | false |

---

## ⚡ Quick Summary

1. Copy the SQL above
2. Paste in Supabase Dashboard → SQL Editor
3. Click Run
4. Refresh your app
5. Try adding variants again!

**Time needed**: 2 minutes  
**Difficulty**: Easy  
**Status after fix**: ✅ Variants will work perfectly
