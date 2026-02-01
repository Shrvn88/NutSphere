# Phase 1 Testing Guide

## Quick Test Instructions

### 1. View Page Source (Check SEO)
Right-click on any page → "View Page Source"

**What to look for:**
```html
<!-- Product Detail Page -->
<title>Premium Almonds | E-Commerce Store</title>
<meta name="description" content="Buy Premium Almonds - Premium quality...">
<meta property="og:title" content="Premium Almonds">
<meta property="og:image" content="...">
<script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Product"...}
</script>
```

### 2. Test Sitemap
Visit: `http://localhost:3000/sitemap.xml`

Should show XML with all URLs:
- Home page
- /categories
- /products
- All category pages
- All product pages

### 3. Test Robots.txt
Visit: `http://localhost:3000/robots.txt`

Should show:
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /account/

Sitemap: https://yourstore.com/sitemap.xml
```

### 4. Test Image Loading
Open DevTools → Network tab → Filter by "Img"
- Images should load as WebP format
- Check for proper sizes (not loading full-size unnecessarily)
- Verify Supabase CDN URLs

### 5. Test Performance
1. Open Chrome DevTools → Lighthouse tab
2. Select "Mobile" device
3. Check all categories
4. Click "Generate report"

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 100

### 6. Test Mobile Responsiveness
1. Open DevTools → Device Toolbar (Ctrl+Shift+M)
2. Test devices:
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - Galaxy S20 (360x800)

Check:
- Product grid responsive
- Images scale properly
- Text readable
- Buttons tappable

### 7. Test Navigation
1. Home → Categories → Select Category → See Products
2. Click on a Product → See Details
3. Use breadcrumbs to go back
4. Test pagination (if more than 12 products)

### 8. Test Data Display
**Product Card should show:**
- ✅ Product image
- ✅ Discount badge (10% OFF)
- ✅ Stock status (In Stock / Low Stock / Out of Stock)
- ✅ Product name
- ✅ Category name (clickable)
- ✅ Star rating
- ✅ Discounted price
- ✅ Original price (strikethrough)
- ✅ Weight

**Product Detail should show:**
- ✅ Breadcrumb navigation
- ✅ Large product image
- ✅ Discount badge
- ✅ Thumbnail gallery
- ✅ Category link
- ✅ Star ratings
- ✅ Price with savings
- ✅ Stock status
- ✅ Weight
- ✅ Description
- ✅ Add to Cart button
- ✅ Add to Wishlist button
- ✅ Additional info (delivery, returns, authenticity)

## Build Test

Before considering Phase 1 complete:

```powershell
# Stop dev server
# Then run production build
npm run build

# Should complete without errors
# Check output for:
# ○ (Static)  - Pages pre-rendered at build time
# ƒ (Dynamic) - Server-rendered on demand
```

Expected output for Phase 1 pages:
```
Route (app)                              Size
├ ○ /                                    ...
├ ○ /categories                          ...
├ ƒ /categories/[slug]                   ...
├ ○ /products                            ...
├ ƒ /products/[slug]                     ...
```

## Production Test

After deploying:

1. **Submit to Google Search Console**
   - Add property
   - Verify ownership
   - Submit sitemap

2. **Test with Google Rich Results**
   Visit: https://search.google.com/test/rich-results
   - Enter your product page URL
   - Should detect Product schema

3. **Test Social Media Previews**
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

## Common Issues & Solutions

### Images not loading
- Check Supabase Storage bucket is public
- Verify RLS policy allows anonymous SELECT
- Check image URLs in database

### Sitemap 404
- Verify app/sitemap.ts file exists
- Check Next.js version (requires 13+)
- Run `npm run build` to regenerate

### Slow page loads
- Check database indexes exist
- Verify pagination is working
- Check image optimization in next.config.ts
- Enable caching headers

### SEO tags not showing
- Check View Source (not DevTools Elements - that shows client-side)
- Verify generateMetadata is async
- Check for errors in server console

## Phase 1 Completion Checklist

- [ ] All pages load without errors
- [ ] Product images display correctly
- [ ] Pagination works on listing pages
- [ ] Product detail page shows all info
- [ ] Breadcrumbs navigate correctly
- [ ] Stock status badges display with correct colors
- [ ] Discount calculations accurate
- [ ] Category filtering works
- [ ] Sitemap.xml accessible
- [ ] Robots.txt accessible
- [ ] Page source shows meta tags
- [ ] JSON-LD structured data present
- [ ] npm run build succeeds
- [ ] Lighthouse score 90+ on performance
- [ ] Mobile responsive (tested on 3 devices)
- [ ] Images load as WebP/AVIF

## Ready for Phase 2?

Once all items above are checked:
✅ Phase 1 is complete
✅ Production-ready
✅ Ready to proceed to Phase 2: Shopping Cart & Checkout

---

**Note:** Remember to update placeholder URLs before deploying:
- Replace `https://yourstore.com` with actual domain
- Replace `@yourstore` with actual Twitter handle
- Add `/public/og-image.jpg` for social media
