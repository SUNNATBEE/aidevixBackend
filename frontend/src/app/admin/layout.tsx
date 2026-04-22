'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiExternalLink, FiShield } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectUser } from '@store/slices/authSlice';
import AdminRoute from '@/components/auth/AdminRoute';
import { ADMIN_NAV } from '@/config/adminNav';

function NavLink({
  href,
  label,
  hint,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={hint}
      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all ${
        active
          ? 'text-white'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
      } `}
    >
      {active && (
        <motion.div
          layoutId="admin-nav-glow"
          className="absolute inset-0 -z-10 rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/15 via-amber-400/5 to-transparent"
          transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
        />
      )}
      {active && (
        <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-amber-300 to-amber-600 shadow-[0_0_12px_rgba(251,191,36,0.55)]" />
      )}
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
          active
            ? 'border-amber-500/40 bg-amber-500/15 text-amber-200'
            : 'border-slate-700/80 bg-slate-900 text-slate-500'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{label}</span>
        <span className="block truncate text-[11px] font-normal text-slate-500">{hint}</span>
      </span>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useSelector(selectUser);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle =
    ADMIN_NAV.flatMap((s) => s.items).find((i) => i.href === pathname)?.label ||
    (pathname?.includes('/admin/courses/') ? 'Kurs tahriri' : 'Admin');

  const sidebar = (
    <div className="flex h-full flex-col border-r border-white/10 bg-[#0a0c14]/95 backdrop-blur-xl">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 font-display text-lg font-bold text-slate-950 shadow-lg shadow-amber-500/25">
          A
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold tracking-wide text-white">Aidevix Admin</p>
          <p className="truncate text-[11px] text-amber-200/80">Premium boshqaruv paneli</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {ADMIN_NAV.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href + '/'));
                return (
                  <NavLink
                    key={item.href}
                    {...item}
                    active={!!active}
                    onNavigate={() => setMobileOpen(false)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-4">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 py-2.5 text-sm font-medium text-slate-200 transition hover:border-amber-500/40 hover:bg-slate-800"
        >
          <FiExternalLink className="h-4 w-4 opacity-70" />
          Saytga qaytish
        </Link>
      </div>
    </div>
  );

  return (
    <AdminRoute>
      <div className="min-h-screen bg-[#06070d] font-sans text-slate-200">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(251,191,36,0.9), transparent 45%),
              radial-gradient(circle at 80% 0%, rgba(99,102,241,0.7), transparent 40%),
              radial-gradient(circle at 50% 100%, rgba(14,165,233,0.5), transparent 50%)`,
          }}
        />

        <div className="relative z-10 flex min-h-screen">
          {/* Desktop sidebar */}
          <aside className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">{sidebar}</aside>

          {/* Mobile drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {mobileOpen && (
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,18rem)] shadow-2xl lg:hidden"
              >
                {sidebar}
              </motion.aside>
            )}
          </AnimatePresence>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#0a0c14]/85 px-4 backdrop-blur-md sm:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-slate-700/80 p-2 text-slate-200 lg:hidden"
                  onClick={() => setMobileOpen((o) => !o)}
                  aria-label="Menyu"
                >
                  {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
                </button>
                <div>
                  <h1 className="font-display text-lg font-bold text-white sm:text-xl">{pageTitle}</h1>
                  <p className="hidden text-xs text-slate-500 sm:block">Barcha o‘zgarishlar API orqali saqlanadi</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300 sm:inline-flex">
                  <FiShield className="h-3.5 w-3.5" />
                  {user?.role === 'admin' ? 'Administrator' : user?.role}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-sm font-bold text-amber-200">
                  {(user?.username || '?').slice(0, 1).toUpperCase()}
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
