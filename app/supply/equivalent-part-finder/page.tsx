import type { Metadata } from 'next';
import EquivalentClient from './EquivalentClient';

export const metadata: Metadata = {
  title: 'Equivalent Part Finder — Marine Supply',
  description: 'If the exact item is obsolete or unavailable, we identify a compatible replacement or equivalent spare with an engineering note.',
  alternates: { canonical: '/supply/equivalent-part-finder' }
};

export default function Page() {
  return (
    <div className="container-x py-12 md:py-16">
      <nav className="text-[12px] font-mono text-ink-subtle mb-4">
        <a href="/" className="hover:text-amber-600 no-underline">Home</a>
        <span className="mx-2">/</span>
        <a href="/supply" className="hover:text-amber-600 no-underline">Supply</a>
        <span className="mx-2">/</span>
        <span>Equivalent finder</span>
      </nav>
      <div className="kicker mb-3">Cross-reference desk</div>
      <h1 className="mb-3">Find an equivalent or compatible part.</h1>
      <p className="text-ink-muted max-w-2xl mb-2">If the exact item is obsolete or unavailable, we propose a compatible replacement or equivalent spare.</p>
      <p className="text-ink-subtle text-[13.5px] max-w-2xl mb-10">Every equivalent comes with an engineering note documenting where it matches the original and where it differs — so your superintendent has a paper trail.</p>
      <EquivalentClient />
    </div>
  );
}
