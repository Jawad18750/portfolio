"use client";

import { AvatarGroup, Flex, Heading, RevealFx, SmartImage, SmartLink, Text } from "@/once-ui/components";
import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';

interface ProjectCardProps {
    href: string;
    images: string[];
    title: string;
    content: string;
    description: string;
    avatars: { src: string }[];
    link: string;
    priority?: boolean;
    /** Stagger offset in ms - each card gets different start delay for auto-switch */
    staggerIndex?: number;
}

const AUTO_SWITCH_INTERVAL = 4500; // ms per image - not too quick
const STAGGER_OFFSET = 800; // ms between each card's first switch

export const ProjectCard: React.FC<ProjectCardProps> = ({
    href,
    images = [],
    title,
    content,
    description,
    avatars,
    link,
    priority = false,
    staggerIndex = 0,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const t = useTranslations();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Auto-switch images infinitely with staggered timing per card
    useEffect(() => {
        if (images.length <= 1) return;

        const initialDelay = staggerIndex * STAGGER_OFFSET;
        let intervalId: ReturnType<typeof setInterval> | null = null;

        const switchToNext = () => {
            setIsTransitioning(false);
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % images.length);
                setIsTransitioning(true);
            }, 630);
        };

        const startTimer = setTimeout(() => {
            intervalId = setInterval(switchToNext, AUTO_SWITCH_INTERVAL);
        }, initialDelay);

        return () => {
            clearTimeout(startTimer);
            if (intervalId) clearInterval(intervalId);
        };
    }, [images.length, staggerIndex]);

    const handleImageClick = () => {
        if(images.length > 1) {
            setIsTransitioning(false);
            const nextIndex = (activeIndex + 1) % images.length;
            handleControlClick(nextIndex);

        }
    };

    const handleControlClick = (index: number) => {
        if (index !== activeIndex) {
            setIsTransitioning(false);
            setTimeout(() => {
                setActiveIndex(index);
                setIsTransitioning(true);
            }, 630);
        }
    };

    return (
        <Flex
            fillWidth gap="m"
            direction="column">
            {images[activeIndex] && <Flex onClick={handleImageClick}>
                <RevealFx
                    style={{width: '100%'}}
                    delay={0.4}
                    trigger={isTransitioning}
                    speed="fast">
                    <SmartImage
                        tabIndex={0}
                        radius="l"
                        alt={title}
                        aspectRatio="16 / 9"
                        src={images[activeIndex]}
                        priority={priority}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{
                            border: '1px solid var(--neutral-alpha-weak)',
                            ...(images.length > 1 && {
                                cursor: 'pointer',
                            }),
                        }}/>
                </RevealFx>
            </Flex>}
            {images.length > 1 && (
                <Flex
                    gap="4" paddingX="s"
                    fillWidth
                    justifyContent="center"
                    className="image-controls">
                    {images.map((_, index) => (
                        <Flex
                            key={index}
                            onClick={() => handleControlClick(index)}
                            style={{
                                background: activeIndex === index
                                    ? 'var(--neutral-on-background-strong)'
                                    : 'var(--neutral-alpha-medium)',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease',
                            }}
                            fillWidth
                            height="2">
                        </Flex>
                    ))}
                </Flex>
            )}
            <Flex
                mobileDirection="column"
                fillWidth paddingX="s" paddingTop="12" paddingBottom="24" gap="l">
                {title && (
                    <Flex
                        flex={5}>
                        <Heading
                            as="h2"
                            wrap="balance"
                            variant="heading-strong-l">
                            {title}
                        </Heading>
                    </Flex>
                )}
                {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
                    <Flex
                        flex={7} direction="column"
                        gap="16">
                        {description?.trim() && (
                            <Text
                                wrap="balance"
                                variant="body-default-s"
                                onBackground="neutral-weak">
                                {description}
                            </Text>
                        )}
                        <Flex gap="24" wrap alignItems="center">
                            {avatars?.length > 0 && (
                                <AvatarGroup
                                    avatars={avatars}
                                    size="m"
                                    reverseOrder/>
                            )}
                            {content?.trim() && (
                                <SmartLink
                                    suffixIcon="arrowRight"
                                    style={{margin: '0', width: 'fit-content'}}
                                    href={href}>
                                        <Text
                                            variant="body-default-s">
                                        {t("projectCard.label")}
                                        </Text>
                                </SmartLink>
                            )}
                            {link && (
                                <SmartLink
                                    suffixIcon="arrowUpRightFromSquare"
                                    style={{ margin: "0", width: "fit-content" }}
                                    href={link}>
                                    <Text variant="body-default-s">{t("projectCard.link")}</Text>
                                </SmartLink>
                            )}
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};
