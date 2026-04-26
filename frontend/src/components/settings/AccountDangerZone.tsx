'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { authApi } from '@/api/authApi';
import { selectUser } from '@store/slices/authSlice';
import { toast } from 'react-hot-toast';
import ReauthModal from '@/components/auth/ReauthModal';

type UserShape = {
  hasLocalPassword?: boolean;
  googleLinked?: boolean;
} | null;

export default function AccountDangerZone() {
  const user = useSelector(selectUser) as UserShape;
  const [step, setStep] = useState<'idle' | 'confirm'>( 'idle' );
  const [reauthOpen, setReauthOpen] = useState(false);

  const isGoogleOnly = Boolean(user?.googleLinked) && user?.hasLocalPassword === false;

  const onVerified = async (reauthToken: string) => {
    setReauthOpen(false);
    setStep('idle');
    try {
      await authApi.deleteMyAccount(reauthToken);
      toast.success('Hisobingiz o‘chirildi');
      window.location.replace('/');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(msg || 'O‘chirib bo‘lmadi');
    }
  };

  return (
    <section className="border border-rose-500/25 rounded-2xl p-6 bg-rose-500/[0.06]">
      <h2 className="text-lg font-semibold text-rose-200 mb-1">Hisobni o‘chirish</h2>
      <p className="text-sm text-gray-400 mb-4 leading-relaxed">
        Barcha shaxsiy ma’lumotlar anonymlashtiriladi, sessiyalar yopiladi. Qayta tiklanmaydi.
      </p>
      {step === 'idle' && (
        <button
          type="button"
          onClick={() => setStep('confirm')}
          className="text-sm px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-200 border border-rose-500/30 hover:bg-rose-500/30 transition"
        >
          Hisobni o‘chirish
        </button>
      )}
      {step === 'confirm' && (
        <div className="space-y-3">
          <p className="text-sm text-amber-200/90">Ishonchingiz komilmi? Bu amal qaytarib bo‘lmaydi.</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStep('idle')}
              className="text-sm px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
            >
              Orqaga
            </button>
            <button
              type="button"
              onClick={() => setReauthOpen(true)}
              className="text-sm px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium"
            >
              Ha, o‘chirish
            </button>
          </div>
        </div>
      )}

      <ReauthModal
        open={reauthOpen}
        onClose={() => { setReauthOpen(false); setStep('confirm'); }}
        onVerified={onVerified}
        reason="Hisobni butunlay o‘chirish uchun kimligingizni tasdiqlang"
        isGoogleOnly={isGoogleOnly}
      />
    </section>
  );
}
