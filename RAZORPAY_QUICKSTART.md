# Quick Start: Razorpay Integration

## 🚀 Setup (5 minutes)

### 1. Database Migration
```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/006_razorpay_integration.sql
ALTER TABLE orders ADD COLUMN razorpay_order_id TEXT;
ALTER TABLE orders ADD COLUMN razorpay_payment_id TEXT;
ALTER TABLE orders ADD COLUMN razorpay_signature TEXT;
```

### 2. Get Razorpay Keys
1. Sign up: https://dashboard.razorpay.com/signup
2. Get keys: Settings → API Keys
3. Copy Test Key ID (rzp_test_xxx) and Key Secret

### 3. Update .env.local
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### 4. Test Payment
```bash
npm run dev
# 1. Add product to cart
# 2. Go to checkout
# 3. Fill address
# 4. Click "Proceed to Payment"
# 5. Use test card: 4111 1111 1111 1111
# 6. CVV: 123, Expiry: Any future date
```

## 🔒 Security Checklist

✅ Keys in .env.local (not committed)
✅ Signature verification on backend
✅ No client-side payment success
✅ Webhook signature verification
✅ Admin client for order creation

## 📝 Test Cards

| Purpose | Card Number | CVV | Expiry |
|---------|-------------|-----|--------|
| Success | 4111 1111 1111 1111 | 123 | Any future |
| Failure | 4000 0000 0000 0002 | 123 | Any future |

## 🎯 API Endpoints

### POST /api/verify-payment
Verify payment after Razorpay success
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "sig_xxx",
  "order_id": "uuid"
}
```

### POST /api/razorpay-webhook
Receive async payment updates from Razorpay

## 🛠 Troubleshooting

### Payment modal not opening?
- Check Razorpay script loaded: `console.log(globalThis.window.Razorpay)`
- Verify NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local

### Payment verification fails?
- Check RAZORPAY_KEY_SECRET matches
- View browser console for errors
- Check order exists in database

### Webhook not receiving events?
- Use ngrok for local testing: `ngrok http 3000`
- Update webhook URL in Razorpay dashboard
- Verify webhook secret matches

## 📚 Documentation

- Full setup: `PHASE4_RAZORPAY.md`
- Summary: `PHASE4_COMPLETE.md`
- Razorpay docs: https://razorpay.com/docs/

## ✅ Going Live

1. Complete KYC in Razorpay
2. Generate live keys (rzp_live_*)
3. Update .env.local with live keys
4. Set production webhook URL
5. Test with small real payment
6. Monitor Razorpay dashboard

**Status**: Phase 4 Complete! 🎉
