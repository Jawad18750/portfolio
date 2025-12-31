import { getPosts } from '@/app/utils/utils'
import { baseURL, routes as routesConfig } from '@/app/resources'
import { routing } from '@/i18n/routing'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const locales = routing.locales;
    const defaultLocale = routing.defaultLocale;

    // Helper to generate URL with proper locale handling (must include https://)
    const getUrl = (locale: string, path: string) => {
        if (locale === defaultLocale) {
            return `https://${baseURL}${path}`;
        }
        return `https://${baseURL}/${locale}${path}`;
    };

    let blogs = locales.flatMap((locale) => 
        getPosts(['src', 'app', '[locale]', 'blog', 'posts', locale]).map((post) => ({
            url: getUrl(locale, `/blog/${post.slug}`),
            lastModified: post.metadata.publishedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: {
                languages: Object.fromEntries(
                    locales.map(loc => [loc, getUrl(loc, `/blog/${post.slug}`)])
                ),
            },
        }))
    );

    let works = locales.flatMap((locale) => 
        getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]).map((post) => ({
            url: getUrl(locale, `/work/${post.slug}`),
            lastModified: post.metadata.publishedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
            alternates: {
                languages: Object.fromEntries(
                    locales.map(loc => [loc, getUrl(loc, `/work/${post.slug}`)])
                ),
            },
        }))
    );

    const activeRoutes = Object.keys(routesConfig).filter((route) => routesConfig[route]);

    let routes = locales.flatMap((locale)=> 
        activeRoutes.map((route) => {
            const path = route !== '/' ? route : '';
            return {
                url: getUrl(locale, path),
                lastModified: new Date(),
                changeFrequency: (route === '/' ? 'weekly' : 'monthly') as const,
                priority: route === '/' ? 1.0 : 0.9,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map(loc => [loc, getUrl(loc, path)])
                    ),
                },
            };
        })
    );

    return [...routes, ...blogs, ...works]
}