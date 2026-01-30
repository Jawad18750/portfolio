'use client';

import React from 'react';
import Image from 'next/image';

type Locale = 'en' | 'ar';

type AppBadgesProps = {
  locale?: Locale;
  appStoreUrl?: string;
  playStoreUrl?: string;
  className?: string;
};

const BADGE_HEIGHT = 40;

export function AppBadges({
  locale = 'en',
  appStoreUrl,
  playStoreUrl,
  className = '',
}: AppBadgesProps) {
  const appStoreBadge = locale === 'ar' ? '/images/app-store-ar.svg' : '/images/app-store-en.svg';
  const playStoreBadge = locale === 'ar' ? '/images/google-play-ar.svg' : '/images/google-play-en.svg';

  const badgeClass = 'transition-opacity duration-200 hover:opacity-80';

  return (
    <div
      className={`flex flex-wrap items-center gap-4 my-6 ${className}`}
      style={{ gap: 'var(--static-space-16)' }}
    >
      {appStoreUrl && (
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download on the App Store"
          className={badgeClass}
        >
          <Image
            src={appStoreBadge}
            alt="Download on the App Store"
            height={BADGE_HEIGHT}
            width={120}
            unoptimized
            style={{ height: BADGE_HEIGHT, width: 'auto' }}
          />
        </a>
      )}
      {playStoreUrl && (
        <a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Get it on Google Play"
          className={badgeClass}
        >
          <Image
            src={playStoreBadge}
            alt="Get it on Google Play"
            height={BADGE_HEIGHT}
            width={135}
            unoptimized
            style={{ height: BADGE_HEIGHT, width: 'auto' }}
          />
        </a>
      )}
    </div>
  );
}
