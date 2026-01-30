"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { usePathname } from '@/i18n/routing';
import { routes, protectedRoutes } from '@/app/resources';
import { routing } from '@/i18n/routing';
import { Flex, Spinner, Input, Button, Heading } from '@/once-ui/components';

interface RouteGuardProps {
    children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
    const pathname = usePathname();
    const [isRouteEnabled, setIsRouteEnabled] = useState(false);
    const [isPasswordRequired, setIsPasswordRequired] = useState(false);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const performChecks = async () => {
            setLoading(true);
            setIsRouteEnabled(false);
            setIsPasswordRequired(false);
            setIsAuthenticated(false);

            const checkRouteEnabled = () => {
                if (!pathname) return false;

                // Strip locale prefix for checking (e.g. /en/blog -> /blog)
                const segments = pathname.split('/').filter(Boolean);
                const locales = routing.locales;
                const pathWithoutLocale = segments[0] && locales.includes(segments[0])
                    ? '/' + segments.slice(1).join('/')
                    : pathname;
                const basePath = '/' + (pathWithoutLocale?.split('/').filter(Boolean)[0] || '');

                if (basePath in routes) {
                    return routes[basePath as keyof typeof routes];
                }

                // Dynamic routes: /projects/slug, /blog/slug
                if (pathWithoutLocale?.startsWith('/projects') && routes['/projects']) return true;
                if (pathWithoutLocale?.startsWith('/blog') && routes['/blog']) return true;
                if (pathWithoutLocale?.startsWith('/gallery') && routes['/gallery']) return true;

                return false;
            };

            const routeEnabled = checkRouteEnabled();
            setIsRouteEnabled(routeEnabled);

            if (protectedRoutes[pathname as keyof typeof protectedRoutes]) {
                setIsPasswordRequired(true);

                const response = await fetch('/api/check-auth');
                if (response.ok) {
                    setIsAuthenticated(true);
                }
            }

            setLoading(false);
        };

        performChecks();
    }, [pathname]);

    const handlePasswordSubmit = async () => {
        const response = await fetch('/api/authenticate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            setIsAuthenticated(true);
            setError(undefined);
        } else {
            setError('Incorrect password');
        }
    };

    if (loading) {
        return (
        <Flex fillWidth paddingY="128" justifyContent="center">
            <Spinner />
        </Flex>
        );
    }

    if (!isRouteEnabled) {
        notFound();
    }

    if (isPasswordRequired && !isAuthenticated) {
        return (
        <Flex
            fillWidth paddingY="128" maxWidth={24} gap="24"
            justifyContent="center" direction="column" alignItems="center">
            <Heading align="center" wrap="balance">
                This page is password protected
            </Heading>
            <Input
                id="password"
                type="password"
                label="Enter password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError(undefined);
                }}
                error={error}/>
            <Button onClick={handlePasswordSubmit} size="l">
                Submit
            </Button>
        </Flex>
        );
    }

    return <>{children}</>;
};

export { RouteGuard };