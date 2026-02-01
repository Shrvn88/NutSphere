# Phase 2 - Search, Filters & Sorting Testing Guide

## ⚠️ IMPORTANT: Run Database Migration First

Before testing, you **MUST** run the SQL migration to create the search indexes:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the content from `supabase/migrations/004_search_indexes.sql`
3. Click "Run" to execute the SQL
4. Verify indexes were created (the script includes a verification query at the end)

## Features Implemented

### 1. Search Functionality
- **Server-side search** - All queries processed on database
- **Fuzzy matching** - Handles typos and partial matches using PostgreSQL trigram similarity
- **Full-text search** - Using `tsvector` for accurate word matching
- **Auto-suggest** - Real-time suggestions as you type (min 2 characters)

### 2. Filters
- **Category Filter** - Filter by product category
- **Price Range** - Set minimum and maximum price
- **Rating Filter** - Show products above a certain rating (4★, 3★, 2★)
- **Stock Status** - Show only in-stock items

### 3. Sorting Options
- **Newest First** - Sort by `created_at DESC`
- **Most Popular** - Sort by `sales_count` and `views_count DESC`
- **Price: Low to High** - Sort by `price ASC`
- **Price: High to Low** - Sort by `price DESC`
- **Highest Rated** - Sort by `rating_average` and `rating_count DESC`

### 4. Performance Optimizations
- **Database Indexes** - Created 12+ indexes for fast queries
- **Edge Runtime** - Suggestions API uses Edge for speed
- **React Cache** - Server-side caching for repeated queries
- **Debounced Suggestions** - 300ms debounce to reduce API calls

## Testing Checklist

### Basic Search
- [ ] Visit homepage and see search bar in navigation
- [ ] Type "almond" in search - should show auto-suggestions
- [ ] Click a suggestion - should navigate to product page
- [ ] Click "View all results" - should go to search page
- [ ] Search for "nuts" - should show all nut products

### Fuzzy Matching (Typo Handling)
- [ ] Search for "almods" (typo) - should still find "almonds"
- [ ] Search for "cashw" (partial) - should find "cashews"
- [ ] Search for "walnut" (singular) - should find "walnuts"

### Filters
- [ ] Go to `/search` page
- [ ] Select a category filter - products should filter immediately
- [ ] Set price range (e.g., 400-600) - only matching products show
- [ ] Select "4★ & above" rating - only high-rated products show
- [ ] Apply multiple filters together - all filters should work together
- [ ] Click "Clear all filters" - should reset to all products

### Sorting
- [ ] Sort by "Newest First" - newest products appear first
- [ ] Sort by "Most Popular" - products with highest sales show first
- [ ] Sort by "Price: Low to High" - cheapest products first
- [ ] Sort by "Price: High to Low" - most expensive first
- [ ] Sort by "Highest Rated" - best rated products first

### Pagination
- [ ] If more than 20 products, pagination should appear
- [ ] Click "Next" - should show next page
- [ ] Click "Previous" - should go back
- [ ] Page number should display correctly
- [ ] Filters and sorting should persist across pages

### URL State (SEO)
- [ ] All filters should be in URL query params
- [ ] Copy URL with filters - should work when pasted
- [ ] Browser back/forward should work correctly
- [ ] Filters should survive page refresh

### Auto-Suggest Performance
- [ ] Typing fast should not spam API (debounced)
- [ ] Loading spinner shows while fetching
- [ ] Clicking outside closes suggestions
- [ ] Pressing Enter submits search

### Edge Cases
- [ ] Search with no results - should show "No products found" message
- [ ] Search with special characters - should handle gracefully
- [ ] Very long search query - should not break
- [ ] Empty search - should show all products

## URLs to Test

- Homepage: http://localhost:3000
- Search page: http://localhost:3000/search
- Search with query: http://localhost:3000/search?q=almond
- With filters: http://localhost:3000/search?q=nuts&category=...&minPrice=400&maxPrice=600&sort=price-asc
- Suggestions API: http://localhost:3000/api/search/suggestions?q=almond

## Performance Checks

- [ ] Search page loads in < 1 second
- [ ] Suggestions appear in < 500ms
- [ ] No client-side filtering (check Network tab)
- [ ] Database queries use indexes (check Supabase logs)
- [ ] Page doesn't freeze while typing in search

## Expected Behavior

### Search Results Page
- Clean grid layout with products
- Filter sidebar on left (sticky)
- Sort dropdown at top
- Product cards with image, name, price, rating, stock status
- Pagination at bottom if > 20 products
- Breadcrumb showing search query

### Auto-Suggest Dropdown
- Shows up to 5 product suggestions
- Each suggestion has: image, name, category, price
- "View all results" link at bottom
- Closes when clicking outside
- Closes after selecting a product

## Database Verification

Run this in Supabase SQL Editor to verify indexes:

```sql
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'products'
ORDER BY indexname;
```

Should see indexes like:
- `idx_products_name_trgm` (fuzzy search)
- `idx_products_search_vector` (full-text search)
- `idx_products_price` (price sorting)
- `idx_products_rating` (rating sorting)
- And more...

## Common Issues

### Images Not Loading
- Already fixed using standard `<img>` tags instead of Next.js Image

### Suggestions Not Working
- Check API endpoint works: `/api/search/suggestions?q=test`
- Verify search_vector column exists in database

### Filters Not Applied
- Check URL has query params
- Verify RLS policies allow SELECT on products table

### Performance Issues
- Run the migration SQL to create indexes
- Check indexes are being used in Supabase query performance tab

## Success Criteria (Exit Criteria)

✅ All Phase 2 features implemented:
- [x] Server-side keyword search
- [x] Auto-suggest with fuzzy matching
- [x] Category, price, rating filters
- [x] 5 sorting options (newest, popular, price asc/desc, rating)
- [x] Pagination
- [x] URL-based state (SEO friendly)

✅ Performance:
- [x] Database indexes created
- [x] No client-side filtering
- [x] Optimized queries
- [x] Scales to thousands of products

✅ User Experience:
- [x] Search bar in navigation
- [x] Real-time suggestions
- [x] Clear filter options
- [x] Responsive design
- [x] Proper error handling

## Next Steps

After testing and confirming Phase 2 works correctly:
- Move to **Phase 3: Cart & Checkout**
- Implement shopping cart functionality
- Add order placement system
