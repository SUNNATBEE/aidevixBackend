'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IoPlay, IoTime, IoEye, IoArrowBack, IoCodeSlash, IoStar, IoDocumentText } from 'react-icons/io5';
import { selectIsLoggedIn } from '@/store/slices/authSlice';
import { selectInstagramSub, selectTelegramSub } from '@/store/slices/subscriptionSlice';
import { useVideos } from '@hooks/useVideos';
import { useSubscription } from '@hooks/useSubscription';
import { formatDuration } from '@utils/formatDuration';
import SubscriptionGate from '@/components/subscription/SubscriptionGate';
import { videoApi } from '@/api/videoApi';
import { motion } from 'framer-motion';
import VideoComments from '@/components/videos/VideoComments';

export default function VideoPage() {
  const { id }: { id: string } = useParams();
  const router = useRouter();
  const { current: video, videoLink, player, loading, error, fetchById } = useVideos();
  const embedUrl = player && typeof player === 'object' && 'embedUrl' in player ? (player as { embedUrl?: string }).embedUrl : undefined;
  useSubscription();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const instagram = useSelector(selectInstagramSub);
  const telegram = useSelector(selectTelegramSub);

  const isSubscribed = !!(isLoggedIn && instagram?.subscribed && telegram?.subscribed);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [question, setQuestion] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const wasSubscribedRef = useRef(isSubscribed);

  // Progress tracking: har 10 soniyada POST /api/videos/{id}/progress
  const watchedSecondsRef = useRef<number>(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (id) fetchById(id);
  }, [id]);

  // Video ko'rilayotganda progress saqlash (faqat login + obuna bo'lsa)
  useEffect(() => {
    const courseId =
      typeof video?.course === 'object' ? video.course?._id : undefined;
    const canWatch = isLoggedIn && isSubscribed && !!embedUrl && !!courseId;
    if (!canWatch || !id || !courseId) return;

    progressTimerRef.current = setInterval(() => {
      watchedSecondsRef.current += 10;
      videoApi.saveProgress(courseId, id, watchedSecondsRef.current).catch(() => {});
    }, 10_000);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [id, isLoggedIn, isSubscribed, embedUrl, video?.course]);

  // Obuna bekor qilinganda avtomatik gate ochish
  useEffect(() => {
    if (wasSubscribedRef.current && !isSubscribed && isLoggedIn) {
      setShowModal(true);
    }
    wasSubscribedRef.current = isSubscribed;
  }, [isSubscribed, isLoggedIn]);

  const handleVideoClick = (e: React.MouseEvent) => {
    if (!isSubscribed) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    window.location.reload();
  };

  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="loading loading-spinner loading-lg text-primary"
        ></motion.div>
      </div>
    );
  }

  if (error || !video) {
    const statusCode = (error as { statusCode?: number })?.statusCode
    const isAuth = statusCode === 401
    const isSub  = statusCode === 403
    const isBusy = statusCode === 503
    const isNotFound = statusCode === 404

    return (
      <div className="min-h-screen bg-[#0A0E1A] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl mb-6"
        >
          {isAuth ? '🔐' : isSub ? '🔒' : isBusy ? '⏳' : '😕'}
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3">
          {isAuth ? 'Tizimga kirish talab qilinadi'
          : isSub  ? 'Obuna talab qilinadi'
          : isBusy ? 'Video hali tayyor emas'
          :          'Video topilmadi'}
        </h2>
        <p className="text-gray-400 mb-8 max-w-sm">
          {isAuth ? 'Videoni ko\'rish uchun avval tizimga kiring.'
          : isSub  ? 'Ushbu videoni ko\'rish uchun Telegram va Instagram kanallarimizga obuna bo\'ling.'
          : isBusy ? 'Video Bunny.net da hali qayta ishlanmoqda yoki yuklanmagan. Iltimos, keyinroq qayta urinib ko\'ring.'
          :          'Bunday video mavjud emas yoki o\'chirib yuborilgan.'}
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          {isAuth && (
            <Link href="/login" className="btn btn-primary rounded-full px-8">Kirish</Link>
          )}
          {isSub && (
            <Link
              href={`/subscription?returnUrl=/videos/${id}`}
              className="btn btn-primary rounded-full px-8"
            >
              Obuna bo&apos;lish
            </Link>
          )}
          {isBusy && (
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary rounded-full px-8"
            >
              Qayta yuklash
            </button>
          )}
          <Link href="/courses" className="btn btn-outline btn-sm rounded-full px-6 text-white border-white/20">Kurslarga qaytish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Orqaga tugma */}
        <motion.button 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
          <span>Orqaga</span>
        </motion.button>

        {/* Video Header Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#0d1224]/60 border border-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl"
        >
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="badge badge-primary badge-outline font-bold text-[10px] uppercase tracking-widest px-3">
              Kurs: {video.course?.title || 'Dars'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight tracking-tight">
            {video.title}
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
            {video.description || "Ushbu dars haqida hozircha tavsif qo'shilmagan."}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-gray-400">
              <IoTime className="text-indigo-400" />
              <span className="text-sm font-medium">{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <IoEye className="text-indigo-400" />
              <span className="text-sm font-medium">
                {(video.viewCount ?? video.views ?? 0).toLocaleString()} marta ko'rilgan
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <IoStar className="text-yellow-400" />
              <span className="text-sm font-medium">{video.rating?.average?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
        </motion.div>

        {/* Video Player Section */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-[2.5rem] overflow-hidden aspect-video relative bg-black border border-white/5 shadow-2xl group"
        >
          {!isLoggedIn ? (
            /* Not logged in */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#0d1224] to-[#1a1c2e]">
              <div className="w-24 h-24 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
                  <IoPlay size={32} className="ml-1" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Tizimga kiring</h2>
              <p className="text-gray-400 text-center px-8 max-w-md mb-8">
                Videoni ko&apos;rish uchun avval tizimga kiring.
              </p>
              <Link href="/login" className="btn btn-primary bg-indigo-500 hover:bg-indigo-600 border-none rounded-full px-10 h-14 font-bold text-lg shadow-xl shadow-indigo-500/20">
                Kirish
              </Link>
            </div>
          ) : !isSubscribed ? (
            /* Logged in but not subscribed */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#0d1224] to-[#1a1c2e] group">
              <div className="w-24 h-24 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
                  <IoPlay size={32} className="ml-1" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Obuna talab qilinadi</h2>
              <p className="text-gray-400 text-center px-8 max-w-md mb-8">
                Ushbu darsni ko&apos;rish uchun Telegram va Instagram kanallarimizga obuna bo&apos;ling.
              </p>
              <button
                onClick={handleVideoClick}
                className="btn btn-primary bg-indigo-500 hover:bg-indigo-600 border-none rounded-full px-10 h-14 font-bold text-lg shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
              >
                🔓 Obuna bo&apos;lish
              </button>
            </div>
          ) : embedUrl ? (
            /* Subscribed + Bunny Stream */
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (videoLink as any)?.telegramLink ? (
            /* Subscribed + Telegram link */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#0d1224] to-[#1a1c2e]">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-600/20 shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/40">
                  <IoPlay size={32} className="ml-1" />
                </div>
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">Video Telegram&apos;da joylashgan</h2>
              <p className="mb-8 max-w-md px-8 text-center text-gray-400">
                Ushbu darsni ko&apos;rish uchun quyidagi tugmani bosing va biz taqdim etgan havola orqali videoga o&apos;ting.
              </p>
              <a
                href={(videoLink as any).telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary h-14 rounded-full border-none bg-indigo-500 px-10 text-lg font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-600"
              >
                ▶ Videoni ko&apos;rish
              </a>
            </div>
          ) : (
            /* Subscribed but no link — video processing */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#0d1224] to-[#1a1c2e]">
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center mb-6">
                <span className="text-3xl">⏳</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Video tayyorlanmoqda</h2>
              <p className="text-gray-400 text-center px-8 max-w-md mb-6">
                Video hali ishlanmoqda. Iltimos, bir oz kuting.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-outline text-white border-white/20 rounded-full px-8 hover:bg-white/10"
              >
                🔄 Yangilash
              </button>
            </div>
          )}
        </motion.div>

        {/* Playground Redirect */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl backdrop-blur-sm"
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Amaliyot bilan o&apos;rganing</h3>
            <p className="text-gray-400 text-sm">Playground orqali yozilgan kodlarni sinab ko&apos;ring.</p>
          </div>
          <Link
            href={`/videos/${id}/playground`}
            className="btn bg-white/5 hover:bg-indigo-500 hover:text-white text-white border-white/10 rounded-2xl normal-case gap-2 px-8 h-12 transition-all duration-300"
          >
            <IoCodeSlash />
            Playground&apos;da o&apos;rganish →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Materials */}
          {video?.materials && video.materials.length > 0 && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0d1224]/60 border border-white/5 rounded-3xl p-6 sm:p-8"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <IoDocumentText className="text-indigo-400" />
                Dars Materiallari
              </h3>
              <div className="space-y-3">
                {video.materials.map((mat: { name: string; url: string }, i: number) => (
                  <a
                    key={i}
                    href={mat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                      <IoDocumentText className="text-indigo-400" size={18} />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                      {mat.name}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Q&A */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0d1224]/60 border border-white/5 rounded-3xl p-6 sm:p-8"
          >
            <h3 className="text-lg font-bold text-white mb-6">Savol va Javoblar</h3>
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0 shadow-lg" />
              <div className="flex-1 relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 px-4 py-3 resize-none focus:outline-none focus:border-indigo-500/50 transition-colors"
                  rows={3}
                  placeholder="Dars bo'yicha savolingiz bormi?"
                />
                <button
                  onClick={() => setQuestion('')}
                  disabled={!question.trim()}
                  className="absolute bottom-3 right-3 px-4 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg active:scale-95"
                >
                  Yuborish
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Q&A Comments Section */}
      <VideoComments videoId={id} />

      {/* Instagram Verification Modal */}
      <SubscriptionGate
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        videoId={id}
      />
    </div>
  );
}
