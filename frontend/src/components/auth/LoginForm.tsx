'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { login, selectAuthLoading, selectAuthError, clearError } from '@store/slices/authSlice';
import { forgotPasswordFlow } from '@utils/forgotPasswordFlow';
import { useLang } from '@/context/LangContext';
import { useTheme } from '@/context/ThemeContext';

export default function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { t } = useLang();
  const { isDark } = useTheme();
  
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const onSubmit = async (data: any) => {
    dispatch(clearError());

    const result = await (dispatch as any)(login({
      email: data.email,
      password: data.password,
    }));
    
    if (login.fulfilled.match(result)) {
      forgotPasswordFlow.rememberEmail(data.email);
      toast.success('Muvaffaqiyatli kirdingiz!');
      router.push('/');
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
                message: 'Parol kamida 6ta belgidan iborat bo\'lishi kerak'
              }
            })} 
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)}
            className="absolute right-5 text-gray-500 hover:text-gray-700 focus:outline-none"
            university-tag="show-password"
          >
            {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-error text-xs mt-1 ml-4">{(errors.password as any).message}</p>}
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
            <>
              {t('auth.login.submit')} <span className="ml-2 font-bold">→</span>
            </>
          )}
        </button>
      </div>

      <div className="text-center pt-4">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('auth.login.noAccount')} </span>
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm font-medium transition-colors">
          {t('auth.login.register')}
        </Link>
      </div>
    </form>
  );
}
