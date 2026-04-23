'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FiRefreshCcw } from 'react-icons/fi';
import { forgotPasswordApi } from '@api/forgotPasswordApi';
import { useLang } from '@/context/LangContext';
import gsap from 'gsap';

function ResetPasswordContent() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardRef = useRef(null);
  const { t } = useLang();

  const email = searchParams.get('email')?.trim().toLowerCase();
  const token = searchParams.get('token');

  const password = watch('password', '');

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const isWeak = strength < 3;
  const strengthPercentage = password.length === 0 ? 0 : Math.min((strength / 5) * 100, 100);

  useEffect(() => {
    if (!email || !token) {
      router.push('/forgot-password');
      return;
    }

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [email, token, router]);

  const onSubmit = async (data: any) => {
    if (!email || !token) return;
    if (data.password !== data.confirmPassword) {
      toast.error(t('reset.mismatch'));
      return;
    }

    try {
      setLoading(true);
      await forgotPasswordApi.resetPassword({ 
        email, 
        resetToken: token, 
        newPassword: data.password 
      });
      toast.success(t('reset.success'));
      router.replace('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('profile.toast.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex font-sans selection:bg-indigo-500/30">
      <div className="w-full flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#0A0E1A]">
        <div
          ref={cardRef}
          className="w-full max-w-[420px] bg-[#0A0E1A] lg:bg-[#0d1224]/40 rounded-3xl border-0 lg:border lg:border-white/5 p-8 sm:p-10 opacity-0 shadow-2xl shadow-indigo-500/5"
        >
          <div className="text-center mb-10">
            <h2 className="text-[1.75rem] font-bold text-white mb-3">{t('reset.title')}</h2>
            <p className="text-gray-400 text-[0.95rem] px-2 leading-relaxed">
              <strong>{email}</strong> {t('verify.desc').split(' ').slice(-1)[0] === 'отправленный' ? ' - ' : ''} {t('reset.newPassword').toLowerCase()}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('reset.newPassword')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <IoLockClosedOutline className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: t('reset.required'), 
                    minLength: { value: 8, message: t('reset.minLength') } 
                  })}
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-12 py-3 bg-[#0A0E1A]/50 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all`}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${isWeak ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${isWeak ? Math.max(30, strengthPercentage) : 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-[11px] font-medium ${isWeak ? 'text-red-500' : 'text-green-500'}`}>
                    {isWeak ? t('reset.weak') : t('reset.strong')}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t('reset.confirmPassword')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiRefreshCcw className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: true,
                    validate: value => value === password || t('reset.mismatch')
                  })}
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-12 py-3 bg-[#0A0E1A]/50 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all`}
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <IoEyeOffOutline className="w-5 h-5" /> : <IoEyeOutline className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{t('reset.mismatch')}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('reset.updating') : t('reset.submit')}
            </button>

            <div className="text-center pt-4">
              <Link href="/login" className="text-gray-400 hover:text-white hover:underline text-sm font-medium transition-colors">
                {t('reset.back')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
