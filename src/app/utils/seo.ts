import { baseURL } from '@/app/resources';
import { routing } from '@/i18n/routing';

/**
 * Get the locale prefix for URLs (empty for default locale)
 */
export function getLocalePrefix(locale: string): string {
    return locale === routing.defaultLocale ? '' : `/${locale}`;
}

/**
 * Build full URL for a path and locale
 */
export function getCanonicalUrl(locale: string, path: string): string {
    const prefix = getLocalePrefix(locale);
    const pathPart = path.startsWith('/') ? path : `/${path}`;
    return `https://${baseURL}${prefix}${pathPart}`;
}

/**
 * Generate alternates.languages for hreflang - all locale URLs for a given path
 */
export function getAlternateLanguages(path: string): Record<string, string> {
    const languages: Record<string, string> = {};
    routing.locales.forEach((locale) => {
        languages[locale] = getCanonicalUrl(locale, path);
    });
    return languages;
}
