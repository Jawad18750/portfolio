'use client';

import React, { CSSProperties, forwardRef, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';

import { Flex } from './Flex';
import { Mask } from './Mask';
import styles from './Background.module.scss';

type GradientConfig = {
    display?: boolean;
    opacity?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    tilt?: number;
    colorStart?: string;
    colorEnd?: string;
};

type DotsConfig = {
    display?: boolean;
    opacity?: number;
    color?: string;
    size?: string;
};

type GridConfig = {
    display?: boolean;
    opacity?: number;
    width?: string;
    height?: string;
    color?: string;
};

type LinesConfig = {
    display?: boolean;
    opacity?: number;
    angle?: number;
    color?: string;
    thickness?: number;
    size?: string;
};

type MaskConfig = {
    cursor?: boolean;
    x?: number;
    y?: number;
    radius?: number;
};

type BackgroundProps = React.ComponentProps<typeof Flex> & {
    gradient?: GradientConfig;
    dots?: DotsConfig;
    grid?: GridConfig;
    lines?: LinesConfig;
    mask?: MaskConfig;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
    }
}

const remap = (value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number) => {
    return ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) + outputMin;
};

const Background = forwardRef<HTMLDivElement, BackgroundProps>(({
        gradient = {},
        dots = {},
    grid = {},
        lines = {},
    mask,
        className,
    style,
    children,
    ...rest
    }, forwardedRef) => {
    const backgroundRef = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            setRef(forwardedRef, backgroundRef.current);
        }, [forwardedRef]);

    const gradientPosition = useMemo(() => {
        if (gradient.x == null || gradient.y == null) return { x: 50, y: 50 };
        const adjustedX = remap(gradient.x, 0, 100, 37.5, 62.5);
        const adjustedY = remap(gradient.y, 0, 100, 37.5, 62.5);
        return { x: adjustedX, y: adjustedY };
    }, [gradient.x, gradient.y]);

    const renderLayers = () => (
            <>
                {gradient.display && (
                <Flex
                    position="absolute"
                    className={styles.gradient}
                    pointerEvents="none"
                        style={{
                            opacity: gradient.opacity,
                        '--gradient-position-x': `${gradientPosition.x}%`,
                        '--gradient-position-y': `${gradientPosition.y}%`,
                        '--gradient-width': gradient.width != null ? `${gradient.width / 4}%` : '25%',
                        '--gradient-height': gradient.height != null ? `${gradient.height / 4}%` : '25%',
                        '--gradient-tilt': gradient.tilt != null ? `${gradient.tilt}deg` : '0deg',
                        '--gradient-color-start': gradient.colorStart ? `var(--${gradient.colorStart})` : 'var(--brand-solid-strong)',
                        '--gradient-color-end': gradient.colorEnd ? `var(--${gradient.colorEnd})` : 'var(--brand-solid-weak)',
                    } as CSSProperties}
                    />
                )}
                {dots.display && (
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    fillWidth
                    fillHeight
                    pointerEvents="none"
                    className={styles.dots}
                        style={{
                            opacity: dots.opacity,
                        '--dots-color': `var(--${dots.color ?? 'brand-on-background-weak'})`,
                        '--dots-size': `var(--static-space-${dots.size ?? '24'})`,
                    } as CSSProperties}
                    />
                )}
                {lines.display && (
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    fillWidth
                    fillHeight
                    pointerEvents="none"
                    className={styles.lines}
                        style={{
                            opacity: lines.opacity,
                        '--lines-angle': `${lines.angle ?? -45}deg`,
                        '--lines-color': `var(--${lines.color ?? 'brand-on-background-weak'})`,
                        '--lines-thickness': `${lines.thickness ?? 1}px`,
                        '--lines-size': `var(--static-space-${lines.size ?? '16'})`,
                        background: `
                            repeating-linear-gradient(
                                var(--lines-angle),
                                var(--static-transparent),
                                var(--static-transparent) calc(var(--lines-size) - var(--lines-thickness)),
                                var(--lines-color) calc(var(--lines-size) - var(--lines-thickness)),
                                var(--lines-color) var(--lines-size)
                            )
                        `,
                    } as CSSProperties}
                />
            )}
            {grid.display && (
                <Flex
                    position="absolute"
                    top="0"
                    left="0"
                    fillWidth
                    fillHeight
                    pointerEvents="none"
                    style={{
                        opacity: grid.opacity,
                        backgroundImage: `
                            linear-gradient(
                                to right,
                                var(--${grid.color ?? 'brand-on-background-weak'}) 1px,
                                transparent 1px
                            ),
                            linear-gradient(
                                to bottom,
                                var(--${grid.color ?? 'brand-on-background-weak'}) 1px,
                                transparent 1px
                            )
                        `,
                        backgroundSize: `${grid.width ?? '160px'} ${grid.height ?? '160px'}`,
                    } as CSSProperties}
                />
            )}
            {children}
            </>
        );

    return (
        <Flex
            ref={backgroundRef}
            className={classNames(className)}
            fillWidth
            fillHeight
            position="absolute"
            top="0"
            left="0"
            zIndex={0}
            overflow="hidden"
            style={{
                pointerEvents: 'none',
                ...style,
            }}
            {...rest}>
            {mask ? (
                <Mask
                    cursor={mask.cursor}
                    x={mask.x}
                    y={mask.y}
                    radius={mask.radius}>
                    {renderLayers()}
                </Mask>
            ) : (
                renderLayers()
            )}
        </Flex>
    );
});

Background.displayName = 'Background';

export { Background };