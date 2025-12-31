"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Flex, ToggleButton } from "@/once-ui/components"
import styles from '@/components/Header.module.scss'

import { routes, display } from '@/app/resources'

import { routing } from '@/i18n/routing';
import { Locale, usePathname, useRouter } from '@/i18n/routing';
import { renderContent } from "@/app/resources";
import { useTranslations } from "next-intl";
import { i18n } from "@/app/resources/config";

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

export const Header = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname() ?? '';
    const params = useParams();
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

    function handleLanguageChange(locale: string) {
        const nextLocale = locale as Locale;
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
    const { person, home, about, work } = renderContent(t);

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
                        background="surface" border="neutral-medium" borderStyle="solid-1" radius="m-4" shadow="l"
                        padding="4"
                        justifyContent="center">
                        <Flex
                            gap="4"
                            textVariant="body-default-s"
                            className="nav-menu">
                            { routes['/'] && (
                                <ToggleButton
                                    prefixIcon="home"
                                    href={`/${params?.locale}`}
                                    selected={pathname === "/"}>
                                </ToggleButton>
                            )}
                            { routes['/about'] && (
                                <ToggleButton
                                    prefixIcon="person"
                                    href={`/${params?.locale}/about`}
                                    selected={pathname === "/about"}>
                                    <Flex paddingX="2" hide="s">{about.label}</Flex>
                                </ToggleButton>
                            )}
                            { routes['/work'] && (
                                <ToggleButton
                                    prefixIcon="grid"
                                    href={`/${params?.locale}/work`}
                                    selected={pathname.startsWith('/work')}>
                                    <Flex paddingX="2" hide="s">{work.label}</Flex>
                                </ToggleButton>
                            )}
                            {routing.locales.length > 1 && (
                                <ToggleButton
                                    prefixIcon="globe"
                                    selected={false}
                                    size="s"
                                    onClick={() => handleLanguageChange(params?.locale === 'en' ? 'ar' : 'en')}
                                    className={isPending ? 'pointer-events-none opacity-60' : ''}
                                />
                            )}
                            <ToggleButton
                                prefixIcon={isDarkMode ? "moon" : "sun"}
                                selected={false}
                                size="s"
                                onClick={handleThemeToggle}
                                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                            />
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