import { InlineCode } from "@/once-ui/components";

const createI18nContent = (t) => {
    const person = {
        firstName: t("person.firstName"),
        lastName:  t("person.lastName"),
        get name() {
            return `${this.firstName} ${this.lastName}`;
        },
        role:      t("person.role"),
        avatar:    '/images/avatar.svg',
        location:  t("person.location"),        // IANA time zone identifier, e.g., 'Africa/Tripoli'
        languages: [t("person.languages.english"), t("person.languages.arabic")]  // optional: Leave the array empty if you don't want to display languages
    }

    const newsletter = {
        display: true,
        title: <>{t("newsletter.title", {firstName: person.firstName})}</>,
        description: <>{t("newsletter.description")}</>
    }

    const contact = {
        display: true,
        label: t("contact.label"),
        title: <>{t("contact.title")}</>,
        description: <>{t("contact.description")}</>,
        channels: {
            email: t("contact.channels.email"),
            whatsapp: t("contact.channels.whatsapp")
        }
    }

    const social = [
        // Links are automatically displayed.
        // Import new icons in /once-ui/icons.ts
        {
            name: 'GitHub',
            icon: 'github',
            link: 'https://github.com/Jawad18750',
        },
        {
            name: 'LinkedIn',
            icon: 'linkedin',
            link: 'https://ly.linkedin.com/in/abdeljawad-almiladi-99a0a2208',
        },
        {
            name: 'Facebook',
            icon: 'facebook',
            link: 'https://www.facebook.com/profile.php?id=100084824989707',
        },
        {
            name: 'Instagram',
            icon: 'instagram',
            link: 'https://www.instagram.com/jawadalmiladi/',
        },
        {
            name: 'Email',
            icon: 'email',
            link: 'mailto:me@abdeljawad.com',
        },
    ]

    const home = {
        label: t("home.label"),
        title: t("home.title", {name: person.name}),
        description: t("home.description", {role: person.role}),
        headline: <>{t("home.headline")}</>,
        subline: <>{t("home.subline")}</>,
        featured: {
            display: true,
            title: <>{t("home.selectedWork")}</>,
            href: '/projects/shrimp-nation'
        }
    }

    const testimonials = [
        {
            id: 'testimonial-1',
            name: t("testimonials.0.name"),
            role: t("testimonials.0.role"),
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
            testimonial: t("testimonials.0.testimonial"),
            rating: 5,
            logos: [
                '/images/testimonials/alnawa-light.svg',
                '/images/testimonials/alnoor-light.svg',
                '/images/testimonials/alsamiya-light.svg',
                '/images/testimonials/shrimp-light.svg'
            ]
        },
        {
            id: 'testimonial-2',
            name: t("testimonials.1.name"),
            role: t("testimonials.1.role"),
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
            testimonial: t("testimonials.1.testimonial"),
            rating: 5,
            logos: [
                '/images/testimonials/eyfel-light.svg',
                '/images/testimonials/qrl-light.svg',
                '/images/testimonials/takamol-light.svg',
                '/images/testimonials/rawafid-light.svg'
            ]
        },
        {
            id: 'testimonial-3',
            name: t("testimonials.2.name"),
            role: t("testimonials.2.role"),
            avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
            testimonial: t("testimonials.2.testimonial"),
            rating: 5,
            logos: [
                '/images/testimonials/color-light.svg',
                '/images/testimonials/mero-light.svg',
                '/images/testimonials/titanium-light.svg',
                '/images/testimonials/39ertime-light.svg'
            ]
        },
        {
            id: 'testimonial-4',
            name: t("testimonials.3.name"),
            role: t("testimonials.3.role"),
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
            testimonial: t("testimonials.3.testimonial"),
            rating: 5,
            logos: [
                '/images/testimonials/deco-light.svg',
                '/images/testimonials/decora-light.svg',
                '/images/testimonials/alnokhba-light.svg',
                '/images/testimonials/alnabil-light.svg'
            ]
        },
        {
            id: 'testimonial-5',
            name: t("testimonials.4.name"),
            role: t("testimonials.4.role"),
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
            testimonial: t("testimonials.4.testimonial"),
            rating: 5,
            logos: [
                '/images/testimonials/firstelite-light.svg',
                '/images/testimonials/elemento-light.svg',
                '/images/testimonials/qrl-light.svg',
                '/images/testimonials/stay-healthy-light.svg'
            ]
        }
    ]

    // Combine all logos from all testimonials for global slider (deduplicated)
    const allLogos = [...new Set(testimonials.reduce((acc, testimonial) => {
        return testimonial.logos ? [...acc, ...testimonial.logos] : acc;
    }, []))];

    const about = {
        label: t("about.label"),
        title: t("about.title"),
        description: t("about.description", {name: person.name, role: person.role, location: person.location}),
        tableOfContent: {
            display: true,
            subItems: true
        },
        avatar: {
            display: true
        },
        calendar: {
            display: true,
            link: 'https://wa.me/218910170735'
        },
        intro: {
            display: true,
            title: t("about.intro.title"),
            description: <>{t("about.intro.description")}</>
        },
        work: {
            display: true, // set to false to hide this section
            title: t("about.work.title"),
            experiences: [
                {
                    company: 'Freelancing',
                    displayName: t("about.work.companies.Freelancing"),
                    timeframe: '2024 - Present',
                    role: 'App & Website Developer',
                    achievements: [
                        'Started developing applications alongside website design and development. To expand the scope of digital services I provide.'
                    ],
                    images: [ ]
                },
                {
                    company: 'Full-time Freelancing',
                    displayName: t("about.work.companies.Full-time Freelancing"),
                    timeframe: '2024 - 2023',
                    role: 'Website Developer',
                    achievements: [
                        'Started developing applications alongside website design and development. To expand the scope of digital services I provide.'
                    ],
                    images: [ ]
                },
                {
                    company: 'MyTeam',
                    displayName: t("about.work.companies.MyTeam"),
                    timeframe: '2023 - 2022',
                    role: 'Social Media Designer',
                    achievements: [
                        'Built a specialized team for managing social media accounts and client communication. Where I managed accounts for more than 6 companies at the same time.'
                    ],
                    images: [ ]
                },
                {
                    company: 'Decora',
                    displayName: t("about.work.companies.Decora"),
                    timeframe: '2022 - 2021',
                    role: 'Visual Identity Designer',
                    achievements: [
                        'Started developing applications alongside website design and development. To expand the scope of digital services I provide.'
                    ],
                    images: [ ]
                },
                {
                    company: 'FreelancerCom',
                    displayName: t("about.work.companies.FreelancerCom"),
                    timeframe: '2021',
                    role: 'Brand Identity Designer',
                    achievements: [
                        'Started as a brand identity designer on the platform. And worked with clients from Britain, Australia, and America.'
                    ],
                    images: [ ]
                }
            ]
        },
        studies: {
            display: false, // set to false to hide this section
            title: t("about.studies.title"),
            institutions: [
                {
                    name: 'University of Tripoli',
                    description: <>Studied Computer Science and Software Engineering.</>,
                },
                {
                    name: 'Online Learning Platforms',
                    description: <>Completed advanced courses in modern web development and cloud technologies.</>,
                }
            ]
        },
        technical: {
            display: true, // set to false to hide this section
            title: t("about.technical.title"),
            skills: [
                {
                    title: 'Frontend & UI Engineering',
                    description: 'description',
                    images: [],
                    icon: 'grid',
                    tags: [
                        { name: 'React', icon: 'react' },
                        { name: 'Next.js', icon: 'nextjs' },
                        { name: 'TypeScript', icon: 'typescript' },
                        { name: 'Tailwind CSS', icon: 'tailwindcss' },
                        { name: 'SCSS', icon: 'sass' },
                        { name: 'JavaScript', icon: 'javascript' },
                    ]
                },
                {
                    title: 'Backend & APIs',
                    description: 'description',
                    images: [],
                    icon: 'globe',
                    tags: [
                        { name: 'Node.js', icon: 'nodejs' },
                        { name: 'Express', icon: 'express' },
                        { name: 'REST APIs' },
                        { name: 'GraphQL', icon: 'graphql' },
                        { name: 'Python', icon: 'python' },
                    ]
                },
                {
                    title: 'Databases & System Architecture',
                    description: 'description',
                    images: [],
                    icon: 'clipboard',
                    tags: [
                        { name: 'PostgreSQL', icon: 'postgresql' },
                        { name: 'MongoDB', icon: 'mongodb' },
                        { name: 'Redis', icon: 'redis' },
                        { name: 'MySQL', icon: 'mysql' },
                        { name: 'Supabase', icon: 'supabase' },
                    ]
                },
                {
                    title: 'Server, Cloud & Deployment',
                    description: 'description',
                    images: [],
                    icon: 'arrowUpRightFromSquare',
                    tags: [
                        { name: 'Vercel', icon: 'vercel' },
                        { name: 'VPS' },
                        { name: 'Libyan Spider' },
                        { name: 'AWS', icon: 'aws' },
                        { name: 'Docker', icon: 'docker' },
                        { name: 'Nginx', icon: 'nginx' },
                        { name: 'GitHub Actions', icon: 'githubactions' },
                    ]
                },
                {
                    title: 'Performance, Analytics & Tracking',
                    description: 'description',
                    images: [],
                    icon: 'checkCircle',
                    tags: [
                        { name: 'Google Analytics', icon: 'googleanalytics' },
                        { name: 'GTM', icon: 'googletagmanager' },
                        { name: 'Lighthouse', icon: 'lighthouse' },
                        { name: 'Web Vitals' },
                    ]
                },
                {
                    title: 'Security & System Awareness',
                    description: 'description',
                    images: [],
                    icon: 'warningTriangle',
                    tags: [
                        { name: 'OAuth' },
                        { name: 'JWT', icon: 'jwt' },
                        { name: 'HTTPS/SSL' },
                        { name: 'Security Best Practices' },
                    ]
                }
            ]
        }
    }

    const blog = {
        label: t("blog.label"),
        title: t("blog.title"),
        description: t("blog.description", {name: person.name})
        // Create new blog posts by adding a new .mdx file to app/blog/posts
        // All posts will be listed on the /blog route
    }

    const work = {
        label: t("work.label"),
        title: t("work.title"),
        description: t("work.description", {name: person.name})
        // Create new project pages by adding a new .mdx file to app/blog/posts
        // All projects will be listed on the /home and /projects routes
    }

    const gallery = {
        label: t("gallery.label"),
        title: t("gallery.title"),
        description: t("gallery.description", {name: person.name}),
        // Images from https://pexels.com
        images: [
            {
                src: '/images/gallery/img-01.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-02.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            { 
                src: '/images/gallery/img-03.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            { 
                src: '/images/gallery/img-04.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-05.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-06.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-07.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-08.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-09.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-10.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            { 
                src: '/images/gallery/img-11.jpg',
                alt: 'image',
                orientation: 'vertical'
            },
            {
                src: '/images/gallery/img-12.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            {
                src: '/images/gallery/img-13.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
            { 
                src: '/images/gallery/img-14.jpg',
                alt: 'image',
                orientation: 'horizontal'
            },
        ]
    }
    return {
        person,
        social,
        newsletter,
        contact,
        home,
        about,
        blog,
        work,
        gallery,
        testimonials,
        allLogos
    }
};

export { createI18nContent };
