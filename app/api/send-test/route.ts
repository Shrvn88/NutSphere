import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.EMAIL_FROM || 'orders@send.nutsphere.com'

    if (!apiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    console.log('Testing with:', { apiKey: apiKey.substring(0, 10) + '...', fromEmail })

    const { data, error } = await resend.emails.send({
      from: 'NutSphere Orders <' + fromEmail + '>',
      to: 'omkarmahajan339@gmail.com',
      replyTo: 'support@nutsphere.com',
      subject: 'Your NutSphere Order Confirmation - Test Email',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; border-radius: 12px;">
              <h1 style="margin: 0; font-size: 28px;">Order Confirmation</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px;">Thank you for your order</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb; border-radius: 12px; margin-top: 20px;">
              <p style="font-size: 16px;">Dear Omkar,</p>
              <p>Thank you for shopping with NutSphere! This is a test email to confirm our email system is working correctly.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="margin-top: 0; color: #1f2937;">✅ Configuration Verified</h3>
                <ul style="line-height: 1.8;">
                  <li><strong>From:</strong> ${fromEmail}</li>
                  <li><strong>To:</strong> omkarmahajan339@gmail.com</li>
                  <li><strong>Domain:</strong> send.nutsphere.com ✓</li>
                  <li><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</li>
                </ul>
              </div>
              
              <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <h3 style="margin-top: 0;">📧 Email Features Active</h3>
                <p style="margin: 10px 0;">Your store will now automatically send:</p>
                <ul style="line-height: 1.8;">
                  <li>Order confirmation emails</li>
                  <li>Shipping notifications</li>
                  <li>Delivery confirmations</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">© 2026 NutSphere. All rights reserved.</p>
                <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
                  NutSphere Premium Nuts & Seeds Store<br>
                  Email: support@nutsphere.com | Website: nutsphere.com
                </p>
                <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
                  You received this email because you placed an order with NutSphere.<br>
                  <a href="#" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> | 
                  <a href="#" style="color: #6b7280; text-decoration: underline;">Contact Support</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend API Error:', error)
      return NextResponse.json(
        { 
          success: false,
          error: error.message,
          details: error,
          config: {
            fromEmail,
            apiKeyPrefix: apiKey.substring(0, 10) + '...'
          }
        },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data)

    return NextResponse.json({
      success: true,
      message: '🎉 Test email sent successfully!',
      emailId: data?.id,
      details: {
        from: fromEmail,
        to: 'omkarmahajan339@gmail.com',
        timestamp: new Date().toISOString(),
        checkInbox: 'Please check omkarmahajan339@gmail.com inbox (and spam folder)'
      }
    })

  } catch (error: any) {
    console.error('Exception:', error)
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

