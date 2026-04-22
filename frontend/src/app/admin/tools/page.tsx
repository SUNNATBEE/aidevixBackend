'use client';

import React, { useState } from 'react';
import { createDailyChallenge } from '@/api/adminApi';
import toast from 'react-hot-toast';

const TYPES = [
  { value: 'watch_video', label: 'Video ko‘rish' },
  { value: 'complete_quiz', label: 'Quiz tugatish' },
  { value: 'streak', label: 'Streak' },
  { value: 'enroll_course', label: 'Kursga yozilish' },
  { value: 'rate_course', label: 'Kursni baholash' },
] as const;

export default function AdminToolsPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('watch_video');
  const [targetCount, setTargetCount] = useState(1);
  const [xpReward, setXpReward] = useState(50);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      toast.error('Sarlavha va sana majburiy');
      return;
    }
    setSaving(true);
    try {
      await createDailyChallenge({
        title: title.trim(),
        description: description.trim() || `${title.trim()} — kunlik vazifa`,
        type,
        targetCount,
        xpReward,
        date,
      });
      toast.success('Kunlik vazifa yaratildi');
      setTitle('');
      setDescription('');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Yaratishda xato');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Kunlik vazifa (challenge)</h2>
        <p className="mt-1 text-sm text-slate-400">
          Har bir sana uchun bitta faol vazifa. Bu yerda POST{' '}
          <code className="rounded bg-slate-800 px-1 text-xs text-amber-200/90">/api/challenges/admin</code> chaqiriladi.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-white/10 bg-[#0f121c] p-6 shadow-xl"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-400">Sarlavha</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none"
            placeholder="Masalan: 3 ta darsni ko‘ring"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-400">Tavsif (ixtiyoriy)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-amber-500/50 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">Tur</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none"
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">Sana (YYYY-MM-DD)</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">Maqsad (soni)</label>
            <input
              type="number"
              min={1}
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value) || 1)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">XP mukofoti</label>
            <input
              type="number"
              min={0}
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-semibold text-slate-950 shadow-lg shadow-amber-500/25 disabled:opacity-50"
        >
          {saving ? 'Saqlanmoqda…' : 'Vazifani yaratish'}
        </button>
      </form>
    </div>
  );
}
