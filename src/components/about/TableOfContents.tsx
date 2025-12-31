'use client';

import React from 'react';
import { Flex, Text } from '@/once-ui/components';
import styles from './about.module.scss';

interface TableOfContentsProps {
    structure: {
        title: string;
        display: boolean;
        items: string[];
    }[];
    about: {
        tableOfContent: {
            display: boolean;
            subItems: boolean;
        };
    };
    locale?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about, locale }) => {
    const isRTL = locale === 'ar';


    if (!about.tableOfContent.display) return null;

    const scrollTo = (id: string, offset: number) => {
        const element = document.getElementById(id);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    if (!about.tableOfContent.display) return null;

    return (
        <Flex
            fillWidth
            direction="column"
            gap="32"
            className="table-of-contents">
            {structure
                .filter(section => section.display)
                .map((section, sectionIndex) => (
                <Flex key={sectionIndex} gap="12" direction="column">
                    <Flex
                        style={{ cursor: 'pointer' }}
                        className={styles.hover}
                        gap="8"
                        alignItems="center"
                        onClick={() => scrollTo(section.title, 80)}>
                        <Flex
                            height="1" minWidth="16"
                            background="neutral-strong">
                        </Flex>
                        <Text>
                            {section.title}
                        </Text>
                    </Flex>
                    {about.tableOfContent.subItems && (
                        <>
                            {section.items.map((item, itemIndex) => (
                                <Flex
                                    hide="l"
                                    key={itemIndex}
                                    style={{ cursor: 'pointer' }}
                                    className={styles.hover}
                                    gap="12"
                                    paddingLeft={isRTL ? "0" : "12"}
                                    paddingRight={isRTL ? "12" : "0"}
                                    alignItems="center"
                                    onClick={() => scrollTo(item, 80)}>
                                    <Flex
                                        height="1" minWidth="8"
                                        background="neutral-strong">
                                    </Flex>
                                    <Text>
                                        {item}
                                    </Text>
                                </Flex>
                            ))}
                        </>
                    )}
                </Flex>
            ))}
        </Flex>
    );
};

export default TableOfContents;