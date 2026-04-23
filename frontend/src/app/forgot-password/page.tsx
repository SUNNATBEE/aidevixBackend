'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { forgotPasswordApi } from '@api/forgotPasswordApi';
import { forgotPasswordFlow } from '@utils/forgotPasswordFlow';
import { useLang } from '@/context/LangContext';
import gsap from 'gsap';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cardRef = useRef(null);
  const { t } = useLang();

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  const onSubmit = async (data: any) => {
    const email = data.email.trim().toLowerCase();

    try {
      setLoading(true);
      await forgotPasswordApi.forgotPassword({ email });
      forgotPasswordFlow.startTimer(email);
      toast.success(t('forgot.sent'));
      router.push(`/verify-code?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('forgot.notFound'));
    } finally {
      setLoading(false);
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
            <h2 className="text-[1.45rem] sm:text-[1.75rem] font-bold text-white mb-3">{t('forgot.title')}</h2>
            <p className="text-gray-400 text-[0.95rem] px-2 leading-relaxed">
              {t('forgot.desc')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            <div className="form-control w-full">
              <label className="label pt-0 pb-1 px-1">
                <span className="label-text text-gray-300 font-medium text-sm">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className={`w-full bg-white text-gray-900 px-5 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? 'ring-2 ring-error' : ''}`}
                  {...register('email', {
                    required: t('forgot.emailRequired'),
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: t('forgot.emailInvalid'),
                    }
                  })}
                />
              </div>
              {errors.email && <p className="text-error text-xs mt-1 ml-4">{(errors.email as any).message}</p>}
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
