import { NextResponse } from 'next/server'
import { sendOrderDeliveredEmail } from '@/lib/email/notifications'

export async function GET() {
  try {
    console.log('🔵 Testing order delivery email...')
    
    // Send the delivery email
    const result = await sendOrderDeliveredEmail(
      'Omkar Mahajan',
      'omkarmahajan339@gmail.com',
      'ORD-9868F2B2'
    )
    
    console.log('✅ Result:', result)

    return NextResponse.json({
      success: true,
      message: 'Delivery email test completed!',
      result: result
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}

