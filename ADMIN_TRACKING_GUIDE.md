# Admin Tracking Update Helper

This document shows how to update order tracking information and trigger shipment emails.

## Option 1: Using Server Console (Node.js)

Create a script `scripts/update-tracking.ts`:

```typescript
import { updateOrderTracking } from '@/lib/data/orders'

async function updateTracking() {
  const result = await updateOrderTracking(
    'your-order-id-here',      // Order ID from database
    'Blue Dart',                // Courier name
    'BD1234567890',            // Tracking number
    'https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890' // Tracking URL
  )
  
  if (result.success) {
    console.log('✅ Tracking updated and email sent!')
  } else {
    console.error('❌ Error:', result.error)
  }
}

updateTracking()
```

Run with: `npx tsx scripts/update-tracking.ts`

## Option 2: Using Supabase SQL Editor

For manual updates without email notification:

```sql
UPDATE orders
SET 
  courier_name = 'Blue Dart',
  tracking_id = 'BD1234567890',
  tracking_url = 'https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890',
  status = 'shipped',
  updated_at = NOW()
WHERE id = 'your-order-id-here';
```

**Note:** This won't send the shipment email. Use Option 1 for automatic emails.

## Option 3: Create Admin API Route

Create `app/api/admin/update-tracking/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { updateOrderTracking } from '@/lib/data/orders'

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check here
    
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
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Tracking updated and email sent' 
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

Call from Postman or curl:

```bash
curl -X POST http://localhost:3000/api/admin/update-tracking \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "your-order-id",
    "courierName": "Blue Dart",
    "trackingId": "BD1234567890",
    "trackingUrl": "https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890"
  }'
```

## Common Courier Tracking URLs

### Blue Dart
```
https://www.bluedart.com/tracking.aspx?trackNo={TRACKING_ID}
```

### Delhivery
```
https://www.delhivery.com/track/package/{TRACKING_ID}
```

### DTDC
```
https://www.dtdc.in/tracking.asp?Ttype=0&strCnno={TRACKING_ID}
```

### India Post
```
https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx
```

### Ecom Express
```
https://ecomexpress.in/tracking/?awb_field={TRACKING_ID}
```

## Example Usage

```typescript
// Blue Dart shipment
await updateOrderTracking(
  'order-id',
  'Blue Dart',
  'BD1234567890',
  'https://www.bluedart.com/tracking.aspx?trackNo=BD1234567890'
)

// Delhivery shipment
await updateOrderTracking(
  'order-id',
  'Delhivery',
  'DEL987654321',
  'https://www.delhivery.com/track/package/DEL987654321'
)

// Without tracking URL (will show tracking ID only)
await updateOrderTracking(
  'order-id',
  'Local Courier',
  'LC123456'
)
```

## What Happens When You Call updateOrderTracking()

1. ✅ Order status changed to "shipped"
2. ✅ Courier name, tracking ID, and URL saved to database
3. ✅ Shipment email sent to customer with:
   - Order number
   - Courier name
   - Tracking ID
   - "Track Your Order" button (if URL provided)
4. ✅ Customer can view tracking on order detail page

## Troubleshooting

### Email Not Sending
- Check `.env.local` has `RESEND_API_KEY`
- Verify sender email is verified in Resend dashboard
- Check server logs for email errors
- For testing, use `onboarding@resend.dev` as FROM email

### Order Not Found Error
- Verify order ID exists in database
- Check order belongs to a real user
- Ensure migration 007 has been run

### Permission Denied
- This is an admin function - ensure proper authentication
- Use admin client or service role key for database access
