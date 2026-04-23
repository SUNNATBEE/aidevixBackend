'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IoPlay, IoTime, IoEye, IoLockClosed, IoArrowBack, IoCodeSlash, IoStar } from 'react-icons/io5';
import { selectIsLoggedIn } from '@/store/slices/authSlice';
import { selectInstagramSub, selectTelegramSub } from '@/store/slices/subscriptionSlice';
import { useVideos } from '@hooks/useVideos';
import { formatDuration } from '@utils/formatDuration';
import { ROUTES } from '@utils/constants';
import SubscriptionGate from '@/components/subscription/SubscriptionGate';
import VideoComments from '@/components/videos/VideoComments';

export default function VideoPage() {
  const { id }: { id: string } = useParams();
  const router = useRouter();
  const { current: video, videoLink, player, loading, error, fetchById } = useVideos();
  const embedUrl = player && typeof player === 'object' && 'embedUrl' in player ? (player as { embedUrl?: string }).embedUrl : undefined;
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const instagram = useSelector(selectInstagramSub);
  const telegram = useSelector(selectTelegramSub);
  const isSubscribed = !!(isLoggedIn && instagram?.subscribed && telegram?.subscribed);
  const [showModal, setShowModal] = useState<boolean>(false);
  const wasSubscribedRef = useRef(isSubscribed);

  useEffect(() => {
    if (id) fetchById(id);
  }, [id]);

  // Obuna bekor qilinganda avtomatik gate ochish
  useEffect(() => {
    if (wasSubscribedRef.current && !isSubscribed && isLoggedIn) {
      setShowModal(true);
    }
    wasSubscribedRef.current = isSubscribed;
  }, [isSubscribed, isLoggedIn]);

  const handleVideoClick = (e: React.MouseEvent) => {
    // Agar foydalanuvchi login qilmagan yoki obuna bo'lmagan bo'lsa
    if (!isSubscribed) {
      e.preventDefault();
      setShowModal(true);
    }
    // Aks holda Telegram linkga o'tadi
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    // Instagram tasdiqlangandan keyin sahifani qayta yuklash
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Video topilmadi</h2>
        <Link href="/courses" className="btn btn-primary rounded-full px-8">Kurslarga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Orqaga tugma */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
          <span>Orqaga</span>
        </button>

        {/* Video Header Section */}
        <div className="bg-[#0d1224]/60 border border-white/5 rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="badge badge-primary badge-outline font-bold text-[10px] uppercase tracking-widest px-3">
              Kurs: {video.course?.title || 'Dars'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
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
        </div>

        {/* Video: Bunny Stream iframe yoki Telegram havola */}
        {embedUrl ? (
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black shadow-2xl">
            <div className="aspect-video w-full">
              <iframe
                title={video.title}
                src={embedUrl}
                className="h-full w-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="border-t border-white/10 bg-[#0d1224]/80 px-4 py-3 text-center text-xs text-slate-400">
              Player Bunny.net Stream orqali. Havola muddatli imzo bilan himoyalangan.
            </p>
          </div>
        ) : (
          <div className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/5 bg-black/40 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-600/20 shadow-2xl transition-transform duration-500 group-hover:scale-110">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/40">
                <IoPlay size={32} className="ml-1" />
              </div>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white">Video Telegram&apos;da joylashgan</h2>
            <p className="mb-8 max-w-md px-8 text-center text-gray-400">
              Ushbu darsni ko&apos;rish uchun quyidagi tugmani bosing va biz taqdim etgan havola orqali videoga o&apos;ting.
            </p>

            {videoLink && isSubscribed ? (
              <a
                href={videoLink.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary h-14 rounded-full border-none bg-indigo-500 px-10 text-lg font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-600"
              >
                ▶ Videoni ko&apos;rish
              </a>
            ) : (
              <button
                type="button"
                onClick={handleVideoClick}
                className="btn btn-primary h-14 rounded-full border-none bg-indigo-500 px-10 text-lg font-bold shadow-xl shadow-indigo-500/20 hover:bg-indigo-600"
              >
                ▶ Videoni ko&apos;rish
              </button>
            )}
          </div>
        )}

        {/* Playground Redirect */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Amaliyot bilan o&apos;rganing</h3>
            <p className="text-gray-400 text-sm">Playground orqali yozilgan kodlarni sinab ko&apos;ring.</p>
          </div>
          <Link 
            href={`/videos/${id}/playground`} 
            className="btn bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-2xl normal-case gap-2 px-8 h-12"
          >
            <IoCodeSlash />
            Playground&apos;da o&apos;rganish →
          </Link>
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
