'use client';

import React, { useState } from 'react';
import { createDailyChallenge, sendTelegramMessage, bulkLinkBunny } from '@/api/adminApi';
import toast from 'react-hot-toast';
import { FiSend, FiLink, FiActivity } from 'react-icons/fi';

const TYPES = [
  { value: 'watch_video', label: "Video ko'rish" },
  { value: 'complete_quiz', label: 'Quiz tugatish' },
  { value: 'streak', label: 'Streak' },
  { value: 'enroll_course', label: 'Kursga yozilish' },
  { value: 'rate_course', label: 'Kursni baholash' },
] as const;

function ChallengeSection() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('watch_video');
  const [targetCount, setTargetCount] = useState(1);
  const [xpReward, setXpReward] = useState(50);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) { toast.error('Sarlavha va sana majburiy'); return; }
    setSaving(true);
    try {
      await createDailyChallenge({
        title: title.trim(),
        description: description.trim() || `${title.trim()} — kunlik vazifa`,
        type, targetCount, xpReward, date,
      });
      toast.success('Kunlik vazifa yaratildi');
      setTitle('');
      setDescription('');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Yaratishda xato');
    } finally { setSaving(false); }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6 shadow-xl">
      <div className="mb-5 flex items-center gap-2">
        <FiActivity className="text-amber-400" />
        <h3 className="font-display text-lg font-bold text-white">Kunlik vazifa (challenge)</h3>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-400">Sarlavha</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none"
            placeholder="Masalan: 3 ta darsni ko'ring"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-400">Tavsif (ixtiyoriy)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
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
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">Sana</label>
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
              type="number" min={1} value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value) || 1)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-400">XP mukofoti</label>
            <input
              type="number" min={0} value={xpReward}
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

function TelegramSection() {
  const [message, setMessage] = useState('');
  const [parseMode, setParseMode] = useState('HTML');
  const [sending, setSending] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) { toast.error('Xabar matni bo\'sh'); return; }
    setSending(true);
    try {
      await sendTelegramMessage(message.trim(), parseMode);
      toast.success('@aidevix kanaliga yuborildi');
      setMessage('');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Yuborishda xato');
    } finally { setSending(false); }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6 shadow-xl">
      <div className="mb-5 flex items-center gap-2">
        <FiSend className="text-sky-400" />
        <h3 className="font-display text-lg font-bold text-white">Telegram kanalga xabar</h3>
        <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] text-sky-300 border border-sky-500/20">
          @aidevix
        </span>
      </div>
      <form onSubmit={send} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-400">
            Xabar matni ({parseMode === 'HTML' ? 'HTML teglari qo\'llab-quvvatlanadi' : 'oddiy matn'})
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder={'<b>Yangilik!</b>\n\nAidevix platformasiga yangi kurslar qo\'shildi 🚀'}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-white placeholder:font-sans placeholder:text-slate-600 focus:border-sky-500/50 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            {message.length} belgi
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-400">Format</label>
          <select
            value={parseMode}
            onChange={(e) => setParseMode(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-sky-500/50 focus:outline-none"
          >
            <option value="HTML">HTML</option>
            <option value="Markdown">Markdown</option>
            <option value="">Oddiy matn</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-500/25 disabled:opacity-50"
        >
          <FiSend className="h-4 w-4" />
          {sending ? 'Yuborilmoqda…' : 'Kanalga yuborish'}
        </button>
      </form>
    </div>
  );
}

function BulkLinkSection() {
  const [raw, setRaw] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ succeeded: number; failed: { error: string }[] } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = raw.trim().split('\n').filter(Boolean);
    const links = lines.map((l) => {
      const [videoId, bunnyVideoId] = l.split(',').map((s) => s.trim());
      return { videoId, bunnyVideoId };
    }).filter((x) => x.videoId && x.bunnyVideoId);

    if (links.length === 0) { toast.error('Hech qanday juft topilmadi'); return; }
    setLoading(true);
    try {
      const res = await bulkLinkBunny(links);
      const d = (res.data as { data: { succeeded: { videoId: string }[]; failed: { error: string }[] } }).data;
      setResult({ succeeded: d.succeeded.length, failed: d.failed });
      toast.success(`${d.succeeded.length} ta video ulandi`);
      if (d.failed.length > 0) toast.error(`${d.failed.length} ta xato`);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Xato yuz berdi');
    } finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f121c] p-6 shadow-xl">
      <div className="mb-5 flex items-center gap-2">
        <FiLink className="text-violet-400" />
        <h3 className="font-display text-lg font-bold text-white">Bulk Bunny GUID ulash</h3>
      </div>
      <p className="mb-4 text-sm text-slate-400">
        Har qatorda: <code className="rounded bg-slate-800 px-1.5 text-xs text-amber-200">videoId,bunnyVideoId</code>
      </p>
      <form onSubmit={submit} className="space-y-4">
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          placeholder={"6748f3a1c2d3e4f5a6b7c8d9,03bda3b1-c05e-4a36-9edc-d1772ffa1312\n..."}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm text-white placeholder:font-sans placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !raw.trim()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/25 disabled:opacity-50"
        >
          <FiLink className="h-4 w-4" />
          {loading ? 'Ulanmoqda…' : "Hammasini ulash"}
        </button>
      </form>
      {result && (
        <div className="mt-4 rounded-xl border border-white/10 bg-slate-950 p-4 text-sm">
          <p className="text-emerald-400">{result.succeeded} ta muvaffaqiyatli</p>
          {result.failed.map((f, i) => (
            <p key={i} className="text-red-400">{f.error}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Vositalar</h2>
        <p className="mt-1 text-sm text-slate-400">
          Kunlik vazifalar, Telegram xabar yuborish va Bunny.net bulk GUID ulash.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChallengeSection />
        <TelegramSection />
      </div>
      <BulkLinkSection />
    </div>
  );
}
