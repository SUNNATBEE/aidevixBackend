import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { selectUser } from '@store/slices/authSlice';
import { useUserStats } from '@hooks/useUserStats';
import { useSubscription } from '@hooks/useSubscription';
import { fetchUserStats, updateProfileThunk } from '@store/slices/userStatsSlice';
import { uploadApi } from '@api/uploadApi';
import { toast } from 'react-hot-toast';
import {
  FiEdit2, FiUser, FiBriefcase, FiInstagram,
  FiMail, FiAward, FiCamera, FiX, FiMapPin,
} from 'react-icons/fi';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { xp, level, badges, videosWatched, bio, skills, avatar } = useUserStats();
  const sub = useSubscription();

  const [activeTab, setActiveTab] = useState("Ma'lumotlar");
  const avatarInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editDraft, setEditDraft] = useState({ ism: '', familiya: '', kasb: '', bio: '' });
  const [initialDraft, setInitialDraft] = useState(null);

  useEffect(() => {
    if (editOpen) {
      const initial = {
        ism: user?.firstName || '',
        familiya: user?.lastName || '',
        kasb: user?.jobTitle || '',
        bio: bio || '',
      };
      setInitialDraft(initial);
      setEditDraft(initial);
    }
  }, [editOpen, user, bio]);

  // Full-screen modal — body scroll lock va header/footer overlap
  useEffect(() => {
    document.body.style.overflow = editOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [editOpen]);

  const hasChanges = initialDraft != null && (
    editDraft.ism !== initialDraft.ism ||
    editDraft.familiya !== initialDraft.familiya ||
    editDraft.kasb !== initialDraft.kasb ||
    editDraft.bio !== initialDraft.bio
  );

  const handleSave = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;
    try {
      setIsSaving(true);
      await dispatch(updateProfileThunk({
        bio: editDraft.bio,
        ism: editDraft.ism,
        familiya: editDraft.familiya,
        kasb: editDraft.kasb,
      })).unwrap();
      toast.success('Profil muvaffaqiyatli yangilandi!');
      setEditOpen(false);
    } catch (err) {
      toast.error(err || 'Xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Rasm hajmi 2MB dan oshmasligi kerak.'); return; }
    setAvatarPreview(URL.createObjectURL(file));
    try {
      setAvatarUploading(true);
      await uploadApi.uploadAvatar(file);
      toast.success('Avatar yangilandi!');
      dispatch(fetchUserStats());
      setAvatarPreview(null);
    } catch {
      toast.error('Avatar yuklashda xatolik');
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
    }
  };

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Foydalanuvchi';
  const tabs = ["Ma'lumotlar", "Obunalar", "Faollik"];

  return (
    <div className="min-h-screen bg-[#07090F] text-slate-200 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* ── HERO CARD ── */}
        <div className="bg-[#0D1220] border border-white/[0.06] rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-[76px] h-[76px] rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-400">
                <div className="w-full h-full rounded-full bg-[#0D1220] p-[2px]">
                  <img
                    src={avatarPreview || avatar || user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=312e81&color=fff&size=200`}
                    alt="avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center border-2 border-[#0D1220] hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                <FiCamera size={10} className="text-white" />
              </button>
              <input ref={avatarInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white mb-0.5">{displayName}</h1>
              <p className="text-indigo-400 text-sm font-medium mb-1">{user?.jobTitle || 'Python Dasturchi'}</p>
              <p className="text-slate-500 text-xs flex items-center gap-1 mb-4">
                <FiMapPin size={11} /> Toshkent, O'zbekiston
              </p>

              <div className="flex items-center gap-5">
                <div>
                  <span className="text-white font-bold">12</span>
                  <span className="text-slate-500 text-[11px] uppercase ml-1.5 tracking-wide">Kurslar</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div>
                  <span className="text-white font-bold">{videosWatched || 45}</span>
                  <span className="text-slate-500 text-[11px] uppercase ml-1.5 tracking-wide">Videolar</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-0.5">
                  <span className="text-white font-bold">4.8</span>
                  <span className="text-yellow-400 text-sm ml-0.5">★</span>
                  <span className="text-slate-500 text-[11px] uppercase ml-1.5 tracking-wide">Reyting</span>
                </div>
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setEditOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 rounded-xl text-slate-300 text-sm font-medium transition-all"
            >
              <FiEdit2 size={13} />
              Profilni tahrirlash
            </button>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-0 border-b border-white/[0.07] mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 pb-3 text-sm font-medium border-b-2 -mb-px transition-all ${
                activeTab === tab
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode="wait">
          {activeTab === "Ma'lumotlar" && (
            <motion.div
              key="malumotlar"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-5"
            >
              {/* LEFT col */}
              <div className="lg:col-span-2 space-y-5">

                {/* Shaxsiy ma'lumotlar */}
                <div className="bg-[#0D1220] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="flex items-center gap-2 text-white font-semibold text-sm">
                      <FiUser size={14} className="text-indigo-400" />
                      Shaxsiy ma'lumotlar
                    </h3>
                    <button onClick={() => setEditOpen(true)}>
                      <FiEdit2 size={13} className="text-slate-600 hover:text-slate-400 transition-colors" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1.5 block">Ism</label>
                      <div className="bg-[#080C15] border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm">
                        {user?.firstName || <span className="text-slate-600">—</span>}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1.5 block">Familiya</label>
                      <div className="bg-[#080C15] border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm">
                        {user?.lastName || <span className="text-slate-600">—</span>}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-[11px] text-slate-500 mb-1.5 block">Kasbi / Mutaxassisligi</label>
                    <div className="bg-[#080C15] border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm flex items-center gap-2">
                      <FiBriefcase size={13} className="text-slate-500 flex-shrink-0" />
                      {user?.jobTitle || 'Python Dasturchi'}
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="text-[11px] text-slate-500 mb-1.5 block">Bio</label>
                    <div className="bg-[#080C15] border border-white/[0.05] rounded-xl px-4 py-3 text-slate-300 text-sm min-h-[72px] leading-relaxed">
                      {bio || <span className="text-slate-600 italic">Hali biografiya qo'shilmagan.</span>}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditOpen(true)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                    >
                      Saqlash
                    </button>
                  </div>
                </div>

                {/* Ko'nikmalar */}
                <div className="bg-[#0D1220] border border-white/[0.06] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 text-white font-semibold text-sm">
                      <FiAward size={14} className="text-indigo-400" />
                      Ko'nikmalar
                    </h3>
                    <button className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors">Tahrirlash</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills?.length > 0 ? skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#080C15] border border-white/[0.06] rounded-lg text-slate-300 text-xs font-medium">
                        {skill}
                      </span>
                    )) : (
                      ['Python', 'Django', 'Machine Learning', 'PostgreSQL', 'Docker'].map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#080C15] border border-white/[0.06] rounded-lg text-slate-300 text-xs font-medium">
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="add Ko'nikma"
                    className="w-full bg-transparent text-xs text-slate-500 outline-none placeholder-slate-700 py-1"
                  />
                </div>
              </div>

              {/* RIGHT col */}
              <div className="space-y-5">

                {/* Kontakt */}
                <div className="bg-[#0D1220] border border-white/[0.06] rounded-2xl p-6">
                  <h3 className="text-white font-semibold text-sm mb-4">Kontakt ma'lumotlar</h3>
                  <div className="space-y-4">

                    {/* Telegram */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#3B82F6">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.927l-2.97-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.636.659z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Telegram</p>
                        <p className="text-white text-sm truncate">@{sub?.telegram?.username || 'aizidev'}</p>
                      </div>
                      {sub?.telegram?.subscribed && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      )}
                    </div>

                    {/* Instagram */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                        <FiInstagram size={14} className="text-pink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Instagram</p>
                        <p className="text-white text-sm">{sub?.instagram?.username || 'Ulanmagan'}</p>
                      </div>
                      {!sub?.instagram?.subscribed && (
                        <button className="flex-shrink-0 px-3 py-1 bg-orange-500/10 text-orange-400 text-[11px] rounded-lg border border-orange-500/20 hover:bg-orange-500/20 transition-colors">
                          Ulanish
                        </button>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <FiMail size={14} className="text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">Email</p>
                        <p className="text-white text-sm truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* So'nggi faollik */}
                <div className="bg-[#0D1220] border border-white/[0.06] rounded-2xl p-6">
                  <h3 className="text-white font-semibold text-sm mb-4">So'nggi faollik</h3>
                  <div className="space-y-3">
                    {badges?.length > 0 ? badges.slice(0, 2).map((badge, i) => (
                      <div key={i}>
                        <p className="text-slate-300 text-xs font-medium">"{badge.name}" ni yakunladi</p>
                        <p className="text-slate-600 text-[11px] mt-0.5">{new Date(badge.earnedAt).toLocaleDateString()}</p>
                      </div>
                    )) : (
                      <>
                        <div>
                          <p className="text-slate-300 text-xs font-medium">"Python Asoslari" kursini yakunladi</p>
                          <p className="text-slate-600 text-[11px] mt-0.5">6 kun oldin</p>
                        </div>
                        <div>
                          <p className="text-slate-300 text-xs font-medium">Yangi sertifikat oldi</p>
                          <p className="text-slate-600 text-[11px] mt-0.5">Yanvar 14, 23</p>
                        </div>
                      </>
                    )}
                  </div>
                  <button className="text-indigo-400 text-xs mt-4 hover:text-indigo-300 transition-colors">
                    Barchasi ko'rish
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Obunalar" && (
            <motion.div key="obunalar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-20 text-center text-slate-500 text-sm">
              Obunalar moduli yaqin orada ishga tushadi...
            </motion.div>
          )}

          {activeTab === "Faollik" && (
            <motion.div key="faollik" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges?.length > 0 ? badges.map((badge, i) => (
                <div key={i} className="bg-[#0D1220] border border-white/[0.06] p-5 rounded-2xl text-center">
                  <div className="text-3xl mb-2">{badge.icon || '🏆'}</div>
                  <h5 className="font-semibold text-xs text-white">{badge.name}</h5>
                  <p className="text-[10px] text-slate-500 mt-1">{new Date(badge.earnedAt).toLocaleDateString()}</p>
                </div>
              )) : (
                <div className="col-span-full py-16 text-center text-slate-500 text-sm">
                  Hech qanday faollik topilmadi.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── FULL-SCREEN EDIT MODAL ── */}
      {/* z-index: 99999 — header va footer ni to'liq yopadi */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[99999] bg-[#07090F] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="w-full max-w-lg bg-[#0D1220] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.06]">
                <h2 className="text-white font-semibold text-base">Profilni tahrirlash</h2>
                <button
                  onClick={() => setEditOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <FiX size={15} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="px-7 py-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1.5 block">Ism</label>
                    <input
                      type="text"
                      value={editDraft.ism}
                      onChange={e => setEditDraft({ ...editDraft, ism: e.target.value })}
                      placeholder="Ismingizni kiriting"
                      className="w-full bg-[#080C15] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1.5 block">Familiya</label>
                    <input
                      type="text"
                      value={editDraft.familiya}
                      onChange={e => setEditDraft({ ...editDraft, familiya: e.target.value })}
                      placeholder="Familiyangizni kiriting"
                      className="w-full bg-[#080C15] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 mb-1.5 block">Kasbi / Mutaxassisligi</label>
                  <input
                    type="text"
                    value={editDraft.kasb}
                    onChange={e => setEditDraft({ ...editDraft, kasb: e.target.value })}
                    placeholder="Masalan: Frontend Developer"
                    className="w-full bg-[#080C15] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 mb-1.5 block">Bio</label>
                  <textarea
                    rows={4}
                    value={editDraft.bio}
                    onChange={e => setEditDraft({ ...editDraft, bio: e.target.value })}
                    placeholder="O'zingiz haqingizda bir necha so'z..."
                    className="w-full bg-[#080C15] border border-white/[0.07] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="flex-1 py-3 bg-white/[0.05] hover:bg-white/[0.08] rounded-xl text-slate-400 text-sm font-medium transition-all"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={!hasChanges || isSaving}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                  >
                    {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
