'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export default function LoginClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setBusy(true);
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(nextPath);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? 'Could not sign in.');
      setBusy(false);
    }
  }

  async function sendReset() {
    setErr(null);
    setInfo(null);
    if (!email) {
      setErr('Enter your email first, then click reset.');
      return;
    }
    setBusy(true);
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
      });
      if (error) throw error;
      setInfo('Password reset link sent. Check your inbox and set a new password.');
    } catch (e: any) {
      setErr(e?.message ?? 'Could not send reset email.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="field-label">Email</label>
      <input
        className="field-input"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@leventmarinetech.com"
        autoComplete="email"
      />
      <label className="field-label">Password</label>
      <input
        className="field-input"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {err && <div className="font-mono text-[12.5px] text-red-600">{err}</div>}
      {info && <div className="font-mono text-[12.5px] text-green-700">{info}</div>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="btn-primary btn-md disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={sendReset}
          disabled={busy}
          className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-amber-600 hover:text-amber disabled:opacity-50"
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
}
