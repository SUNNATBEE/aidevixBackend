'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { forgotPasswordApi } from '@api/forgotPasswordApi';
import { forgotPasswordFlow } from '@utils/forgotPasswordFlow';
import { useLang } from '@/context/LangContext';
import { useTheme } from '@/context/ThemeContext';
import TurnstileWidget from '@/components/common/TurnstileWidget';
import gsap from 'gsap';

function VerifyCodeContent() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const cardRef = useRef(null);
  const { t } = useLang();
  const { isDark } = useTheme();
  const captchaSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const captchaRequired = Boolean(captchaSiteKey);

  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      router.push('/forgot-password');
    }

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [email, router]);

  useEffect(() => {
    if (!email) return;
    setTimeLeft(forgotPasswordFlow.getRemainingSeconds(email));
    const timer = setInterval(() => {
      setTimeLeft(forgotPasswordFlow.getRemainingSeconds(email));
    }, 1000);
    return () => clearInterval(timer);
  }, [email]);

  const onSubmit = async (data: any) => {
    if (!email) return;

    try {
      setLoading(true);
      let resetToken = null;

      try {
        const res = await forgotPasswordApi.verifyCode({ email, code: data.code });
        if (res.data.success) {
          resetToken = res.data.data.resetToken;
        }
      } catch (error) {
        throw error;
      }

      if (!resetToken) {
        throw new Error('Serverdan reset token olinmadi.');
      }

      toast.success(t('verify.confirmed'));
      router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || t('profile.toast.error');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    if (captchaRequired && !captchaToken) {
      toast.error(t('forgot.captchaRequired'));
      return;
    }
    try {
      setResendLoading(true);
      await forgotPasswordApi.forgotPassword({
        email,
        ...(captchaToken ? { captchaToken } : {}),
      });
      forgotPasswordFlow.startTimer(email);
      setTimeLeft(forgotPasswordFlow.getRemainingSeconds(email));
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
      toast.success(t('verify.sent'));
    } catch (error: any) {
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
      const code = error.response?.data?.code;
      if (code === 'CAPTCHA_REQUIRED' || error.response?.status === 403) {
        toast.error(t('forgot.captchaFailed'));
        return;
      }
      if (!error.response && (error?.message === 'Network Error' || error?.code === 'ERR_NETWORK')) {
        toast.error(t('forgot.networkError'));
        return;
      }
      toast.error(error.response?.data?.message || t('profile.toast.error'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex font-sans selection:bg-indigo-500/30">
      <div className="w-full flex flex-col justify-center items-center p-3 sm:p-12 relative bg-[#0A0E1A]">
        <div 
          ref={cardRef}
          className="w-full max-w-[420px] bg-[#0A0E1A] lg:bg-[#0d1224]/40 rounded-2xl sm:rounded-3xl border-0 lg:border lg:border-white/5 p-5 sm:p-10 opacity-0 shadow-2xl shadow-indigo-500/5"
        >
          <div className="text-center mb-7 sm:mb-10">
            <h2 className="text-[1.45rem] sm:text-[1.75rem] font-bold text-white mb-3">{t('verify.title')}</h2>
            <p className="text-gray-400 text-[0.95rem] px-2 leading-relaxed">
              <strong>{email}</strong> {t('verify.desc')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            <div className="form-control w-full">
              <label className="label pt-0 pb-1 px-1">
                <span className="label-text text-gray-300 font-medium text-sm">{t('verify.label')}</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="000000" 
                  style={{ letterSpacing: '6px', textAlign: 'center' }}
                  className={`w-full bg-white text-gray-900 px-5 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary transition-all text-xl font-bold ${errors.code ? 'ring-2 ring-error' : ''}`}
                  {...register('code', { 
                    required: t('verify.codeRequired'),
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: t('verify.codePattern')
                    }
                  })} 
                />
              </div>
              {errors.code && <p className="text-error text-xs mt-1 text-center">{(errors.code as any).message}</p>}
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary bg-indigo-500 hover:bg-indigo-600 border-none w-full rounded-full normal-case text-base font-medium h-12 flex justify-center items-center text-white"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <>{t('verify.submit')} <span className="ml-2 font-bold">→</span></>
                )}
              </button>
            </div>

            <div className="text-center pt-6">
              {timeLeft > 0 ? (
                <p className="text-gray-400 text-sm">
                  {t('verify.resend')} ({timeLeft}s)
                </p>
              ) : (
                <>
                  {captchaRequired && (
                    <div className="flex justify-center pb-4">
                      <TurnstileWidget
                        key={captchaKey}
                        siteKey={captchaSiteKey}
                        onToken={setCaptchaToken}
                        onError={() => setCaptchaToken(null)}
                        theme={isDark ? 'dark' : 'light'}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading || (captchaRequired && !captchaToken)}
                    className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {resendLoading ? t('verify.sending') : t('verify.resend')}
                  </button>
                </>
              )}
            </div>

            <div className="text-center pt-4">
              <Link href="/forgot-password" className="text-gray-400 hover:text-white hover:underline text-sm font-medium transition-colors">
                {t('verify.useOther')}
              </Link>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
      <VerifyCodeContent />
    </Suspense>
  );
}
