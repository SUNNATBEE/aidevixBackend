'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, selectAuthLoading, selectAuthError, clearError } from '@store/slices/authSlice';
import { toast } from 'react-hot-toast';
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FiRefreshCcw } from 'react-icons/fi';
import { forgotPasswordFlow } from '@utils/forgotPasswordFlow';
import { useLang } from '@/context/LangContext';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useLang();
  
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
  const router = useRouter();
  const [refCodeParam, setRefCodeParam] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const ref = searchParams.get('ref');
      if (ref) {
        setRefCodeParam(ref);
        setValue('referralCode', ref);
      }
    }
  }, [setValue]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const password = watch('password', '');

  // Parol mustahkamligini hisoblash
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength; // 0 dan 5gacha
  };

  const strength = getPasswordStrength(password);
  const isWeak = strength < 3;
  const strengthPercentage = password.length === 0 ? 0 : Math.min((strength / 5) * 100, 100);

  const onSubmit = async (data: any) => {
    dispatch(clearError());

    // Shartlarni qabul qilganini tekshirish
    if (!data.terms) {
      toast.error("Iltimos, Foydalanish shartlari va Maxfiylik siyosati bilan tanishib chiqing.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Parollar mos kelmadi.");
      return;
    }

    const nameParts = data.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    const username = data.fullName.trim().replace(/\s+/g, '_').toLowerCase();
    const email = data.email.trim().toLowerCase();

    const result = await (dispatch as any)(registerUser({
      username,
      email,
      password: data.password,
      firstName,
      lastName,
      referralCode: data.referralCode || undefined
    }));

    if (registerUser.fulfilled.match(result)) {
      forgotPasswordFlow.rememberEmail(email);
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {authError && (
        <div className="alert alert-error text-sm rounded-lg p-3 text-red-500 bg-red-500/10 border border-red-500/20">
          {authError}
        </div>
      )}
      
      {/* Ism */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">To'liq ism</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <IoPersonOutline className="w-5 h-5" />
          </div>
          <input
            type="text"
            {...register('fullName', {
              required: "To'liq ism majburiy",
              minLength: { value: 3, message: "Kamida 3 ta belgi kiriting" },
              maxLength: { value: 40, message: "Ko'pi bilan 40 ta belgi kiriting" },
              validate: (v) => v.trim().length >= 3 || "To'liq ism juda qisqa"
            })}
            autoComplete="name"
            className={`w-full pl-11 pr-4 py-3 bg-[#0A0E1A]/50 border ${errors.fullName ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all`}
            placeholder="Ismingizni kiriting"
          />
        </div>
        {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{(errors.fullName as any).message}</span>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email manzil</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <IoMailOutline className="w-5 h-5" />
          </div>
          <input
            type="email"
            {...register('email', {
              required: 'Email manzil majburiy',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Email formati noto'g'ri"
              }
            })}
            autoComplete="username"
            className={`w-full pl-11 pr-4 py-3 bg-[#0A0E1A]/50 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all`}
            placeholder="name@example.com"
          />
        </div>
        {errors.email && <span className="text-red-500 text-xs mt-1 block">{(errors.email as any).message}</span>}
      </div>

      {/* Parol */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Parol</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <IoLockClosedOutline className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            {...register('password', {
              required: 'Parol majburiy',
              minLength: { value: 8, message: "Kamida 8 ta belgi bo'lishi kerak" },
              validate: {
                hasUpper: v => /[A-Z]/.test(v) || "Kamida 1 ta katta harf kerak",
                hasLower: v => /[a-z]/.test(v) || "Kamida 1 ta kichik harf kerak",
                hasDigit: v => /\d/.test(v) || "Kamida 1 ta raqam kerak",
                hasSpecial: v => /[^A-Za-z0-9]/.test(v) || "Kamida 1 ta maxsus belgi kerak"
              }
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
        {errors.password && <span className="text-red-500 text-xs mt-1 block">{(errors.password as any).message}</span>}
        
        {/* Parol kiritilgandan keyin ko'rinadigan kuchlilik indikatori */}
        {password.length > 0 && (
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${isWeak ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${isWeak ? Math.max(30, strengthPercentage) : 100}%` }}
              ></div>
            </div>
            <span className={`text-[11px] font-medium ${isWeak ? 'text-red-500' : 'text-green-500'}`}>
              {isWeak ? 'Zaif' : 'Mustahkam'}
            </span>
          </div>
        )}
      </div>

      {/* Parolni tasdiqlash */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Parolni tasdiqlash</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <FiRefreshCcw className="w-4 h-4" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register('confirmPassword', { 
              required: "Parolni tasdiqlash majburiy",
              validate: value => value === password || "Parollar mos emas"
            })}
            autoComplete="new-password"
            className={`w-full pl-11 pr-12 py-3 bg-[#0A0E1A]/50 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all`}
            placeholder="********"
          />
        </div>
        {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{(errors.confirmPassword as any).message || "Parollar mos emas"}</span>}
      </div>

      {/* Referral yozish */}
      <div>
        <label className="flex justify-between text-sm font-medium text-gray-300 mb-1.5">
          <span>{t('auth.register.ref')}</span>
          <span className="text-xs text-gray-500 font-normal">{t('auth.register.refOptional')}</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <span className="text-emerald-500 font-bold mb-1">🎁</span>
          </div>
          <input
            type="text"
            defaultValue={refCodeParam}
            {...register('referralCode')}
            className="w-full pl-11 pr-4 py-3 bg-[#0A0E1A]/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all uppercase"
            placeholder={t('auth.register.refPlaceholder')}
          />
        </div>
        {refCodeParam && <span className="text-emerald-400 text-xs mt-1 block tracking-wide">{t('auth.register.refBonus')}</span>}
      </div>

      {/* Shartlar Checkbox */}
      <div className="flex items-start gap-3 mt-4">
        <div className="flex items-center h-5 mt-1">
          <input
            type="checkbox"
            {...register('terms', { required: "Shartlarni tasdiqlash majburiy" })}
            className="w-4 h-4 rounded border-white/20 bg-[#0A0E1A]/50 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-0 transition-all cursor-pointer"
          />
        </div>
        <label className="text-sm text-gray-400 leading-relaxed cursor-pointer" onClick={() => {
          const checkbox = document.querySelector('input[name="terms"]');
          if (checkbox) (checkbox as any).click();
        }}>
          Men <span className="text-indigo-400 hover:underline">Foydalanish shartlari</span> va <span className="text-indigo-400 hover:underline">Maxfiylik siyosati</span> bilan tanishib chiqdim va qabul qilaman.
        </label>
      </div>
      {errors.terms && <span className="text-red-500 text-xs -mt-2 block">{(errors.terms as any).message}</span>}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Kutib turing...' : "Ro'yxatdan o'tish"}
        {!loading && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </form>
  );
}
