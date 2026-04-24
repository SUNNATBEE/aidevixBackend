'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectUser, selectIsLoggedIn } from '@store/slices/authSlice';
import { promptApi, type Prompt } from '@api/promptApi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  IoSparkles, IoAdd, IoHeart, IoHeartOutline, IoCopy,
  IoClose, IoFilter, IoTrendingUp, IoTime, IoEye, IoChevronForward,
  IoInformationCircleOutline, IoLockClosed,
} from 'react-icons/io5';
import { useSubscription } from '@/hooks/useSubscription';
import TelegramVerify from '@components/subscription/TelegramVerify';
import { SOCIAL_LINKS } from '@utils/constants';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'all', label: 'Barchasi', emoji: '🌐' },
  { key: 'system', label: 'System prompt', emoji: '⚙️' },
  { key: 'vibe_coding', label: 'Vibe Coding', emoji: '⚡' },
  { key: 'claude', label: 'Claude', emoji: '🤖' },
  { key: 'cursor', label: 'Cursor', emoji: '🖱️' },
  { key: 'copilot', label: 'Copilot', emoji: '🐙' },
  { key: 'coding', label: 'Kodlash', emoji: '💻' },
  { key: 'debugging', label: 'Debug', emoji: '🔍' },
  { key: 'architecture', label: 'Arxitektura', emoji: '🏗️' },
  { key: 'refactoring', label: 'Refactor', emoji: '♻️' },
  { key: 'testing', label: 'Test', emoji: '🧪' },
  { key: 'documentation', label: 'Docs', emoji: '📚' },
];

const TOOLS = ['Any', 'Claude Code', 'Cursor', 'GitHub Copilot', 'ChatGPT', 'Gemini', 'Windsurf'];

const SORT_OPTIONS = [
  { key: 'newest', label: 'Yangi', icon: IoTime },
  { key: 'popular', label: 'Popular', icon: IoHeart },
  { key: 'views', label: 'Ko\'p ko\'rilgan', icon: IoEye },
];

