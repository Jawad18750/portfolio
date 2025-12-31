'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Flex, Text, RevealFx, Scroller, IconButton } from '@/once-ui/components';
import { LogoSlider } from './LogoSlider';

interface Testimonial {
    id: string;
    name: string;
    role?: string;
    avatar: string;
    testimonial: string;
    rating: number; // 1-5 stars
    logos?: string[]; // Array of client logo URLs
}

interface TestimonialSliderProps {
    testimonials: Testimonial[];
    allLogos?: string[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    locale?: string;
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
    testimonials,
    allLogos = [],
    autoPlay = true,
    autoPlayInterval = 5000,
    locale
}) => {
    const isRTL = locale === 'ar';
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [maxContentHeight, setMaxContentHeight] = useState(0);
    const [expandedStates, setExpandedStates] = useState<{[key: number]: boolean}>({});
    const [isMobile, setIsMobile] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // Character threshold for "long" testimonials (Arabic-friendly)
    const LONG_TESTIMONIAL_THRESHOLD = 280;

    // Check if testimonial is long
    const isLongTestimonial = (text: string) => text.length > LONG_TESTIMONIAL_THRESHOLD;

    // Truncate text at word boundary
    const truncateText = (text: string, maxLength: number = 250) => {
        if (text.length <= maxLength) return text;

        // Find last space before maxLength
        const truncated = text.substring(0, maxLength);
        const lastSpaceIndex = truncated.lastIndexOf(' ');

        if (lastSpaceIndex > maxLength * 0.7) { // Don't cut too much
            return truncated.substring(0, lastSpaceIndex) + '...';
        }

        return truncated + '...';
    };

    // Toggle expanded state for current testimonial
    const toggleExpanded = () => {
        setExpandedStates(prev => ({
            ...prev,
            [activeIndex]: !prev[activeIndex]
        }));
    };

    // Reset expanded state when changing testimonials
    const resetExpandedState = (index: number) => {
        if (index !== activeIndex) {
            setExpandedStates(prev => ({
                ...prev,
                [activeIndex]: false // Collapse current
            }));
        }
    };

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Measure maximum testimonial content height
    useLayoutEffect(() => {
        if (!contentRef.current || testimonials.length === 0) return;

        const container = contentRef.current;
        let maxHeight = 0;

        // Use responsive width for measurement
        const measureWidth = isMobile ? Math.min(window.innerWidth * 0.9 - 32, 600) : 400; // Account for padding

        // Create temporary elements to measure each testimonial text only (collapsed state)
        testimonials.forEach((testimonial) => {
            const displayText = isLongTestimonial(testimonial.testimonial)
                ? truncateText(testimonial.testimonial)
                : testimonial.testimonial;

            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.visibility = 'hidden';
            tempDiv.style.pointerEvents = 'none';
            tempDiv.style.width = measureWidth + 'px';
            tempDiv.style.fontSize = '16px';
            tempDiv.style.lineHeight = isRTL ? '1.6' : '1.5'; // Slightly more line height for Arabic
            tempDiv.style.fontStyle = 'italic';
            tempDiv.style.textAlign = 'center';
            tempDiv.style.wordWrap = 'break-word';
            tempDiv.style.padding = isMobile ? '0 1rem' : '0';
            tempDiv.style.boxSizing = 'border-box';
            tempDiv.style.direction = isRTL ? 'rtl' : 'ltr'; // Set text direction for accurate measurement
            tempDiv.innerHTML = `
                <div>"${displayText}"</div>
                ${isLongTestimonial(testimonial.testimonial) ? '<div style="margin-top: 12px; font-size: 14px;">Read more</div>' : ''}
            `;

            document.body.appendChild(tempDiv);
            const height = tempDiv.offsetHeight;
            maxHeight = Math.max(maxHeight, height);
            document.body.removeChild(tempDiv);
        });

        setMaxContentHeight(maxHeight);
    }, [testimonials, isMobile]);

    useEffect(() => {
        // Don't autoplay if testimonial is expanded
        if (!autoPlay || testimonials.length <= 1 || expandedStates[activeIndex]) return;

        const interval = setInterval(() => {
            handleNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, testimonials.length, activeIndex, expandedStates]);

    const handleNext = () => {
        if (isTransitioning) return;
        resetExpandedState(activeIndex);
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveIndex((prevIndex) =>
                prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
            );
            setIsTransitioning(false);
        }, 300);
    };

    const handlePrev = () => {
        if (isTransitioning) return;
        resetExpandedState(activeIndex);
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveIndex((prevIndex) =>
                prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
            );
            setIsTransitioning(false);
        }, 300);
    };

    const handleControlClick = (index: number) => {
        if (isTransitioning || index === activeIndex) return;
        resetExpandedState(activeIndex);
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveIndex(index);
            setIsTransitioning(false);
        }, 300);
    };

    if (testimonials.length === 0) return null;

    const activeTestimonial = testimonials[activeIndex];

    return (
        <Flex fillWidth direction="column" gap="l">
            <RevealFx translateY="16" delay={0.2}>
                <Flex
                    fillWidth
                    direction="column"
                    alignItems="center"
                    gap="xl"
                    padding="xl"
                    radius="l"
                    position="relative"
                >
                    {/* Client Logos */}
                    {allLogos && allLogos.length > 0 && (
                        <LogoSlider logos={allLogos} />
                    )}

                    {/* Navigation Arrows */}
                    {testimonials.length > 1 && (
                        <Flex
                            position="absolute"
                            fillWidth
                            justifyContent="space-between"
                            paddingX="m"
                            style={{ top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                        >
                            <IconButton
                                icon={isRTL ? "chevronRight" : "chevronLeft"}
                                variant="tertiary"
                                size="m"
                                onClick={handlePrev}
                                style={{
                                    pointerEvents: 'auto',
                                    background: 'var(--neutral-alpha-weak)',
                                    backdropFilter: 'blur(var(--static-space-1))',
                                    border: '1px solid var(--neutral-alpha-medium)'
                                }}
                            />
                            <IconButton
                                icon={isRTL ? "chevronLeft" : "chevronRight"}
                                variant="tertiary"
                                size="m"
                                onClick={handleNext}
                                style={{
                                    pointerEvents: 'auto',
                                    background: 'var(--neutral-alpha-weak)',
                                    backdropFilter: 'blur(var(--static-space-1))',
                                    border: '1px solid var(--neutral-alpha-medium)'
                                }}
                            />
                        </Flex>
                    )}

                    {/* Testimonial Content - Text Only */}
                    <div
                        ref={contentRef}
                        style={{
                            height: expandedStates[activeIndex] ? 'auto' : (maxContentHeight > 0 ? `${maxContentHeight}px` : 'auto'),
                            minHeight: expandedStates[activeIndex] ? `${maxContentHeight}px` : 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            maxWidth: isMobile ? '90vw' : 'var(--static-space-s)',
                            padding: isMobile ? '0 1rem' : '0',
                            paddingBottom: expandedStates[activeIndex] 
                                ? (isMobile ? (isRTL ? '3rem' : '2.5rem') : (isRTL ? '2rem' : '1rem'))
                                : (isMobile ? (isRTL ? '2.5rem' : '2rem') : '0'),
                            marginBottom: isMobile ? (testimonials.length > 4 ? '1rem' : '0.5rem') : '0',
                            boxSizing: 'border-box',
                            transition: 'all 0.3s ease-in-out',
                            opacity: isTransitioning ? 0.7 : 1,
                            transform: isTransitioning ? 'scale(0.98)' : 'scale(1)'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'var(--static-space-s)'
                        }}>
                            <Text
                                variant="body-default-l"
                                onBackground="neutral-weak"
                                align="center"
                                style={{
                                    fontStyle: 'italic',
                                    transition: 'opacity 0.3s ease-in-out',
                                    opacity: isTransitioning ? 0.7 : 1
                                }}
                            >
                                "{expandedStates[activeIndex] || !isLongTestimonial(activeTestimonial.testimonial)
                                    ? activeTestimonial.testimonial
                                    : truncateText(activeTestimonial.testimonial)}"
                            </Text>

                            {/* Read More/Less Toggle */}
                            {isLongTestimonial(activeTestimonial.testimonial) && !expandedStates[activeIndex] && (
                                <Text
                                    variant="body-default-s"
                                    onBackground="neutral-weak"
                                    align="center"
                                    style={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        opacity: 0.8,
                                        transition: 'opacity 0.2s ease',
                                        fontStyle: 'normal',
                                        marginTop: '0.75rem'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                                    onClick={toggleExpanded}
                                >
                                    {isRTL ? 'اقرأ المزيد' : 'Read more'}
                                </Text>
                            )}

                            {/* Read Less - only show when expanded */}
                            {isLongTestimonial(activeTestimonial.testimonial) && expandedStates[activeIndex] && (
                                <Text
                                    variant="body-default-s"
                                    onBackground="neutral-weak"
                                    align="center"
                                    style={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        opacity: 0.8,
                                        transition: 'opacity 0.2s ease',
                                        fontStyle: 'normal',
                                        marginTop: isRTL ? '1.5rem' : '1rem'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                                    onClick={toggleExpanded}
                                >
                                    {isRTL ? 'اقرأ أقل' : 'Read less'}
                                </Text>
                            )}
                        </div>
                    </div>

                    {/* Fixed Author Info - Below testimonial text */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: isMobile 
                            ? (testimonials.length > 4 ? (isRTL ? 'var(--static-space-l)' : 'var(--static-space-m)') : (isRTL ? 'var(--static-space-m)' : 'var(--static-space-s)'))
                            : (isRTL ? 'var(--static-space-xl)' : 'var(--static-space-l)')
                    }}>
                        <Text
                            variant="heading-strong-s"
                            onBackground="neutral-strong"
                        >
                            {activeTestimonial.name}
                        </Text>
                        {activeTestimonial.role && (
                            <Text
                                variant="body-default-s"
                                onBackground="neutral-weak"
                            >
                                {activeTestimonial.role}
                            </Text>
                        )}
                    </div>

                    {/* Navigation Dots */}
                    {testimonials.length > 1 && (
                        <Flex gap="4" justifyContent="center">
                            {testimonials.map((_, index) => (
                                <Flex
                                    key={index}
                                    onClick={() => handleControlClick(index)}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor:
                                            activeIndex === index
                                                ? 'var(--brand-solid-strong)'
                                                : 'var(--neutral-alpha-medium)',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                />
                            ))}
                        </Flex>
                    )}
                </Flex>
            </RevealFx>
        </Flex>
    );
};

export { TestimonialSlider };