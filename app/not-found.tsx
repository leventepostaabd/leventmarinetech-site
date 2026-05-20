import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <div className="kicker mb-4 inline-flex">Error · 404</div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-3">Off-course.</h1>
      <p className="text-ink-muted text-[17px] max-w-md mx-auto mb-8">The page you were looking for is not aboard this vessel. Let's get you back to a known port.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-primary btn-lg">Back to home</Link>
        <Link href="/contact" className="btn-ghost btn-lg">Contact us</Link>
        <a href="tel:+16193840403" className="btn-ghost btn-lg">Call 24/7</a>
      </div>
    </div>
  );
}
