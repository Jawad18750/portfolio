type Locale = 'en' | 'ar';

export function formatDate(date: string, includeRelative = false, locale: Locale = 'en') {
    const currentDate = new Date();

    if (!date.includes('T')) {
        date = `${date}T00:00:00`;
    }

    const targetDate = new Date(date);
    const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
    const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
    const daysAgo = currentDate.getDate() - targetDate.getDate();

    const localeMap = {
        en: { yAgo: 'y ago', moAgo: 'mo ago', dAgo: 'd ago', today: 'Today' },
        ar: { yAgo: ' سنة', moAgo: ' شهر', dAgo: ' يوم', today: 'اليوم' },
    };
    const t = localeMap[locale];

    let formattedDate = '';

    if (yearsAgo > 0) {
        formattedDate = `${yearsAgo}${t.yAgo}`;
    } else if (monthsAgo > 0) {
        formattedDate = `${monthsAgo}${t.moAgo}`;
    } else if (daysAgo > 0) {
        formattedDate = `${daysAgo}${t.dAgo}`;
    } else {
        formattedDate = t.today;
    }

    const localeForDate = locale === 'ar' ? 'ar-LY' : 'en-US';
    const fullDate = targetDate.toLocaleString(localeForDate, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    if (!includeRelative) {
        return fullDate;
    }

    return `${fullDate} (${formattedDate})`;
}