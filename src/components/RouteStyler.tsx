"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const normalizeRouteKey = (pathname: string) => {
  if (!pathname) return "home";
  const segments = pathname.split("/").filter(Boolean);
  const locales = routing.locales;
  if (segments.length && locales.includes(segments[0])) {
    segments.shift();
  }
  const key = segments[0] ?? "home";
  if (key.length === 0) return "home";
  return key;
};

export const RouteStyler = () => {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const key = normalizeRouteKey(pathname);
    document.body.dataset.routeKey = key;
    return () => {
      delete document.body.dataset.routeKey;
    };
  }, [pathname]);

  return null;
};
