'use client';

import React, { ReactNode, forwardRef } from 'react';
import Link from 'next/link';

import { Spinner, Icon, Arrow } from '.';
import styles from './Button.module.scss';

interface CommonProps {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size?: 's' | 'm' | 'l';
    weight?: 'default' | 'strong';
    label?: string;
    prefixIcon?: string;
    suffixIcon?: string;
    arrowIcon?: boolean;
    loading?: boolean;
    fillWidth?: boolean;
    children?: ReactNode;
    href?: string;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}

export type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
export type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const isExternalLink = (url: string) => /^https?:\/\//.test(url);

const Button = forwardRef<HTMLButtonElement, ButtonProps | AnchorProps>(({
    variant = 'primary',
    size = 'm',
    weight = 'strong',
    label,
    children,
    prefixIcon,
    suffixIcon,
    arrowIcon = false,
    loading = false,
    fillWidth = false,
    href,
    className,
    style,
    id,
    ...props
}, ref) => {
    const labelSize = size === 'l' ? 'font-l' : size === 'm' ? 'font-m' : 'font-s';
    const iconSize = size === 'l' ? 'm' : size === 'm' ? 's' : 'xs';
    const fontWeight = weight === 'strong' ? 'font-strong' : 'font-default';

    const content = (
        <>
            {prefixIcon && !loading && <Icon name={prefixIcon} size={iconSize} />}
            {loading && <Spinner size={size} />}
            <div className={`font-label ${fontWeight} ${styles.label} ${labelSize}`}>{label || children}</div>
            {arrowIcon && id && (
                <Arrow
                    style={{ marginLeft: 'calc(-1 * var(--static-space-4))' }}
                    trigger={`#${id}`}
                    scale={size === 's' ? 0.8 : size === 'm' ? 0.9 : 1}
                    color={variant === 'primary' ? 'onSolid' : 'onBackground'}
                />
            )}
            {suffixIcon && <Icon name={suffixIcon} size={iconSize} />}
        </>
    );

    const commonProps = {
        id,
        className: `${styles.button} ${styles[variant]} ${styles[size]} ${fillWidth ? styles.fillWidth : styles.fitContent} ${className || ''}`,
        style: { ...style, textDecoration: 'none' },
    };

    if (href) {
        const isExternal = isExternalLink(href);

        if (isExternal) {
            return (
                <a
                    href={href}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    target="_blank"
                    rel="noreferrer"
                    {...commonProps}
                    {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
                    {content}
                </a>
            );
        }

        return (
            <Link
                href={href}
                ref={ref as React.Ref<HTMLAnchorElement>}
                {...commonProps}
                {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {content}
            </Link>
        );
    }

    return (
        <button
            ref={ref as React.Ref<HTMLButtonElement>}
            {...commonProps}
            {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
            {content}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };