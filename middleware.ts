import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const LOCALE_COOKIE = 'lm.locale';
const LOCALE_MANUAL_COOKIE = 'lm.locale.manual';

/**
 * Determine the auto-detected locale from Vercel's geo headers.
 * - TR country (Türkiye) → 'tr'
 * - everything else      → 'en'
 *
 * Vercel injects geo on `request.geo` in Edge runtime. We also read the
 * `x-vercel-ip-country` header as a fallback (works on most Edge deployments).
 */
function detectLocaleFromGeo(request: NextRequest): 'en' | 'tr' {
  const country =
    (request as unknown as { geo?: { country?: string } }).geo?.country ||
    request.headers.get('x-vercel-ip-country') ||
    '';
  return country.toUpperCase() === 'TR' ? 'tr' : 'en';
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // ----------------------------------------------------------------------
  // 1. Locale auto-detection (Vercel geo headers).
  //    Only set the cookie if neither an explicit value nor a manual-override
  //    flag is already present, so the user's manual choice always wins.
  // ----------------------------------------------------------------------
  const hasExplicitLocale = !!request.cookies.get(LOCALE_COOKIE)?.value;
  const hasManualOverride = request.cookies.get(LOCALE_MANUAL_COOKIE)?.value === '1';

  if (!hasExplicitLocale && !hasManualOverride) {
    const detected = detectLocaleFromGeo(request);
    response.cookies.set({
      name: LOCALE_COOKIE,
      value: detected,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax'
    });
  }

  // ----------------------------------------------------------------------
  // 2. Supabase session refresh (admin pages stay authed).
  // ----------------------------------------------------------------------
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        }
      }
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|.*\\.svg|.*\\.jpg|.*\\.png).*)']
};
