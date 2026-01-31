import {defineRouting} from 'next-intl/routing';
import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import { i18nOptions } from '@/app/resources/config';
 
export const routing = defineRouting({
  locales: i18nOptions.locales,
  defaultLocale: i18nOptions.defaultLocale,

  // Won't display `defaultLocale` in routes (e.g. / for Arabic, /en for English)
  localePrefix: 'as-needed',

  // Disable Accept-Language detection so defaultLocale (ar) is used for / instead of browser language
  localeDetection: false
});
 
export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation(routing);