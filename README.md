# **Portfolio - Abdeljawad Almiladi**

A customized portfolio built with [Once UI's Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) template, featuring a contact form, WhatsApp integration, and automated VPS deployment.

**Live Site:** [abdeljawad.com](https://abdeljawad.com)

![Portfolio](public/images/cover.png)

---

## **🚀 Features**

### **Core Features (from Once UI Magic Portfolio)**
- All tokens, components & features of [Once UI](https://once-ui.com)
- Automatic open-graph and X image generation
- Responsive layout optimized for all screen sizes
- Timeless design without heavy animations
- Endless customization options through data attributes
- Conditional section rendering
- Password protection for URLs

### **Custom Features Added**
- ✅ **Contact Form** - Professional contact form with email/phone/message fields
- ✅ **WhatsApp Integration** - Deep link integration for seamless communication
- ✅ **Smart Phone Detection** - Automatic Libyan phone number normalization (+218)
- ✅ **SMTP Email** - Server-side email sending via nodemailer
- ✅ **Bot Protection** - Cloudflare Turnstile invisible bot protection
- ✅ **Analytics & Tracking** - Google Tag Manager (GTM) with GA4 and Facebook Pixel
- ✅ **SEO Optimization** - Sitemap, robots.txt, structured data (JSON-LD), hreflang
- ✅ **Automated Deployment** - GitHub Actions workflow for VPS deployment
- ✅ **OpenLiteSpeed Integration** - Automatic reverse proxy configuration
- ✅ **Enhanced RTL Support** - Improved Arabic (RTL) layout and typography
- ✅ **Mobile Optimization** - Fully responsive contact form and footer

### **Localization**
- Full i18n support with next-intl
- English and Arabic (RTL) languages
- RTL-aware components and layouts

---

## **📋 Getting Started**

### **Prerequisites**
- Node.js v18.17+ or v20+
- npm or yarn
- Git

### **Installation**

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
CONTACT_EMAIL=your-contact@email.com

# Cloudflare Turnstile (Bot Protection)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Next.js
NODE_ENV=development
```

See `.env.example` for detailed configuration instructions.

**4. Run dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (defaults to Arabic locale).

**5. Edit configuration**
- **Config:** `src/app/resources/config.js`
- **Content:** `src/app/resources/content-i18n.js`
- **Translations:** `messages/en.json` and `messages/ar.json`

**6. Create blog posts / projects**
Add new `.mdx` files to:
- `src/app/[locale]/blog/posts/[locale]/`
- `src/app/[locale]/work/projects/[locale]/`

---

## **🚀 Deployment**

### **Automated VPS Deployment**

This repository includes automated deployment via GitHub Actions.

**Quick Deploy:**
```bash
./deploy.sh
```

Or manually:
```bash
git push origin main
```

**Setup Instructions:**
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.

**Quick Setup:**
1. Configure GitHub Secrets (VPS_HOST, VPS_USER, VPS_SSH_KEY)
2. Create `.env` file on server at `/var/www/portfolio/.env`
3. Push to `main` branch - deployment happens automatically!

**Deployment Features:**
- ✅ Automatic build and deployment
- ✅ PM2 process management
- ✅ OpenLiteSpeed reverse proxy auto-configuration
- ✅ Health checks and error diagnostics
- ✅ Automatic backups (keeps last 3)

---

## **📧 Contact Form**

The contact form includes:
- **Name** (required)
- **Email** (required, validated)
- **Phone** (optional, with smart Libyan number detection)
- **Message** (required)

**Features:**
- Smart phone number normalization (091/092/093 → +218)
- WhatsApp deep link integration
- SMTP email sending
- Success/error state handling
- Full RTL support for Arabic

---

## **🌐 Localization**

### **Supported Languages**
- **Arabic** (ar) - Default locale, RTL layout
- **English** (en) - LTR layout

### **Adding Translations**
Edit translation files:
- `messages/en.json` - English translations
- `messages/ar.json` - Arabic translations

### **RTL Support**
- Automatic RTL layout for Arabic
- RTL-aware form labels and inputs
- RTL footer and navigation
- Custom CSS overrides for proper RTL rendering

---

## **🛠️ Tech Stack**

- **Framework:** [Next.js 14](https://nextjs.org)
- **UI Components:** [Once UI](https://once-ui.com)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app)
- **Email:** [nodemailer](https://nodemailer.com)
- **Bot Protection:** [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- **Analytics:** [Google Tag Manager](https://tagmanager.google.com/) + GA4 + Facebook Pixel
- **Deployment:** GitHub Actions + PM2 + OpenLiteSpeed
- **Styling:** SCSS + CSS Modules
- **Content:** MDX

---

## **📁 Project Structure**

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated deployment workflow
├── messages/                   # i18n translation files
│   ├── en.json
│   └── ar.json
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized routes
│   │   ├── api/
│   │   │   └── contact/       # Contact form API endpoint
│   │   └── resources/        # Config and content
│   ├── components/
│   │   ├── ContactForm.tsx   # Contact form component
│   │   └── ...
│   └── once-ui/               # Once UI components
├── deploy.sh                  # Quick deployment script
├── DEPLOYMENT.md              # Deployment guide
└── README.md                  # This file
```

---

## **📚 Documentation**

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[QUICK-DEPLOY.md](QUICK-DEPLOY.md)** - Quick deployment reference
- **[POST-DEPLOYMENT.md](POST-DEPLOYMENT.md)** - Post-deployment checklist

---

## **🤝 Contributing**

This is a customized fork. For the original template, see:
[Once UI Magic Portfolio](https://github.com/once-ui-system/magic-portfolio)

---

## **👤 Author**

**Abdeljawad Almiladi**
- Website: [abdeljawad.com](https://abdeljawad.com)
- Portfolio built with [Once UI Magic Portfolio](https://github.com/once-ui-system/magic-portfolio)

---

## **🙏 Credits**

**Original Template:**
- Built by [Once UI](https://once-ui.com)
- Authors: [Lorant Toth](https://www.threads.net/@lorant.one) & [Zsofia Komaromi](https://www.threads.net/@zsofia_kom)
- Localization by [François Hernandez](https://github.com/francoishernandez)

**Customizations:**
- Contact form and WhatsApp integration
- Automated VPS deployment
- Enhanced RTL support
- Mobile optimizations

---

## **📄 License**

Distributed under the CC BY-NC 4.0 License.
- Commercial usage is not allowed.
- Attribution is required.

See `LICENSE.txt` for more information.

---

## **🔗 Links**

- **Live Site:** [abdeljawad.com](https://abdeljawad.com)
- **Original Template:** [Once UI Magic Portfolio](https://github.com/once-ui-system/magic-portfolio)
- **Once UI:** [once-ui.com](https://once-ui.com)

---

## **📝 Changelog**

### **v0.2.0** (Current)
- ✅ Added contact form with email/phone/message fields
- ✅ Integrated WhatsApp deep link functionality
- ✅ Implemented smart phone number detection
- ✅ Added SMTP email sending with HTML formatting
- ✅ Integrated Cloudflare Turnstile bot protection
- ✅ Added Google Tag Manager with GA4 and Facebook Pixel
- ✅ Implemented SEO optimizations (sitemap, robots.txt, structured data, hreflang)
- ✅ Changed default locale to Arabic
- ✅ Created automated VPS deployment workflow (port 3001)
- ✅ Enhanced RTL support for Arabic
- ✅ Improved mobile responsiveness
- ✅ Added comprehensive deployment documentation
- ✅ Fixed logo slider and testimonial spacing issues
- ✅ Updated avatar to SVG format

---

**Built with ❤️ using [Once UI](https://once-ui.com)**
