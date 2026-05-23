import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } };

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div
      className="container-x"
      style={{ paddingTop: 'calc(var(--lm-topbar-h, 56px) + 4rem)', paddingBottom: '4rem' }}
    >
      <div className="max-w-md">
        <div className="kicker mb-3">Authorized portal</div>
        <h1 className="mb-3">Sign in</h1>
        <p className="text-ink-muted mb-6 text-[14.5px]">
          Admin access only. If you forgot your password, click <em>Forgot password</em> — we email a
          reset link to the inbox on file.
        </p>
        <LoginClient nextPath={searchParams.next ?? '/admin'} />
      </div>
    </div>
  );
}
