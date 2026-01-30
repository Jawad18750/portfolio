import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import React, { ReactNode } from 'react';

import { SmartImage, SmartLink, Text } from '@/once-ui/components';
import { AppBadges } from '@/components/AppBadges';
import { CodeBlock } from '@/once-ui/modules';
import { HeadingLink } from '@/components';

import { TextProps } from '@/once-ui/interfaces';
import { SmartImageProps } from '@/once-ui/components/SmartImage';
import { routing } from '@/i18n/routing';

type TableProps = {
    data: {
        headers: string[];
        rows: string[][];
    };
};

function Table({ data }: TableProps) {
    const headers = data.headers.map((header, index) => (
        <th key={index}>{header}</th>
    ));
    const rows = data.rows.map((row, index) => (
        <tr key={index}>
        {row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
        ))}
        </tr>
    ));

    return (
        <table>
            <thead>
                <tr>{headers}</tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
}

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: ReactNode;
};

function createCustomLink(locale?: string) {
    return function CustomLink({ href, children, ...props }: CustomLinkProps) {
        if (href.startsWith('/')) {
            const localizedHref = locale && locale !== routing.defaultLocale
                ? `/${locale}${href}`
                : href;
            return (
                <SmartLink href={localizedHref} {...props}>
                    {children}
                </SmartLink>
            );
        }

        if (href.startsWith('#')) {
            return <a href={href} {...props}>{children}</a>;
        }

        return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
            </a>
        );
    };
}

function createImage({ alt, src, ...props }: SmartImageProps & { src: string }) {
    if (!src) {
        console.error("SmartImage requires a valid 'src' property.");
        return null;
    }

    return (
        <SmartImage
            className="my-20"
            enlarge
            radius="m"
            aspectRatio="16 / 9"
            alt={alt}
            src={src}
            sizes="(max-width: 768px) 100vw, 640px"
            {...props}/>
        )
}

function slugify(str: string): string {
    return str
        .toString()
        .toLowerCase()
        .trim() // Remove whitespace from both ends of a string
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\u0600-\u06FF\-]+/g, '') // Remove non-word chars (keeps Arabic \u0600-\u06FF)
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-|-$/g, '') // Trim leading/trailing hyphens
        || 'section' // Fallback for empty slugs (e.g. from non-Latin text)
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    const CustomHeading = ({ children, ...props }: TextProps) => {
    const slug = slugify(children as string);
        return (
            <HeadingLink
                style={{marginTop: 'var(--static-space-24)', marginBottom: 'var(--static-space-12)'}}
                level={level}
                id={slug}
                {...props}>
                {children}
            </HeadingLink>
        );
    };
  
    CustomHeading.displayName = `Heading${level}`;
  
    return CustomHeading;
}

function createParagraph({ children }: TextProps) {
    return (
        <Text style={{lineHeight: '1.7'}}
            variant="body-default-m"
            onBackground="neutral-medium"
            marginTop="8"
            marginBottom="12">
            {children}
        </Text>
    );
};

function createMDXComponents(locale?: string) {
    const localeForBadges = locale === 'ar' ? 'ar' : 'en';
    const CustomLinkWithLocale = createCustomLink(locale);
    return {
        p: createParagraph as any,
        h1: createHeading(1) as any,
        h2: createHeading(2) as any,
        h3: createHeading(3) as any,
        h4: createHeading(4) as any,
        h5: createHeading(5) as any,
        h6: createHeading(6) as any,
        img: createImage as any,
        a: CustomLinkWithLocale as any,
        Table,
        CodeBlock,
        AppBadges: (props: { appStoreUrl?: string; playStoreUrl?: string }) => (
            <AppBadges locale={localeForBadges} {...props} />
        ),
    };
}

const defaultComponents = createMDXComponents();

type CustomMDXProps = MDXRemoteProps & {
    components?: Record<string, React.ComponentType<any>>;
    locale?: string;
};

export function CustomMDX(props: CustomMDXProps) {
    const { locale, components: customComponents, ...mdxProps } = props;
    const components = locale
        ? { ...createMDXComponents(locale), ...(customComponents || {}) }
        : { ...defaultComponents, ...(customComponents || {}) };

    return (
        // @ts-ignore: Suppressing type error for MDXRemote usage
        <MDXRemote
            {...mdxProps}
            components={components}
        />
    );
}