import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'

// Custom price formatter for PDF (jsPDF doesn't handle ₹ well)
function formatPriceForPDF(price: number): string {
  return `Rs ${price.toLocaleString('en-IN')}`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    console.log('[Admin Invoice] Generating invoice for order:', orderId)

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

    // Get order details with items
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          line_total,
          discount_percentage,
          product_name
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Create PDF document - EXACT SAME AS CUSTOMER INVOICE
    const doc = new jsPDF()
    
    let yPos = 20

    // Header - Company Info with branding
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(34, 197, 94) // Green color for NutSphere
    doc.text('NUTSPHERE', 20, yPos)
    
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    yPos += 6
    doc.text('NUTSPHERE AGROCOMM', 20, yPos)
    
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    yPos += 7
    doc.text('H.NO 84, Shivkalyan Nagar Loha', 20, yPos)
    yPos += 5
    doc.text('Dist-Nanded 431708, Maharashtra', 20, yPos)
    yPos += 5
    doc.text('Email: orders@nutsphere.com', 20, yPos)
    yPos += 5
    doc.text('Phone: +91 87665 00291', 20, yPos)
    yPos += 5
    doc.text('FSSAI License: 1121599900840', 20, yPos)
    
    doc.setTextColor(0, 0, 0) // Reset to black

    // Invoice Title (right side)
    doc.setFontSize(26)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('TAX INVOICE', 200, 22, { align: 'right' })
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    doc.text(`Invoice No: ${order.order_number}`, 200, 35, { align: 'right' })
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}`, 200, 40, { align: 'right' })
    doc.text(`Payment: ${order.payment_status.toUpperCase()}`, 200, 45, { align: 'right' })
    
    doc.setTextColor(0, 0, 0) // Reset to black

    // Line separator
    yPos = 65
    doc.setDrawColor(34, 197, 94) // Green line
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)
    doc.setDrawColor(0, 0, 0) // Reset to black
    doc.setLineWidth(0.2)

    // Customer Details
    yPos += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', 20, yPos)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPos += 7
    doc.text(order.customer_name, 20, yPos)
    yPos += 5
    doc.text(order.customer_email, 20, yPos)
    yPos += 5
    doc.text(order.customer_phone, 20, yPos)

    // Shipping Address (right side)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('SHIP TO:', 120, 70)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    let shipY = 77
    doc.text(order.customer_name, 120, shipY)
    shipY += 5
    doc.text(order.shipping_address_line1, 120, shipY)
    shipY += 5
    if (order.shipping_address_line2) {
      doc.text(order.shipping_address_line2, 120, shipY)
      shipY += 5
    }
    doc.text(`${order.shipping_city}, ${order.shipping_state} ${order.shipping_postal_code}`, 120, shipY)
    shipY += 5
    doc.text(order.shipping_country, 120, shipY)

    // Table Header
    yPos = 110
    doc.line(20, yPos, 190, yPos)
    yPos += 7
    doc.setFont('helvetica', 'bold')
    doc.text('Item', 20, yPos)
    doc.text('Qty', 110, yPos)
    doc.text('Price', 130, yPos)
    doc.text('Discount', 155, yPos)
    doc.text('Total', 190, yPos, { align: 'right' })
    
    yPos += 2
    doc.line(20, yPos, 190, yPos)

    // Table Items
    doc.setFont('helvetica', 'normal')
    yPos += 7
    for (const item of order.order_items) {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      const itemName = item.product_name.length > 40 
        ? item.product_name.substring(0, 37) + '...'
        : item.product_name

      doc.text(itemName, 20, yPos)
      doc.text(item.quantity.toString(), 110, yPos)
      doc.text(formatPriceForPDF(item.unit_price), 130, yPos)
      doc.text(item.discount_percentage > 0 ? `${item.discount_percentage}%` : '-', 155, yPos)
      doc.text(formatPriceForPDF(item.line_total), 190, yPos, { align: 'right' })

      yPos += 10
    }

    // Summary section
    yPos += 5
    doc.line(20, yPos, 190, yPos)
    yPos += 10

    doc.text('Subtotal:', 140, yPos)
    doc.text(formatPriceForPDF(order.subtotal), 190, yPos, { align: 'right' })
    yPos += 7

    if (order.discount_amount > 0) {
      doc.text('Discount:', 140, yPos)
      doc.text(`-${formatPriceForPDF(order.discount_amount)}`, 190, yPos, { align: 'right' })
      yPos += 7
    }

    doc.text('Shipping:', 140, yPos)
    doc.text(order.shipping_cost === 0 ? 'FREE' : formatPriceForPDF(order.shipping_cost), 190, yPos, { align: 'right' })
    yPos += 7

    doc.setFontSize(8)
    doc.setTextColor(0, 128, 0) // Green color
    doc.text('GST:', 140, yPos)
    doc.text('Included', 190, yPos, { align: 'right' })
    doc.setTextColor(0, 0, 0) // Back to black
    doc.setFontSize(10)
    yPos += 10

    doc.line(140, yPos, 190, yPos)
    yPos += 7

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Grand Total:', 140, yPos)
    doc.text(formatPriceForPDF(order.total_amount), 190, yPos, { align: 'right' })

    // Footer with branding
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    doc.text('This is a computer-generated invoice and does not require a signature.', 105, 270, { align: 'center' })
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(34, 197, 94)
    doc.text('Thank you for choosing NutSphere!', 105, 275, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(7)
    doc.text('www.nutsphere.in | Premium Quality Nuts & Seeds', 105, 280, { align: 'center' })

    // Generate PDF
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${order.order_number}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
}
