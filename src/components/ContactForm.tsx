"use client";

import { mailchimp } from '@/app/resources'
import { Button, Flex, Heading, Input, Text, Background, Textarea } from '@/once-ui/components';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Script from 'next/script';

declare global {
    interface Window {
        turnstile?: {
            render: (container: string | HTMLElement, options: any) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
            getResponse: (widgetId: string) => string | undefined;
            execute: (widgetId: string | HTMLElement | string) => void;
        };
    }
}

type ContactFormProps = {
    display: boolean;
    title: string | JSX.Element;
    description: string | JSX.Element;
}

export const ContactForm = ({ display, title, description }: ContactFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileWidgetId = useRef<string | null>(null);
    const turnstileContainerRef = useRef<HTMLDivElement>(null);

    const t = useTranslations();
    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    
    if (!turnstileSiteKey) {
        console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured');
    }
    
    // Initialize Turnstile widget when script loads
    useEffect(() => {
        if (!turnstileSiteKey) return; // Don't initialize if site key is missing
        
        const renderTurnstile = () => {
            if (window.turnstile && turnstileContainerRef.current && !turnstileWidgetId.current) {
                turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
                    sitekey: turnstileSiteKey,
                    size: 'invisible',
                    execution: 'execute', // Run challenge automatically on form submit
                    callback: (token: string) => {
                        setTurnstileToken(token);
                    },
                    'error-callback': () => {
                        setTurnstileToken(null);
                        console.error('Turnstile error');
                    },
                    'expired-callback': () => {
                        setTurnstileToken(null);
                        if (turnstileWidgetId.current && window.turnstile) {
                            window.turnstile.reset(turnstileWidgetId.current);
                        }
                    },
                });
            }
        };

        // Check if Turnstile is already loaded
        if (window.turnstile) {
            renderTurnstile();
        }
    }, [turnstileSiteKey]);

    const validateEmail = (email: string): boolean => {
        if (email === '') return false;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Smart phone number normalization for Libyan numbers
    const normalizePhoneNumber = (phone: string): string => {
        const trimmed = phone.trim();
        
        // If it starts with 091, 092, 093, 094, 095 and doesn't have +, add +218
        if (/^09[12345]/.test(trimmed) && !trimmed.startsWith('+')) {
            return '+218' + trimmed.substring(1);
        }
        
        // If it starts with 91, 92, 93, 94, 95 (without leading 0) and doesn't have +, add +218
        if (/^9[12345]/.test(trimmed) && !trimmed.startsWith('+') && !trimmed.startsWith('0')) {
            return '+218' + trimmed;
        }
        
        return trimmed;
    };

    const handleChange = (field: string, value: string) => {
        // For phone field, normalize internally but don't show the normalized value
        if (field === 'phone') {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = t('contact.errors.name') || 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = t('contact.errors.emailRequired') || 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t('contact.errors.emailInvalid') || 'Please enter a valid email address';
        }

        if (!formData.message.trim()) {
            newErrors.message = t('contact.errors.message') || 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateWhatsAppURL = (): string => {
        // Use submittedData if available (after success), otherwise use current formData
        const data = submittedData || formData;
        const normalizedPhone = normalizePhoneNumber(data.phone);
        const message = `مرحبًا، اسمي: ${data.name}\nرقمي: ${normalizedPhone || 'غير محدد'}\nبريدي الإلكتروني: ${data.email}\nرسالتي: ${data.message}`;
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/218912160676?text=${encodedMessage}`;
    };

    const handleWhatsAppClick = () => {
        const whatsappURL = generateWhatsAppURL();
        window.open(whatsappURL, '_blank');
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // For invisible Turnstile, the challenge runs automatically
        // We just need to wait for the token if it's not already available
        if (turnstileSiteKey) {
            if (!turnstileToken && turnstileWidgetId.current && window.turnstile) {
                // Wait for the token to be generated (invisible widget runs automatically)
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Get the token
                const token = window.turnstile.getResponse(turnstileWidgetId.current);
                if (!token) {
                    setSubmitStatus('error');
                    return;
                }
                setTurnstileToken(token);
            }

            if (!turnstileToken) {
                setSubmitStatus('error');
                return;
            }
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const normalizedPhone = normalizePhoneNumber(formData.phone);
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    phone: normalizedPhone,
                    ...(turnstileToken && { turnstileToken })
                }),
            });

            const responseData = await response.json();
            
            if (response.ok) {
                // Save submitted data before clearing form (needed for WhatsApp button)
                setSubmittedData({ ...formData, phone: normalizedPhone });
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
                setTurnstileToken(null);
                
                // Reset Turnstile widget for next submission
                if (turnstileWidgetId.current && window.turnstile) {
                    window.turnstile.reset(turnstileWidgetId.current);
                }
                
                // Log success for debugging
                console.log('Contact form submitted successfully:', responseData);
            } else {
                console.error('Contact form error:', responseData);
                setSubmitStatus('error');
                // Store error message for potential future display
                if (responseData.error || responseData.details) {
                    console.error('Error details:', responseData.error, responseData.details);
                }
            }
        } catch (error) {
            console.error('Contact form error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!display) return null;

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // Turnstile script loaded, trigger widget render
                    setTimeout(() => {
                        if (window.turnstile && turnstileContainerRef.current && !turnstileWidgetId.current) {
                            turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
                                sitekey: turnstileSiteKey,
                                size: 'invisible',
                                callback: (token: string) => {
                                    setTurnstileToken(token);
                                },
                                'error-callback': () => {
                                    setTurnstileToken(null);
                                    console.error('Turnstile error');
                                },
                                'expired-callback': () => {
                                    setTurnstileToken(null);
                                    if (turnstileWidgetId.current && window.turnstile) {
                                        window.turnstile.reset(turnstileWidgetId.current);
                                    }
                                },
                            });
                        }
                    }, 100);
                }}
            />
            <link rel="preconnect" href="https://challenges.cloudflare.com" />
            <Flex
            style={{overflow: 'hidden'}}
            position="relative"
            fillWidth 
            padding="xl" 
            radius="l" 
            marginBottom="m"
            direction="column" 
            alignItems="center" 
            align="center"
            background="surface" 
            border="neutral-medium" 
            borderStyle="solid-1"
            className="contact-form-container">
            <Background
                position="absolute"
                mask={mailchimp.effects.mask as any}
                gradient={mailchimp.effects.gradient as any}
                dots={mailchimp.effects.dots as any}
                lines={mailchimp.effects.lines as any}/>
            <Heading style={{position: 'relative'}}
                marginBottom="s"
                variant="display-strong-xs">
                {title}
            </Heading>
            <Text
                style={{
                    position: 'relative',
                    maxWidth: 'var(--responsive-width-xs)'
                }}
                wrap="balance"
                marginBottom="l"
                onBackground="neutral-medium">
                {description}
            </Text>
            
            {submitStatus === 'success' ? (
                <Flex 
                    direction="column" 
                    gap="m" 
                    alignItems="center" 
                    style={{position: 'relative'}} 
                    fillWidth 
                    maxWidth={40}
                    className="contact-form-success">
                    <Heading variant="heading-strong-m">
                        {t('contact.success')}
                    </Heading>
                    <Text onBackground="neutral-medium" align="center">
                        {t('contact.successMessage')}
                    </Text>
                    <Flex 
                        gap="s" 
                        marginTop="s"
                        direction="row"
                        mobileDirection="column"
                        fillWidth
                        className="contact-form-buttons">
                        <Button
                            variant="secondary"
                            size="m"
                            onClick={() => {
                                setSubmitStatus('idle');
                                setSubmittedData(null); // Clear submitted data when starting new form
                            }}
                            className="contact-button"
                        >
                            {t('contact.sendAnother')}
                        </Button>
                        <Button
                            variant="primary"
                            size="m"
                            onClick={handleWhatsAppClick}
                            className="contact-button"
                        >
                            {t('contact.continueWhatsApp')}
                        </Button>
                    </Flex>
                </Flex>
            ) : submitStatus === 'error' ? (
                <Flex direction="column" gap="m" alignItems="center" style={{position: 'relative'}}>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                        {t('contact.error')}
                    </Text>
                    <Button
                        variant="primary"
                        size="m"
                        onClick={() => setSubmitStatus('idle')}
                    >
                        {t('contact.tryAgain')}
                    </Button>
                </Flex>
            ) : (
                <form
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                    onSubmit={handleSubmit}>
                    <Flex
                        fillWidth 
                        maxWidth={40} 
                        gap="m" 
                        direction="column"
                        className="contact-form-fields">
                        <div className="contact-field-wrapper">
                            <Input
                                id="name"
                                label={t('contact.labels.name')}
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                                error={errors.name}
                            />
                        </div>
                        <Flex 
                            gap="m" 
                            fillWidth
                            direction="row"
                            mobileDirection="column"
                            className="contact-email-phone-wrapper">
                            <div className="contact-field-wrapper">
                                <Input
                                    id="email"
                                    label={t('contact.labels.email')}
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                    error={errors.email}
                                />
                            </div>
                            <div className="contact-field-wrapper">
                                <Input
                                    id="phone"
                                    label={t('contact.labels.phone')}
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                />
                            </div>
                        </Flex>
                        <div className="contact-field-wrapper">
                            <Textarea
                                id="message"
                                label={t('contact.labels.message')}
                                value={formData.message}
                                onChange={(e) => handleChange('message', e.target.value)}
                                rows={4}
                                required
                                error={errors.message}
                            />
                        </div>
                        <div className="contact-field-wrapper">
                            <Button
                                type="submit"
                                size="m"
                                fillWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('contact.sending') : t('contact.send')}
                            </Button>
                        </div>
                        {/* Invisible Turnstile widget container */}
                        <div ref={turnstileContainerRef} style={{ display: 'none' }} />
                    </Flex>
                </form>
            )}
        </Flex>
        </>
    );
};
