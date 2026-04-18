'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { selectUser } from '@store/slices/authSlice';
import { useUserStats } from '@hooks/useUserStats';
import { useSubscription } from '@hooks/useSubscription';
import { fetchUserStats, updateProfileThunk } from '@store/slices/userStatsSlice';
import { uploadApi } from '@api/uploadApi';
import { toast } from 'react-hot-toast';
import { useLang } from '@context/LangContext';
import {
  FiEdit2,
  FiMapPin,
  FiUser,
  FiBriefcase,
  FiInstagram,
  FiMail,
  FiCheckCircle,
  FiAward,
  FiZap,
  FiCamera,
  FiX
} from 'react-icons/fi';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { xp, level, badges, videosWatched, bio, skills, avatar, loading: statsLoading } = useUserStats();
  const sub = useSubscription();
  const { t } = useLang();

  const TABS = [t('profile.tab.info'), t('profile.tab.subs'), t('profile.tab.achievements')];

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const avatarInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync activeTab when language changes
  useEffect(() => {
    setActiveTab(TABS[0]);
  }, [t('profile.tab.info')]);

  // Form states initialized properly from Redux/Stats
  const [editDraft, setEditDraft] = useState({
    ism: '',
    familiya: '',
    kasb: '',
    bio: '',
  });

  // Sync editDraft with server data when modal opens
  useEffect(() => {
    if (editOpen) {
      setEditDraft({
        ism: user?.firstName || '',
        familiya: user?.lastName || '',
        kasb: user?.jobTitle || '',
        bio: bio || '',
      });
    }
  }, [editOpen, user, bio]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await dispatch(updateProfileThunk({
        bio: editDraft.bio,
        ism: editDraft.ism,
        familiya: editDraft.familiya,
        kasb: editDraft.kasb
      })).unwrap();

      toast.success(t('profile.toast.updated'));
      setEditOpen(false);
    } catch (err) {
      toast.error(err || t('profile.toast.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('profile.toast.avatarSize'));
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setAvatarPreview(nextPreview);

    try {
      setAvatarUploading(true);
      await uploadApi.uploadAvatar(file);
      toast.success(t('profile.toast.avatarUpdated'));
      dispatch(fetchUserStats());
      setAvatarPreview(null);
    } catch (err) {
      toast.error(t('profile.toast.avatarError'));
      setAvatarPreview(null);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200 pt-28 pb-20 px-4 sm:px-6 lg:px-12 selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">

        {/* --- HERO SECTION --- */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full -z-10 translate-y-[-20%]"></div>

          <div className="relative bg-[#0d101a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-10">

              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <div className="w-full h-full rounded-full bg-[#0d101a] p-1 overflow-hidden">
                    <img
                      src={avatarPreview || avatar || user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'U'}&background=312e81&color=fff&size=200`}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white flex items-center justify-center shadow-lg border-4 border-[#0d101a] transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                >
                  <FiCamera size={18} />
                </button>
                <input ref={avatarInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>

              {/* User Identity Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    {user?.firstName || user?.username} {user?.lastName || ''}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 uppercase tracking-widest">
                    <FiCheckCircle size={12} /> {t('profile.badge.active')}
                  </span>
                </div>

                <p className="text-xl text-slate-400 font-medium mb-6">
                  {user?.jobTitle || t('profile.default.job')}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-8">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{t('profile.stat.level')}</span>
                    <span className="text-2xl font-black text-indigo-400 flex items-center gap-2">
                       <FiZap size={20} className="fill-indigo-400" /> {level || 1}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-white/5 hidden md:block"></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{t('profile.stat.xp')}</span>
                    <span className="text-2xl font-black text-white">{xp || 0}</span>
                  </div>
                  <div className="w-px h-10 bg-white/5 hidden md:block"></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{t('profile.stat.videos')}</span>
                    <span className="text-2xl font-black text-white">{videosWatched || 0}</span>
                  </div>
                </div>
              </div>

              {/* Edit Trigger */}
              <button
                onClick={() => setEditOpen(true)}
                className="self-center md:self-start mt-4 py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-200 font-bold text-sm transition-all flex items-center gap-2 group"
              >
                <FiEdit2 className="group-hover:text-indigo-400 transition-colors" />
                {t('profile.btn.edit')}
              </button>
            </div>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-[0_4px_20px_rgba(79,70,229,0.3)]'
                  : 'bg-white/5 text-slate-500 hover:text-slate-300 border border-transparent hover:border-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}
        <AnimatePresence mode="wait">
          {activeTab === t('profile.tab.info') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Details */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-[#0d101a] border border-white/5 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <FiUser className="text-indigo-500" />
                    {t('profile.section.info')}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t('profile.field.firstName')}</label>
                      <p className="text-lg font-bold text-white">{user?.firstName || t('profile.notSet')}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t('profile.field.lastName')}</label>
                      <p className="text-lg font-bold text-white">{user?.lastName || t('profile.notSet')}</p>
                    </div>
                  </div>

                  <div className="space-y-1 mb-8">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t('profile.field.job')}</label>
                    <p className="text-lg font-bold text-white">{user?.jobTitle || t('profile.default.job')}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{t('profile.field.bio')}</label>
                    <p className="text-slate-400 leading-relaxed italic">
                      &ldquo;{bio || t('profile.noBio')}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-[#0d101a] border border-white/5 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                    <FiAward className="text-indigo-500" />
                    {t('profile.section.skills')}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {skills?.length > 0 ? skills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-indigo-300 text-xs font-bold uppercase tracking-wider">
                        {skill}
                      </span>
                    )) : (
                      <p className="text-slate-500 italic">{t('profile.noSkills')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side Info */}
              <div className="space-y-8">
                <div className="bg-[#0d101a] border border-white/5 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-8">{t('profile.section.contact')}</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
                        <FiMail size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase">Email</p>
                        <p className="font-bold text-slate-200">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 flex items-center justify-center text-indigo-400">
                        <FiInstagram size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase">Instagram</p>
                        <p className="font-bold text-slate-200">@{sub?.instagram?.username || t('profile.needsLink')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <h4 className="text-2xl font-black mb-2 italic">Aidevix Pro</h4>
                      <p className="text-white/70 text-sm mb-6">{t('profile.pro.desc')}</p>
                      <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform">
                        Upgrade Now
                      </button>
                   </div>
                   <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === t('profile.tab.subs') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center bg-[#0d101a] border border-white/5 rounded-3xl text-slate-500 font-medium">
               {t('profile.subs.soon')}
            </motion.div>
          )}

          {activeTab === t('profile.tab.achievements') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {badges?.length > 0 ? badges.map((badge, i) => (
                  <div key={i} className="bg-[#0d101a] border border-white/5 p-6 rounded-3xl text-center">
                    <div className="text-4xl mb-3">{badge.icon || '🏆'}</div>
                    <h5 className="font-bold text-sm text-white">{badge.name}</h5>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase">{new Date(badge.earnedAt).toLocaleDateString()}</p>
                  </div>
               )) : (
                 <div className="col-span-full py-20 text-center text-slate-500">{t('profile.noAchievements')}</div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- EDIT MODAL --- */}
      <AnimatePresence>
        {editOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0d101a] border border-white/10 rounded-[2.5rem] shadow-2xl p-8 sm:p-12 overflow-hidden"
            >
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl -z-10"></div>

              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-white italic">{t('profile.modal.title')}</h2>
                <button onClick={() => setEditOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                   <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase px-1">{t('profile.field.firstName')}</label>
                    <input
                      type="text"
                      value={editDraft.ism}
                      onChange={(e) => setEditDraft({...editDraft, ism: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                      placeholder={t('profile.modal.firstPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase px-1">{t('profile.field.lastName')}</label>
                    <input
                      type="text"
                      value={editDraft.familiya}
                      onChange={(e) => setEditDraft({...editDraft, familiya: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                      placeholder={t('profile.modal.lastPlaceholder')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">{t('profile.modal.jobLabel')}</label>
                  <input
                    type="text"
                    value={editDraft.kasb}
                    onChange={(e) => setEditDraft({...editDraft, kasb: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                    placeholder={t('profile.modal.jobPlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase px-1">{t('profile.modal.bioLabel')}</label>
                  <textarea
                    rows={4}
                    value={editDraft.bio}
                    onChange={(e) => setEditDraft({...editDraft, bio: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium resize-none"
                    placeholder={t('profile.modal.bioPlaceholder')}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 font-bold uppercase text-[10px] tracking-widest transition-all"
                  >
                    {t('profile.modal.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSaving ? t('profile.modal.saving') : t('profile.modal.save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
