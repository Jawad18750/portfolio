"use client";

import { Fragment, useEffect, useState, useTransition } from "react";

import { Flex, ToggleButton } from "@/once-ui/components"
import styles from '@/components/Header.module.scss'

import { routes, display } from '@/app/resources'

import { routing } from '@/i18n/routing';
import { Locale, usePathname, useRouter } from '@/i18n/routing';
import { renderContent } from "@/app/resources";
import { useTranslations } from "next-intl";

type TimeDisplayProps = {
    timeZone: string;
    locale?: string;  // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = 'en-GB' }) => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            };
            const timeString = new Intl.DateTimeFormat(locale, options).format(now);
            setCurrentTime(timeString);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [timeZone, locale]);

    return (
        <>
            {currentTime}
        </>
    );
};

export default TimeDisplay;

const NavDivider = () => (
    <Flex
        aria-hidden="true"
        style={{
            width: '1px',
            height: '24px',
            minWidth: '1px',
            background: 'var(--neutral-alpha-strong)',
            borderRadius: '999px',
            opacity: 0.35
        }}
    />
);

type HeaderProps = {
    locale: string;
};

export const Header = ({ locale }: HeaderProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname() ?? '';
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Initialize theme from localStorage or HTML attribute
    useEffect(() => {
        const htmlElement = document.documentElement;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // Apply saved theme immediately
            htmlElement.setAttribute('data-theme', savedTheme);
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // Use current theme from HTML attribute (set by server)
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            setIsDarkMode(currentTheme === 'dark');
            // Save it to localStorage for future visits
            localStorage.setItem('theme', currentTheme);
        }
    }, []);

    function handleLanguageChange(next: string) {
        const nextLocale = next as Locale;
        startTransition(() => {
            router.replace(
                pathname,
                {locale: nextLocale}
            )
        })
    }

    function handleThemeToggle() {
        const newTheme = isDarkMode ? 'light' : 'dark';
        const htmlElement = document.documentElement;
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setIsDarkMode(!isDarkMode);
    }

    const t = useTranslations();
    const { person, about, work, contact } = renderContent(t);

    const isDefaultLocale = locale === routing.defaultLocale;
    const localePrefix = isDefaultLocale ? '' : `/${locale}`;

    const withLocale = (path: string) => {
        if (path === '/' || path === '') {
            return isDefaultLocale ? '/' : `/${locale}`;
        }
        return `${localePrefix}${path}`;
    };

    const navItems: { key: string; element: JSX.Element }[] = [];

    if (routes['/']) {
        navItems.push({
            key: 'home',
            element: (
                <ToggleButton
                    prefixIcon="home"
                    href={withLocale('/')}
                    selected={pathname === withLocale('/')}
                />
            )
        });
    }

    if (routes['/about']) {
        navItems.push({
            key: 'about',
            element: (
                <ToggleButton
                    prefixIcon="person"
                    href={withLocale('/about')}
                    selected={pathname === withLocale('/about')}
                >
                    <Flex paddingX="2" hide="s">{about.label}</Flex>
                </ToggleButton>
            )
        });
    }

    if (routes['/projects']) {
        navItems.push({
            key: 'projects',
            element: (
                <ToggleButton
                    prefixIcon="grid"
                    href={withLocale('/projects')}
                    selected={pathname.startsWith(withLocale('/projects'))}
                >
                    <Flex paddingX="2" hide="s">{work.label}</Flex>
                </ToggleButton>
            )
        });
    }

    if (routes['/contact']) {
        navItems.push({
            key: 'contact',
            element: (
                <ToggleButton
                    prefixIcon="email"
                    href={withLocale('/contact')}
                    selected={pathname.startsWith(withLocale('/contact'))}
                >
                    <Flex paddingX="2" hide="s">{contact.label}</Flex>
                </ToggleButton>
            )
        });
    }

    if (routing.locales.length > 1) {
        navItems.push({
            key: 'locale-switch',
            element: (
                <ToggleButton
                    prefixIcon="globe"
                    selected={false}
                    size="s"
                    onClick={() => handleLanguageChange(locale === 'en' ? 'ar' : 'en')}
                    className={isPending ? 'pointer-events-none opacity-60' : ''}
                />
            )
        });
    }

    navItems.push({
        key: 'theme',
        element: (
            <ToggleButton
                prefixIcon={isDarkMode ? "moon" : "sun"}
                selected={false}
                size="s"
                onClick={handleThemeToggle}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            />
        )
    });

    const dividerAfter = new Set(['home', 'contact']);

    return (
        <>
            <Flex
                className={styles.mask}
                position="fixed" zIndex={9}
                fillWidth minHeight="80" justifyContent="center">
            </Flex>
            <Flex style={{height: 'fit-content'}}
                className={styles.position}
                as="header"
                zIndex={9}
                fillWidth padding="8"
                justifyContent="center">
                <Flex
                    paddingLeft="12" fillWidth
                    alignItems="center"
                    textVariant="body-default-s"
                    className="location-section">
                    { display.location && (
                        <Flex hide="s">
                            {person.location}
                        </Flex>
                    )}
                </Flex>
                <Flex fillWidth justifyContent="center">
                    <Flex
                        background="page"
                        border="neutral-alpha-weak"
                        radius="xs"
                        shadow="l"
                        padding="4"
                        justifyContent="center"
                    >
                        <Flex
                            gap="4"
                            textVariant="body-default-s"
                            alignItems="center"
                            className="nav-menu">
                            {navItems.map((item, index) => (
                                <Fragment key={item.key}>
                                    {item.element}
                                    {dividerAfter.has(item.key) && index < navItems.length - 1 && (
                                        <NavDivider />
                                    )}
                                </Fragment>
                            ))}
                        </Flex>
                    </Flex>
                </Flex>
                <Flex fillWidth justifyContent="flex-end" alignItems="center" className="header-right">
                    <Flex
                        paddingRight="12"
                        justifyContent="flex-end" alignItems="center"
                        textVariant="body-default-s"
                        gap="20"
                        className="header-controls">
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}