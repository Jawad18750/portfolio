import { baseURL } from '@/app/resources'

export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
        ],
        sitemap: `https://${baseURL}/sitemap.xml`,
    }
}