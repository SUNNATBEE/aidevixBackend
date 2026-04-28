'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { forgotPasswordApi } from '@api/forgotPasswordApi';
import { forgotPasswordFlow } from '@utils/forgotPasswordFlow';
import { useLang } from '@/context/LangContext';
import { useTheme } from '@/context/ThemeContext';
import TurnstileWidget from '@/components/common/TurnstileWidget';
import gsap from 'gsap';

type Method = 'email' | 'telegram';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [method, setMethod] = useState<Method>('email');
  const router = useRouter();
  const cardRef = useRef(null);
  const { t } = useLang();
  const { isDark } = useTheme();
  const captchaSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const captchaRequired = Boolean(captchaSiteKey);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  const switchMethod = (m: Method) => {
    setMethod(m);
    reset();
  };

  const onSubmit = async (data: any) => {
    const identifier = method === 'email'
      ? data.email.trim().toLowerCase()
      : data.telegram.trim().replace(/^@/, '');

    if (captchaRequired && !captchaToken) {
      toast.error(t('forgot.captchaRequired'));
      return;
    }

    try {
      setLoading(true);
      await forgotPasswordApi.forgotPassword({ identifier, method, ...(captchaToken ? { captchaToken } : {}) });
      forgotPasswordFlow.startTimer(identifier);
      toast.success(method === 'email' ? t('forgot.sent') : t('forgot.sentTelegram'));
      router.push(`/verify-code?identifier=${encodeURIComponent(identifier)}&method=${method}`);
    } catch (error: any) {
      const code = error.response?.data?.code;
      const msg = error.response?.data?.message;
      if (code === 'CAPTCHA_REQUIRED' || error.response?.status === 403) {
        setCaptchaToken(null);
        toast.error(t('forgot.captchaFailed'));
        return;
      }
      if (!error.response && (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK')) {
        toast.error(t('forgot.networkError'));
        return;
      }
      toast.error(msg || t('forgot.notFound'));
    } finally {
      setLoading(false);
    }
  };

  const tabBase = 'flex-1 py-2 text-sm font-medium rounded-full transition-all';
  const tabActive = 'bg-indigo-600 text-white';
  const tabInactive = isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800';

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex font-sans selection:bg-indigo-500/30">
      <div className="w-full flex flex-col justify-center items-center p-3 sm:p-12 relative bg-[#0A0E1A]">
        <div
          ref={cardRef}
          className="w-full max-w-[420px] bg-[#0A0E1A] lg:bg-[#0d1224]/40 rounded-2xl sm:rounded-3xl border-0 lg:border lg:border-white/5 p-5 sm:p-10 opacity-0 shadow-2xl shadow-indigo-500/5"
        >
          <div className="text-center mb-7 sm:mb-8">
            <h2 className="text-[1.45rem] sm:text-[1.75rem] font-bold text-white mb-3">{t('forgot.title')}</h2>
            <p className="text-gray-400 text-[0.95rem] px-2 leading-relaxed">
              {t('forgot.desc')}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-white/5 rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMethod('email')}
              className={`${tabBase} ${method === 'email' ? tabActive : tabInactive}`}
            >
              {t('forgot.emailTab')}
            </button>
            <button
              type="button"
              onClick={() => switchMethod('telegram')}
              className={`${tabBase} ${method === 'telegram' ? tabActive : tabInactive}`}
            >
              {t('forgot.telegramTab')}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            {method === 'email' ? (
              <div className="form-control w-full">
                <label className="label pt-0 pb-1 px-1">
                  <span className="label-text text-gray-300 font-medium text-sm">Email</span>
                </label>
                <input
                  key="email"
                  type="email"
                  placeholder="email@example.com"
                  className={`w-full bg-white text-gray-900 px-5 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? 'ring-2 ring-error' : ''}`}
                  {...register('email', {
                    required: t('forgot.emailRequired'),
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: t('forgot.emailInvalid'),
                    },
                  })}
                />
                {errors.email && <p className="text-error text-xs mt-1 ml-4">{(errors.email as any).message}</p>}
              </div>
            ) : (
              <div className="form-control w-full">
                <label className="label pt-0 pb-1 px-1">
                  <span className="label-text text-gray-300 font-medium text-sm">Telegram username</span>
                </label>
                <input
                  key="telegram"
                  type="text"
                  placeholder="@username"
                  className={`w-full bg-white text-gray-900 px-5 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary transition-all ${errors.telegram ? 'ring-2 ring-error' : ''}`}
                  {...register('telegram', {
                    required: t('forgot.telegramRequired'),
                    pattern: {
                      value: /^@?[a-zA-Z0-9_]{5,32}$/,
                      message: t('forgot.telegramInvalid'),
                    },
                  })}
                />
                {errors.telegram && <p className="text-error text-xs mt-1 ml-4">{(errors.telegram as any).message}</p>}
                <p className="text-gray-500 text-xs mt-2 ml-1">{t('forgot.telegramHint')}</p>
              </div>
            )}

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
                disabled={loading || (captchaRequired && !captchaToken)}
                className="btn btn-primary bg-indigo-500 hover:bg-indigo-600 border-none w-full rounded-full normal-case text-base font-medium h-12 flex justify-center items-center text-white"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <>{t('forgot.next')} <span className="ml-2 font-bold">→</span></>
                )}
              </button>
            </div>

            <div className="text-center pt-4">
              <Link href="/login" className="text-gray-400 hover:text-white hover:underline text-sm font-medium transition-colors">
                {t('forgot.back')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
