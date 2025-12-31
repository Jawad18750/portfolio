import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * Test endpoint to send an actual test email
 * GET /api/contact/send-test
 * 
 * This endpoint sends a test email to verify the email sending functionality
 */
export async function GET(request: NextRequest) {
    try {
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const contactEmail = process.env.CONTACT_EMAIL || smtpUser;

        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !contactEmail) {
            return NextResponse.json({
                status: 'error',
                message: 'SMTP configuration is incomplete',
            }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: parseInt(smtpPort) === 465,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        const testEmailContent = {
            from: `"Portfolio Contact Form" <${process.env.SMTP_FROM || smtpUser}>`,
            to: contactEmail,
            subject: 'Test Email from Portfolio Contact Form',
            text: `
This is a test email from your portfolio contact form.

If you received this email, your SMTP configuration is working correctly!

Time: ${new Date().toISOString()}
            `.trim(),
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .success { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="success">
            <h2>✅ Test Email Successful!</h2>
            <p>This is a test email from your portfolio contact form.</p>
            <p>If you received this email, your SMTP configuration is working correctly!</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>
    </div>
</body>
</html>
            `.trim(),
        };

        console.log('Sending test email to:', contactEmail);
        const info = await transporter.sendMail(testEmailContent);

        return NextResponse.json({
            status: 'success',
            message: 'Test email sent successfully',
            messageId: info.messageId,
            response: info.response,
            to: contactEmail,
        });
    } catch (error: any) {
        console.error('Test email error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to send test email',
            error: {
                message: error.message,
                code: error.code,
            },
        }, { status: 500 });
    }
}
