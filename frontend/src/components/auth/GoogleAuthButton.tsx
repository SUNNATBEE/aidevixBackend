'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';
import { googleAuth, clearError } from '@store/slices/authSlice';
import { useTheme } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';
import { FcGoogle } from 'react-icons/fc';
import { FiShield } from 'react-icons/fi';

interface Props {
  mode?: 'login' | 'register';
  /** Qo'shimcha wrapper className (form ichida joylash) */
  className?: string;
}

/**
 * Google OAuth — rasmiy `GoogleLogin` vidjeti, premium chrome va tema moslashuvi.
 */
export default function GoogleAuthButton({ mode = 'login', className }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useLang();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google credential olinmadi');
      return;
    }
    dispatch(clearError());
    const result = await (dispatch as any)(googleAuth({ credential: credentialResponse.credential }));
    if (googleAuth.fulfilled.match(result)) {
      const payload: any = result.payload;
      if (payload?.requires2FA) {
        router.push('/auth/2fa-verify');
        return;
      }
      if (payload?.requiresEmailVerification) {
        const email = encodeURIComponent(payload.email || '');
        router.push(`/auth/verify-email?email=${email}`);
        return;
      }
      toast.success(
        mode === 'register' ? "Google orqali ro'yxatdan o'tdingiz!" : 'Google orqali muvaffaqiyatli kirdingiz!',
      );
      router.push('/');
    }
  };

  const hint = mode === 'register' ? t('auth.oauth.hintRegister') : t('auth.oauth.hintLogin');
  const isRegister = mode === 'register';

  return (
    <div className={clsx('w-full', className)}>
      <div
        className={clsx(
          'relative overflow-hidden rounded-2xl p-[1px] transition duration-300',
          'hover:scale-[1.01] active:scale-[0.99]',
          isDark
            ? 'bg-gradient-to-br from-indigo-500/40 via-slate-500/25 to-amber-400/25 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:shadow-[0_24px_60px_rgba(79,70,229,0.12)]'
            : 'bg-gradient-to-br from-slate-200 via-white to-indigo-100/80 shadow-lg shadow-slate-300/40 hover:shadow-xl hover:shadow-indigo-200/30',
        )}
      >
        <div
          className={clsx(
            'rounded-[15px] px-3 py-3 sm:px-4 sm:py-4',
            isDark ? 'bg-[#080b12]/[0.97]' : 'bg-white',
            'ring-1 ring-inset',
            isDark ? 'ring-white/[0.06]' : 'ring-slate-200/80',
          )}
        >
          <div className="mb-3 flex items-center justify-between gap-2.5 sm:mb-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <span
                className={clsx(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  isDark
                    ? 'bg-white/[0.06] ring-1 ring-white/10'
                    : 'bg-slate-50 ring-1 ring-slate-200/80',
                )}
              >
                <FcGoogle className="text-[26px]" aria-hidden />
              </span>
              <div className="min-w-0 text-left">
                <p
                  className={clsx(
                    'text-[10px] font-bold uppercase tracking-[0.2em]',
                    isDark ? 'text-indigo-300/90' : 'text-indigo-600/90',
                  )}
                >
                  Google
                </p>
                <p
                  className={clsx(
                    'truncate text-sm font-semibold leading-tight',
                    isDark ? 'text-slate-100' : 'text-slate-800',
                  )}
                >
                  {isRegister ? t('auth.oauth.titleRegister') : t('auth.oauth.titleLogin')}
                </p>
              </div>
            </div>
            <FiShield
              className={clsx('hidden h-5 w-5 shrink-0 sm:block', isDark ? 'text-emerald-400/80' : 'text-emerald-600/70')}
              aria-hidden
            />
          </div>

          <p
            className={clsx(
              'mb-3 text-center text-[12px] leading-relaxed',
              isDark ? 'text-slate-500' : 'text-slate-500',
            )}
          >
            {hint}
          </p>

          <div className="flex w-full justify-center [&>div]:w-full [&>div>div]:w-full [&>div>div>div]:w-full [&_iframe]:!max-w-full">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => toast.error('Google orqali amalga oshmadi')}
              theme={isDark ? 'filled_black' : 'outline'}
              size="large"
              shape="pill"
              width="100%"
              text={isRegister ? 'signup_with' : 'continue_with'}
              logo_alignment="left"
              useOneTap={false}
            />
          </div>

          <p
            className={clsx(
              'mt-3 text-center text-[10px] tracking-wider',
              isDark ? 'text-slate-600' : 'text-slate-400',
            )}
          >
            {t('auth.oauth.badge')}
          </p>
        </div>
      </div>
    </div>
  );
}
