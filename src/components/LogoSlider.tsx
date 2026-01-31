'use client';

import React, { useEffect, useState } from 'react';

interface LogoSliderProps {
    logos: string[];
    speed?: number; // pixels per second - affects animation duration
}

const LogoSlider: React.FC<LogoSliderProps> = ({
    logos,
    speed = 30
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
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

    if (logos.length === 0) return null;

    // Create multiple copies for seamless infinite scroll (3 sets for CSS animation loop)
    const duplicatedLogos = logos.length <= 1 ? logos : [...logos, ...logos, ...logos];
    const shouldAnimate = logos.length > 1;

    // Duration: ~100px per logo, total width / speed. Slower on mobile. Base ~60s for 16 logos.
    const logoCount = logos.length;
    const baseDuration = Math.max(40, (logoCount * 120) / speed);
    const duration = isMobile ? baseDuration * 1.2 : baseDuration;

    return (
        <div
            style={{
                width: '100%',
                direction: 'ltr', // Force LTR for consistent scroll in both Arabic (RTL) and English
                maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* CSS transform animation - works reliably on iOS (no scrollLeft) */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: 'max-content',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    gap: isMobile ? 'var(--static-space-m)' : 'clamp(var(--static-space-l), 6vw, var(--static-space-xxl))',
                    ...(shouldAnimate && {
                        animation: `logo-slide ${duration}s linear infinite`,
                        animationIterationCount: 'infinite',
                        animationPlayState: isPaused && !isMobile ? 'paused' : 'running',
                        willChange: 'transform'
                    })
                }}
                className="logo-slider-track"
                onMouseEnter={() => !isMobile && setIsPaused(true)}
                onMouseLeave={() => !isMobile && setIsPaused(false)}
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

            <style jsx>{`
                @keyframes logo-slide {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-33.333%, 0, 0); }
                }
            `}</style>
        </div>
    );
};

export { LogoSlider };