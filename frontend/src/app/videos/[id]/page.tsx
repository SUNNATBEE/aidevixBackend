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
import IntegratedPlayground from '@/components/videos/IntegratedPlayground';

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
  const [isSticky, setIsSticky] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1024);
  const wasSubscribedRef = useRef(isSubscribed);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Progress tracking: har 10 soniyada POST /api/videos/{id}/progress
  const watchedSecondsRef = useRef<number>(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (id) fetchById(id);
  }, [id]);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

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

  // Sticky video logic
  useEffect(() => {
    const handleScroll = () => {
      if (!videoContainerRef.current) return;
      const rect = videoContainerRef.current.getBoundingClientRect();
      const shouldBeSticky = rect.bottom < 0;
      setIsSticky(shouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-[#0A0E1A] text-white pt-20 sm:pt-24 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
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
          className="mb-6 flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white sm:mb-8 sm:text-base group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
          <span>Orqaga</span>
        </motion.button>

        {/* Video Header Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 rounded-2xl border border-white/5 bg-[#0d1224]/60 p-4 shadow-2xl backdrop-blur-md sm:mb-10 sm:rounded-3xl sm:p-10"
        >
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="badge badge-primary badge-outline px-2 sm:px-3 font-bold text-[10px] uppercase tracking-wider">
              Kurs: {video.course?.title || 'Dars'}
            </span>
          </div>

          <h1 className="mb-3 text-2xl font-black leading-tight tracking-tight text-white sm:mb-4 sm:text-4xl">
            {video.title}
          </h1>

          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-gray-400 sm:mb-8 sm:text-lg">
            {video.description || "Ushbu dars haqida hozircha tavsif qo'shilmagan."}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-5 sm:pt-6 border-t border-white/5">
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
        <div ref={videoContainerRef} className="mb-8 sm:mb-10 aspect-video">
          <motion.div 
            layout
            initial={{ scale: 0.95, opacity: 0 }}
            animate={isSticky ? { 
              scale: 1, 
              opacity: 1,
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: viewportWidth < 360 ? 156 : viewportWidth < 640 ? 200 : 320,
              height: viewportWidth < 360 ? 88 : viewportWidth < 640 ? 112 : 180,
              zIndex: 100,
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)'
            } : { 
              scale: 1, 
              opacity: 1,
              position: 'relative',
              width: '100%',
              height: '100%',
              bottom: 'auto',
              right: 'auto',
              zIndex: 1
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`rounded-[2.5rem] overflow-hidden bg-black border border-white/5 shadow-2xl group ${isSticky ? 'pointer-events-auto' : ''}`}
          >
          {!isLoggedIn ? (
            /* Not logged in */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#0d1224] to-[#1a1c2e] px-3 text-center">
              <div className="mb-4 sm:mb-6 flex h-16 w-16 sm:h-24 sm:w-24 rounded-full border border-indigo-500/30 bg-indigo-600/20 items-center justify-center shadow-2xl">
                <div className="flex h-10 w-10 sm:h-16 sm:w-16 rounded-full bg-indigo-500 items-center justify-center text-white shadow-lg shadow-indigo-500/40">
                  <IoPlay size={32} className="ml-1" />
                </div>
              </div>
              <h2 className="mb-2 text-xl sm:text-2xl font-bold text-white">Tizimga kiring</h2>
              <p className="mb-5 sm:mb-8 max-w-md px-2 sm:px-8 text-sm sm:text-base text-gray-400">
                Videoni ko&apos;rish uchun avval tizimga kiring.
              </p>
              <Link href="/login" className="btn btn-primary border-none bg-indigo-500 hover:bg-indigo-600 rounded-full px-5 sm:px-10 h-11 sm:h-14 font-bold text-sm sm:text-lg shadow-xl shadow-indigo-500/20">
                Kirish
              </Link>
            </div>
          ) : !isSubscribed ? (
            /* Logged in but not subscribed */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#0d1224] to-[#1a1c2e] group px-3 text-center">
              <div className="mb-4 sm:mb-6 flex h-16 w-16 sm:h-24 sm:w-24 rounded-full border border-indigo-500/30 bg-indigo-600/20 items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <div className="flex h-10 w-10 sm:h-16 sm:w-16 rounded-full bg-indigo-500 items-center justify-center text-white shadow-lg shadow-indigo-500/40">
                  <IoPlay size={32} className="ml-1" />
                </div>
              </div>
              <h2 className="mb-2 text-xl sm:text-2xl font-bold text-white">Obuna talab qilinadi</h2>
              <p className="mb-5 sm:mb-8 max-w-md px-2 sm:px-8 text-sm sm:text-base text-gray-400">
                Ushbu darsni ko&apos;rish uchun Telegram va Instagram kanallarimizga obuna bo&apos;ling.
              </p>
              <button
                onClick={handleVideoClick}
                className="btn btn-primary border-none bg-indigo-500 hover:bg-indigo-600 rounded-full px-5 sm:px-10 h-11 sm:h-14 font-bold text-sm sm:text-lg shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#0d1224] to-[#1a1c2e] px-3 text-center">
              <div className="mb-4 sm:mb-6 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-600/20 shadow-2xl transition-transform duration-500 group-hover:scale-110">
                <div className="flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/40">
                  <IoPlay size={32} className="ml-1" />
                </div>
              </div>
              <h2 className="mb-2 text-xl sm:text-2xl font-bold text-white">Video Telegram&apos;da joylashgan</h2>
              <p className="mb-5 sm:mb-8 max-w-md px-2 sm:px-8 text-sm sm:text-base text-gray-400">
                Ushbu darsni ko&apos;rish uchun quyidagi tugmani bosing va biz taqdim etgan havola orqali videoga o&apos;ting.
              </p>
              <a
                href={(videoLink as any).telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary h-11 sm:h-14 rounded-full border-none bg-indigo-500 px-5 sm:px-10 text-sm sm:text-lg font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-600"
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
          {isSticky && (
            <button 
              onClick={() => setIsSticky(false)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black rounded-full text-white z-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <IoArrowBack className="rotate-90" />
            </button>
          )}
        </motion.div>
        </div>

        {/* Integrated Playground Section */}
        {isSubscribed && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <IntegratedPlayground 
              videoId={id} 
              category={video.course?.category || 'javascript'} 
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 mt-10 sm:mt-12">
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
