'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserDetail, unwrapAdmin } from '@/api/adminApi';
import { FiArrowLeft, FiUser, FiAward, FiBookOpen, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';

type UserDetail = {
  user: {
    _id: string; username: string; email: string; role: string;
    isActive: boolean; createdAt: string; avatar?: string;
  };
  stats: { xp: number; level: number; streak: number; badges: string[] } | null;
  enrollments: { _id: string; courseId?: { title?: string; category?: string }; createdAt: string; isCompleted: boolean }[];
  payments: { _id: string; amount: number; status: string; provider?: string; createdAt: string }[];
};

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getUserDetail(id)
      .then((res) => setData(unwrapAdmin<UserDetail>(res)))
      .catch(() => toast.error("Foydalanuvchi ma'lumotlarini yuklashda xato"))
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(n || 0);
  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('uz-UZ') : '—';

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-amber-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-200">
        Foydalanuvchi topilmadi
      </div>
    );
  }

  const { user, stats, enrollments, payments } = data;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-xl border border-slate-700 p-2 text-slate-300 hover:bg-white/5"
        >
          <FiArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">{user.username}</h2>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
        <span className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${
          user.role === 'admin'
            ? 'border border-amber-500/30 bg-amber-500/15 text-amber-200'
            : 'border border-slate-600 bg-slate-900 text-slate-300'
        }`}>
          {user.role}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          user.isActive === false
            ? 'border border-red-500/30 bg-red-500/10 text-red-300'
            : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
        }`}>
          {user.isActive === false ? 'Bloklangan' : 'Faol'}
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: <FiAward />, label: 'XP', value: fmt(stats?.xp ?? 0), color: 'text-amber-400' },
          { icon: <FiUser />, label: 'Daraja', value: stats?.level ?? 0, color: 'text-sky-400' },
          { icon: <FiBookOpen />, label: 'Kurslar', value: enrollments.length, color: 'text-emerald-400' },
          { icon: <FiDollarSign />, label: "To'lovlar", value: payments.length, color: 'text-violet-400' },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-[#0f121c] p-5">
            <div className={`mb-2 ${c.color}`}>{c.icon}</div>
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Enrollments */}
        <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Kurslar ({enrollments.length})</h3>
          {enrollments.length === 0 ? (
            <p className="text-sm text-slate-500">Kurslar yo'q</p>
          ) : (
            <ul className="space-y-2">
              {enrollments.map((e) => (
                <li key={e._id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-200">
                    {e.courseId?.title || '—'}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    {e.courseId?.category && (
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                        {e.courseId.category}
                      </span>
                    )}
                    <span className={`text-xs ${e.isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {e.isCompleted ? 'Tugatgan' : 'Jarayonda'}
                    </span>
                    <span className="text-xs text-slate-600">{fmtDate(e.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Payments */}
        <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">To'lovlar ({payments.length})</h3>
          {payments.length === 0 ? (
            <p className="text-sm text-slate-500">To'lovlar yo'q</p>
          ) : (
            <ul className="space-y-2">
              {payments.map((p) => (
                <li key={p._id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 text-sm">
                  <span className="font-mono text-amber-200/90">{fmt(p.amount)} UZS</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    p.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-slate-700/50 text-slate-300'
                  }`}>
                    {p.status}
                  </span>
                  <span className="text-xs text-slate-500">{p.provider || '—'}</span>
                  <span className="text-xs text-slate-600">{fmtDate(p.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Badges */}
      {stats?.badges && stats.badges.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6">
          <h3 className="mb-4 font-display text-lg font-bold text-white">Medalllar</h3>
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((b) => (
              <span key={b} className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm text-amber-200">
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600">
        Ro'yxatdan o'tgan: {fmtDate(user.createdAt)} · ID: {user._id}
      </p>
    </div>
  );
}
