# Email Notification Setup Guide

## Overview
Your e-commerce store automatically sends email notifications to customers at key order stages to build trust and keep them informed.

## Email Notifications Implemented

### 1. Order Confirmation Email ✅
**Trigger:** Automatically sent when a customer places an order  
**Location:** `lib/data/orders.ts` → `createOrder()` function  
**Template:** `lib/email/notifications.ts` → `sendOrderConfirmationEmail()`

**Includes:**
- Order number and date
- Complete order details with itemized list
- Total amount paid
- Shipping address
- Contact information

### 2. Order Delivered Email ✅
**Trigger:** Automatically sent when admin updates order status to "delivered"  
**Location:** `app/api/admin/orders/[orderId]/update/route.ts`  
**Template:** `lib/email/notifications.ts` → `sendOrderDeliveredEmail()`

**Includes:**
- Order delivery confirmation
- Quality check reminder (inspect products immediately)
- Refund policy notice (only for defective/damaged products)
- Contact information with phone and email
- 24-hour window to report issues with photos

### 3. Order Shipped Email (Available)
**Trigger:** Can be sent manually when order is shipped  
**Template:** `lib/email/notifications.ts` → `sendOrderShippedEmail()`

**Includes:**
- Shipment confirmation
- Courier name and tracking ID
- Tracking URL (if available)
- Contact information

## Email Service Configuration

### Using Resend (Recommended)

1. **Create Resend Account:**
   - Go to https://resend.com
   - Sign up for a free account
   - Verify your email

2. **Get API Key:**
   - Navigate to API Keys in dashboard
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Configure Domain (Optional but Recommended):**
   - Add your domain in Resend dashboard
   - Add DNS records (TXT, CNAME) to verify
   - Once verified, emails will be sent from your domain

4. **Set Environment Variables:**
   Add to your `.env.local` file:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=noreply@nutsphere.com
   ```

   For testing, you can use:
   ```env
   EMAIL_FROM=onboarding@resend.dev
   ```

## Testing Email Notifications

### Test Order Confirmation
1. Place a test order on your website
2. Check the registered email for confirmation
3. Verify all order details are correct

### Test Delivery Notification
1. Go to Admin Dashboard → Orders
2. Select any order
3. Change status to "Delivered"
4. Check customer email for delivery notification

### Check Email Logs
- View sent emails in Resend dashboard
- Check delivery status and open rates
- Monitor bounces and complaints

## Email Template Customization

All email templates are in `lib/email/notifications.ts`

### Current Branding:
- **Company:** NutSphere
- **Address:** H.NO 84, Shivkalyan Nagar Loha, Dist-Nanded 431708
- **Phone:** +91 87665 00291
- **Email:** Hello@nutsphere.com

### To Customize:
1. Open `lib/email/notifications.ts`
2. Edit HTML templates in each function
3. Modify colors, fonts, or content as needed
4. Test changes by placing a test order

### Template Features:
- Responsive design (mobile-friendly)
- Professional styling with brand colors
- Clear call-to-action buttons
- Automatic date formatting (Indian format)
- Price formatting with rupee symbol

## Troubleshooting

### Emails Not Sending
1. **Check API Key:**
   ```bash
   # Verify environment variable is set
   echo $RESEND_API_KEY
   ```

2. **Check Logs:**
   - Look for errors in terminal/console
   - Check Resend dashboard for failed sends

3. **Verify Email Address:**
   - Ensure customer email is valid
   - Check spam folder

### Emails Going to Spam
1. **Verify Domain:** Set up SPF, DKIM, DMARC records
2. **Use Real Domain:** Don't use `onboarding@resend.dev` in production
3. **Avoid Spam Words:** Keep email content professional

### Email Content Issues
1. **Check Template Variables:** Ensure all data is passed correctly
2. **Test HTML:** Use Resend's preview feature
3. **Validate Links:** Ensure all URLs are absolute paths

## Production Checklist

- [ ] Resend API key configured in production environment
- [ ] Custom domain verified and configured
- [ ] `EMAIL_FROM` set to your domain email
- [ ] Test order confirmation email
- [ ] Test delivery notification email
- [ ] Verify all contact details are correct
- [ ] Check email deliverability (spam score)
- [ ] Monitor email logs regularly

## Additional Features to Consider

### Future Enhancements:
- **Order Shipped Notification:** Trigger when tracking ID is added
- **Order Cancelled:** Notify when order is cancelled
- **Refund Confirmation:** Send when refund is processed
- **Review Request:** Ask for product review after delivery
- **Abandoned Cart:** Remind users of items in cart (requires scheduled jobs)

### SMS Notifications (Optional):
Consider adding SMS via:
- Twilio
- MSG91
- Fast2SMS

## Support

For email service issues:
- **Resend Docs:** https://resend.com/docs
- **Support:** support@resend.com

For customization help:
- Edit templates in `lib/email/notifications.ts`
- Test locally before deploying
- Monitor delivery rates in Resend dashboard

---

**Note:** Email notifications are already implemented and will work automatically once you configure the Resend API key. All templates include your business details and refund policy.
