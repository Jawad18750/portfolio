import React from 'react';

import { Badge, Button, Flex, Heading, RevealFx, Text, Avatar } from '@/once-ui/components';

import { baseURL, renderContent } from '@/app/resources';
import { getCanonicalUrl, getAlternateLanguages } from '@/app/utils/seo';
import { routing } from '@/i18n/routing';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {
	const t = await getTranslations();
    const { home } = renderContent(t);
	const title = home.title;
	const description = home.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

	const currentUrl = getCanonicalUrl(locale, '/');
	
	return {
		title,
		description,
		alternates: {
			canonical: currentUrl,
			languages: getAlternateLanguages('/'),
		},
		openGraph: {
			title,
			description,
			type: 'website',
			url: currentUrl,
			images: [
				{
					url: ogImage,
					alt: title,
					width: 1200,
					height: 630,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	};
}

export default async function Home(
	{ params: {locale}}: { params: { locale: string }}
) {
	unstable_setRequestLocale(locale);
	const t = await getTranslations();
	const { home, about, person } = renderContent(t);
	const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;
	const withLocale = (path: string) => {
		if (path === '/' || path === '') {
			return localePrefix || '/';
		}
		return `${localePrefix}${path}`;
	};
	const badgeHref = withLocale(home.featured?.href ?? '/projects');
	return (
		<Flex
			maxWidth="m"
			fillWidth
			alignItems="center"
			justifyContent="center"
			direction="column"
			gap="xl"
		>
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: home.title,
						description: home.description,
						url: `https://${baseURL}${locale === 'ar' ? '' : `/${locale}`}`,
						inLanguage: locale === 'ar' ? 'ar' : 'en',
						image: `https://${baseURL}/og?title=${encodeURIComponent(home.title)}`,
						publisher: {
							'@type': 'Person',
							name: person.name,
							jobTitle: person.role,
							image: {
								'@type': 'ImageObject',
								url: `https://${baseURL}${person.avatar}`,
							},
						},
						mainEntity: {
							'@type': 'Person',
							name: person.name,
							jobTitle: person.role,
							url: `https://${baseURL}${locale === 'ar' ? '' : `/${locale}`}/about`,
						},
					}),
				}}
			/>
			<Flex
				className="hero-section"
				fillWidth
				paddingY="24"
				direction="column"
				gap="m"
				alignItems="center"
			>
				<Flex
					direction="column"
					fillWidth
					maxWidth="s"
					alignItems="center"
					justifyContent="center"
					style={{ textAlign: 'center' }}
				>
				{home.featured?.display && (
					<RevealFx fillWidth justifyContent="center" alignItems="center" paddingTop="16" paddingBottom="32" paddingLeft="12" className="hero-badge">
						<Flex justifyContent="center" fillWidth>
							<Badge arrow={false} href={badgeHref}>
								{home.featured.title}
							</Badge>
						</Flex>
					</RevealFx>
				)}
					<RevealFx translateY="4" fillWidth justifyContent="center" paddingBottom="16" className="hero-heading">
							<Heading
								wrap="balance"
							variant="display-strong-l"
							align="center"
						>
								{home.headline}
							</Heading>
						</RevealFx>
					<RevealFx translateY="8" delay={0.02} fillWidth justifyContent="center" paddingBottom="32">
							<Text
								wrap="balance"
								onBackground="neutral-weak"
							variant="heading-default-xl"
							align="center"
						>
								{home.subline}
							</Text>
						</RevealFx>
				<RevealFx paddingTop="12" delay={0.04} fillWidth justifyContent="center" paddingLeft="12">
					<Flex justifyContent="center" fillWidth>
							<Button
								id="about"
								data-border="rounded"
						href={withLocale('/about')}
						variant="secondary"
						size="m"
								weight="default"
								arrowIcon
					>
									<Flex
										gap="8"
										alignItems="center"
								paddingRight="4"
							>
										{about.avatar.display && (
											<Avatar
												style={
													locale === 'ar'
														? { marginRight: '-0.75rem', marginLeft: '0.25rem' }
														: { marginLeft: '-0.75rem', marginRight: '0.25rem' }
												}
												src={person.avatar}
										size="m"
									/>
										)}
								{t('about.title')}
							</Flex>
						</Button>
					</Flex>
						</RevealFx>
					</Flex>
			</Flex>
		</Flex>
	);
}
