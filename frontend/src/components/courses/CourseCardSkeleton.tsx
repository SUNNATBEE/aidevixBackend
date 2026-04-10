import React from 'react';
import Skeleton from '@/components/common/Skeleton';

export default function CourseCardSkeleton() {
  return (
    <div className="block overflow-hidden rounded-[2rem] border border-white/8 bg-[#11141b] transition-all duration-500">
      {/* Thumbnail Skeleton */}
      <Skeleton className="aspect-video w-full rounded-none" />
      
      {/* Body Skeleton */}
      <div className="flex h-auto flex-col justify-between p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/8 pt-5">
          <Skeleton className="h-4 w-16" />
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
