import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const CONTACT_EMAIL = 'hello@nutsphere.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email to business
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">📧 New Contact Form Submission</h1>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin-top: 0; color: #1f2937; font-size: 18px;">Contact Details</h2>
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px 0;">${subject}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h2 style="margin-top: 0; color: #1f2937; font-size: 18px;">Message</h2>
              <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-left: 4px solid #2563eb; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; color: #1e40af;">
                <strong>💡 Quick Action:</strong> Reply directly to this email to respond to the customer.
              </p>
            </div>
          </div>
          
          <div style="background-color: #1f2937; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 5px 0;">© 2026 NutSphere. All rights reserved.</p>
            <p style="margin: 5px 0;">This is an automated notification from your website contact form.</p>
          </div>
        </body>
      </html>
    `

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: CONTACT_EMAIL,
      replyTo: email, // Allow direct reply to customer
      subject: `Contact Form: ${subject}`,
      html,
    })

    if (emailError) {
      console.error('Failed to send contact email:', emailError)
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      )
    }

    // Send confirmation email to customer
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">✓ Message Received!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for contacting us</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; margin-top: 0;">Hi ${name},</p>
            <p style="font-size: 16px;">Thank you for reaching out to NutSphere! We have received your message and will get back to you as soon as possible.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #1f2937; font-size: 18px;">Your Message</h2>
              <p style="margin: 5px 0; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 15px 0 5px 0; font-size: 14px;"><strong>Message:</strong></p>
              <p style="margin: 5px 0; white-space: pre-wrap; font-size: 14px; color: #6b7280; line-height: 1.6;">${message}</p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
              We typically respond within 24 hours during business days (Monday-Saturday, 9:00 AM - 6:00 PM IST).
            </p>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="font-size: 14px; margin: 5px 0;"><strong>Need immediate assistance?</strong></p>
              <p style="font-size: 14px; margin: 5px 0;">📞 Phone: <a href="tel:+918766500291" style="color: #2563eb; text-decoration: none;">+91 87665 00291</a></p>
              <p style="font-size: 14px; margin: 5px 0;">✉️ Email: <a href="mailto:hello@nutsphere.com" style="color: #2563eb; text-decoration: none;">hello@nutsphere.com</a></p>
            </div>
          </div>
          
          <div style="background-color: #1f2937; color: #d1d5db; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 5px 0;">© 2026 NutSphere. All rights reserved.</p>
            <p style="margin: 5px 0;">H.NO 84, Shivkalyan Nagar Loha, Dist-Nanded 431708</p>
            <p style="margin: 5px 0;">Phone: +91 87665 00291 | Email: hello@nutsphere.com</p>
          </div>
        </body>
      </html>
    `

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
      to: email,
      subject: 'Thank you for contacting NutSphere',
      html: confirmationHtml,
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: emailResult,
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
