import type { Metadata } from 'next';
import UnlistedClient from './UnlistedClient';

export const metadata: Metadata = {
  title: 'Unlisted Part Request — Marine Supply',
  description: 'Can\'t find the part in our catalog? Send the part number, photo, or nameplate — we go look.',
  alternates: { canonical: '/supply/unlisted-request' }
};

export default function Page() {
  return (
    <div className="container-x py-12 md:py-16">
      <nav className="text-[12px] font-mono text-ink-subtle mb-4">
        <a href="/" className="hover:text-amber-600 no-underline">Home</a>
        <span className="mx-2">/</span>
        <a href="/supply" className="hover:text-amber-600 no-underline">Supply</a>
        <span className="mx-2">/</span>
        <span>Unlisted</span>
      </nav>
      <div className="kicker mb-3">Unlisted item</div>
      <h1 className="mb-3">Can&apos;t find the part?</h1>
      <p className="text-ink-muted max-w-2xl mb-10">Send a photo, the part number, or describe the nameplate. Our supplier network covers brands not in this catalog.</p>
      <UnlistedClient />
    </div>
  );
}
