'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Flex } from '@/once-ui/components';

interface LogoSliderProps {
    logos: string[];
    speed?: number; // pixels per second
}

const LogoSlider: React.FC<LogoSliderProps> = ({
    logos,
    speed = 30
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Detect theme and screen size changes
    useEffect(() => {
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            setIsDarkMode(theme === 'dark');
        };

        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkTheme();
        checkScreenSize();

        const themeObserver = new MutationObserver(checkTheme);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        window.addEventListener('resize', checkScreenSize);

        return () => {
            themeObserver.disconnect();
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const getLogoSrc = (logoPath: string) => {
        const fileName = logoPath.split('/').pop() || '';
        const baseName = fileName.replace('-light.svg', '').replace('-dark.svg', '').replace('.svg', '');

        if (isDarkMode) {
            return `/images/testimonials/${baseName}-dark.svg`;
        } else {
            return `/images/testimonials/${baseName}-light.svg`;
        }
    };

    // Handle drag functionality
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!scrollRef.current) return;

        setIsDragging(true);
        setStartX(e.clientX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        scrollRef.current.style.cursor = 'grabbing';

        // Capture pointer for smooth dragging
        scrollRef.current.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !scrollRef.current) return;

        e.preventDefault();
        const x = e.clientX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!scrollRef.current) return;

        setIsDragging(false);
        scrollRef.current.style.cursor = 'grab';
        scrollRef.current.releasePointerCapture(e.pointerId);
    };

    useEffect(() => {
        if (!scrollRef.current || logos.length <= 1) return;

        const scrollElement = scrollRef.current;
        let animationId: number | null = null;
        let isPaused = false;
        let lastTimestamp = performance.now();
        let currentIsMobile = isMobile; // Capture current mobile state
        let currentIsDragging = isDragging; // Capture current dragging state

        const animate = (timestamp: number) => {
            if (!scrollElement) {
                animationId = requestAnimationFrame(animate);
                return;
            }

            // Update captured states (in case they change)
            currentIsMobile = window.innerWidth < 768;
            currentIsDragging = isDragging;

            // Only pause on hover for desktop, never pause on mobile
            const shouldPause = !currentIsMobile && isPaused;
            
            if (!shouldPause && !currentIsDragging) {
                const deltaTime = Math.min(timestamp - lastTimestamp, 100); // Cap delta to prevent large jumps
                lastTimestamp = timestamp;
                
                // Slower speed on mobile for better UX
                const currentSpeed = currentIsMobile ? speed * 0.5 : speed;
                scrollElement.scrollLeft += (currentSpeed * deltaTime) / 1000; // Convert to pixels per millisecond

                // Reset to beginning when reaching halfway point (duplicated content)
                const singleSetWidth = scrollElement.scrollWidth / 3;
                if (scrollElement.scrollLeft >= singleSetWidth) {
                    scrollElement.scrollLeft = 0;
                }
            }
            
            animationId = requestAnimationFrame(animate);
        };

        // Only pause on hover for desktop (not mobile)
        const handleMouseEnter = () => {
            if (!currentIsMobile) {
                isPaused = true;
            }
        };
        const handleMouseLeave = () => {
            if (!currentIsMobile) {
                isPaused = false;
            }
        };

        // Only add hover listeners on desktop
        if (!currentIsMobile) {
            scrollElement.addEventListener('mouseenter', handleMouseEnter);
            scrollElement.addEventListener('mouseleave', handleMouseLeave);
        }

        // Start animation immediately
        lastTimestamp = performance.now();
        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
            }
            if (scrollElement && !currentIsMobile) {
                scrollElement.removeEventListener('mouseenter', handleMouseEnter);
                scrollElement.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [logos, speed, isDragging, isMobile]);

    if (logos.length === 0) return null;

    // Create multiple copies for seamless infinite scroll
    const duplicatedLogos = [...logos, ...logos, ...logos];

    return (
        <div
            style={{
                width: '100%',
                maskImage: isMobile 
                    ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
                    : 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                WebkitMaskImage: isMobile
                    ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
                    : 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Native scroll container - direction: ltr for RTL safety */}
                <div
                    ref={scrollRef}
                    style={{
                        width: '100%',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        cursor: isMobile ? 'default' : (isDragging ? 'grabbing' : 'grab'),
                        direction: 'ltr', // Explicit LTR for scroll math consistency
                        touchAction: isMobile ? 'none' : 'pan-x', // Prevent touch scrolling on mobile, allow on desktop
                        userSelect: 'none',
                        WebkitUserSelect: 'none'
                    }}
                    className="logo-slider"
                    onPointerDown={isMobile ? undefined : handlePointerDown}
                    onPointerMove={isMobile ? undefined : handlePointerMove}
                    onPointerUp={isMobile ? undefined : handlePointerUp}
                    onPointerLeave={isMobile ? undefined : handlePointerUp}
                >
                {/* Flex row with max-content width to guarantee overflow */}
                <div
                    style={{
                        display: 'flex',
                        width: 'max-content',
                        flexWrap: 'nowrap',
                        alignItems: 'center',
                        gap: isMobile ? 'var(--static-space-m)' : 'clamp(var(--static-space-l), 6vw, var(--static-space-xxl))' // Adjusted responsive spacing
                    }}
                >
                    {duplicatedLogos.map((logo, index) => (
                        <div
                            key={`${logo}-${index}`}
                            style={{
                                minWidth: isMobile ? '105px' : '200px',
                                width: isMobile ? '105px' : 'auto',
                                height: isMobile ? '90px' : '140px',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'transparent'
                            }}
                        >
                            <div
                                style={{
                                    width: isMobile ? '90px' : 'clamp(55px, 7vw, 75px)',
                                    height: isMobile ? '90px' : 'clamp(55px, 7vw, 75px)',
                                    minWidth: isMobile ? '90px' : 'clamp(70px, 9vw, 105px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <img
                                    key={`${logo}-${isDarkMode ? 'dark' : 'light'}`}
                                    src={getLogoSrc(logo)}
                                    alt={`Client logo ${index + 1}`}
                                    loading="lazy"
                                    style={{
                                        width: isMobile ? '90px' : 'clamp(80px, 10vw, 105px)',
                                        height: isMobile ? '90px' : 'clamp(80px, 10vw, 105px)',
                                        objectFit: 'contain',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease'
                                    }}
                                    onLoad={(e) => {
                                        // Show image when loaded successfully
                                        e.currentTarget.style.opacity = '1';
                                        // Hide the background once image loads
                                        (e.currentTarget.parentElement as HTMLElement).style.backgroundColor = 'transparent';
                                        (e.currentTarget.parentElement as HTMLElement).style.boxShadow = 'none';
                                    }}
                                    onError={(e) => {
                                        // Instead of hiding, show a subtle placeholder
                                        e.currentTarget.style.display = 'none';
                                        const parent = e.currentTarget.parentElement as HTMLElement;
                                        if (parent) {
                                            parent.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                                            parent.style.border = '1px dashed rgba(255, 255, 255, 0.1)';
                                        }
                                        console.log(`Failed to load logo: ${getLogoSrc(logo)}`);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .logo-slider::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export { LogoSlider };