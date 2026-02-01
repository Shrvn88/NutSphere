# Phase 4: Razorpay Payment Integration

## Overview
Complete Razorpay payment gateway integration with secure backend verification, webhooks, and refund support.

## Features Implemented

### 1. **Razorpay Order Creation** ✅
- Server-side order creation via Razorpay API
- Order amount, currency, and receipt stored
- Integration with database order creation flow

### 2. **Payment Verification** ✅
- Signature verification using HMAC SHA256
- Backend-only verification (no client-side trust)
- Payment status updates in database
- Order confirmation on successful payment

### 3. **Failure Handling** ✅
- Payment failure detection
- Order status updates on failure
- User-friendly error messages
- Payment retry support

### 4. **Webhook Support** ✅
- Razorpay webhook endpoint configured
- Signature verification for webhook authenticity
- Handles multiple webhook events:
  - `payment.authorized`
  - `payment.captured`
  - `payment.failed`
  - `refund.created`
  - `refund.processed`

### 5. **Refund Functionality** ✅
- Server action to trigger refunds
- Full refund support via Razorpay API
- Stock restoration on refund
- Order status updates

## Setup Instructions

### 1. Database Migration

Run the migration in your Supabase SQL editor:

```bash
# The migration file is already created at:
supabase/migrations/006_razorpay_integration.sql
```

**What it does:**
- Adds `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` columns to orders table
- Creates indexes for faster lookups
- Adds `increment_stock` function for refunds

### 2. Razorpay Account Setup

1. **Create Razorpay Account**
   - Go to https://dashboard.razorpay.com/signup
   - Complete KYC verification
   - Activate your account

2. **Get API Keys**
   - Navigate to Settings → API Keys
   - Generate Test/Live keys
   - Copy the Key ID and Key Secret

3. **Setup Webhook**
   - Go to Settings → Webhooks
   - Click "Add New Webhook"
   - Webhook URL: `https://yourdomain.com/api/razorpay-webhook`
   - Select events:
     - `payment.authorized`
     - `payment.captured`
     - `payment.failed`
     - `refund.created`
     - `refund.processed`
   - Copy the Webhook Secret

### 3. Environment Configuration

Update your `.env.local` file with Razorpay credentials:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

**Important:**
- Use test keys (`rzp_test_*`) for development
- Use live keys (`rzp_live_*`) for production only after full testing
- Never commit these keys to version control

### 4. Testing the Integration

#### Test Mode (Development)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the checkout flow:**
   - Add items to cart
   - Proceed to checkout
   - Fill in address details
   - Click "Proceed to Payment"
   - Razorpay modal should open

3. **Use Razorpay test cards:**
   - Success: `4111 1111 1111 1111`
   - Failure: `4000 0000 0000 0002`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - OTP: `123456` (for Indian cards)

4. **Verify the flow:**
   - Payment success redirects to order confirmation
   - Order status is "confirmed"
   - Payment status is "paid"
   - Check Supabase orders table for payment details

#### Test Webhooks Locally

Use ngrok or similar tool to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the ngrok URL in Razorpay webhook settings
# Example: https://abc123.ngrok.io/api/razorpay-webhook
```

### 5. Going Live

1. **Complete Razorpay KYC** (if not done)
   - Submit business documents
   - Wait for approval

2. **Activate Live Mode**
   - Generate live API keys
   - Update `.env.local` with live keys

3. **Update Webhook URL**
   - Use production domain
   - Example: `https://yourdomain.com/api/razorpay-webhook`

4. **Test with real money** (small amounts)
   - Place a test order with real payment
   - Verify payment flow
   - Test refund functionality

## Security Features

### ✅ Backend-Only Logic
- Order creation happens on server
- Payment verification on server
- No sensitive operations on client

### ✅ Signature Verification
- All payments verified with HMAC SHA256
- Webhooks verified with webhook secret
- No fake payments possible

### ✅ Environment Variables
- Keys stored securely in `.env.local`
- Never exposed to client (except key ID)
- Service role key used for database operations

### ✅ RLS (Row Level Security)
- Admin client bypasses RLS for order creation
- User data protected by Supabase RLS policies

## API Endpoints

### POST `/api/verify-payment`
Verifies Razorpay payment signature after successful payment.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "order_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "order": { ... }
}
```

### POST `/api/razorpay-webhook`
Receives webhook events from Razorpay.

**Headers:**
- `x-razorpay-signature`: Webhook signature

**Body:**
```json
{
  "event": "payment.captured",
  "payload": { ... }
}
```

## Server Actions

### `createOrder(checkoutData)`
Creates order in database and Razorpay.

**Returns:**
```typescript
{
  success: boolean
  orderId?: string
  orderNumber?: string
  razorpayOrderId?: string
  amount?: number
  currency?: string
  error?: string
}
```

### `refundOrder(orderId, reason?)`
Processes refund for a paid order.

**Returns:**
```typescript
{
  success: boolean
  refundId?: string
  error?: string
}
```

## Flow Diagram

```
User Checkout
     ↓
Create Order (Server)
     ↓
Create Razorpay Order (Server)
     ↓
Open Razorpay Modal (Client)
     ↓
User Pays
     ↓
Payment Success Handler (Client)
     ↓
Verify Signature (Server)
     ↓
Update Order Status (Server)
     ↓
Redirect to Confirmation
     ↓
Webhook Notification (Async)
```

## Exit Criteria - All Met ✅

- [x] No fake payment success
- [x] Signature verification implemented
- [x] Secure backend-only logic
- [x] Order creation integrated with Razorpay
- [x] Payment verification API working
- [x] Webhook handler configured
- [x] Refund functionality implemented
- [x] Error handling for all scenarios
- [x] Test mode working
- [x] Production-ready code

## Troubleshooting

### Payment not working?
1. Check Razorpay keys in `.env.local`
2. Verify script loaded: `console.log(window.Razorpay)`
3. Check browser console for errors

### Webhook not receiving events?
1. Verify webhook URL is publicly accessible
2. Check webhook secret matches
3. View webhook logs in Razorpay dashboard

### Refund failing?
1. Ensure order is paid
2. Check payment ID exists in database
3. Verify Razorpay account has refund permissions

## Next Steps

After Phase 4, proceed to Phase 5 based on your roadmap (Admin Dashboard, Analytics, etc.).

**Remember:** Always test thoroughly in test mode before going live with real payments!
