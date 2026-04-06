'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { IoPlay, IoTime, IoBookOutline, IoStar } from 'react-icons/io5';
import { selectIsLoggedIn } from '@/store/slices/authSlice';
import { selectInstagramSub } from '@/store/slices/subscriptionSlice';
import { ROUTES } from '@/utils/constants';
import { formatDurationText } from '@/utils/formatDuration';
import SubscriptionGate from '@/components/subscription/SubscriptionGate';

const CAT = {
  html:       { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400',  label: 'HTML',   glow: 'hover:shadow-orange-500/10'  },
  css:        { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',    label: 'CSS',    glow: 'hover:shadow-blue-500/10'    },
  javascript: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400',  label: 'JS',     glow: 'hover:shadow-yellow-500/10'  },
  typescript: { bg: 'bg-blue-600/10',   border: 'border-blue-600/20',   text: 'text-blue-300',    label: 'TS',     glow: 'hover:shadow-blue-600/10'    },
  react:      { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   text: 'text-cyan-400',    label: 'React',  glow: 'hover:shadow-cyan-500/10'    },
  redux:      { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400',  label: 'Redux',  glow: 'hover:shadow-purple-500/10'  },
  nodejs:     { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400',   label: 'Node',   glow: 'hover:shadow-green-500/10'   },
  tailwind:   { bg: 'bg-teal-500/10',   border: 'border-teal-500/20',   text: 'text-teal-400',    label: 'TW',     glow: 'hover:shadow-teal-500/10'    },
  general:    { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400',  label: 'Other',  glow: 'hover:shadow-violet-500/10'  },
}

interface CourseProps {
  course: any;
  index?: number;
  className?: string;
}

export default function CourseCard({ course, index = 0, className = '' }: CourseProps) {
  const cardRef = useRef(null)
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const instagram = useSelector(selectInstagramSub);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay: Math.min(index * 0.1, 1), ease: 'power3.out' },
    )
  }, [index])

  const onEnter = () => gsap.to(cardRef.current, { y: -4, shadow: '0 10px 40px -5px rgba(124, 58, 237, 0.2)', scale: 1.01, duration: 0.3, ease: 'power2.out' })
  const onLeave = () => gsap.to(cardRef.current, { y: 0,  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', scale: 1,     duration: 0.3, ease: 'power2.out' })

  if (!course) return null

  const cat          = CAT[course.category as keyof typeof CAT] || CAT.general
  const totalSecs    = (course.videos || []).reduce((s: any, v: any) => s + (v.duration || 0), 0)
  const videoCount   = course.videos?.length ?? course.videoCount ?? 0
  const rating       = typeof course.rating === 'object' ? (course.rating?.average ?? 0) : (course.rating ?? 0)
  const ratingCount  = typeof course.rating === 'object' ? (course.rating?.count ?? 0)   : (course.ratingCount ?? 0)
  const isPro        = course.price > 0
  const instructorName = typeof course.instructor === 'object'
    ? (course.instructor?.firstName ? `${course.instructor.firstName} ${course.instructor.lastName || ''}` : course.instructor?.username) 
    : course.instructor
    
  const isNew = course.createdAt
    ? Date.now() - new Date(course.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000
    : false

  const handleClick = (e: React.MouseEvent) => {
    // Agar foydalanuvchi login qilmagan yoki Instagram tasdiqlanmagan bo'lsa
    if (!isLoggedIn || !instagram?.subscribed) {
      e.preventDefault();
      setShowModal(true);
    }
    // Aks holda Link o'z ishini qiladi
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    // Instagram tasdiqlangandan keyin kursga o'tish
    window.location.href = ROUTES.COURSE(course._id);
  };

  return (
    <>
      <Link
        href={ROUTES.COURSE(course._id)}
        ref={cardRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={handleClick}
        className={
          'group block rounded-3xl overflow-hidden bg-[#12141c] border border-white/5 ' +
          'transition-all duration-500 ' +
          cat.glow + ' ' + className
        }
      >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#0f1115] overflow-hidden">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className={'w-full h-full flex items-center justify-center ' + cat.bg}>
            <span className={'text-4xl font-black tracking-tighter opacity-40 ' + cat.text}>
              {cat.label}
            </span>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay group-hover:bg-blue-600/0 transition-colors" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
           <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 scale-50 group-hover:scale-100 transition-transform duration-500">
             <IoPlay className="text-white text-xl translate-x-0.5" />
           </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isNew && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-lg shadow-emerald-500/20">
              YANGI
            </span>
          )}
          {isPro && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur-md shadow-lg shadow-indigo-600/20">
              PRO
            </span>
          )}
        </div>

        <div className={'absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ' + cat.bg + ' ' + cat.text + ' ' + cat.border}>
          {cat.label}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col justify-between h-auto">
        <div className="space-y-3">
          {/* Meta Info */}
          <div className="flex items-center gap-3 text-[10px] font-medium tracking-wide text-white/30">
            <span className="flex items-center gap-1.5 py-1 px-2 bg-white/5 rounded-lg border border-white/5">
              <IoBookOutline className="text-xs" />
              {videoCount} dars
            </span>
            {totalSecs > 0 && (
              <span className="flex items-center gap-1.5 py-1 px-2 bg-white/5 rounded-lg border border-white/5">
                <IoTime className="text-xs" />
                {formatDurationText(totalSecs)}
              </span>
            )}
          </div>

          <h3 className="font-bold text-base leading-snug line-clamp-2 text-white group-hover:text-indigo-400 transition-colors duration-300">
            {course.title}
          </h3>

          <div className="flex items-center gap-2 group/author">
            <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-indigo-500/20 group-hover/author:bg-indigo-600/30 transition-colors">
              {instructorName?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="text-xs text-white/40 group-hover/author:text-white/60 transition-colors truncate">
              {instructorName || 'Aidevix Mentor'}
            </span>
          </div>
        </div>

        {/* Rating + Price */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <div className="flex text-yellow-500">
              <IoStar className="text-xs" />
            </div>
            <span className="text-sm font-bold text-white/80">
              {rating > 0 ? Number(rating).toFixed(1) : '—'}
            </span>
            {ratingCount > 0 && (
              <span className="text-xs text-white/20 font-medium">({ratingCount})</span>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <span className={'text-base font-black ' + (isPro ? 'text-indigo-400' : 'text-emerald-400')}>
              {isPro ? `${course.price.toLocaleString()} so'm` : 'Bepul'}
            </span>
            {isPro && (
               <span className="text-[10px] text-white/20 line-through">
                {(course.price * 1.5).toLocaleString()} so'm
               </span>
            )}
          </div>
        </div>
      </div>
    </Link>

    {/* Instagram Verification Modal */}
    <SubscriptionGate
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onSuccess={handleModalSuccess}
    />
  </>
  )
}
