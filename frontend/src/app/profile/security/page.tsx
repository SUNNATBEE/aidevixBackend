'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@utils/constants';

/** Eski URL — barcha xavfsizlik sozlamalari `/settings/security` da. */
export default function ProfileSecurityRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(ROUTES.SETTINGS_SECURITY);
  }, [router]);
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center text-slate-400 text-sm">
      Xavfsizlik sahifasiga yo‘naltirilmoqda…
    </div>
  );
}
