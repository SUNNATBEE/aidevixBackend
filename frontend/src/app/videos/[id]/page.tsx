'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IoPlay, IoTime, IoEye, IoLockClosed, IoArrowBack, IoCodeSlash, IoStar } from 'react-icons/io5';
import { selectIsLoggedIn } from '@/store/slices/authSlice';
import { selectInstagramSub } from '@/store/slices/subscriptionSlice';
import { useVideos } from '@hooks/useVideos';
import { formatDuration } from '@utils/formatDuration';
import { ROUTES } from '@utils/constants';
import SubscriptionGate from '@/components/subscription/SubscriptionGate';

export default function VideoPage() {
  const { id }: { id: string } = useParams();
  const router = useRouter();
  const { current: video, videoLink, loading, error, fetchById } = useVideos();
  const [modalOpen, setModalOpen] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const instagram = useSelector(selectInstagramSub);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (id) fetchById(id);
  }, [id]);

  const handleVideoClick = (e: React.MouseEvent) => {
    // Agar foydalanuvchi login qilmagan yoki Instagram tasdiqlanmagan bo'lsa
    if (!isLoggedIn || !instagram?.subscribed) {
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
    const statusCode = (error as { statusCode?: number })?.statusCode
    const isAuth = statusCode === 401
    const isSub  = statusCode === 403

    return (
      <div className="min-h-screen bg-[#0A0E1A] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-6">{isAuth ? '🔐' : isSub ? '🔒' : '😕'}</div>
        <h2 className="text-2xl font-bold text-white mb-3">
          {isAuth ? 'Tizimga kirish talab qilinadi'
          : isSub  ? 'Obuna talab qilinadi'
          :          'Video topilmadi'}
        </h2>
        <p className="text-gray-400 mb-8 max-w-sm">
          {isAuth ? 'Videoni ko\'rish uchun avval tizimga kiring.'
          : isSub  ? 'Ushbu videoni ko\'rish uchun Telegram va Instagram kanallarimizga obuna bo\'ling.'
          :          'Bunday video mavjud emas yoki o\'chirib yuborilgan.'}
        </p>
        <div className="flex gap-3">
          {isAuth && (
            <Link href="/login" className="btn btn-primary rounded-full px-8">Kirish</Link>
          )}
          {isSub && (
            <Link href="/subscription" className="btn btn-primary rounded-full px-8">Obuna bo'lish</Link>
          )}
          <Link href="/courses" className="btn btn-outline btn-sm rounded-full px-6 text-white border-white/20">Kurslarga qaytish</Link>
        </div>
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
              <span className="text-sm font-medium">{video.views?.toLocaleString() || 0} marta ko'rilgan</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <IoStar className="text-yellow-400" />
              <span className="text-sm font-medium">{video.rating?.average?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="rounded-[2.5rem] overflow-hidden aspect-video relative bg-black border border-white/5 shadow-2xl">
          {videoLink?.embedUrl && (isLoggedIn && instagram?.subscribed) ? (
            <iframe
              src={videoLink.embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#0d1224] to-[#1a1c2e] group">
              <div className="w-24 h-24 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
                  <IoPlay size={32} className="ml-1" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Videoni ko&apos;rish</h2>
              <p className="text-gray-400 text-center px-8 max-w-md mb-8">
                Ushbu darsni ko&apos;rish uchun obuna tasdiqlanishi kerak.
              </p>
              <button
                onClick={handleVideoClick}
                className="btn btn-primary bg-indigo-500 hover:bg-indigo-600 border-none rounded-full px-10 h-14 font-bold text-lg shadow-xl shadow-indigo-500/20"
              >
                ▶ Videoni ko&apos;rish
              </button>
            </div>
          )}
        </div>

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
