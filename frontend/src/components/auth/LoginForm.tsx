'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { login, selectAuthError, clearError } from '@store/slices/authSlice';
import { forgotPasswordFlow } from '@utils/forgotPasswordFlow';
import { useLang } from '@/context/LangContext';
import { useTheme } from '@/context/ThemeContext';
import GoogleAuthButton from './GoogleAuthButton';
import TurnstileWidget from '@/components/common/TurnstileWidget';

export default function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { t } = useLang();
  const { isDark } = useTheme();

  const dispatch = useDispatch();
  const router = useRouter();
  const authError = useSelector(selectAuthError);
  const captchaSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const captchaRequired = Boolean(captchaSiteKey);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: any) => {
    if (captchaRequired && !captchaToken) {
      toast.error('Iltimos, robot emasligingizni tasdiqlang');
      return;
    }
    setIsSubmitting(true);
    dispatch(clearError());

    try {
      const result = await (dispatch as any)(login({
        email: data.email,
        password: data.password,
        ...(captchaToken ? { captchaToken } : {}),
      }));

      if (login.fulfilled.match(result)) {
        forgotPasswordFlow.rememberEmail(data.email);
        const payload: any = result.payload;
        if (payload?.requires2FA) {
          router.push('/auth/2fa-verify');
          return;
        }
        if (payload?.requiresEmailVerification) {
          router.push(`/auth/verify-email?email=${encodeURIComponent(payload.email || data.email)}`);
          return;
        }
        toast.success('Muvaffaqiyatli kirdingiz!');
        router.push('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {authError && (
        <div className="alert alert-error text-sm rounded-lg p-3 text-red-500 bg-red-500/10 border border-red-500/20">
          {authError}
        </div>
      )}

      {/* Email input */}
      <div className="form-control w-full">
        <label className="label pt-0 pb-1 px-1">
          <span className={`label-text font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('auth.login.email')}</span>
        </label>
        <div className="relative">
          <input 
            type="email" 
            placeholder="email@example.com" 
            className={`w-full bg-white text-gray-900 px-5 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? 'ring-2 ring-error' : ''}`}
            {...register('email', { 
              required: 'Email manzilini kiritish majburiy',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Noto\'g\'ri email formati'
              }
            })} 
          />
        </div>
        {errors.email && <p className="text-error text-xs mt-1 ml-4">{(errors.email as any).message}</p>}
      </div>

      {/* Parol input */}
      <div className="form-control w-full">
        <div className="flex justify-between items-center pb-1 px-1">
          <label className="label pt-0 pb-0">
            <span className={`label-text font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('auth.login.password')}</span>
          </label>
          <Link href="/forgot-password" className="text-indigo-400 text-xs hover:underline">
            {t('auth.login.forgot')}
          </Link>
        </div>
        <div className="relative flex items-center">
           <input 
            type={showPass ? "text" : "password"} 
            placeholder="••••••••" 
            autoComplete="current-password"
            className={`w-full bg-white text-gray-900 px-5 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary transition-all pr-12 ${errors.password ? 'ring-2 ring-error' : ''}`}
            {...register('password', {
              required: 'Parolni kiritish majburiy',
              minLength: {
                value: 6,
                message: t('auth.login.passwordMinLength'),
              },
            })}
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)}
            className="absolute right-5 text-gray-500 hover:text-gray-700 focus:outline-none"
            data-testid="login-toggle-password"
          >
            {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-error text-xs mt-1 ml-4">{(errors.password as any).message}</p>}
      </div>

      {captchaRequired && (
        <div className="flex justify-center pt-1">
          <TurnstileWidget
            siteKey={captchaSiteKey}
            onToken={setCaptchaToken}
            onError={() => setCaptchaToken(null)}
            theme={isDark ? 'dark' : 'light'}
          />
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || (captchaRequired && !captchaToken)}
          className="btn btn-primary bg-indigo-500 hover:bg-indigo-600 border-none w-full rounded-full normal-case text-base font-medium h-12 flex justify-center items-center text-white disabled:opacity-60"
        >
          {isSubmitting ? (
             <span className="loading loading-spinner loading-md"></span>
           ) : (
            <>
              {t('auth.login.submit')} <span className="ml-2 font-bold">→</span>
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 pt-2">
        <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>yoki</span>
        <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
      </div>

      {/* Google OAuth */}
      <GoogleAuthButton mode="login" />

      <div className="text-center pt-2">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('auth.login.noAccount')} </span>
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm font-medium transition-colors">
          {t('auth.login.register')}
        </Link>
      </div>
    </form>
  );
}
