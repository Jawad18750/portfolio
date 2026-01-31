'use client';

import { Flex, RevealFx, SmartImage } from '@/once-ui/components';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ProjectImageGalleryProps {
    images: string[];
    alt?: string;
    aspectRatio?: string;
    radius?: string;
}

const SWIPE_THRESHOLD = 50;

export function ProjectImageGallery({
    images,
    alt = 'Project image',
    aspectRatio = '16 / 9',
    radius = 'm',
}: ProjectImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const touchStartX = useRef<number>(0);

    useEffect(() => {
        const timer = setTimeout(() => setIsTransitioning(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const goToIndex = useCallback((index: number) => {
        if (index !== activeIndex && index >= 0 && index < images.length) {
            setIsTransitioning(false);
            setTimeout(() => {
                setActiveIndex(index);
                setIsTransitioning(true);
            }, 630);
        }
    }, [activeIndex, images.length]);

    const handleSwipe = useCallback((deltaX: number) => {
        if (images.length <= 1) return;
        if (deltaX < -SWIPE_THRESHOLD) {
            goToIndex((activeIndex + 1) % images.length);
        } else if (deltaX > SWIPE_THRESHOLD) {
            goToIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
        }
    }, [activeIndex, images.length, goToIndex]);

    const handleImageClick = () => {
        if (images.length > 1) {
            goToIndex((activeIndex + 1) % images.length);
        }
    };

    const handleControlClick = (index: number) => {
        goToIndex(index);
    };

    if (images.length === 0) return null;

    return (
        <Flex fillWidth direction="column" gap="4">
            <Flex
                onClick={handleImageClick}
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
                    handleSwipe(deltaX);
                }}
            >
                <RevealFx
                    style={{ width: '100%' }}
                    delay={0.4}
                    trigger={isTransitioning}
                    speed="fast">
                    <SmartImage
                        tabIndex={0}
                        radius={radius}
                        alt={alt}
                        aspectRatio={aspectRatio}
                        src={images[activeIndex]}
                        priority={activeIndex === 0}
                        sizes="(max-width: 768px) 100vw, 640px"
                        style={{
                            border: '1px solid var(--neutral-alpha-weak)',
                            ...(images.length > 1 && { cursor: 'pointer' }),
                        }}
                    />
                </RevealFx>
            </Flex>
            {images.length > 1 && (
                <Flex
                    gap="4"
                    fillWidth
                    justifyContent="center"
                    paddingTop="4">
                    {images.map((_, index) => (
                        <Flex
                            key={index}
                            onClick={() => handleControlClick(index)}
                            style={{
                                background:
                                    activeIndex === index
                                        ? 'var(--neutral-on-background-strong)'
                                        : 'var(--neutral-alpha-medium)',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease',
                            }}
                            fillWidth
                            height="2"
                        />
                    ))}
                </Flex>
            )}
        </Flex>
    );
}
