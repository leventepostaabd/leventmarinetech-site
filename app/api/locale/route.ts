import { NextResponse } from 'next/server';

const LOCALES = ['en', 'tr', 'el', 'es', 'de'];

export async function POST(req: Request) {
  const { locale, returnTo } = await req.json().catch(() => ({}));
  const valid = LOCALES.includes(locale) ? locale : 'en';
  const res = NextResponse.json({ ok: true, locale: valid });
  res.cookies.set('lm.locale', valid, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  });
  if (typeof returnTo === 'string') res.headers.set('X-Next-Return', returnTo);
  return res;
}
