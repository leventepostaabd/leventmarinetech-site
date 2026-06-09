'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { changeOwnPassword, createUser, setUserRole, setUserPassword, deleteUser } from './_actions';

type U = { id: string; email: string | null; full_name: string | null; role: string; created_at: string };

export default function AccountClient({ meId, meEmail, users }: { meId: string; meEmail: string; users: U[] }) {
  const router = useRouter();

  // ── change own password ──
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwState, setPwState] = useState<{ ok?: string; err?: string; busy?: boolean }>({});

  async function savePw() {
    setPwState({ busy: true });
    if (pw !== pw2) { setPwState({ err: 'Şifreler aynı değil' }); return; }
    try {
      await changeOwnPassword(pw);
      setPw(''); setPw2('');
      setPwState({ ok: 'Şifreniz güncellendi. Bir dahaki girişte bunu kullanın.' });
    } catch (e) {
      setPwState({ err: e instanceof Error ? e.message : 'Hata' });
    }
  }

  // ── add user ──
  const [nu, setNu] = useState({ email: '', password: '', full_name: '', role: 'admin' as 'admin' | 'guest' });
  const [nuState, setNuState] = useState<{ ok?: string; err?: string; busy?: boolean }>({});

  async function addUser() {
    setNuState({ busy: true });
    try {
      await createUser(nu);
      setNu({ email: '', password: '', full_name: '', role: 'admin' });
      setNuState({ ok: 'Kullanıcı oluşturuldu.' });
      router.refresh();
    } catch (e) {
      setNuState({ err: e instanceof Error ? e.message : 'Hata' });
    }
  }

  async function resetUserPw(u: U) {
    const np = prompt(`${u.email} için yeni şifre (en az 8 karakter):`);
    if (!np) return;
    try { await setUserPassword(u.id, np); alert('Şifre güncellendi.'); }
    catch (e) { alert(e instanceof Error ? e.message : 'Hata'); }
  }
  async function toggleRole(u: U) {
    try { await setUserRole(u.id, u.role === 'admin' ? 'guest' : 'admin'); router.refresh(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Hata'); }
  }
  async function remove(u: U) {
    if (!confirm(`${u.email} kullanıcısını silmek istediğinize emin misiniz?`)) return;
    try { await deleteUser(u.id); router.refresh(); }
    catch (e) { alert(e instanceof Error ? e.message : 'Hata'); }
  }

  return (
    <div className="max-w-3xl">
      <div className="kicker">Admin</div>
      <h2 className="text-[20px] mt-0.5 mb-5">Hesap & Kullanıcılar</h2>

      {/* Change own password */}
      <section className="card mb-6">
        <h3 className="text-[16px] font-bold mb-1">Şifremi değiştir</h3>
        <p className="text-[12.5px] text-ink-muted mb-3">Giriş: <span className="font-mono">{meEmail}</span></p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Yeni şifre</span>
            <input className="lm-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
          </label>
          <label className="block">
            <span className="field-label">Yeni şifre (tekrar)</span>
            <input className="lm-input" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
          </label>
        </div>
        {pwState.err && <p className="mt-2 text-[13px] text-red-700">{pwState.err}</p>}
        {pwState.ok && <p className="mt-2 text-[13px] text-green-700">{pwState.ok}</p>}
        <button className="btn-accent btn-md mt-3" onClick={savePw} disabled={pwState.busy || pw.length < 8}>Şifreyi kaydet</button>
      </section>

      {/* Add user */}
      <section className="card mb-6">
        <h3 className="text-[16px] font-bold mb-3">Yeni kullanıcı ekle</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">E-posta</span>
            <input className="lm-input" type="email" value={nu.email} onChange={(e) => setNu({ ...nu, email: e.target.value })} />
          </label>
          <label className="block">
            <span className="field-label">Ad (opsiyonel)</span>
            <input className="lm-input" value={nu.full_name} onChange={(e) => setNu({ ...nu, full_name: e.target.value })} />
          </label>
          <label className="block">
            <span className="field-label">Başlangıç şifresi</span>
            <input className="lm-input" value={nu.password} onChange={(e) => setNu({ ...nu, password: e.target.value })} placeholder="en az 8 karakter" />
          </label>
          <label className="block">
            <span className="field-label">Rol</span>
            <select className="lm-input" value={nu.role} onChange={(e) => setNu({ ...nu, role: e.target.value as 'admin' | 'guest' })}>
              <option value="admin">Admin (tam erişim)</option>
              <option value="guest">Guest (erişim yok)</option>
            </select>
          </label>
        </div>
        {nuState.err && <p className="mt-2 text-[13px] text-red-700">{nuState.err}</p>}
        {nuState.ok && <p className="mt-2 text-[13px] text-green-700">{nuState.ok}</p>}
        <button className="btn-accent btn-md mt-3" onClick={addUser} disabled={nuState.busy}>Kullanıcı oluştur</button>
        <p className="mt-2 text-[12px] text-ink-subtle">Onay e-postası gerekmez — kullanıcı bu e-posta + başlangıç şifresiyle direkt girer.</p>
      </section>

      {/* User list */}
      <section>
        <h3 className="text-[16px] font-bold mb-3">Kullanıcılar</h3>
        <div className="overflow-x-auto rounded-lg ring-1 ring-line">
          <table className="w-full min-w-[620px] text-[13px]">
            <thead className="bg-navy-50/60 text-left font-mono text-[10.5px] uppercase tracking-wide text-ink-subtle">
              <tr><th className="px-3 py-2">E-posta</th><th className="px-3 py-2">Rol</th><th className="px-3 py-2 text-right">İşlemler</th></tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-navy-50/40">
                  <td className="px-3 py-2">
                    {u.email}{u.id === meId && <span className="ml-1 text-[11px] text-amber-700">(siz)</span>}
                    {u.full_name && <div className="text-[11.5px] text-ink-subtle">{u.full_name}</div>}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 font-mono text-[10.5px] uppercase ${u.role === 'admin' ? 'bg-green-50 text-green-700' : 'bg-navy-50 text-ink-muted'}`}>{u.role}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap justify-end gap-1">
                      <button className="btn-ghost btn-sm" onClick={() => resetUserPw(u)}>Şifre ata</button>
                      {u.id !== meId && <button className="btn-ghost btn-sm" onClick={() => toggleRole(u)}>{u.role === 'admin' ? '→ Guest' : '→ Admin'}</button>}
                      {u.id !== meId && <button className="btn-ghost btn-sm text-red-600" onClick={() => remove(u)}>Sil</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
