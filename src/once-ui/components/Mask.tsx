'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Flex } from './Flex';
import styles from './Mask.module.scss';

type MaskProps = React.ComponentProps<typeof Flex> & {
    cursor?: boolean;
    x?: number;
    y?: number;
    radius?: number;
};

const Mask = forwardRef<HTMLDivElement, MaskProps>(({
    cursor = false,
    x,
    y,
    radius = 50,
    className,
    style,
    children,
    ...rest
}, forwardedRef) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
    const maskRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!forwardedRef) return;

        if (typeof forwardedRef === 'function') {
            forwardedRef(maskRef.current);
        } else if ('current' in forwardedRef) {
            forwardedRef.current = maskRef.current;
        }
    }, [forwardedRef]);

    useEffect(() => {
        if (!cursor) return;

        const handleMouseMove = (event: MouseEvent) => {
            if (!maskRef.current) return;
            const rect = maskRef.current.getBoundingClientRect();
            setCursorPosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [cursor]);

    useEffect(() => {
        if (!cursor) return;

        let animationFrameId: number;

        const updateSmoothPosition = () => {
            setSmoothPosition((prev) => {
                const dx = cursorPosition.x - prev.x;
                const dy = cursorPosition.y - prev.y;
                const easingFactor = 0.05;

                return {
                    x: Math.round(prev.x + dx * easingFactor),
                    y: Math.round(prev.y + dy * easingFactor),
                };
            });
            animationFrameId = requestAnimationFrame(updateSmoothPosition);
        };

        animationFrameId = requestAnimationFrame(updateSmoothPosition);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [cursorPosition, cursor]);

    const maskStyle = () => {
        if (cursor) {
            return {
                '--mask-position-x': `${smoothPosition.x}px`,
                '--mask-position-y': `${smoothPosition.y}px`,
                '--mask-radius': `${radius}vh`,
            } as React.CSSProperties;
        }

        if (x != null && y != null) {
            return {
                '--mask-position-x': `${x}%`,
                '--mask-position-y': `${y}%`,
                '--mask-radius': `${radius}vh`,
            } as React.CSSProperties;
        }

        return {};
    };

    return (
        <Flex
            ref={maskRef}
            className={classNames(styles.mask, className)}
            fillWidth
            fillHeight
            position="absolute"
            top="0"
            left="0"
            zIndex={0}
            overflow="hidden"
            style={{
                ...maskStyle(),
                ...style,
            }}
            {...rest}>
            {children}
        </Flex>
    );
});

Mask.displayName = 'Mask';

export { Mask };
