import React from 'react';
import CourseCardSkeleton from '@/components/courses/CourseCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
          <div className="h-12 w-64 animate-pulse rounded-xl bg-white/5" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-white/5" />
        </div>

        {/* Filter bar skeleton */}
        <div className="mb-10 flex flex-wrap gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-white/5" />
          ))}
        </div>

        {/* Courses grid skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
