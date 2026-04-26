'use client';

import { useEffect, useState, useCallback } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authApi } from '@/api/authApi';
import { toast } from 'react-hot-toast';
import { IoLockClosed, IoClose } from 'react-icons/io5';

type Props = {
  open: boolean;
  onClose: () => void;
  onVerified: (reauthToken: string) => void;
  reason?: string;
  isGoogleOnly?: boolean;
};

/**
 * Step-up reauth: parol yoki Google ID token → 5 daqiqalik `X-Reauth-Token`.
 */
export default function ReauthModal({
  open,
  onClose,
  onVerified,
  reason = "Bu amal uchun kimligingizni qayta tasdiqlang",
  isGoogleOnly = false,
}: Props) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finishWithToken = useCallback(
    (token: string) => {
      onVerified(token);
      setPassword('');
      setError(null);
    },
    [onVerified],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await authApi.reauth({ password });
      const token = (res.data as { data?: { reauthToken?: string } })?.data?.reauthToken;
      if (!token) throw new Error('Reauth token kelmadi');
      finishWithToken(token);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      const text = msg || (err instanceof Error ? err.message : 'Tasdiqlash amalga oshmadi');
      setError(text);
      toast.error(text);
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSuccess = async (cred: CredentialResponse) => {
    if (!cred.credential) {
      toast.error('Google credential olinmadi');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await authApi.reauth({ googleCredential: cred.credential });
      const token = (res.data as { data?: { reauthToken?: string } })?.data?.reauthToken;
      if (!token) throw new Error('Reauth token kelmadi');
      finishWithToken(token);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      const text = msg || 'Google bilan tasdiqlash amalga oshmadi';
      setError(text);
      toast.error(text);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <IoLockClosed className="text-xl" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white leading-tight">Qayta tasdiqlash</h2>
              <p className="text-sm text-slate-400 mt-1">{reason}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-500 hover:text-white hover:bg-white/5 transition"
            aria-label="Yopish"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {isGoogleOnly ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Hisobingiz Google bilan bog‘langan. Davom etish uchun Google orqali tasdiqlang.
            </p>
            {error && (
              <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                {error}
              </div>
            )}
            <div className="flex justify-center [&>div]:w-full">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => toast.error('Google xatolik')}
                theme="filled_black"
                size="large"
                text="continue_with"
                useOneTap={false}
              />
            </div>
            {submitting && <p className="text-center text-xs text-slate-500">Tekshirilmoqda…</p>}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5"
            >
              Bekor qilish
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Joriy parol</label>
              <input
                type="password"
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/50"
                disabled={submitting}
              />
            </div>
            {error && (
              <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5"
              >
                Bekor
              </button>
              <button
                type="submit"
                disabled={submitting || !password.trim()}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-45 text-white text-sm font-medium"
              >
                {submitting ? 'Tekshirilmoqda…' : 'Tasdiqlash'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
