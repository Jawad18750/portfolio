import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Match all pathnames except for
  // - API routes (api, trpc)
  // - Next.js internals (_next, _vercel)
  // - Files with extensions (e.g., favicon.ico)
  matcher: [
    // Match root path and all other paths except excluded ones
    '/',
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};