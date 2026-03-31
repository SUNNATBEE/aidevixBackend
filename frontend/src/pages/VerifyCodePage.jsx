import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { forgotPasswordApi } from '@api/forgotPasswordApi';
import { forgotPasswordFlow } from '@utils/forgotPasswordFlow';
import gsap from 'gsap';

export default function VerifyCodePage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!email) return;
    setTimeLeft(forgotPasswordFlow.getRemainingSeconds(email));
    const timer = setInterval(() => {
      setTimeLeft(forgotPasswordFlow.getRemainingSeconds(email));
    }, 1000);
    return () => clearInterval(timer);
  }, [email]);

  const onSubmit = async (data) => {
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

      toast.success('Kod tasdiqlandi. Endi yangi parol kiriting.');
      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Kodni tasdiqlashda xatolik yuz berdi.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await forgotPasswordApi.forgotPassword({ email });
      forgotPasswordFlow.startTimer(email);
      setTimeLeft(forgotPasswordFlow.getRemainingSeconds(email));
      toast.success('Yangi kod yuborildi!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setResendLoading(false);
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
            <h2 className="text-[1.75rem] font-bold text-white mb-3">Kodni tasdiqlash</h2>
            <p className="text-gray-400 text-[0.95rem] px-2 leading-relaxed">
              <strong>{email}</strong> manziliga yuborilgan 6 xonali kodni kiriting.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            <div className="form-control w-full">
              <label className="label pt-0 pb-1 px-1">
                <span className="label-text text-gray-300 font-medium text-sm">Tasdiqlash kodi</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="000000" 
                  style={{ letterSpacing: '8px', textAlign: 'center' }}
                  className={`w-full bg-white text-gray-900 px-5 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary transition-all text-xl font-bold ${errors.code ? 'ring-2 ring-error' : ''}`}
                  {...register('code', { 
                    required: 'Kodni kiritish majburiy',
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: 'Kod 6 xonali raqam bo\'lishi kerak'
                    }
                  })} 
                />
              </div>
              {errors.code && <p className="text-error text-xs mt-1 text-center">{errors.code.message}</p>}
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
                  <>Tasdiqlash <span className="ml-2 font-bold">→</span></>
                )}
              </button>
            </div>

            <div className="text-center pt-6">
              {timeLeft > 0 ? (
                <p className="text-gray-400 text-sm">
                  Qayta kod yuborish ({timeLeft}s)
                </p>
              ) : (
                <button 
                  type="button" 
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm font-medium transition-colors"
                >
                  {resendLoading ? 'Yuborilmoqda...' : 'Qayta kod yuborish'}
                </button>
              )}
            </div>

            <div className="text-center pt-4">
              <Link to="/forgot-password" className="text-gray-400 hover:text-white hover:underline text-sm font-medium transition-colors">
                ← Boshqa email ishlatish
              </Link>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
}
