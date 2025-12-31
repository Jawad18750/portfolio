import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, message, turnstileToken } = await request.json();

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate Turnstile token
        const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAACJ9xj71JB8ExEynp1xo-2JR2N8';
        if (!turnstileToken) {
            return NextResponse.json(
                { error: 'Bot verification failed', details: 'Missing verification token' },
                { status: 400 }
            );
        }

        // Get client IP for Turnstile validation
        const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                         request.headers.get('x-real-ip') ||
                         'unknown';

        // Validate Turnstile token with Cloudflare
        try {
            const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    secret: turnstileSecret,
                    response: turnstileToken,
                    remoteip: clientIP,
                }),
            });

            const turnstileResult = await turnstileResponse.json();

            if (!turnstileResult.success) {
                console.error('Turnstile validation failed:', turnstileResult['error-codes']);
                return NextResponse.json(
                    { 
                        error: 'Bot verification failed', 
                        details: 'Please try again. If the problem persists, refresh the page.' 
                    },
                    { status: 400 }
                );
            }
        } catch (turnstileError) {
            console.error('Turnstile validation error:', turnstileError);
            return NextResponse.json(
                { 
                    error: 'Verification service error', 
                    details: 'Unable to verify request. Please try again later.' 
                },
                { status: 500 }
            );
        }

        // Validate SMTP configuration
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const contactEmail = process.env.CONTACT_EMAIL || smtpUser;

        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
            console.error('SMTP configuration missing:', {
                hasHost: !!smtpHost,
                hasPort: !!smtpPort,
                hasUser: !!smtpUser,
                hasPass: !!smtpPass,
            });
            return NextResponse.json(
                { 
                    error: 'Email service not configured',
                    details: 'SMTP configuration is missing. Please check environment variables.'
                },
                { status: 500 }
            );
        }

        if (!contactEmail) {
            console.error('CONTACT_EMAIL not set and SMTP_USER is missing');
            return NextResponse.json(
                { 
                    error: 'Recipient email not configured',
                    details: 'CONTACT_EMAIL or SMTP_USER must be set.'
                },
                { status: 500 }
            );
        }

        // Create transporter with SMTP configuration
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            // Add connection timeout
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        // Verify SMTP connection before sending
        try {
            await transporter.verify();
            console.log('SMTP connection verified successfully');
        } catch (verifyError: any) {
            console.error('SMTP verification failed:', {
                message: verifyError.message,
                code: verifyError.code,
                command: verifyError.command,
            });
            return NextResponse.json(
                { 
                    error: 'SMTP connection failed',
                    details: verifyError.message || 'Unable to connect to email server. Please check SMTP settings.'
                },
                { status: 500 }
            );
        }

        // Build email content (both text and HTML for better deliverability)
        const emailContentText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
        `.trim();

        const emailContentHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; }
        .message-box { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Contact Form Submission</h2>
        </div>
        <div class="field">
            <div class="label">Name:</div>
            <div class="value">${name}</div>
        </div>
        <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
        </div>
        <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${phone || 'Not provided'}</div>
        </div>
        <div class="field">
            <div class="label">Message:</div>
            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
        </div>
    </div>
</body>
</html>
        `.trim();

        // Send email
        const mailOptions = {
            from: `"${name}" <${process.env.SMTP_FROM || smtpUser}>`,
            to: contactEmail,
            subject: `New Contact Form Submission from ${name}`,
            text: emailContentText,
            html: emailContentHtml,
            replyTo: email,
            // Add headers to improve deliverability
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
            },
        };

        console.log('Attempting to send email:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
        });

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', {
            messageId: info.messageId,
            response: info.response,
        });

        return NextResponse.json({ 
            success: true,
            messageId: info.messageId 
        });

    } catch (error: any) {
        console.error('Email sending error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            stack: error.stack,
        });

        // Provide more detailed error information
        let errorMessage = 'Failed to send email';
        let errorDetails = error.message || 'Unknown error occurred';

        if (error.code === 'EAUTH') {
            errorMessage = 'SMTP authentication failed';
            errorDetails = 'Invalid email or password. Please check SMTP_USER and SMTP_PASS.';
        } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
            errorMessage = 'SMTP connection timeout';
            errorDetails = 'Unable to connect to SMTP server. Please check SMTP_HOST and SMTP_PORT.';
        } else if (error.code === 'EENVELOPE') {
            errorMessage = 'Invalid email address';
            errorDetails = 'The recipient email address is invalid.';
        }

        return NextResponse.json(
            { 
                error: errorMessage,
                details: errorDetails
            },
            { status: 500 }
        );
    }
}
