'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiBook, FiUsers, FiDollarSign, FiLogOut, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Courses', href: '/admin/courses', icon: <FiBook className="w-5 h-5" /> },
    { name: 'Users', href: '/admin/users', icon: <FiUsers className="w-5 h-5" /> },
    { name: 'Payments', href: '/admin/payments', icon: <FiDollarSign className="w-5 h-5" /> },
    { name: 'Settings', href: '/admin/settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex text-sm font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col items-stretch overflow-hidden shadow-2xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0 select-none">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
            <span className="font-bold text-white text-lg">A</span>
          </div>
          <span className="font-bold text-lg tracking-wide text-white">SuperAdmin</span>
        </div>

        <nav className="flex-1 overflow-y-auto w-full py-6 px-4 space-y-2">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Management</p>
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href));
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group overflow-hidden ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="admin-sidebar-active" 
                    className="absolute inset-0 bg-indigo-600/10 border border-indigo-500/20 rounded-lg -z-10" 
                  />
                )}
                {/* Accent bar for active state */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
                <span className={`z-10 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {link.icon}
                </span>
                <span className="z-10 truncate">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors">
            <FiLogOut className="w-4 h-4" /> Exit to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f111a]">
        <header className="h-16 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-10 shrink-0">
          <h2 className="text-xl font-bold text-white capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
              <FiUsers className="w-4 h-4" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
