import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// PATCH - Update order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const body = await request.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate status
    const validOrderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (body.status && !validOrderStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
    }

    // Validate payment_status
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']
    if (body.payment_status && !validPaymentStatuses.includes(body.payment_status)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
    }

    // Build update data
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (body.status !== undefined) {
      updateData.status = body.status
    }

    if (body.payment_status !== undefined) {
      updateData.payment_status = body.payment_status
    }

    if (body.tracking_id !== undefined) {
      updateData.tracking_id = body.tracking_id
    }

    if (body.tracking_url !== undefined) {
      updateData.tracking_url = body.tracking_url
    }

    if (body.admin_notes !== undefined) {
      updateData.admin_notes = body.admin_notes
    }

    // Update order
    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Error in order update:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get order details or invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const url = new URL(request.url)
    const format = url.searchParams.get('format')

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        user_id,
        total_amount,
        subtotal,
        payment_status,
        payment_method,
        status,
        tracking_id,
        tracking_url,
        admin_notes,
        created_at,
        updated_at,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address_line1,
        shipping_address_line2,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        order_items (
          id,
          quantity,
          unit_price,
          product_name,
          products (
            id,
            name,
            sku
          )
        )
      `
      )
      .eq('id', orderId)
      .single()

    if (error || !order) {
      console.error('Error fetching order:', error)
      return NextResponse.json({ error: error?.message || 'Order not found' }, { status: error ? 500 : 404 })
    }

    // If format=invoice, return invoice HTML
    if (format === 'invoice') {
      return generateInvoiceHTML(order)
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error in get order:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate invoice HTML
function generateInvoiceHTML(order: any) {
  const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Calculate subtotal from order items
  const subtotal = order.order_items?.reduce(
    (sum: number, item: any) => sum + item.quantity * item.unit_price,
    0
  ) || 0

  const totalAmount = order.total_amount || 0

  const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice-${order.order_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #fff; padding: 20px; }
    .invoice-container { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #e5e5e5; }
    .invoice-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
    .company-info h1 { font-size: 28px; margin-bottom: 5px; }
    .company-info p { font-size: 12px; opacity: 0.9; }
    .invoice-details { text-align: right; }
    .invoice-details h2 { font-size: 24px; margin-bottom: 10px; }
    .invoice-details p { font-size: 12px; margin: 3px 0; }
    .invoice-body { padding: 30px; }
    .address-section { display: flex; gap: 40px; margin-bottom: 30px; }
    .address-box { flex: 1; }
    .address-box h3 { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #667eea; }
    .address-box p { font-size: 13px; margin: 3px 0; }
    .address-box .name { font-weight: 600; font-size: 14px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table th { background: #f8f9fa; padding: 12px 15px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; border-bottom: 2px solid #dee2e6; }
    .items-table td { padding: 15px; border-bottom: 1px solid #e9ecef; font-size: 13px; }
    .items-table .product-name { font-weight: 500; }
    .items-table .text-right { text-align: right; }
    .items-table .text-center { text-align: center; }
    .totals-section { display: flex; justify-content: flex-end; }
    .totals-box { width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 13px; }
    .total-row.subtotal { border-bottom: 1px solid #e9ecef; }
    .total-row.grand-total { border-top: 2px solid #333; font-size: 16px; font-weight: 700; padding-top: 15px; margin-top: 5px; }
    .payment-info { margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; display: flex; gap: 40px; flex-wrap: wrap; }
    .payment-info-item { flex: 1; min-width: 150px; }
    .payment-info-item h4 { font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 5px; }
    .payment-info-item p { font-size: 14px; font-weight: 500; }
    .invoice-footer { background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef; }
    .invoice-footer p { font-size: 12px; color: #666; margin: 5px 0; }
    @media print { body { padding: 0; } .invoice-container { border: none; } }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="company-info">
        <h1>E-Shop</h1>
        <p>Your trusted online shopping destination</p>
        <p>support@eshop.com</p>
      </div>
      <div class="invoice-details">
        <h2>INVOICE</h2>
        <p><strong>Invoice No:</strong> ${order.order_number}</p>
        <p><strong>Date:</strong> ${invoiceDate}</p>
        <p><strong>Order ID:</strong> ${order.id.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>

    <div class="invoice-body">
      <div class="address-section">
        <div class="address-box">
          <h3>Bill To / Ship To</h3>
          <p class="name">${order.customer_name || 'Customer'}</p>
          <p>${order.shipping_address_line1 || ''}</p>
          ${order.shipping_address_line2 ? `<p>${order.shipping_address_line2}</p>` : ''}
          <p>${order.shipping_city || ''}, ${order.shipping_state || ''} ${order.shipping_postal_code || ''}</p>
          <p>${order.shipping_country || 'India'}</p>
          <p>Phone: ${order.customer_phone || ''}</p>
          <p>Email: ${order.customer_email || ''}</p>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 50%">Product</th>
            <th class="text-center" style="width: 15%">Quantity</th>
            <th class="text-right" style="width: 17.5%">Unit Price</th>
            <th class="text-right" style="width: 17.5%">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${order.order_items?.map((item: any) => `
            <tr>
              <td>
                <div class="product-name">${item.product_name || item.products?.name || 'Product'}</div>
                ${item.products?.sku ? `<div style="color: #666; font-size: 11px;">SKU: ${item.products.sku}</div>` : ''}
              </td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right">₹${item.unit_price.toFixed(2)}</td>
              <td class="text-right">₹${(item.quantity * item.unit_price).toFixed(2)}</td>
            </tr>
          `).join('') || ''}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="totals-box">
          <div class="total-row subtotal">
            <span>Subtotal</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>COD Fees</span>
            <span>₹0.00</span>
          </div>
          <div class="total-row grand-total">
            <span>Grand Total</span>
            <span>₹${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="payment-info">
        <div class="payment-info-item">
          <h4>Payment Method</h4>
          <p>${order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'online' ? 'Online Payment' : order.payment_method || 'N/A'}</p>
        </div>
        <div class="payment-info-item">
          <h4>Payment Status</h4>
          <p>${order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1)}</p>
        </div>
        <div class="payment-info-item">
          <h4>Order Status</h4>
          <p>${order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}</p>
        </div>
        ${order.tracking_id ? `
          <div class="payment-info-item">
            <h4>Tracking ID</h4>
            <p>${order.tracking_id}</p>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="invoice-footer">
      <p><strong>Thank you for your business!</strong></p>
      <p>This is a computer-generated invoice and does not require a signature.</p>
    </div>
  </div>

  <script>
    document.title = 'Invoice-${order.order_number}';
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    }
  </script>
</body>
</html>
  `

  return new NextResponse(invoiceHTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}
