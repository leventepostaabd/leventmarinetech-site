import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } };

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="container-x py-20">
      <div className="max-w-md">
        <div className="kicker mb-3">Authorized portal</div>
        <h1 className="mb-3">Sign in</h1>
        <p className="text-ink-muted mb-6 text-[14.5px]">
          Magic-link only — no passwords. Use the same email your superintendent or class team has on file. We'll mail you a link that signs you in.
        </p>
        <LoginClient nextPath={searchParams.next ?? '/admin'} />
      </div>
    </div>
  );
}
