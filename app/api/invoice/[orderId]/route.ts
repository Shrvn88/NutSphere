import { NextRequest, NextResponse } from 'next/server'
import { getOrder } from '@/lib/data/orders'
import { formatPrice } from '@/lib/utils/product'
import { jsPDF } from 'jspdf'

interface Props {
  params: Promise<{ orderId: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { orderId } = await params
    const order = await getOrder(orderId)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Create PDF document
    const doc = new jsPDF()
    
    let yPos = 20

    // Header - Company Info
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('NUTSPHERE', 20, yPos)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPos += 10
    doc.text('H.NO 84, Shivkalyan Nagar Loha', 20, yPos)
    yPos += 5
    doc.text('Dist-Nanded 431708, Maharashtra', 20, yPos)
    yPos += 5
    doc.text('Email: orders@nutsphere.com', 20, yPos)
    yPos += 5
    doc.text('Phone: +91 87665 00291', 20, yPos)

    // Invoice Title (right side)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('TAX INVOICE', 200, 20, { align: 'right' })
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Invoice No: ${order.order_number}`, 200, 35, { align: 'right' })
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}`, 200, 40, { align: 'right' })
    doc.text(`Payment: ${order.payment_status.toUpperCase()}`, 200, 45, { align: 'right' })

    // Line separator
    yPos = 60
    doc.line(20, yPos, 190, yPos)

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
    doc.text('Qty', 120, yPos)
    doc.text('Price', 140, yPos)
    doc.text('Discount', 160, yPos)
    doc.text('Total', 180, yPos, { align: 'right' })
    
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
      doc.text(item.quantity.toString(), 120, yPos)
      doc.text(formatPrice(item.unit_price), 140, yPos)
      doc.text(item.discount_percentage > 0 ? `${item.discount_percentage}%` : '-', 160, yPos)
      doc.text(formatPrice(item.line_total), 180, yPos, { align: 'right' })

      yPos += 10
    }

    // Summary section
    yPos += 5
    doc.line(20, yPos, 190, yPos)
    yPos += 10

    doc.text('Subtotal:', 140, yPos)
    doc.text(formatPrice(order.subtotal), 180, yPos, { align: 'right' })
    yPos += 7

    if (order.discount_amount > 0) {
      doc.text('Discount:', 140, yPos)
      doc.text(`-${formatPrice(order.discount_amount)}`, 180, yPos, { align: 'right' })
      yPos += 7
    }

    doc.text('Shipping:', 140, yPos)
    doc.text(order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost), 180, yPos, { align: 'right' })
    yPos += 7

    doc.setFontSize(8)
    doc.setTextColor(0, 128, 0) // Green color
    doc.text('GST:', 140, yPos)
    doc.text('Included', 180, yPos, { align: 'right' })
    doc.setTextColor(0, 0, 0) // Back to black
    doc.setFontSize(10)
    yPos += 10

    doc.line(140, yPos, 190, yPos)
    yPos += 7

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Grand Total:', 140, yPos)
    doc.text(formatPrice(order.total_amount), 180, yPos, { align: 'right' })

    // Footer
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('This is a computer-generated invoice and does not require a signature.', 105, 270, { align: 'center' })
    doc.text('Thank you for your business!', 105, 275, { align: 'center' })

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
