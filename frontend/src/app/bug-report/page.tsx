'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '@store/slices/authSlice';
import { useLang } from '@/context/LangContext';
import { ROUTES } from '@utils/constants';
import { bugReportApi, type BugReportMine } from '@api/bugReportApi';
import { toast } from 'react-hot-toast';

function statusLabel(status: string, t: (k: string) => string) {
  const k = `bugReport.status.${status}` as const;
  const v = t(k);
  return v === k ? status : v;
}

export default function BugReportPage() {
  const { t } = useLang();
  const isAuth = useSelector(selectIsLoggedIn);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [sending, setSending] = useState(false);
  const [mine, setMine] = useState<BugReportMine[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPageUrl((u) => (u ? u : `${window.location.origin}${window.location.pathname || '/'}`));
  }, []);

  useEffect(() => {
    if (!isAuth) return;
    bugReportApi
      .mine()
      .then(({ data }) => setMine(data.data || []))
      .catch(() => {});
  }, [isAuth]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuth) {
      toast.error('Avval tizimga kiring');
      return;
    }
    if (title.trim().length < 5) {
      toast.error('Sarlavha kamida 5 belgi');
      return;
    }
    if (description.trim().length < 20) {
      toast.error('Tavsif kamida 20 belgi');
      return;
    }
    try {
      setSending(true);
      await bugReportApi.submit({
        title: title.trim(),
        description: description.trim(),
        pageUrl: pageUrl.trim() || undefined,
        suggestion: suggestion.trim() || undefined,
      });
      toast.success(t('bugReport.success'));
      setTitle('');
      setDescription('');
      setSuggestion('');
      const { data } = await bugReportApi.mine();
      setMine(data.data || []);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Xato');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] px-3 pb-20 pt-24 text-slate-200 selection:bg-indigo-500/30 sm:px-4 sm:pt-28 md:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{t('bugReport.pageTitle')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{t('bugReport.subtitle')}</p>

        {!isAuth ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="mb-4 text-slate-400">{t('nav.login')} — bug xabar berish uchun akkaunt kerak.</p>
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-500"
            >
              {t('nav.login')}
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('bugReport.fieldTitle')}
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={160}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('bugReport.fieldDesc')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={8000}
                required
                className="w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('bugReport.fieldUrl')}
              </label>
              <input
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                maxLength={800}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('bugReport.fieldSuggestion')}
              </label>
              <p className="mb-1 text-[11px] text-slate-500">{t('bugReport.hintSuggestion')}</p>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                rows={4}
                maxLength={4000}
                className="w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-2xl bg-indigo-600 py-3.5 font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {sending ? t('bugReport.sending') : t('bugReport.submit')}
            </button>
          </form>
        )}

        {isAuth && mine.length > 0 && (
          <section className="mt-14 border-t border-white/10 pt-10">
            <h2 className="mb-4 text-lg font-bold text-white">{t('bugReport.history')}</h2>
            <ul className="space-y-3">
              {mine.map((r) => (
                <li
                  key={r._id}
                  className="rounded-2xl border border-white/10 bg-[#0a0c14]/80 px-4 py-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-white">{r.title}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
                      {statusLabel(r.status, t)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>
                      {t('bugReport.bugXp')}: {r.bugXpGranted ? '+100' : '—'}
                    </span>
                    <span>
                      {t('bugReport.sugXp')}: {r.suggestionXpGranted ? '+100' : '—'}
                    </span>
                  </div>
                  {r.adminNote ? <p className="mt-2 text-xs text-slate-400">{r.adminNote}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
