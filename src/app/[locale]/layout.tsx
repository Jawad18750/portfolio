import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";
import "@/app/resources/custom.css";

import classNames from 'classnames';

import { Footer, Header, RouteGuard } from "@/components";
import { RouteStyler } from "@/components/RouteStyler";
import { baseURL, effects, style } from '@/app/resources'

import { Inter } from 'next/font/google'
import { Source_Code_Pro } from 'next/font/google'
import localFont from 'next/font/local';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { GoogleTagManager } from '@next/third-parties/google';

import { routing } from "@/i18n/routing";
import { renderContent } from "@/app/resources";
import { Background, Flex, Particle } from "@/once-ui/components";

export async function generateMetadata(
	{ params: { locale }}: { params: { locale: string }}
) {

	const t = await getTranslations();
	const { person, home } = renderContent(t);

	const currentUrl = `https://${baseURL}${locale === routing.defaultLocale ? '' : `/${locale}`}`;
	const alternateLanguages: Record<string, string> = {};
	
	routing.locales.forEach((loc) => {
		alternateLanguages[loc] = `https://${baseURL}${loc === routing.defaultLocale ? '' : `/${loc}`}`;
	});

	return {
		metadataBase: new URL(`https://${baseURL}`),
		title: home.title,
		description: home.description,
		alternates: {
			canonical: currentUrl,
			languages: alternateLanguages,
		},
		icons: {
			icon: '/favicon.ico',
			apple: '/favicon.ico',
		},
		openGraph: {
			title: `${person.firstName}'s Portfolio`,
			description: 'Portfolio website showcasing my work.',
			url: currentUrl,
			siteName: `${person.firstName}'s Portfolio`,
			locale: locale === 'ar' ? 'ar_LY' : 'en_US',
			type: 'website',
			alternateLocale: locale === 'ar' ? 'en_US' : 'ar_LY',
		},
		twitter: {
			card: 'summary_large_image',
			title: home.title,
			description: home.description,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
	}
};

const primary = Inter({
	variable: '--font-primary',
	subsets: ['latin'],
	display: 'swap',
	preload: true,
	fallback: ['system-ui', 'arial'],
})

// Lama Sans Arabic Font Setup
// Using the 4 weights that match Inter font usage in the portfolio
const secondary = localFont({
    variable: '--font-secondary',
    src: [
        {
            path: '../../../public/fonts/LamaSans-Light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/LamaSans-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/LamaSans-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../../public/fonts/LamaSans-ExtraBold.ttf',
            weight: '800',
            style: 'normal',
        },
    ],
    display: 'swap',
    preload: true,
    fallback: ['system-ui', 'arial'],
})

type FontConfig = {
    variable: string;
};

/*
	Replace with code for tertiary fonts
	from https://once-ui.com/customize
*/
const tertiary: FontConfig | undefined = undefined;
/*
*/

const code = Source_Code_Pro({
	variable: '--font-code',
	subsets: ['latin'],
	display: 'swap',
	preload: false, // Code font is less critical, load on demand
});

interface RootLayoutProps {
	children: React.ReactNode;
	params: {locale: string};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({locale}));
  }

export default async function RootLayout({
	children,
	params: {locale}
} : RootLayoutProps) {
	unstable_setRequestLocale(locale);
	const messages = await getMessages();
	return (
		<NextIntlClientProvider messages={messages}>
			<Flex
				as="html" lang={locale}
				background="page"
				data-neutral={style.neutral} data-brand={style.brand} data-accent={style.accent}
				data-solid={style.solid} data-solid-style={style.solidStyle}
				data-theme={style.theme}
				data-border={style.border}
				data-surface={style.surface}
				data-transition={style.transition}
				className={classNames(
					primary.variable,
					secondary ? secondary.variable : '',
					tertiary ? tertiary.variable : '',
					code.variable,
					locale === 'ar' ? 'arabic-font' : '')}>
				<Flex style={{minHeight: '100vh'}}
					as="body"
					fillWidth margin="0" padding="0"
					direction="column">
					<RouteStyler />
					{process.env.NEXT_PUBLIC_GTM_ID && (
						<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
					)}
					{effects.particles?.display && (
						<Particle
							fillHeight
							fillWidth
							position="fixed"
							style={{ top: 0, left: 0, zIndex: 0 }}
							density={effects.particles.density ?? 200}
							color={effects.particles.color ?? 'brand-on-background-weak'}
							size={effects.particles.size ?? '2'}
							speed={effects.particles.speed ?? 0.3}
							interactive={effects.particles.interactive ?? false}
							interactionRadius={effects.particles.interactionRadius ?? 20}
							opacity={effects.particles.opacity ?? 40}
						/>
					)}
					<Background
						position="fixed"
						mask={effects.mask as any}
						gradient={effects.gradient as any}
						dots={effects.dots as any}
						grid={effects.grid as any}
						lines={effects.lines as any}/>
					<Flex fillWidth minHeight="16"></Flex>
					<Header locale={locale}/>
					<Flex
						zIndex={0}
						fillWidth paddingY="0" paddingX="l"
						justifyContent="center" flex={1}>
						<Flex
							justifyContent="center"
							fillWidth minHeight="0">
							<RouteGuard>
								{children}
							</RouteGuard>
						</Flex>
					</Flex>
					<div className="layout-footer">
						<Footer/>
					</div>
				</Flex>
			</Flex>
		</NextIntlClientProvider>
	);
}