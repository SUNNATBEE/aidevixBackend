'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IoPlay, IoTime, IoEye, IoLockClosed, IoStar } from 'react-icons/io5';
import { selectIsLoggedIn } from '@/store/slices/authSlice';
import { selectAllVerified } from '@/store/slices/subscriptionSlice';
import { formatDurationText } from '@/utils/formatDuration';
import { ROUTES } from '@/utils/constants';

interface VideoProps {
  video: {
    _id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    duration?: number;
    viewCount?: number;
    rating?: number | { average: number; count: number };
  };
  index?: number;
}

export default function VideoCard({ video, index = 0 }: VideoProps) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const allVerified = useSelector(selectAllVerified);

  // canWatch logic: for now let's assume we need to be logged in and verified
  // but some might be free. If video has isFree, we should check that.
  const canWatch = isLoggedIn && allVerified;

  if (!video) return null;

  const rating = typeof video.rating === 'object' ? video.rating?.average : video.rating;
  const href = canWatch ? ROUTES.VIDEO(video._id) : ROUTES.SUBSCRIPTION;

  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-3 rounded-2xl bg-[#0f1115] border border-white/5 hover:bg-[#161920] hover:border-purple-500/20 transition-all duration-300 w-full"
    >
      {/* 1. Thumbnail / Order */}
      <div className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/5">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-600/10">
            <span className="text-xl font-black text-purple-400 opacity-40">
              {(index + 1).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Lock / Play Overlay */}
        {!canWatch ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <IoLockClosed className="text-yellow-500 text-xl" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform shadow-lg shadow-purple-600/40">
              <IoPlay className="text-white text-xs ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* 2. Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h3 className="text-sm font-semibold text-slate-200 line-clamp-1 group-hover:text-purple-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {video.description || "Video darslik tafsilotlari"}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-white/5 px-1.5 py-0.5 rounded-md">
            <IoTime className="text-slate-600" />
            {formatDurationText(video.duration || 0)}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
            <IoEye className="text-slate-600" />
            {video.viewCount || 0}
          </span>
          {rating && rating > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-yellow-500/80 ml-auto">
              <IoStar />
              {Number(rating).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
