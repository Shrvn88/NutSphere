# Quick Test Guide - Variant Persistence Fix

## ✅ What Was Fixed
- Variants now persist when you save and revisit the product edit page
- Proper error messages if variant save fails
- Better data mapping between database and form

## 🧪 Quick Test (2 minutes)

### Step 1: Add a Variant
1. Open your browser and go to: `http://localhost:3000/admin/products`
2. Click **"Edit"** on any product (e.g., Sunflower Seeds)
3. Scroll down to **"Product Variants (Weight Options)"**
4. Click the **"+ Add Variant"** button
5. Fill in:
   - **Variant Name**: `500g`
   - **Weight (grams)**: `500`
   - **Price (₹)**: `10.00`
   - **Stock Quantity**: `100`
   - Check ✅ **"Set as default"**
   - Check ✅ **"Set as Active"**
6. Click **"Add"** button

### Step 2: Save Product
1. Scroll to the bottom
2. Click **"Update Product"** button
3. Wait for the success message
4. You'll be redirected to the products list

### Step 3: Verify Persistence
1. Click **"Edit"** on the same product again
2. Scroll to **"Product Variants (Weight Options)"**
3. **✅ SUCCESS**: You should see your `500g` variant listed!

## 📸 Expected Result

**Before Fix:**
- Added variant → Saved → Reopened → ❌ Variant gone

**After Fix:**
- Added variant → Saved → Reopened → ✅ Variant still there!

## 🎯 What You Should See

In the variants table, you should see:

| VARIANT | PRICE | STOCK | DEFAULT | ACTIONS |
|---------|-------|-------|---------|---------|
| 500g    | ₹1000.00<br/>~~₹1500.00~~ | 100 | Default | Edit Delete |

## 🐛 If It Still Doesn't Work

1. **Check Browser Console** (F12 → Console tab)
   - Look for any red error messages
   - Share the error message

2. **Check Server Logs**
   - Look at your terminal where Next.js is running
   - Look for errors related to "variants"

3. **Hard Refresh**
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Or `Cmd + Shift + R` (Mac)

4. **Verify Database**
   - Open your Supabase dashboard
   - Go to Table Editor → `product_variants`
   - Check if your variant is actually saved there

## 💡 Common Issues

### "No variants added yet" after saving
**Cause**: Browser cache  
**Fix**: Hard refresh the page

### Error message when saving
**Cause**: Missing required fields or permission issue  
**Fix**: 
- Ensure all required fields are filled (Name, Price)
- Check that you're logged in as admin
- Check server logs for detailed error

### Variants show in admin but not on product page
**This is a different issue!**  
**Fix**: See the [VARIANT_FIX_GUIDE.md](VARIANT_FIX_GUIDE.md)

## 📋 Full Testing Checklist

Test all these scenarios:

- [ ] Add single variant → Save → Reopen → Variant appears
- [ ] Add multiple variants → Save → Reopen → All variants appear
- [ ] Edit existing variant → Save → Reopen → Changes saved
- [ ] Delete variant → Save → Reopen → Variant gone
- [ ] Set different variant as default → Save → Reopen → New default active
- [ ] Inactive variant → Save → Reopen → Shows as inactive

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Variants appear in the list after saving
2. ✅ You can edit variants and changes persist
3. ✅ Default variant badge shows correctly
4. ✅ No errors in console or server logs
5. ✅ Price formatting is correct (₹X.XX format)

---

**Need Help?** Check these guides:
- Full details: [VARIANT_PERSISTENCE_FIX.md](VARIANT_PERSISTENCE_FIX.md)
- Frontend display: [VARIANT_FIX_GUIDE.md](VARIANT_FIX_GUIDE.md)
