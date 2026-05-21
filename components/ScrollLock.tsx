'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Strict no-scroll rule (per user directive 2026-05-21):
 *   "hic bir sekilde hic bir web sayfasinda assagi kayma istemiyoruz
 *    malzeme katolog sayfasi haric"
 *
 * Only the supply catalog and the staff admin/portal/auth flows ever
 * let the body scroll. Every other page must lay out inside one
 * viewport, using lm-screen + lm-screen-body for any internal panel
 * scroll that's still required (legal docs, knowledge posts).
 */
const SCROLL_ALLOWED_PREFIXES = ['/supply', '/admin', '/portal', '/login', '/auth'];

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
