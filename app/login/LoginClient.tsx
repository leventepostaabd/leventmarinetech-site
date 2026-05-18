'use client';
import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export default function LoginClient({ nextPath }: { nextPath: string }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
        }
      });
      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      setErr(e?.message ?? 'Could not send magic link.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) return (
    <div className="card border-l-4 border-l-green-600">
      <h2 className="text-xl mb-2">Check your inbox.</h2>
      <p className="text-ink-muted text-[14.5px]">We sent a sign-in link to <strong className="font-mono">{email}</strong>. Click it to come back here.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="field-label">Work email</label>
      <input className="field-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="superintendent@company.com" />
      {err && <div className="font-mono text-[12.5px] text-red-600">{err}</div>}
      <button type="submit" disabled={busy} className="btn-primary btn-md w-fit disabled:opacity-60">{busy ? 'Sending…' : 'Send magic link'}</button>
    </form>
  );
}
