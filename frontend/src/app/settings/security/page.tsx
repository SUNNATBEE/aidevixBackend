'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '@api/authApi';
import {
  selectUser,
  selectIsLoggedIn,
  selectAuthLoading,
  checkAuthStatus,
} from '@store/slices/authSlice';

type DisableState = { open: boolean; password: string; code: string; submitting: boolean };
type RegenState = { open: boolean; code: string; submitting: boolean; codes: string[] | null };
type ChangePwState = { open: boolean; current: string; next: string; confirm: string; submitting: boolean };

export default function SecuritySettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const authLoading = useSelector(selectAuthLoading);

  const [disable, setDisable] = useState<DisableState>({ open: false, password: '', code: '', submitting: false });
  const [regen, setRegen] = useState<RegenState>({ open: false, code: '', submitting: false, codes: null });
  const [changePw, setChangePw] = useState<ChangePwState>({
    open: false, current: '', next: '', confirm: '', submitting: false,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.replace(`/login?next=${encodeURIComponent('/settings/security')}`);
    }
  }, [authLoading, isLoggedIn, router]);

  const isAdmin = user?.role === 'admin';
  const totpOn = !!user?.totpEnabled;

  const onDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disable.password || !disable.code) return;
    setDisable((s) => ({ ...s, submitting: true }));
    try {
      await authApi.disable2FA({ password: disable.password, code: disable.code });
      toast.success('2FA o\'chirildi');
      setDisable({ open: false, password: '', code: '', submitting: false });
      dispatch(checkAuthStatus() as any);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xato');
      setDisable((s) => ({ ...s, submitting: false }));
    }
  };

  const onRegen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regen.code) return;
    setRegen((s) => ({ ...s, submitting: true }));
    try {
      const { data } = await authApi.regenerateBackupCodes({ code: regen.code });
      setRegen({ open: true, code: '', submitting: false, codes: data.data.backupCodes });
      toast.success('Yangi backup kodlar yaratildi');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kod noto\'g\'ri');
      setRegen((s) => ({ ...s, submitting: false }));
    }
  };

  const onChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (changePw.next !== changePw.confirm) {
      toast.error('Yangi parollar mos emas');
      return;
    }
    setChangePw((s) => ({ ...s, submitting: true }));
    try {
      await authApi.changePassword({ currentPassword: changePw.current, newPassword: changePw.next });
      toast.success('Parol yangilandi. Qayta login qiling.');
      router.replace('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xato');
      setChangePw((s) => ({ ...s, submitting: false }));
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link href="/profile" className="text-sm text-gray-400 hover:text-white">← Profil</Link>
          <h1 className="text-3xl font-bold mt-2">Xavfsizlik</h1>
          <p className="text-gray-400 text-sm mt-1">Parol va ikki bosqichli himoyani boshqaring</p>
        </div>

        {/* Password */}
        <section className="bg-[#0d1224]/40 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold">Parol</h2>
              <p className="text-gray-400 text-sm">Hisobingiz parolini o&apos;zgartiring</p>
            </div>
            {!changePw.open && (
              <button
                onClick={() => setChangePw((s) => ({ ...s, open: true }))}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm"
              >
                O&apos;zgartirish
              </button>
            )}
          </div>

          {changePw.open && (
            <form onSubmit={onChangePw} className="space-y-3 mt-4">
              <input
                type="password" placeholder="Joriy parol"
                value={changePw.current}
                onChange={(e) => setChangePw((s) => ({ ...s, current: e.target.value }))}
                className="w-full bg-[#0A0E1A]/50 border border-white/10 rounded-xl px-4 py-3"
                autoComplete="current-password"
              />
              <input
                type="password" placeholder="Yangi parol"
                value={changePw.next}
                onChange={(e) => setChangePw((s) => ({ ...s, next: e.target.value }))}
                className="w-full bg-[#0A0E1A]/50 border border-white/10 rounded-xl px-4 py-3"
                autoComplete="new-password"
              />
              <input
                type="password" placeholder="Yangi parolni tasdiqlang"
                value={changePw.confirm}
                onChange={(e) => setChangePw((s) => ({ ...s, confirm: e.target.value }))}
                className="w-full bg-[#0A0E1A]/50 border border-white/10 rounded-xl px-4 py-3"
                autoComplete="new-password"
              />
              <div className="flex gap-2">
                <button
                  type="submit" disabled={changePw.submitting}
                  className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl disabled:opacity-50"
                >{changePw.submitting ? 'Saqlanmoqda...' : 'Saqlash'}</button>
                <button
                  type="button"
                  onClick={() => setChangePw({ open: false, current: '', next: '', confirm: '', submitting: false })}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
                >Bekor</button>
              </div>
            </form>
          )}
        </section>

        {/* 2FA */}
        <section className="bg-[#0d1224]/40 border border-white/5 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Ikki bosqichli autentifikatsiya</h2>
                {totpOn && <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">YOQILGAN</span>}
                {!totpOn && <span className="text-xs bg-zinc-500/20 text-zinc-300 px-2 py-0.5 rounded-full">O&apos;CHIRILGAN</span>}
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {isAdmin
                  ? 'Admin hisoblar uchun majburiy. O\'chirib bo\'lmaydi.'
                  : 'TOTP ilova (Google Authenticator, Authy, 1Password) orqali himoya'}
              </p>
            </div>
          </div>

          {!totpOn && (
            <Link
              href="/auth/2fa-setup"
              className="inline-block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm"
            >
              2FA ni yoqish
            </Link>
          )}

          {totpOn && (
            <div className="space-y-3 mt-4">
              <button
                onClick={() => setRegen({ open: true, code: '', submitting: false, codes: null })}
                className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm"
              >
                🔑 Backup kodlarni qayta yaratish
              </button>
              {!isAdmin && (
                <button
                  onClick={() => setDisable({ open: true, password: '', code: '', submitting: false })}
                  className="w-full text-left px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-sm text-rose-300"
                >
                  ⚠️ 2FA ni o&apos;chirish
                </button>
              )}
            </div>
          )}
        </section>

        {/* Disable modal */}
        {disable.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <form onSubmit={onDisable} className="w-full max-w-md bg-[#0d1224] border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg font-semibold">2FA ni o&apos;chirish</h3>
              <p className="text-sm text-gray-400">Joriy parolingiz va TOTP kodi (yoki backup kod) kerak.</p>
              <input
                type="password" placeholder="Joriy parol"
                value={disable.password}
                onChange={(e) => setDisable((s) => ({ ...s, password: e.target.value }))}
                className="w-full bg-[#0A0E1A]/50 border border-white/10 rounded-xl px-4 py-3"
                autoComplete="current-password"
              />
              <input
                type="text" placeholder="TOTP yoki backup kod"
                value={disable.code}
                onChange={(e) => setDisable((s) => ({ ...s, code: e.target.value.toUpperCase() }))}
                className="w-full bg-[#0A0E1A]/50 border border-white/10 rounded-xl px-4 py-3 font-mono"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={disable.submitting} className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 rounded-xl disabled:opacity-50">
                  {disable.submitting ? 'O\'chirilmoqda...' : 'O\'chirish'}
                </button>
                <button
                  type="button"
                  onClick={() => setDisable({ open: false, password: '', code: '', submitting: false })}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
                >Bekor</button>
              </div>
            </form>
          </div>
        )}

        {/* Regen backup codes modal */}
        {regen.open && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-[#0d1224] border border-white/10 rounded-2xl p-6 space-y-3">
              {!regen.codes && (
                <form onSubmit={onRegen} className="space-y-3">
                  <h3 className="text-lg font-semibold">Yangi backup kodlar</h3>
                  <p className="text-sm text-gray-400">TOTP kodingizni kiriting. Eski backup kodlar bekor qilinadi.</p>
                  <input
                    type="text" placeholder="000000" inputMode="numeric" maxLength={6}
                    value={regen.code}
                    onChange={(e) => setRegen((s) => ({ ...s, code: e.target.value.replace(/\D/g, '') }))}
                    className="w-full bg-[#0A0E1A]/50 border border-white/10 rounded-xl px-4 py-3 text-center text-xl tracking-[6px] font-mono"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={regen.submitting || regen.code.length !== 6} className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl disabled:opacity-50">
                      {regen.submitting ? 'Yaratilmoqda...' : 'Yaratish'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegen({ open: false, code: '', submitting: false, codes: null })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl"
                    >Bekor</button>
                  </div>
                </form>
              )}

              {regen.codes && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">🔑 Yangi backup kodlar</h3>
                  <p className="text-sm text-amber-300/90">
                    Bu kodlarni xavfsiz joyda saqlang. Bu sahifa qayta ko&apos;rsatilmaydi.
                  </p>
                  <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 rounded-xl p-4 font-mono">
                    {regen.codes.map((c) => (
                      <div key={c} className="text-center text-sm py-1.5 bg-white/5 rounded">{c}</div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(regen.codes!.join('\n'));
                      toast.success('Nusxalandi');
                    }}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm"
                  >📋 Hammasini nusxa olish</button>
                  <button
                    onClick={() => setRegen({ open: false, code: '', submitting: false, codes: null })}
                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl"
                  >Saqladim, yopish</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
