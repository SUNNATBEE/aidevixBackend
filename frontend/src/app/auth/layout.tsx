import { Suspense } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-indigo-500" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
