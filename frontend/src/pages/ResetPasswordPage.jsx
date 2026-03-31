import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FiRefreshCcw } from 'react-icons/fi';
import { forgotPasswordApi } from '@api/forgotPasswordApi';
import { forgotPasswordFlow } from '@utils/forgotPasswordFlow';
import { tokenStorage } from '@utils/tokenStorage';
import { STORAGE_KEYS } from '@utils/constants';
import { localAuth } from '@utils/localAuth';
import gsap from 'gsap';

export default function ResetPasswordPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email')?.trim().toLowerCase();
  const token = queryParams.get('token');

  const password = watch('password', '');

  const getPasswordStrength = (pass) => {
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
      navigate('/forgot-password');
      return;
    }

    if (!forgotPasswordFlow.canReset(email, token)) {
      toast.error('Reset sessiyasi yaroqsiz yoki muddati tugagan.');
      navigate('/forgot-password');
      return;
    }

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [email, token, navigate]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Parollar mos emas.');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Updating password for email:', email);
      console.log('New password:', data.password);
      
      // Local auth da parolni yangilash
      try {
        localAuth.updatePassword(email, data.password);
        console.log('Password updated successfully in localAuth');
      } catch (authError) {
        console.error('LocalAuth error:', authError);
        toast.error(authError.message);
        setLoading(false);
        return;
      }
      
      let responseData = null;
      try {
        const res = await forgotPasswordApi.resetPassword({ email, token, newPassword: data.password });
        responseData = res?.data?.data;
      } catch {
        // Backend endpoint bo'lmasa local flow davom etadi
      }

      forgotPasswordFlow.completeReset(email, token);

      // Agar backend yangi tokenlar qaytarsa — ularni saqlash
      if (responseData?.accessToken) {
        tokenStorage.setTokens(responseData.accessToken, responseData.refreshToken);
        if (responseData.user) tokenStorage.setUser(responseData.user);
        toast.success('Parol yangilandi. Tokenlar saqlandi.');
      } else {
        // Backend token qaytarmasa — faqat parolni localStorage'ga yozib qo'yamiz
        localStorage.setItem(STORAGE_KEYS.PENDING_PASSWORD, data.password);
        toast.success('Parol muvaffaqiyatli yangilandi. Endi login qiling.');
      }

      navigate(`/login?email=${encodeURIComponent(email)}`, { replace: true });
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || error.message || 'Parolni yangilashda xatolik yuz berdi.');
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
            <h2 className="text-[1.75rem] font-bold text-white mb-3">Yangi parol o'rnatish</h2>
            <p className="text-gray-400 text-[0.95rem] px-2 leading-relaxed">
              <strong>{email}</strong> uchun yangi parol kiriting.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Yangi parol</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <IoLockClosedOutline className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: true, minLength: 6 })}
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
                    {isWeak ? 'Zaif' : 'Mustahkam'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Parolni tasdiqlash</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiRefreshCcw className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: true,
                    validate: value => value === password || 'Parollar mos emas'
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
              {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">Parollar mos emas</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Yangilanmoqda...' : "Parolni yangilash"}
            </button>

            <div className="text-center pt-4">
              <Link to="/login" className="text-gray-400 hover:text-white hover:underline text-sm font-medium transition-colors">
                ← Login sahifasiga qaytish
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
