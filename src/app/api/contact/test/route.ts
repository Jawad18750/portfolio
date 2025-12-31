import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * Test endpoint to verify SMTP configuration
 * GET /api/contact/test
 * 
 * This endpoint helps diagnose email configuration issues
 * without sending an actual email.
 */
export async function GET(request: NextRequest) {
    try {
        // Check environment variables
        const envCheck = {
            SMTP_HOST: !!process.env.SMTP_HOST,
            SMTP_PORT: !!process.env.SMTP_PORT,
            SMTP_USER: !!process.env.SMTP_USER,
            SMTP_PASS: !!process.env.SMTP_PASS ? '***' : false,
            SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER || 'Not set',
            CONTACT_EMAIL: process.env.CONTACT_EMAIL || process.env.SMTP_USER || 'Not set',
        };

        // If not all required vars are set, return early
        if (!envCheck.SMTP_HOST || !envCheck.SMTP_PORT || !envCheck.SMTP_USER || !envCheck.SMTP_PASS) {
            return NextResponse.json({
                status: 'error',
                message: 'SMTP configuration is incomplete',
                env: envCheck,
                required: [
                    'SMTP_HOST',
                    'SMTP_PORT',
                    'SMTP_USER',
                    'SMTP_PASS',
                ],
            }, { status: 500 });
        }

        // Try to create transporter and verify connection
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST!,
            port: parseInt(process.env.SMTP_PORT!),
            secure: parseInt(process.env.SMTP_PORT!) === 465,
            auth: {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASS!,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        // Verify connection
        try {
            await transporter.verify();
            return NextResponse.json({
                status: 'success',
                message: 'SMTP configuration is valid and connection successful',
                env: envCheck,
                smtp: {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    secure: parseInt(process.env.SMTP_PORT!) === 465,
                },
            });
        } catch (verifyError: any) {
            return NextResponse.json({
                status: 'error',
                message: 'SMTP connection failed',
                env: envCheck,
                error: {
                    message: verifyError.message,
                    code: verifyError.code,
                    command: verifyError.command,
                },
            }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: 'Unexpected error',
            error: {
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
        }, { status: 500 });
    }
}
