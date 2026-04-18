'use client';

import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '@/api/adminApi';
import { FiUsers, FiBookOpen, FiDollarSign, FiVideo, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: 'Total Users', value: stats?.users?.total || 0, icon: <FiUsers />, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-indigo-500/20' },
    { title: 'Total Courses', value: stats?.courses?.total || 0, icon: <FiBookOpen />, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    { title: 'Total Videos', value: stats?.videos?.total || 0, icon: <FiVideo />, color: 'from-orange-500 to-red-600', shadow: 'shadow-orange-500/20' },
    { title: 'Total Revenue', value: `$${stats?.payments?.totalVolume || 0}`, icon: <FiDollarSign />, color: 'from-purple-500 to-fuchsia-600', shadow: 'shadow-purple-500/20' },
  ];

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Overview</h1>
        <div className="text-sm font-medium text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col gap-4 shadow-xl ${card.shadow} group hover:-translate-y-1 transition-transform`}
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl z-0 transition-opacity group-hover:opacity-40" />
            
            <div className="flex items-center gap-4 z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-xl shadow-lg`}>
                {card.icon}
              </div>
              <p className="text-slate-400 font-medium">{card.title}</p>
            </div>
            
            <h3 className="text-4xl font-bold text-white z-10 flex items-baseline gap-2">
              {card.value}
              <span className="text-sm font-medium text-emerald-400 flex items-center"><FiTrendingUp className="mr-1"/> +12%</span>
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Adding a placeholder for charts */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm min-h-[400px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <FiTrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Detailed Analytics</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Advanced charting will appear here bridging full user engagement and revenue history.</p>
        </div>
      </div>
    </div>
  );
}
