import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, message } = await request.json();

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
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

        // Build email content
        const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
        `.trim();

        // Send email
        const mailOptions = {
            from: process.env.SMTP_FROM || smtpUser,
            to: contactEmail,
            subject: `New Contact Form Submission from ${name}`,
            text: emailContent,
            replyTo: email,
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
