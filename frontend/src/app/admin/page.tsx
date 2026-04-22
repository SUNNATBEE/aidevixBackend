'use client';

import React, { useEffect, useState } from 'react';
import {
  getDashboardStats,
  getTopStudents,
  getCoursesStats,
  getAnalytics,
  unwrapAdmin,
} from '@/api/adminApi';
import { FiUsers, FiBookOpen, FiVideo, FiDollarSign, FiTrendingUp, FiAward, FiLayers, FiBarChart2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';

type DashboardData = {
  users: { total: number; newThisMonth: number };
  courses: { total: number };
  videos: { total: number };
  enrollments: { total: number; completed: number };
  revenue: { total: number; currency: string };
};

type StudentRow = { _id: string; username?: string; email?: string; xp: number; level: number };

type AnalyticsSeries = { label: string; value: number }[];
type AnalyticsData = {
  revenue: AnalyticsSeries;
  signups: AnalyticsSeries;
  enrollments: { _id: string; title: string; count: number }[];
};

function LineChart({ data, color }: { data: AnalyticsSeries; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 400;
  const H = 100;
  const pad = { l: 4, r: 4, t: 8, b: 20 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const pts = data.map((d, i) => {
    const x = pad.l + (i / Math.max(data.length - 1, 1)) * iW;
    const y = pad.t + iH - (d.value / max) * iH;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const fill = `${pts.join(' ')} ${pad.l + iW},${pad.t + iH} ${pad.l},${pad.t + iH}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill={`url(#grad-${color})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = pad.l + (i / Math.max(data.length - 1, 1)) * iW;
        const y = pad.t + iH - (d.value / max) * iH;
        return (
          <g key={d.label}>
            <circle cx={x} cy={y} r="3" fill={color} />
            <text x={x} y={H - 4} textAnchor="middle" fontSize="8" fill="#64748b">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function BarChart({ data, color }: { data: { label: string; count: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex h-28 items-end gap-1.5">
      {data.map((d) => (
        <div key={d._id || d.label} className="group flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{ height: `${Math.max(4, (d.count / max) * 96)}px`, background: color, opacity: 0.85 }}
            title={`${d.label}: ${d.count}`}
          />
          <span className="truncate text-[9px] text-slate-500 max-w-full px-0.5">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [courses, setCourses] = useState<
    { title: string; viewCount?: number; studentsCount?: number; price?: number; isFree?: boolean }[]
  >([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const [sRes, tRes, cRes, aRes] = await Promise.all([
          getDashboardStats(),
          getTopStudents(),
          getCoursesStats(),
          getAnalytics(),
        ]);
        if (cancelled) return;
        setStats(unwrapAdmin<DashboardData>(sRes));
        setStudents(unwrapAdmin<{ students: StudentRow[] }>(tRes).students || []);
        setCourses(unwrapAdmin<{ courses: typeof courses }>(cRes).courses || []);
        setAnalytics(unwrapAdmin<AnalyticsData>(aRes));
      } catch {
        if (!cancelled) setErr("Ma'lumot yuklanmadi. Tarmoq yoki loginni tekshiring.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 0 }).format(n || 0);

  const cards = stats
    ? [
        {
          title: 'Foydalanuvchilar',
          sub: `Bu oy +${stats.users.newThisMonth}`,
          value: formatMoney(stats.users.total),
          icon: <FiUsers className="h-6 w-6" />,
          gradient: 'from-sky-500 to-indigo-600',
        },
        {
          title: 'Kurslar',
          sub: 'Faol kurslar',
          value: formatMoney(stats.courses.total),
          icon: <FiBookOpen className="h-6 w-6" />,
          gradient: 'from-emerald-500 to-teal-600',
        },
        {
          title: 'Videolar',
          sub: 'Darslar soni',
          value: formatMoney(stats.videos.total),
          icon: <FiVideo className="h-6 w-6" />,
          gradient: 'from-amber-500 to-orange-600',
        },
        {
          title: "To'lovlar (UZS)",
          sub: 'Yakunlangan',
          value: formatMoney(stats.revenue.total),
          icon: <FiDollarSign className="h-6 w-6" />,
          gradient: 'from-violet-500 to-fuchsia-600',
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-amber-400" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-200">
        {err}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white">Umumiy ko'rinish</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-400">
            Platformaning asosiy ko'rsatkichlari. Ma'lumotlar{' '}
            <code className="mx-1 rounded bg-slate-800 px-1.5 py-0.5 text-xs">/api/admin/*</code>
            dan keladi.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/courses"
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/20"
          >
            Kurs qo'shish
          </Link>
          <Link
            href="/admin/users"
            className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500"
          >
            Foydalanuvchilar
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f121c] p-6 shadow-xl"
          >
            <div
              className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl transition group-hover:opacity-35`}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.title}</p>
                <p className="mt-3 font-display text-3xl font-bold text-white">{card.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <FiTrendingUp className="text-emerald-400/80" />
                  {card.sub}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
              >
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary bar */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-[#0f121c] p-6 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <FiLayers className="h-8 w-8 text-amber-400/90" />
            <div>
              <p className="text-xs uppercase text-slate-500">Ro'yxatdan o'tishlar</p>
              <p className="font-display text-2xl font-bold text-white">{formatMoney(stats.enrollments.total)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiAward className="h-8 w-8 text-emerald-400/90" />
            <div>
              <p className="text-xs uppercase text-slate-500">Tugatilgan</p>
              <p className="font-display text-2xl font-bold text-white">{formatMoney(stats.enrollments.completed)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiUsers className="h-8 w-8 text-sky-400/90" />
            <div>
              <p className="text-xs uppercase text-slate-500">Yangi (shu oy)</p>
              <p className="font-display text-2xl font-bold text-white">{formatMoney(stats.users.newThisMonth)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics charts */}
      {analytics && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6">
            <div className="mb-3 flex items-center gap-2">
              <FiBarChart2 className="text-amber-400" />
              <h3 className="font-display text-base font-bold text-white">Daromad (6 oy, UZS)</h3>
            </div>
            {analytics.revenue.every((d) => d.value === 0) ? (
              <p className="py-8 text-center text-sm text-slate-500">Daromad ma'lumoti yo'q</p>
            ) : (
              <LineChart data={analytics.revenue} color="#f59e0b" />
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6">
            <div className="mb-3 flex items-center gap-2">
              <FiUsers className="text-sky-400" />
              <h3 className="font-display text-base font-bold text-white">Yangi a'zolar (6 oy)</h3>
            </div>
            {analytics.signups.every((d) => d.value === 0) ? (
              <p className="py-8 text-center text-sm text-slate-500">Ro'yxatdan o'tish ma'lumoti yo'q</p>
            ) : (
              <LineChart data={analytics.signups} color="#38bdf8" />
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6">
            <div className="mb-3 flex items-center gap-2">
              <FiBookOpen className="text-emerald-400" />
              <h3 className="font-display text-base font-bold text-white">Top kurslar (enrollment)</h3>
            </div>
            {analytics.enrollments.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">Enrollment ma'lumoti yo'q</p>
            ) : (
              <BarChart
                data={analytics.enrollments.map((e) => ({ _id: e._id, label: e.title, count: e.count }))}
                color="#34d399"
              />
            )}
          </div>
        </div>
      )}

      {/* Tables */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Top o'quvchilar (XP)</h3>
            <span className="text-xs text-slate-500">10 nafar</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                  <th className="pb-3 pr-4">#</th>
                  <th className="pb-3">Foydalanuvchi</th>
                  <th className="pb-3 text-right">XP</th>
                  <th className="pb-3 text-right">Daraja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Hozircha statistika yo'q
                    </td>
                  </tr>
                ) : (
                  students.map((s, idx) => (
                    <tr key={s._id} className="text-slate-300">
                      <td className="py-3 pr-4 text-slate-500">{idx + 1}</td>
                      <td className="py-3">
                        <span className="font-medium text-white">{s.username || '—'}</span>
                        <div className="max-w-[180px] truncate text-xs text-slate-500">{s.email}</div>
                      </td>
                      <td className="py-3 text-right font-mono text-amber-200/90">{s.xp}</td>
                      <td className="py-3 text-right">{s.level}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white">Eng ko'p ko'rilgan kurslar</h3>
            <Link href="/admin/courses" className="text-xs font-medium text-amber-400 hover:text-amber-300">
              Barchasi →
            </Link>
          </div>
          <ul className="space-y-3">
            {courses.slice(0, 8).map((c, i) => (
              <li
                key={`${c.title}-${i}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3"
              >
                <span className="min-w-0 flex-1 truncate font-medium text-slate-100">{c.title}</span>
                <span className="shrink-0 text-xs text-slate-500">
                  {c.viewCount ?? 0} ko'rish · {c.isFree ? 'Bepul' : `${formatMoney(c.price ?? 0)} UZS`}
                </span>
              </li>
            ))}
            {courses.length === 0 && (
              <li className="py-6 text-center text-slate-500">Kurslar ro'yxati bo'sh</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
