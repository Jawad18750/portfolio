const baseURL = 'abdeljawad.com'

// Enable localization
const i18n = true;

// Manage localized content in the messages folder
const i18nOptions = {
    locales: ['en', 'ar'],      // A list of all locales that are supported, e.g. ['en','ar']
    defaultLocale: 'ar'         // Locale used by default and as a fallback
}

const routes = {
    '/':         true,
    '/about':    true,
    '/projects': true,
    '/contact':  true,
    '/blog':     false,  // Set to false to hide from header and home page
    '/gallery':  true,
}

// Enable password protection on selected routes
// Set password in pages/api/authenticate.ts
const protectedRoutes = {
    '/projects/automate-design-handovers-with-a-figma-to-code-pipeline': false
}

const effects = {
    mask: {
        cursor: false,
        x: 50,
        y: 0,
        radius: 100,
    },
    gradient: {
        display: false,
        opacity: 1,
        x: 50,
        y: 60,
        width: 100,
        height: 50,
        tilt: 0,
        colorStart: 'accent-background-strong',
        colorEnd: 'page-background',
    },
    dots: {
        display: true,
        opacity: 0.4,
        size: '2',
        color: 'brand-background-strong',
    },
    grid: {
        display: false,
        opacity: 1,
        width: '0.25rem',
        height: '0.25rem',
        color: 'neutral-alpha-medium',
    },
    lines: {
        display: false,
        opacity: 1,
        color: 'neutral-alpha-weak',
        size: '16',
        thickness: 1,
        angle: 45,
    },
    particles: {
        display: true,
        color: 'brand-on-background-weak',
        size: '2',
        opacity: 40,
        speed: 3,
        density: 200,
        interactive: true,
        interactionRadius: 10,
    }
}

const style = {
    theme:       'dark',         // dark | light
    neutral:     'gray',         // sand | gray | slate
    brand:       'cyan',      // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
    accent:      'cyan',       // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
    solid:       'contrast',     // color | contrast
    solidStyle:  'plastic',         // flat | plastic
    border:      'rounded',      // rounded | playful | conservative
    surface:     'translucent',  // filled | translucent
    transition:  'all'           // all | micro | macro
}

const display = {
    location: false,
    time:     false,
}

const mailchimp = {
    action: 'https://url/subscribe/post?parameters',
    effects: {
        mask: {
            cursor: true,
            radius: 80,
        },
        gradient: {
            display: true,
            opacity: 0.6,
            x: 50,
            y: 0,
            width: 80,
            height: 60,
            tilt: 0,
            colorStart: 'accent-background-strong',
            colorEnd: 'static-transparent',
        },
        dots: {
            display: true,
            opacity: 0.2,
            size: '16',
            color: 'brand-on-background-weak',
        },
        grid: {
            display: false,
        },
        lines: {
            display: false,
        },
    }
}

export { routes, protectedRoutes, effects, style, display, mailchimp, baseURL, i18n, i18nOptions };