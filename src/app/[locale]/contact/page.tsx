import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { baseURL, renderContent } from '@/app/resources';
import { getCanonicalUrl, getAlternateLanguages } from '@/app/utils/seo';
import { ContactForm } from '@/components';
import { Flex, Icon } from '@/once-ui/components';

export async function generateMetadata(
	{ params: { locale } }: { params: { locale: string } }
): Promise<Metadata> {
	const t = await getTranslations();
	const { contact, person } = renderContent(t);

	const title = `${t('contact.title')} – ${person.name}`;
	const description = t('contact.description');
	const currentUrl = getCanonicalUrl(locale, '/contact');

	return {
		title,
		description,
		alternates: {
			canonical: currentUrl,
			languages: getAlternateLanguages('/contact'),
		},
		openGraph: {
			title,
			description,
			type: 'website',
			url: currentUrl,
			images: [
				{
					url: `https://${baseURL}/og?title=${encodeURIComponent(title)}`,
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
		},
	};
}

export default async function ContactPage(
	{ params: { locale } }: { params: { locale: string } }
) {
	unstable_setRequestLocale(locale);

	const t = await getTranslations();
	const { contact } = renderContent(t);

	return (
		<Flex
			maxWidth="m"
			fillWidth
			direction="column"
			alignItems="center"
			justifyContent="center"
			paddingY="xl"
			style={{ minHeight: 'calc(100vh - 120px)' }}
			flex={1}
		>
			{contact.whatsapp.display && (
				<a
					href={contact.whatsapp.link}
					target="_blank"
					rel="noreferrer"
					style={{ textDecoration: 'none', display: 'inline-block' }}>
					<Flex
						style={{
							backdropFilter: 'blur(var(--static-space-1))',
							border: '1px solid var(--brand-alpha-medium)',
							width: 'fit-content'
						}}
						alpha="brand-weak" radius="full"
						padding="4" gap="8" marginBottom="l"
						alignItems="center">
						<Flex paddingLeft="12">
							<Icon
								name="whatsapp"
								onBackground="brand-weak"/>
						</Flex>
						<Flex paddingX="8">
							{t('contact.channels.whatsapp')}
						</Flex>
						<Icon
							name="chevronRight"
							onBackground="brand-weak"/>
					</Flex>
				</a>
			)}
			<ContactForm
				display={contact.display}
				title={contact.title}
				description={contact.description}
			/>
		</Flex>
	);
}
