import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { baseURL, renderContent } from '@/app/resources';
import { ContactForm } from '@/components';
import { Flex } from '@/once-ui/components';

export async function generateMetadata(
	{ params: { locale } }: { params: { locale: string } }
): Promise<Metadata> {
	const t = await getTranslations();
	const { contact, person } = renderContent(t);

	const title = `${t('contact.title')} – ${person.name}`;
	const description = t('contact.description');
	const currentUrl = `https://${baseURL}${locale === 'ar' ? '' : `/${locale}`}/contact`;

	return {
		title,
		description,
		alternates: {
			canonical: currentUrl,
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
			<ContactForm
				display={contact.display}
				title={contact.title}
				description={contact.description}
			/>
		</Flex>
	);
}
