import { NextResponse } from 'next/server'
import { sendOrderDeliveredEmail } from '@/lib/email/notifications'

export async function GET() {
  try {
    console.log('🔵 Starting delivery email test...')
    console.log('Environment:', {
      apiKey: process.env.RESEND_API_KEY?.substring(0, 15) + '...',
      fromEmail: process.env.EMAIL_FROM
    })

    const result = await sendOrderDeliveredEmail(
      'Omkar Mahajan',
      'omkarmahajan339@gmail.com',
      'TEST-12345'
    )

    console.log('✅ Email result:', result)

    return NextResponse.json({
      success: true,
      message: 'Delivery email sent!',
      result: result,
      config: {
        to: 'omkarmahajan339@gmail.com',
        apiKey: process.env.RESEND_API_KEY?.substring(0, 15) + '...',
        fromEmail: process.env.EMAIL_FROM
      }
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        details: error
      },
      { status: 500 }
    )
  }
}

