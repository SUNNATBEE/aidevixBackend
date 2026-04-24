'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { IoGameControllerOutline } from 'react-icons/io5';
import api from '@api/axiosInstance';
import { selectIsLoggedIn } from '@store/slices/authSlice';

export default function ChallengesPage() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [challenge, setChallenge] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);

  const loadTodayChallenge = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('challenges/today');
      setChallenge(data?.data?.challenge || null);
      setProgress(data?.data?.progress || null);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Challenge yuklanmadi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayChallenge();
  }, [isLoggedIn]);

  const handleProgress = async () => {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('challenges/progress');
      setProgress(data?.data?.progress || progress);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Progressni yangilab bo‘lmadi');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[80vh] w-full min-w-0 items-center justify-center overflow-x-clip px-3">
        <div className="w-full max-w-md min-w-0 text-center">
          <div className="w-20 h-20 bg-amber-400/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-400/20">
            <IoGameControllerOutline className="text-4xl text-amber-400" />
          </div>
          <h1 className="mb-3 max-w-full text-balance text-2xl font-black sm:mb-4 sm:text-3xl">Daily <span className="text-amber-400">Challenges</span></h1>
          <p className="text-base-content/60 mb-8">Challenge'larni ko'rish uchun tizimga kiring.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 text-sm font-bold">
            <HiOutlineLightningBolt />
            Kirish
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex min-h-[80vh] w-full min-w-0 items-center justify-center overflow-x-clip px-3">
        <div className="w-full max-w-md min-w-0 text-center">
          <div className="w-20 h-20 bg-amber-400/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-400/20">
            <IoGameControllerOutline className="text-4xl text-amber-400" />
          </div>
          <h1 className="mb-3 max-w-full text-balance text-2xl font-black sm:mb-4 sm:text-3xl">Bugungi challenge yo‘q</h1>
          <p className="text-base-content/60 mb-8">Ertaga qayta tekshirib ko‘ring.</p>
        </div>
      </div>
    );
  }

  const currentCount = progress?.currentCount || 0;
  const targetCount = challenge?.targetCount || 1;
  const pct = Math.min(100, Math.round((currentCount / targetCount) * 100));
  const completed = Boolean(progress?.isCompleted);

  return (
    <div className="flex min-h-[80vh] w-full min-w-0 items-center justify-center overflow-x-clip px-3">
      <div className="w-full max-w-lg min-w-0 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-amber-400/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-400/20"
        >
          <IoGameControllerOutline className="text-4xl text-amber-400" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-3 max-w-full text-balance text-2xl font-black sm:mb-4 sm:text-3xl"
        >
          Bugungi <span className="text-amber-400">Challenge</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base-content/60 mb-8"
        >
          {challenge.title}
          {challenge.description ? ` — ${challenge.description}` : ''}
        </motion.p>

        <div className="mb-6 text-sm text-base-content/70">
          Progress: {currentCount}/{targetCount} ({pct}%)
        </div>
        <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
        </div>

        {error && <p className="text-error text-sm mb-4">{error}</p>}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <button
            onClick={handleProgress}
            disabled={completed || submitting}
            className="flex items-center gap-2 justify-center bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 text-sm font-bold disabled:opacity-60"
          >
            <HiOutlineLightningBolt />
            {completed ? `Bajarildi! +${challenge.xpReward || 0} XP` : submitting ? 'Saqlanmoqda...' : 'Progress qo‘shish'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