const TOOL_COLORS: Record<string, string> = {
  'Claude Code': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Cursor': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'GitHub Copilot': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  'ChatGPT': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Gemini': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Windsurf': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'Any': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

function categoryMeta(key: string) {
  return CATEGORIES.find((c) => c.key === key) ?? { key, label: key, emoji: '📎' };
}

// ─── Create Prompt Modal ──────────────────────────────────────────────────────

function CreatePromptModal({ onClose, onCreated }: { onClose: () => void; onCreated: (p: Prompt) => void }) {
  const [form, setForm] = useState({ title: '', content: '', description: '', category: 'vibe_coding', tool: 'Claude Code', tags: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Sarlavha va prompt matni majburiy');
    try {
      setLoading(true);
      const { data } = await promptApi.create({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      toast.success(data.message || 'Prompt yaratildi! +30 XP 🎉');
      onCreated(data.data);
    } catch {
      toast.error('Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        className="relative w-full max-w-2xl bg-[#0d101a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-3"><IoSparkles className="text-indigo-400" /> Yangi Prompt</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <IoClose size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Sarlavha *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} maxLength={150}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              placeholder="Claude bilan React component yozish..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Kategoriya</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#0a0c14] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all">
                {CATEGORIES.filter(c => c.key !== 'all').map(c => (
                  <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Tool</label>
              <select value={form.tool} onChange={e => setForm({ ...form, tool: e.target.value })}
                className="w-full bg-[#0a0c14] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all">
                {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Prompt matni *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={7} maxLength={5000}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none font-mono text-sm"
              placeholder="Promptingizni bu yerga yozing..." />
            <p className="text-[10px] text-slate-600 text-right mt-1">{form.content.length}/5000</p>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Tavsif (ixtiyoriy)</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} maxLength={300}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              placeholder="Masalan: Bu promptni yuborganingizda AI PR review qiladi yoki test matritsasi chiqaradi..." />
            <p className="mt-1 text-[10px] text-slate-600">Qisqa: boshqa foydalanuvchi nima natija kutishini tushunishi uchun (kartada ko‘rinadi).</p>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Teglar (vergul bilan ajrating)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              placeholder="react, component, hooks..." />
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-bold text-sm transition-all">
              Bekor
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Yuborilmoqda...' : <><IoSparkles /> Yaratish (+30 XP)</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Prompt detail (full text) ──────────────────────────────────────────────

function PromptDetailModal({
  prompt,
  onClose,
  userId,
  onLike,
}: {
  prompt: Prompt;
  onClose: () => void;
  userId?: string;
  onLike: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const cat = categoryMeta(prompt.category);
  const liked = userId ? prompt.likes?.includes(userId) : false;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Clipboard ga ko\'chirildi!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Ko\'chirishda xato');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Yopish (fon)"
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative flex max-h-[min(92vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.75rem] border border-white/10 bg-[#0a0c14] shadow-2xl sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/5 px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {cat.emoji} {cat.label}
              </span>
              <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold ${TOOL_COLORS[prompt.tool] || TOOL_COLORS.Any}`}>
                {prompt.tool}
              </span>
              {prompt.isFeatured && (
                <span className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-400">
                  Featured
                </span>
              )}
            </div>
            <h2 className="text-balance text-lg font-bold leading-snug text-white sm:text-xl">{prompt.title}</h2>
            <p className="mt-1 text-xs text-slate-500">
              @{prompt.author?.username}
              {prompt.author?.rankTitle ? ` · ${prompt.author.rankTitle}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Yopish"
          >
            <IoClose size={20} />
          </button>
        </div>

        {prompt.description?.trim() ? (
          <p className="shrink-0 border-b border-white/5 px-5 py-3 text-sm leading-relaxed text-slate-400 sm:px-6">
            {prompt.description}
          </p>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-slate-200 sm:text-sm">
            {prompt.content}
          </pre>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/5 bg-[#050507]/80 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <IoEye size={14} /> {prompt.viewsCount}
            </span>
            <button
              type="button"
              onClick={() => onLike(prompt._id)}
              className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-400' : 'hover:text-red-400'}`}
            >
              {liked ? <IoHeart size={16} /> : <IoHeartOutline size={16} />} {prompt.likesCount}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-600/15 px-4 py-2.5 text-xs font-bold text-indigo-300 transition-all hover:bg-indigo-600/25 active:scale-[0.98]"
            >
              <IoCopy size={14} /> {copied ? 'Nusxa olindi' : 'Nusxa olish'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Prompt Card ──────────────────────────────────────────────────────────────

function PromptCard({
  prompt,
  userId,
  onLike,
  onView,
  onExpand,
}: {
  prompt: Prompt;
  userId?: string;
  onLike: (id: string) => void;
  onView: (id: string) => void;
  onExpand: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const liked = userId ? prompt.likes?.includes(userId) : false;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const viewedRef = useRef(false);

  useEffect(() => {
    if (viewedRef.current) return;
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (!visible || viewedRef.current) return;
        viewedRef.current = true;
        onView(prompt._id);
        observer.disconnect();
      },
      { threshold: 0.45 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [prompt._id, onView]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Clipboard ga ko\'chirildi!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Ko\'chirishda xato');
    }
  };

  const cat = categoryMeta(prompt.category);

  return (
    <motion.div ref={cardRef} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="group relative flex h-full flex-col bg-[#0d101a] border border-white/5 rounded-3xl p-5 sm:p-6 hover:border-indigo-500/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.06)]">
      {prompt.isFeatured && (
        <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest">
          Featured
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <img
          src={prompt.author?.avatar || `https://ui-avatars.com/api/?name=${prompt.author?.username || 'U'}&background=312e81&color=fff&size=48`}
          alt={prompt.author?.username || ''}
          className="h-11 w-11 rounded-2xl object-cover border border-white/5 shrink-0"
        />
        <div className="min-w-0 flex-1 pr-12">
          <h3 className="text-base font-bold leading-snug text-white line-clamp-2">{prompt.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">@{prompt.author?.username}</span>
            {prompt.author?.rankTitle && (
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">{prompt.author.rankTitle}</span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold text-slate-400">
          {cat.emoji} {cat.label}
        </span>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${TOOL_COLORS[prompt.tool] || TOOL_COLORS.Any}`}>
          {prompt.tool}
        </span>
        {prompt.tags?.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">#{tag}</span>
        ))}
      </div>

      {prompt.description?.trim() ? (
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-slate-400">{prompt.description}</p>
      ) : null}

      <button
        type="button"
        onClick={onExpand}
        className="relative mb-4 w-full overflow-hidden rounded-2xl border border-white/5 bg-black/35 p-4 text-left transition-colors hover:border-indigo-500/25 hover:bg-black/45"
      >
        <pre className="pointer-events-none max-h-[200px] overflow-hidden font-mono text-[13px] leading-relaxed text-slate-300 whitespace-pre-wrap break-words sm:max-h-[220px] sm:text-sm">
          {prompt.content}
        </pre>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/70 to-transparent" />
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-bold text-indigo-400">
          Batafsil <IoChevronForward size={12} className="opacity-80" />
        </span>
      </button>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <IoEye size={14} /> {prompt.viewsCount}
          </span>
          <button
            type="button"
            onClick={() => onLike(prompt._id)}
            className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-400' : 'hover:text-red-400'}`}
          >
            {liked ? <IoHeart size={15} /> : <IoHeartOutline size={15} />} {prompt.likesCount}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExpand}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
          >
            Ochish
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-600/15 px-3 py-2 text-[11px] font-bold text-indigo-300 transition-all hover:bg-indigo-600/25 active:scale-[0.98]"
          >
            <IoCopy size={12} /> {copied ? 'OK' : 'Copy'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type PromptAccess = 'checking' | 'need_login' | 'need_telegram' | 'granted';

export default function PromptsPage() {
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsLoggedIn);
  const { telegram, loading: subLoading, refetch: refetchSubscription } = useSubscription();

  const promptAccess: PromptAccess = useMemo(() => {
    if (!isAuth) return 'need_login';
    if (subLoading) return 'checking';
    if (!telegram?.subscribed) return 'need_telegram';
    return 'granted';
  }, [isAuth, subLoading, telegram?.subscribed]);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [featured, setFeatured] = useState<Prompt[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [tool, setTool] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showCreate, setShowCreate] = useState(false);
  const [detailPrompt, setDetailPrompt] = useState<Prompt | null>(null);

  const loadMorePrompts = useCallback(async () => {
    if (promptAccess !== 'granted') return;
    const nextPage = page + 1;
    try {
      setLoading(true);
      const params: Record<string, string | number> = { sort, page: nextPage, limit: 12 };
      if (category !== 'all') params.category = category;
      if (tool !== 'all') params.tool = tool;
      const { data } = await promptApi.getAll(params);
      setPrompts((prev) => [...prev, ...data.data.prompts]);
      setTotal(data.data.total);
      setPage(nextPage);
    } catch {
      toast.error('Yuklanmadi');
    } finally {
      setLoading(false);
    }
  }, [category, tool, sort, page, promptAccess]);

  useEffect(() => {
    if (promptAccess !== 'granted') {
      setLoading(false);
      setPrompts([]);
      setFeatured([]);
      setTotal(0);
      setPage(1);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params: Record<string, string | number> = { sort, page: 1, limit: 12 };
        if (category !== 'all') params.category = category;
        if (tool !== 'all') params.tool = tool;
        const [listRes, featRes] = await Promise.all([
          promptApi.getAll(params),
          promptApi.getFeatured(),
        ]);
        if (cancelled) return;
        setPrompts(listRes.data.data.prompts);
        setTotal(listRes.data.data.total);
        setPage(1);
        setFeatured(featRes.data.data || []);
      } catch {
        if (!cancelled) {
          toast.error('Promptlar yuklanmadi');
          setPrompts([]);
          setFeatured([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [promptAccess, category, tool, sort]);

  useEffect(() => {
    if (promptAccess !== 'granted') return;
    const interval = setInterval(() => {
      const params: Record<string, string | number> = { sort, page: 1, limit: 12 };
      if (category !== 'all') params.category = category;
      if (tool !== 'all') params.tool = tool;
      Promise.all([promptApi.getAll(params), promptApi.getFeatured()])
        .then(([listRes, featRes]) => {
          setPrompts(listRes.data.data.prompts);
          setTotal(listRes.data.data.total);
          setFeatured(featRes.data.data || []);
        })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [promptAccess, category, tool, sort]);

  const patchPromptInLists = useCallback((id: string, patch: (p: Prompt) => Prompt) => {
    setPrompts(prev => prev.map(p => (p._id === id ? patch(p) : p)));
    setFeatured(prev => prev.map(p => (p._id === id ? patch(p) : p)));
  }, []);

  const handleLike = async (id: string) => {
    if (!isAuth) return toast.error('Like bosish uchun kiring');
    try {
      const { data } = await promptApi.like(id);
      patchPromptInLists(id, (p) => ({
        ...p,
        likesCount: data.likesCount,
        likes: data.liked ? [...(p.likes || []), user!._id] : (p.likes || []).filter(l => l !== user!._id),
      }));
    } catch {
      toast.error('Xato');
    }
  };

  const handleView = useCallback(async (id: string) => {
    const storageKey = `prompt-viewed-${id}`;
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(storageKey)) return;
    try {
      const { data } = await promptApi.view(id);
      patchPromptInLists(id, (p) => ({ ...p, viewsCount: data.viewsCount }));
      if (typeof window !== 'undefined') window.sessionStorage.setItem(storageKey, '1');
    } catch {
      // no-op
    }
  }, [patchPromptInLists]);

  const handleCreated = (p: Prompt) => {
    setPrompts(prev => [p, ...prev]);
    setTotal(t => t + 1);
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-[#050507] px-3 pb-16 pt-20 text-slate-200 selection:bg-indigo-500/30 sm:px-4 sm:pb-20 sm:pt-24 md:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Compact hero */}
        <header className="relative mb-6 sm:mb-8">
          <div className="pointer-events-none absolute -inset-x-8 -top-8 bottom-0 -z-10 bg-gradient-to-r from-indigo-500/[0.07] via-purple-500/[0.06] to-pink-500/[0.05] blur-2xl" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-300 sm:text-xs">
                <IoSparkles size={12} className="shrink-0 text-indigo-400" />
                AI prompt kutubxonasi
              </div>
              <h1 className="text-balance text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Professional{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">promptlar</span>
              </h1>
              {promptAccess !== 'granted' && (
                <p className="mt-2 flex max-w-xl flex-wrap items-center gap-2 text-xs font-semibold text-amber-200/95 sm:text-sm">
                  <IoLockClosed className="shrink-0" size={16} aria-hidden />
                  <span>Prompt matnlari Telegram kanaliga obuna bo‘lguncha qulflangan.</span>
                </p>
              )}
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                Bu yerda <strong className="font-semibold text-slate-300">tayyor prompt shablonlari</strong> yotadi — ularni Claude, Cursor, ChatGPT va boshqa asistentlarga{' '}
                <strong className="font-semibold text-slate-300">shu ko‘rinishda yuborasiz</strong> (o‘rniga <code className="rounded bg-white/10 px-1 py-0.5 text-[0.8em] text-indigo-200">[PLACEHOLDER]</code> larini o‘z loyihangizga moslab to‘ldiring).
                Natija: model rol, vazifa, cheklov va chiqish formatini oldindan oladi — javoblar aniqroq va sifatliroq bo‘ladi.
              </p>
              <details className="group mt-5 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left sm:px-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-slate-200 marker:content-none">
                  <IoInformationCircleOutline className="shrink-0 text-indigo-400" size={20} />
                  <span>Qisqacha: prompt yozsangiz nima bo‘ladi?</span>
                  <IoChevronForward className="ml-auto shrink-0 text-slate-500 transition-transform group-open:rotate-90" size={16} />
                </summary>
                <div className="mt-4 space-y-3 border-t border-white/5 pt-4 text-sm leading-relaxed text-slate-400">
                  <p>
                    <strong className="text-slate-300">1) Nusxa olish / ochish</strong> — kartadagi matnni to‘liq ko‘rasiz va bir tugmada clipboard ga olasiz.
                  </p>
                  <p>
                    <strong className="text-slate-300">2) AI ga yuborish</strong> — chat yoki agent oynasiga joylashtirasiz. Birinchi xabar sifatida yuborsangiz, model &quot;rol va format&quot;ni saqlab qoladi.
                  </p>
                  <p>
                    <strong className="text-slate-300">3) O‘zgarish</strong> — qavslardagi joylarni (stack, fayl yo‘li, ticket matni) almashtiring; keraksiz bo‘limlarni o‘chirib tashlash mumkin.
                  </p>
                  <p className="text-xs text-slate-500">
                    Kutubxonadagi namunalar senior prompt injinerlar ishlatadigan tuzilma bilan: rol, kontekst, vazifa, cheklovlar, chiqish formati.
                  </p>
                </div>
              </details>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
              {!isAuth ? (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500"
                >
                  <IoAdd size={18} /> Kirish
                </Link>
              ) : promptAccess === 'granted' ? (
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-[0.98]"
                >
                  <IoAdd size={18} /> Prompt qo‘shish (+30 XP)
                </button>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-xs font-medium text-slate-400 sm:text-sm">
                  {promptAccess === 'checking' ? 'Obuna holati tekshirilmoqda…' : 'Telegram kanalni ulang — keyin prompt qo‘shasiz'}
                </div>
              )}
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-slate-400">
                <IoTrendingUp size={15} className="text-indigo-400/90" />
                <span className="font-semibold text-slate-300">
                  {promptAccess === 'granted' ? total.toLocaleString() : '—'}
                </span>
                ta prompt
              </div>
            </div>
          </div>
        </header>

        {promptAccess === 'checking' && isAuth && (
          <div className="mb-10 flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.02] py-14">
            <span className="loading loading-spinner loading-lg text-indigo-400" />
            <p className="text-sm text-slate-500">Obuna holati tekshirilmoqda…</p>
          </div>
        )}

        {promptAccess === 'need_login' && (
          <section
            className="mb-10 rounded-3xl border border-indigo-500/25 bg-indigo-500/[0.06] p-8 text-center sm:p-12"
            aria-labelledby="prompts-login-gate-title"
          >
            <IoLockClosed className="mx-auto mb-4 text-indigo-400" size={40} aria-hidden />
            <h2 id="prompts-login-gate-title" className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Promptlarni ko‘rish uchun kiring
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-slate-400">
              Kutubxona matnlari faqat akkaunt orqali va Telegram kanal obunasi tasdiqlangach ochiladi.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3 font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500"
            >
              Kirish
            </Link>
          </section>
        )}

        {promptAccess === 'need_telegram' && (
          <section
            className="mb-10 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.08] to-transparent p-6 sm:p-10"
            aria-labelledby="prompts-tg-gate-title"
          >
            <div className="mx-auto max-w-lg text-center">
              <IoLockClosed className="mx-auto mb-4 text-amber-400" size={44} aria-hidden />
              <h2 id="prompts-tg-gate-title" className="mb-2 text-xl font-bold text-white sm:text-2xl">
                Telegram kanaliga obuna bo‘ling
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Prompt shablonlari qulfda. Avval rasmiy kanalga qo‘shiling, keyin pastdagi tugma orqali obunani tasdiqlang — ro‘yxat darhol ochiladi.
              </p>
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-8 inline-flex items-center gap-2 rounded-2xl border border-sky-500/40 bg-sky-500/15 px-5 py-2.5 text-sm font-bold text-sky-300 transition-colors hover:bg-sky-500/25"
              >
                Kanalga o‘tish →
              </a>
            </div>
            <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0a0c14]/80 p-4 sm:p-6">
              <TelegramVerify onTelegramVerified={() => refetchSubscription()} />
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">
              <Link href="/subscription?returnUrl=/prompts" className="text-indigo-400 underline-offset-2 hover:underline">
                Barcha obuna qadamlari (PRO sahifa)
              </Link>
            </p>
          </section>
        )}

        {promptAccess === 'granted' && (
          <>
        {/* Sticky filters — categories first, always visible while scrolling */}
        <div className="sticky top-14 z-30 -mx-3 mb-8 border-y border-white/10 bg-[#050507]/90 px-3 py-3 backdrop-blur-xl sm:-mx-4 sm:px-4 sm:py-4 md:-mx-6 md:px-6 lg:-mx-12 lg:px-12 sm:top-16">
          <div className="mx-auto max-w-7xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Kategoriya</p>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto pb-1 px-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`shrink-0 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all sm:px-4 ${
                    category === c.key
                      ? 'bg-indigo-600 text-white shadow-[0_4px_20px_rgba(79,70,229,0.35)]'
                      : 'border border-transparent bg-white/5 text-slate-500 hover:border-white/10 hover:text-slate-200'
                  }`}
                >
                  <span className="mr-1">{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-1 rounded-2xl bg-white/5 p-1">
                {SORT_OPTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSort(s.key)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        sort === s.key ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={13} /> {s.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <IoFilter size={14} className="hidden text-slate-600 sm:block" />
                <label className="sr-only" htmlFor="prompt-tool-filter">
                  Tool
                </label>
                <select
                  id="prompt-tool-filter"
                  value={tool}
                  onChange={(e) => setTool(e.target.value)}
                  className="w-full min-w-[10rem] rounded-2xl border border-white/10 bg-[#0a0c14] px-3 py-2.5 text-xs font-semibold text-slate-200 focus:border-indigo-500/50 focus:outline-none sm:w-auto"
                >
                  <option value="all">Barcha toollar</option>
                  {TOOLS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Featured — horizontal rail (saves vertical space) */}
        {featured.length > 0 && (
          <section className="mb-10 sm:mb-12" aria-labelledby="featured-prompts-heading">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 id="featured-prompts-heading" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
                <span className="text-amber-400" aria-hidden>
                  ★
                </span>
                Tanlangan promptlar
              </h2>
            </div>
            <div className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-2 sm:-mx-0 sm:px-0">
              {featured.map((p) => (
                <div
                  key={p._id}
                  className="w-[min(100%,22rem)] shrink-0 snap-start sm:w-[min(100%,24rem)] lg:w-[min(100%,26rem)]"
                >
                  <PromptCard
                    prompt={p}
                    userId={user?._id}
                    onLike={handleLike}
                    onView={handleView}
                    onExpand={() => setDetailPrompt(p)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b border-white/5 pb-3">
          <h2 className="text-lg font-bold text-white sm:text-xl">Barcha promptlar</h2>
          <p className="text-xs text-slate-500">
            {category !== 'all' ? `${categoryMeta(category).emoji} ${categoryMeta(category).label} · ` : ''}
            {total.toLocaleString()} ta
          </p>
        </div>

        {/* Grid */}
        {loading && prompts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-white/3 animate-pulse" />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="py-32 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-500">Bu kategoriyada hali prompt yo'q</p>
            {promptAccess === 'granted' && isAuth && (
              <button onClick={() => setShowCreate(true)}
                className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all">
                Birinchi bo'ling!
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-stretch lg:grid-cols-3">
              {prompts.map((p) => (
                <PromptCard
                  key={p._id}
                  prompt={p}
                  userId={user?._id}
                  onLike={handleLike}
                  onView={handleView}
                  onExpand={() => setDetailPrompt(p)}
                />
              ))}
            </div>
            {prompts.length < total && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => loadMorePrompts()}
                  disabled={loading}
                  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-white/10 disabled:opacity-50"
                >
                  {loading ? 'Yuklanmoqda…' : `Ko‘proq yuklash (${total - prompts.length} qoldi)`}
                </button>
              </div>
            )}
          </>
        )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showCreate && promptAccess === 'granted' && (
          <CreatePromptModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {detailPrompt ? (
          <PromptDetailModal
            key={detailPrompt._id}
            prompt={detailPrompt}
            onClose={() => setDetailPrompt(null)}
            userId={user?._id}
            onLike={handleLike}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
