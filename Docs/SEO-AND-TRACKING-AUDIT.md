# SEO, Indexing, Facebook Pixel & Google Tracking Audit

**Date:** January 2025  
**Project:** Portfolio (abdeljawad.com)

---

## 1. SEO & Indexing Audit

### ✅ What's Implemented

| Feature | Status | Location |
|---------|--------|----------|
| **Sitemap** | ✅ | `src/app/sitemap.ts` – Dynamic sitemap with hreflang for en/ar |
| **Robots.txt** | ✅ | `src/app/robots.ts` – Allows all, disallows /api/, /_next/ |
| **Canonical URLs** | ✅ | All pages via `generateMetadata` → `alternates.canonical` |
| **Open Graph** | ✅ | All pages – title, description, images, url |
| **Twitter Cards** | ✅ | All pages – summary_large_image |
| **JSON-LD Schema** | ✅ | Home, About, Projects, Blog, Gallery – WebPage, Person, BlogPosting, CollectionPage |
| **Robots meta** | ✅ | Layout – index: true, follow: true, googleBot max settings |
| **metadataBase** | ✅ | Layout – `https://${baseURL}` |
| **Hreflang** | ✅ | Sitemap alternates.languages for all URLs |

### ⚠️ Issues & Recommendations

#### 1.1 Projects Page Metadata
- **Current:** `title: work.title` ("My projects") – generic
- **Recommendation:** Use `"Projects – Abdeljawad Almiladi"` for stronger branding and SEO (matches the new heading). Update `generateMetadata` in `src/app/[locale]/projects/page.tsx`:

```ts
const title = `${work.label} – ${person.name}`;
```

