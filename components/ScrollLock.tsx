'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Locks body scroll on every route except inventory / long-form content
 * surfaces (the supply catalog by explicit rule, plus admin/portal where
 * staff need it). Honours the "single page, no scroll" design rule the
 * rest of the site is built on.
 */
const SCROLL_ALLOWED_PREFIXES = [
  '/supply',
  '/admin',
  '/portal',
  '/login',
  '/auth',
  '/knowledge',
  '/privacy',
  '/terms',
  '/cookie-policy',
  '/accessibility-statement',
  '/about' // long-form SEO profile — locked single-viewport would gut it
];

export default function ScrollLock() {
  const pathname = usePathname() || '/';

  useEffect(() => {
    const allow = SCROLL_ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));
    const cls = 'lm-no-scroll';
    if (allow) {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    } else {
      document.documentElement.classList.add(cls);
      document.body.classList.add(cls);
    }
    return () => {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    };
  }, [pathname]);

  return null;
}
