import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx'
import { getPosts } from '@/app/utils/utils'
import { AvatarGroup, Button, Flex, Heading, Text } from '@/once-ui/components'
import { ProjectImageGallery } from '@/components/ProjectImageGallery'
import { baseURL, renderContent } from '@/app/resources';
import { routing } from '@/i18n/routing';
import { getCanonicalUrl, getAlternateLanguages } from '@/app/utils/seo';
import { unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/app/utils/formatDate';
import ScrollToHash from '@/components/ScrollToHash';

interface WorkParams {
    params: {
        slug: string;
		locale: string;
    };
}

export async function generateStaticParams(): Promise<{ slug: string; locale: string }[]> {
	const locales = routing.locales;
    
    // Create an array to store all posts from all locales
    const allPosts: { slug: string; locale: string }[] = [];

    // Fetch posts for each locale
    for (const locale of locales) {
        const posts = getPosts(['src', 'app', '[locale]', 'projects', 'projects', locale]);
        allPosts.push(...posts.map(post => ({
            slug: post.slug,
            locale: locale,
        })));
    }

    return allPosts;
}

export function generateMetadata({ params: { slug, locale } }: WorkParams) {
	let post = getPosts(['src', 'app', '[locale]', 'projects', 'projects', locale]).find((post) => post.slug === slug)
	
	if (!post) {
		return
	}

	let {
		title,
		publishedAt: publishedTime,
		summary: description,
		images,
		image,
		team,
	} = post.metadata
	let ogImage = image
		? `https://${baseURL}${image}`
		: `https://${baseURL}/og?title=${title}`;

    const currentUrl = getCanonicalUrl(locale, `/projects/${post.slug}`);
	
	return {
		title,
		description,
		images,
		team,
		alternates: {
			canonical: currentUrl,
			languages: getAlternateLanguages(`/projects/${post.slug}`),
		},
		openGraph: {
			title,
			description,
			type: 'article',
			publishedTime,
			url: currentUrl,
			images: [
				{
					url: ogImage,
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
	}
}

export default function Project({ params }: WorkParams) {
	unstable_setRequestLocale(params.locale);
	let post = getPosts(['src', 'app', '[locale]', 'projects', 'projects', params.locale]).find((post) => post.slug === params.slug)

	if (!post) {
		notFound()
	}

	const t = useTranslations();
	const { person, work } = renderContent(t);
    const localePrefix = params.locale === routing.defaultLocale ? '' : `/${params.locale}`;

	const avatars = post.metadata.team?.map((member) => ({
        src: member.avatar || '/images/avatar.svg',
    })).filter((a) => a.src) || [];

	return (
		<Flex as="section"
			fillWidth maxWidth="m"
			direction="column" alignItems="center"
			gap="l"
			paddingTop="xl">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: post.metadata.title,
						datePublished: post.metadata.publishedAt,
						dateModified: post.metadata.publishedAt,
						description: post.metadata.summary,
						image: post.metadata.image
							? `https://${baseURL}${post.metadata.image}`
							: `https://${baseURL}/og?title=${post.metadata.title}`,
							url: `https://${baseURL}${localePrefix}/projects/${post.slug}`,
						author: {
							'@type': 'Person',
							name: person.name,
						},
					}),
				}}
			/>
			<Flex
				fillWidth maxWidth="s" gap="16"
				direction="column">
				<Button
					href={params.locale === routing.defaultLocale ? '/projects' : `/${params.locale}/projects`}
					variant="tertiary"
					size="s"
					prefixIcon="chevronLeft">
					{work.label}
				</Button>
				<Heading
					variant="display-strong-s">
					{post.metadata.title}
				</Heading>
			</Flex>
			{post.metadata.images.length > 0 && (
				<Flex fillWidth maxWidth="s">
					<ProjectImageGallery
						images={post.metadata.images}
						alt={post.metadata.title}
						aspectRatio="16 / 9"
						radius="m"
					/>
				</Flex>
			)}
			<Flex style={{margin: 'auto'}}
				as="article"
				maxWidth="s" fillWidth
				direction="column">
				<Flex
					gap="12" marginBottom="24"
					alignItems="center">
					{ post.metadata.team && (
						<AvatarGroup
							reverseOrder
							avatars={avatars}
							size="m"/>
					)}
					<Text
						variant="body-default-s"
						onBackground="neutral-weak">
						{formatDate(post.metadata.publishedAt, false, params.locale as 'en' | 'ar')}
					</Text>
				</Flex>
				<CustomMDX source={post.content} locale={params.locale} />
			</Flex>
			<ScrollToHash />
		</Flex>
	)
}