'use client';

import React from 'react';
import { Flex, Icon } from '@/once-ui/components';

interface StarRatingProps {
    rating: number; // 1-5 stars
    size?: 's' | 'm' | 'l';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'm' }) => {
    return (
        <Flex gap="2" alignItems="center">
            {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                    key={star}
                    name="star"
                    size={size}
                    onBackground={star <= rating ? "brand-weak" : "neutral-weak"}
                />
            ))}
        </Flex>
    );
};

export { StarRating };