import React from 'react';
import VideoCardSkeleton from '@/components/videos/VideoCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
          {/* Main Info Skeleton */}
          <div className="space-y-8">
            <div className="aspect-video w-full animate-pulse rounded-[2.5rem] bg-white/5" />
            <div className="space-y-4">
              <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-white/5 md:h-16" />
              <div className="h-20 w-full animate-pulse rounded-2xl bg-white/5" />
            </div>
            
            <div className="flex gap-4">
               <div className="h-12 w-32 animate-pulse rounded-full bg-white/5" />
               <div className="h-12 w-32 animate-pulse rounded-full bg-white/5" />
            </div>

            <div className="space-y-6 pt-10">
              <div className="h-8 w-48 animate-pulse rounded-xl bg-white/5" />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <VideoCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="h-64 w-full animate-pulse rounded-[2rem] border border-white/5 bg-white/5" />
            <div className="h-48 w-full animate-pulse rounded-[2rem] border border-white/5 bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
