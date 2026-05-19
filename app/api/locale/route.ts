import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { locale, returnTo } = await req.json().catch(() => ({}));
  const valid = locale === 'en' || locale === 'tr' ? locale : 'en';
  const res = NextResponse.json({ ok: true, locale: valid });
  res.cookies.set('lm.locale', valid, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  });
  if (typeof returnTo === 'string') res.headers.set('X-Next-Return', returnTo);
  return res;
}
