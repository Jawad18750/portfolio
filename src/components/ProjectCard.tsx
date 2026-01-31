"use client";

import { AvatarGroup, Flex, Heading, RevealFx, SmartImage, SmartLink, Text } from "@/once-ui/components";
import { useCallback, useEffect, useRef, useState } from "react";
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
}

const SWIPE_THRESHOLD = 50;

export const ProjectCard: React.FC<ProjectCardProps> = ({
    href,
    images = [],
    title,
    content,
    description,
    avatars,
    link,
    priority = false,
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

    const touchStartX = useRef<number>(0);

    const goToIndex = useCallback((index: number) => {
        if (index !== activeIndex && index >= 0 && index < images.length) {
            setIsTransitioning(false);
            setTimeout(() => {
                setActiveIndex(index);
                setIsTransitioning(true);
            }, 630);
        }
    }, [activeIndex, images.length]);

    const handleSwipe = useCallback((deltaX: number) => {
        if (images.length <= 1) return;
        if (deltaX < -SWIPE_THRESHOLD) {
            goToIndex((activeIndex + 1) % images.length);
        } else if (deltaX > SWIPE_THRESHOLD) {
            goToIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
        }
    }, [activeIndex, images.length, goToIndex]);

    const handleImageClick = () => {
        if (images.length > 1) {
            goToIndex((activeIndex + 1) % images.length);
        }
    };

    const handleControlClick = (index: number) => {
        goToIndex(index);
    };

    return (
        <Flex
            fillWidth gap="m"
            direction="column">
            {images[activeIndex] && (
                <Flex
                    onClick={handleImageClick}
                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                    onTouchEnd={(e) => {
                        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
                        handleSwipe(deltaX);
                    }}
                >
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
            </Flex>
            )}
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
