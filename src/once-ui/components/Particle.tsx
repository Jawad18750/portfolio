'use client';

import React, { useEffect, useRef } from 'react';

import { Flex } from './Flex';
import { SpacingToken } from '../types';

interface ParticleProps extends React.ComponentProps<typeof Flex> {
    density?: number;
    color?: string;
    size?: SpacingToken;
    speed?: number;
    interactive?: boolean;
    interactionRadius?: number;
    opacity?: number;
}

const Particle = React.forwardRef<HTMLDivElement, ParticleProps>(({
    density = 100,
    color = 'brand-on-background-weak',
    size = '2',
    speed = 0.3,
    interactive = false,
    interactionRadius = 20,
    opacity = 100,
    children,
    className,
    style,
    ...rest
}, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!forwardedRef) return;

        if ('current' in forwardedRef) {
            forwardedRef.current = containerRef.current;
        } else if (typeof forwardedRef === 'function') {
            forwardedRef(containerRef.current);
        }
    }, [forwardedRef]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const particles: HTMLDivElement[] = [];
        const particleTargets = new Map<HTMLDivElement, { x: number; y: number }>();
        const initialPositions = new Map<HTMLDivElement, { x: number; y: number }>();

        let mousePosition = { x: -1000, y: -1000 };
        let animationFrameId: number;

        const parsedSize = `var(--static-space-${size})`;
        const parsedOpacity = `${opacity}%`;
        const movementSpeed = speed * 0.08;
        const repulsionStrength = 0.15 * (speed || 1);

        const handleMouseMove = (event: MouseEvent) => {
            if (!container) return;
            const rect = container.getBoundingClientRect();
            mousePosition = {
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
            };
        };

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = parsedSize;
            particle.style.height = parsedSize;
            particle.style.background = `var(--${color})`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.opacity = parsedOpacity;
            particle.style.transition = 'transform 0.4s ease-out, opacity 0.6s ease-out';

            const initialX = 10 + Math.random() * 80;
            const initialY = 10 + Math.random() * 80;

            particle.style.left = `${initialX}%`;
            particle.style.top = `${initialY}%`;

            initialPositions.set(particle, { x: initialX, y: initialY });
            particleTargets.set(particle, { x: initialX, y: initialY });

            container.appendChild(particle);
            particles.push(particle);

            return particle;
        };

        const updateParticles = () => {
            particles.forEach((particle, index) => {
                const currentTarget = particleTargets.get(particle);
                const initial = initialPositions.get(particle);
                if (!currentTarget || !initial) return;

                const currentX = parseFloat(particle.style.left);
                const currentY = parseFloat(particle.style.top);

                const time = Date.now() * 0.001 * speed;
                const baseNoiseX = Math.sin(time + index) * 0.5;
                const baseNoiseY = Math.cos(time + index * 1.2) * 0.5;

                let targetX = initial.x + baseNoiseX;
                let targetY = initial.y + baseNoiseY;

                if (interactive) {
                    const dx = mousePosition.x - currentX;
                    const dy = mousePosition.y - currentY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < interactionRadius) {
                        const force = (interactionRadius - distance) * repulsionStrength;
                        const angle = Math.atan2(dy, dx);
                        targetX -= Math.cos(angle) * force;
                        targetY -= Math.sin(angle) * force;
                    }
                }

                targetX = Math.max(5, Math.min(95, targetX));
                targetY = Math.max(5, Math.min(95, targetY));

                particleTargets.set(particle, { x: targetX, y: targetY });

                particle.style.left = `${currentX + (targetX - currentX) * movementSpeed}%`;
                particle.style.top = `${currentY + (targetY - currentY) * movementSpeed}%`;
            });

            animationFrameId = requestAnimationFrame(updateParticles);
        };

        if (interactive) {
            document.addEventListener('mousemove', handleMouseMove);
        }

        for (let i = 0; i < density; i++) {
            createParticle();
        }

        updateParticles();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            particles.forEach((particle) => {
                particle.remove();
                particleTargets.delete(particle);
                initialPositions.delete(particle);
            });
        };
    }, [color, size, speed, interactive, interactionRadius, opacity, density, containerRef]);

    return (
        <Flex
            ref={containerRef}
            fill
            pointerEvents="none"
            className={className}
            style={style}
            {...rest}>
            {children}
        </Flex>
    );
});

Particle.displayName = 'Particle';

export { Particle };