#### 1.2 Contact Page Canonical URL Bug
- **File:** `src/app/[locale]/contact/page.tsx` line 17
- **Bug:** `locale === 'ar' ? '' : \`/${locale}\`` – Arabic (default) gets empty, but default locale may not be 'ar' in all configs
- **Fix:** Use `routing.defaultLocale` for consistency:
```ts
const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;
const currentUrl = `https://${baseURL}${localePrefix}/contact`;
```

#### 1.3 Missing hreflang in HTML
- **Current:** Sitemap has hreflang; layout has `alternates.languages` in metadata
- **Gap:** Next.js metadata API may not output `<link rel="alternate" hreflang="x">` in `<head>` for all pages. Verify in production HTML source.
- **Action:** Check view-source on abdeljawad.com – ensure `<link rel="alternate" hreflang="en" href="...">` and `hreflang="ar"` exist.

#### 1.4 Blog Route in Sitemap
- **Check:** `routesConfig` filters active routes. If blog is `false` in config, blog posts may still be in sitemap (they're added separately) but `/blog` index might be missing.
- **Verify:** `routes['/blog']` – if false, `/blog` won't be in the `routes` array. Blog posts are added via `blogs` array, so individual posts are fine. The `/blog` listing page may be missing if it's not in active routes.

#### 1.5 Image Alt Text
- **Projects:** Cover images use `alt={post.metadata.title}` ✅
- **Blog:** Thumbnails use `alt={'Thumbnail of ' + post.metadata.title}` ✅
- **General:** Audit all `<img>` and `SmartImage` for descriptive alt text.

#### 1.6 Page Titles Consistency
- **Contact:** Uses `"Get in touch – Abdeljawad Almiladi"` (good)
- **Projects:** Uses `work.title` ("My projects") – consider matching Contact pattern for consistency.

---

## 2. Facebook Pixel Audit

### Current State

| Item | Status |
|------|--------|
| **Facebook Pixel script** | ❌ Not directly implemented |
| **GTM integration** | ✅ `NEXT_PUBLIC_GTM_ID` loads GoogleTagManager |
| **Contact form → dataLayer** | ✅ Pushes `fluentform_success` with `DLV - form_name: start_project` |

### How It Works

1. **GTM is the gateway:** The project uses GTM (`@next/third-parties/google`). Facebook Pixel is expected to be loaded **via GTM**, not as a separate script.
2. **Contact form conversion:** On successful submit, `ContactForm.tsx` pushes to `dataLayer`:
   ```js
   window.dataLayer.push({
     'event': 'fluentform_success',
     'DLV - form_name': 'start_project'
   });
   ```
3. **GTM setup required:** In GTM, you must:
   - Add **Facebook Pixel** tag (use your Pixel ID from Meta Events Manager)
   - Create trigger: Custom Event = `fluentform_success`
   - Optionally add a **Lead** event when this trigger fires

### ⚠️ Recommendations

1. **Verify GTM Container:**
   - Ensure `NEXT_PUBLIC_GTM_ID` is set in production `.env`
   - GTM container should include:
     - Facebook Pixel base code (Page View)
     - Facebook Pixel Lead event (triggered by `fluentform_success`)

2. **Event naming:** The key `'DLV - form_name'` is unusual. Standard GTM convention is `form_name` or `formName`. If your GTM trigger uses a different variable name, update either:
   - The ContactForm push, or
   - The GTM trigger/variable to match.

3. **No direct fbq() calls:** The project does not call `fbq('track', 'Lead')` directly. All tracking goes through GTM. This is correct if GTM is configured.

4. **Test in production:**
   - Use [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
   - Submit contact form and verify Lead event fires
   - Check Meta Events Manager → Test Events

---

## 3. Google Tracking Audit

### Current State

| Item | Status |
|------|--------|
| **Google Tag Manager** | ✅ Loaded when `NEXT_PUBLIC_GTM_ID` is set |
| **Google Analytics (GA4)** | ⚠️ Via GTM – not in codebase directly |
| **dataLayer push (Contact)** | ✅ `fluentform_success` event |

### How It Works

1. **GTM loads:** `layout.tsx` conditionally renders:
   ```tsx
   {process.env.NEXT_PUBLIC_GTM_ID && (
     <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
   )}
   ```

2. **GA4:** Must be configured inside GTM as a tag (GA4 Configuration + GA4 Event tags). The codebase does not include GA4 directly – that's correct when using GTM.

3. **Contact form:** Same dataLayer push used for Facebook can trigger a GA4 "generate_lead" or custom event in GTM.

### ⚠️ Recommendations

1. **Environment variable:**
   - Ensure `NEXT_PUBLIC_GTM_ID` is set in production
   - Format: `GTM-XXXXXXX`

2. **GTM container should include:**
   - GA4 Configuration tag (Measurement ID: G-XXXXXXXXXX)
   - GA4 Event tag for form submission (trigger: `fluentform_success`)

3. **Google Search Console:**
   - Submit sitemap: `https://abdeljawad.com/sitemap.xml`
   - Verify ownership (DNS or HTML meta tag – .env has `GOOGLE_SITE_VERIFICATION` commented)

4. **No gtag.js or analytics.js in code:** Correct – GTM manages all tags.

---

## 4. Summary Checklist

### SEO
- [x] Sitemap with hreflang
- [x] Robots.txt
- [x] Canonical URLs
- [x] Open Graph & Twitter Cards
- [x] JSON-LD structured data
- [x] Robots meta (index, follow)
- [x] Fix Contact page canonical logic (use routing.defaultLocale)
- [x] Projects page metadata title: "Projects – Name"
- [x] Add hreflang (alternates.languages) to all pages
- [x] Add /blog to sitemap when blog posts exist

### Facebook Pixel
- [ ] Verify GTM has Facebook Pixel tag
- [ ] Verify Lead event fires on contact form submit
- [ ] Test with Meta Pixel Helper

### Google
- [ ] Verify GTM has GA4 tag
- [ ] Verify form submission event in GA4
- [ ] Submit sitemap to Google Search Console
- [ ] Verify site ownership in Search Console

---

## 5. Quick Fixes to Apply

1. **Projects page metadata** – Use "Projects – Abdeljawad Almiladi" for title
2. **Contact page canonical** – Use routing.defaultLocale for locale prefix
3. **GTM/Facebook/GA4** – All configuration is in GTM; ensure container is published and env var is set
