import { getPosts } from '@/app/utils/utils';
import { Flex, Heading } from '@/once-ui/components';
import { Projects } from '@/components/work/Projects';
import { baseURL, renderContent } from '@/app/resources';
import { TestimonialSlider } from '@/components/TestimonialSlider';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';

export async function generateMetadata(
    {params: {locale}}: { params: { locale: string }}
) {

    const t = await getTranslations();
    const { work } = renderContent(t);

	const title = work.title;
	const description = work.description;
	const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;
	const currentUrl = `https://${baseURL}${localePrefix}/projects`;
	
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

export default function ProjectsPage(
    { params: {locale}}: { params: { locale: string }}
) {
    unstable_setRequestLocale(locale);
    const localePrefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    let allProjects = getPosts(['src', 'app', '[locale]', 'projects', 'projects', locale]);

    const t = useTranslations();
    const { person, work, testimonials, allLogos } = renderContent(t);

    return (
        <Flex
			fillWidth maxWidth="m"
			direction="column">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        headline: work.title,
                        description: work.description,
                        url: `https://${baseURL}${localePrefix}/projects`,
                        image: `${baseURL}/og?title=Design%20Projects`,
                        author: {
                            '@type': 'Person',
                            name: person.name,
                        },
                        hasPart: allProjects.map(project => ({
                            '@type': 'CreativeWork',
                            headline: project.metadata.title,
                            description: project.metadata.summary,
                            url: `https://${baseURL}${localePrefix}/projects/${project.slug}`,
                            image: `${baseURL}/${project.metadata.image}`,
                        })),
                    }),
                }}
            />
            <Projects locale={locale}/>
            {testimonials?.length > 0 && (
                <Flex direction="column" gap="m" marginTop="64">
                    <Heading variant="display-strong-s" align="center">
                        {locale === 'ar' ? 'آراء العملاء' : 'Client testimonials'}
                    </Heading>
                    <TestimonialSlider
                        testimonials={testimonials}
                        allLogos={allLogos}
                        locale={locale}
                    />
                </Flex>
            )}
        </Flex>
    );
}