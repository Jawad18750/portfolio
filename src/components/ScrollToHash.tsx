"use client";

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

function scrollToHashElement() {
    const hash = window.location.hash;
    if (!hash) return;
    const id = decodeURIComponent(hash.replace('#', ''));
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

export default function ScrollToHash() {
    const pathname = usePathname();

    const tryScroll = useCallback(() => {
        scrollToHashElement();
    }, []);

    useEffect(() => {
        // Scroll on mount and when pathname changes (e.g. client navigation)
        tryScroll();
        // Retry after a short delay for async content (MDX, etc.)
        const t1 = setTimeout(tryScroll, 100);
        const t2 = setTimeout(tryScroll, 500);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [pathname, tryScroll]);

    useEffect(() => {
        const handleHashChange = () => scrollToHashElement();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return null;
} 