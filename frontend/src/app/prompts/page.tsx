'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectUser, selectIsLoggedIn } from '@store/slices/authSlice';
import { promptApi, type Prompt } from '@api/promptApi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  IoSparkles, IoAdd, IoHeart, IoHeartOutline, IoCopy,
  IoClose, IoFilter, IoTrendingUp, IoTime, IoEye,
} from 'react-icons/io5';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'all', label: 'Barchasi', emoji: '🌐' },
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
              placeholder="Bu prompt nima uchun ishlatiladi..." />
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

// ─── Prompt Card ──────────────────────────────────────────────────────────────

function PromptCard({ prompt, userId, onLike, onView }: { prompt: Prompt; userId?: string; onLike: (id: string) => void; onView: (id: string) => void }) {
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

  return (
    <motion.div ref={cardRef} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="group relative bg-[#0d101a] border border-white/5 rounded-3xl p-6 hover:border-indigo-500/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.05)]">
      {prompt.isFeatured && (
        <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest">
          Featured
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={prompt.author?.avatar || `https://ui-avatars.com/api/?name=${prompt.author?.username || 'U'}&background=312e81&color=fff&size=48`}
          alt={prompt.author?.username}
          className="w-10 h-10 rounded-2xl object-cover border border-white/5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-1">{prompt.title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-slate-500">{prompt.author?.username}</span>
            {prompt.author?.rankTitle && (
              <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded-full text-slate-600 uppercase">{prompt.author.rankTitle}</span>
            )}
          </div>
        </div>
      </div>

      {/* Tool badge */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${TOOL_COLORS[prompt.tool] || TOOL_COLORS.Any}`}>
          {prompt.tool}
        </span>
        {prompt.tags?.slice(0, 3).map(tag => (
          <span key={tag} className="text-[9px] px-2 py-0.5 bg-white/5 rounded-lg text-slate-500">#{tag}</span>
        ))}
      </div>

      {/* Content preview */}
      <div className="relative bg-black/30 rounded-2xl p-4 mb-4 border border-white/5 overflow-hidden">
        <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words line-clamp-5 leading-relaxed">
          {prompt.content}
        </pre>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1 text-xs">
            <IoEye size={12} /> {prompt.viewsCount}
          </span>
          <button onClick={() => onLike(prompt._id)}
            className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-red-400' : 'hover:text-red-400'}`}>
            {liked ? <IoHeart size={14} /> : <IoHeartOutline size={14} />} {prompt.likesCount}
          </button>
        </div>
        <button onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/10 hover:border-indigo-500/30 text-indigo-400 text-[11px] font-bold transition-all active:scale-95">
          <IoCopy size={11} /> {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PromptsPage() {
  const user = useSelector(selectUser);
  const isAuth = useSelector(selectIsLoggedIn);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [featured, setFeatured] = useState<Prompt[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [tool, setTool] = useState('all');
  const [sort, setSort] = useState('newest');
  const [showCreate, setShowCreate] = useState(false);

  const fetchPrompts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = { sort, page: reset ? 1 : page, limit: 12 };
      if (category !== 'all') params.category = category;
      if (tool !== 'all') params.tool = tool;

      const { data } = await promptApi.getAll(params);
      if (reset) {
        setPrompts(data.data.prompts);
        setPage(1);
      } else {
        setPrompts(prev => page === 1 ? data.data.prompts : [...prev, ...data.data.prompts]);
      }
      setTotal(data.data.total);
    } catch {
      toast.error('Promptlar yuklanmadi');
    } finally {
      setLoading(false);
    }
  }, [category, tool, sort, page]);

  useEffect(() => {
    fetchPrompts(true);
  }, [category, tool, sort]);

  useEffect(() => {
    promptApi.getFeatured().then(({ data }) => setFeatured(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrompts(true);
      promptApi.getFeatured().then(({ data }) => setFeatured(data.data)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchPrompts]);

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
    <div className="min-h-screen bg-[#050507] text-slate-200 pt-28 pb-20 px-4 sm:px-6 lg:px-12 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <div className="relative mb-14 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <IoSparkles size={12} /> AI Prompt Kutubxonasi
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Eng Yaxshi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Promptlar</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Claude, Cursor, Copilot va boshqa AI toollar uchun professional promptlar. Hamjamiyat tomonidan yaratilgan.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {isAuth ? (
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                <IoAdd size={18} /> Prompt Qo'shish (+30 XP)
              </button>
            ) : (
              <Link href="/login"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all">
                <IoAdd size={18} /> Kirish va Prompt Qo'shish
              </Link>
            )}
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <IoTrendingUp size={14} /> {total.toLocaleString()} ta prompt
            </div>
          </div>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="text-amber-400">★</span> Featured Promptlar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(p => <PromptCard key={p._id} prompt={p} userId={user?._id} onLike={handleLike} onView={handleView} />)}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-5 mb-8">
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setCategory(c.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  category === c.key
                    ? 'bg-indigo-600 text-white shadow-[0_4px_16px_rgba(79,70,229,0.3)]'
                    : 'bg-white/5 text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/5'
                }`}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {/* Sort + Tool filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1">
              {SORT_OPTIONS.map(s => {
                const Icon = s.icon;
                return (
                  <button key={s.key} onClick={() => setSort(s.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      sort === s.key ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}>
                    <Icon size={12} /> {s.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <IoFilter size={12} className="text-slate-600" />
              <select value={tool} onChange={e => setTool(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50">
                <option value="all">Barcha toollar</option>
                {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
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
            {isAuth && (
              <button onClick={() => setShowCreate(true)}
                className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm transition-all">
                Birinchi bo'ling!
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {prompts.map(p => <PromptCard key={p._id} prompt={p} userId={user?._id} onLike={handleLike} onView={handleView} />)}
            </div>
            {prompts.length < total && (
              <div className="text-center mt-10">
                <button onClick={() => { setPage(p => p + 1); fetchPrompts(); }}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-300 font-bold text-sm transition-all">
                  Ko'proq yuklash ({total - prompts.length} qoldi)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && <CreatePromptModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
      </AnimatePresence>
    </div>
  );
}
