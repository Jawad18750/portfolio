"use client";

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Heading, Flex, IconButton, Toaster } from '@/once-ui/components';

import styles from '@/components/HeadingLink.module.scss';

interface HeadingLinkProps {
    id: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

export const HeadingLink: React.FC<HeadingLinkProps> = ({
    id,
    level,
    children,
    style
}) => {
    const t = useTranslations('headingLink');
    const [toasts, setToasts] = useState<
        { id: string; variant: 'success' | 'danger'; message: string; action?: React.ReactNode }[]
    >([]);

    const addToast = useCallback(
        (variant: 'success' | 'danger', message: string, action?: React.ReactNode) => {
            const toastId = `${new Date().getTime()}`;
            setToasts((prevToasts) => [...prevToasts, { id: toastId, variant, message, action }]);
        },
        []
    );

    const removeToast = useCallback(
        (toastId: string) => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
        },
        []
    );

    const copyURL = (headingId: string): void => {
        const url = `${window.location.origin}${window.location.pathname}#${headingId}`;
        navigator.clipboard.writeText(url).then(() => {
            addToast('success', t('linkCopied'));
        }, () => {
            addToast('danger', t('copyFailed'));
        });
    };

    const variantMap = {
        1: 'heading-strong-xl',
        2: 'heading-strong-xl',
        3: 'heading-strong-l',
        4: 'heading-strong-m',
        5: 'heading-strong-s',
        6: 'heading-strong-xs',
    } as const;

    const variant = variantMap[level];
    const asTag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
        <Flex>
            <Toaster toasts={toasts} removeToast={removeToast}/>
            <Flex
                style={style}
                onClick={() => copyURL(id)}
                className={styles.control}
                alignItems="center"
                gap="4">
                <Heading
                    className={styles.text}
                    id={id}
                    variant={variant}
                    as={asTag}>
                    {children}
                </Heading>
                <IconButton
                    className={styles.visibility}
                    size="s"
                    icon="openLink"
                    variant="ghost"
                    tooltip={t('copyTooltip')}
                    tooltipPosition="right" />
            </Flex>
        </Flex>
    );
};