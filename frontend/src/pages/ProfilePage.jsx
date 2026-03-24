import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@store/slices/authSlice';
import { useUserStats } from '@hooks/useUserStats';
import { useSubscription } from '@hooks/useSubscription';
import { 
  FiEdit2, 
  FiMapPin, 
  FiUser, 
  FiBriefcase, 
  FiSend, 
  FiInstagram, 
  FiMail, 
  FiCheckCircle,
  FiBook,
  FiAward
} from 'react-icons/fi';
import { IoCameraOutline } from 'react-icons/io5';

export default function ProfilePage() {
  const user = useSelector(selectUser);
  const { xp, level, badges, videosWatched, bio, skills, updateProfile } = useUserStats();
  const sub = useSubscription();

  const [activeTab, setActiveTab] = useState("Ma'lumotlar");
  
  // Form states based on image mapping
  const [formData, setFormData] = useState({
    ism: user?.name || user?.username || "Ahmad",
    familiya: "Ergashev",
    kasb: "Frontend Dasturchi",
    bio: bio || "Aidevix platformasida tahsil olyapman.",
  });

  const handleSave = (e) => {
    e.preventDefault();
    // API logic to update profile can be handled here via updateProfile hook
    // updateProfile({ bio: formData.bio, skills: ... })
  };

  // Mock data for places without API equivalent immediately visible
  const statsMock = {
    kurslar: 12,
    videolar: videosWatched || 45,
    reyting: 4.8
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white pt-24 pb-12 px-6 lg:px-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-[1100px] mx-auto">
        
        {/* TOP BANNER */}
        <div className="relative w-full bg-[#0d1224]/50 border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl overflow-hidden mb-8">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-[3px] border-indigo-500 p-1 flex items-center justify-center bg-[#131B31] overflow-hidden">
                  <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=131B31&color=fff&size=128`} 
                    alt="avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {/* Camera Icon Badge */}
                <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors flex items-center justify-center border-[3px] border-[#0d1224] text-white cursor-pointer">
                  <IoCameraOutline size={16} />
                </button>
              </div>

              {/* Info */}
              <div className="pt-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  {formData.ism} {formData.familiya}
                </h1>
                <p className="text-gray-400 text-lg mb-3">{formData.kasb}</p>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-sm text-gray-400 mb-6">
                  <FiMapPin size={16} />
                  <span>Toshkent, O'zbekiston</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-white mb-1">{statsMock.kurslar}</div>
                    <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Kurslar</div>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-white mb-1">{statsMock.videolar}</div>
                    <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Videolar</div>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-white mb-1 flex items-center justify-center gap-1">
                      {statsMock.reyting} <span className="text-yellow-500 text-lg mb-0.5">★</span>
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Reyting</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-4 md:mt-2">
              <button className="py-2.5 px-5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-full transition-all border border-white/10 flex items-center gap-2 text-sm font-medium">
                <FiEdit2 size={16} />
                Profilni tahrirlash
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-white/5 mb-8">
          {["Ma'lumotlar", "Obunalar", "Faollik"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT GRID */}
        {activeTab === "Ma'lumotlar" && (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN - Shaxsiy ma'lumotlar & Ko'nikmalar */}
            <div className="flex-1 space-y-8">
              
              {/* Shaxsiy ma'lumotlar Card */}
              <div className="bg-[#0d1224]/40 border border-white/5 rounded-[24px] p-6 sm:p-8">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <FiUser className="text-indigo-400" size={20} />
                  Shaxsiy ma'lumotlar
                </h2>
                
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 px-1">Ism</label>
                      <input 
                        type="text" 
                        value={formData.ism}
                        onChange={(e) => setFormData({...formData, ism: e.target.value})}
                        className="w-full bg-[#131B31]/50 border border-white/5 rounded-xl px-5 py-3.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 px-1">Familiya</label>
                      <input 
                        type="text" 
                        value={formData.familiya}
                        onChange={(e) => setFormData({...formData, familiya: e.target.value})}
                        className="w-full bg-[#131B31]/50 border border-white/5 rounded-xl px-5 py-3.5 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2 px-1">Kasbi / Mutaxassisligi</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <FiBriefcase size={18} />
                      </div>
                      <input 
                        type="text" 
                        value={formData.kasb}
                        onChange={(e) => setFormData({...formData, kasb: e.target.value})}
                        className="w-full pl-12 pr-5 py-3.5 bg-[#131B31]/50 border border-white/5 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2 px-1">Bio</label>
                    <textarea 
                      rows="4"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full bg-[#131B31]/50 border border-white/5 rounded-xl px-5 py-4 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-colors placeholder-gray-600 resize-none leading-relaxed"
                      placeholder="O'zingiz haqingizda qisqacha..."
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                      Saqlash
                    </button>
                  </div>
                </form>
              </div>

              {/* Ko'nikmalar Card */}
              <div className="bg-[#0d1224]/40 border border-white/5 rounded-[24px] p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="text-indigo-400 p-1 bg-indigo-500/10 rounded-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    Ko'nikmalar
                  </h2>
                  <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Tahrirlash
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {skills?.length > 0 ? skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-[#131B31] border border-white/5 rounded-full text-xs font-medium text-gray-300">
                      {skill}
                    </span>
                  )) : (
                    <>
                      <span className="px-4 py-2 bg-[#131B31] border border-white/5 rounded-full text-xs font-medium text-gray-300">Python</span>
                      <span className="px-4 py-2 bg-[#131B31] border border-white/5 rounded-full text-xs font-medium text-gray-300">Django</span>
                      <span className="px-4 py-2 bg-[#131B31] border border-white/5 rounded-full text-xs font-medium text-gray-300">Machine Learning</span>
                      <span className="px-4 py-2 bg-[#131B31] border border-white/5 rounded-full text-xs font-medium text-gray-300">PostgreSQL</span>
                      <span className="px-4 py-2 bg-[#131B31] border border-white/5 rounded-full text-xs font-medium text-gray-300">Docker</span>
                    </>
                  )}
                  <button className="px-4 py-2 bg-transparent border border-dashed border-white/20 hover:border-indigo-400/50 hover:bg-indigo-500/5 rounded-full text-xs font-medium text-gray-500 hover:text-indigo-300 transition-all">
                    + add Qo'shish
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN - Kontakt & Faollik */}
            <div className="w-full lg:w-[400px] space-y-8">
              
              {/* Kontakt ma'lumotlar Card */}
              <div className="bg-[#0d1224]/40 border border-white/5 rounded-[24px] p-6 sm:p-8">
                <h2 className="text-lg font-bold text-white mb-6">Kontakt ma'lumotlar</h2>
                
                <div className="space-y-4">
                  {/* Telegram */}
                  <div className="flex items-center justify-between p-4 bg-[#131B31]/50 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center shrink-0">
                        <FiSend size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Telegram</div>
                        <div className="text-xs text-gray-500 mt-0.5">{sub.telegram?.username ? `@${sub.telegram.username}` : '@azizbek_dev'}</div>
                      </div>
                    </div>
                    {sub.telegram?.subscribed || true ? (
                      <FiCheckCircle className="text-green-500" size={18} />
                    ) : (
                      <button className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 rounded-lg transition-colors">Ulash</button>
                    )}
                  </div>

                  {/* Instagram */}
                  <div className="flex items-center justify-between p-4 bg-[#131B31]/50 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center shrink-0">
                        <FiInstagram size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Instagram</div>
                        <div className="text-xs text-gray-500 mt-0.5">{sub.instagram?.username ? `@${sub.instagram.username}` : 'Ulanmagan'}</div>
                      </div>
                    </div>
                    {sub.instagram?.subscribed ? (
                      <FiCheckCircle className="text-green-500" size={18} />
                    ) : (
                      <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 rounded-lg transition-colors">Ulash</button>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between p-4 bg-[#131B31]/50 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-500/10 text-slate-400 flex items-center justify-center shrink-0">
                        <FiMail size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Email</div>
                        <div className="text-xs text-gray-500 mt-0.5">{user?.email || 'aziz@aidevix.uz'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* So'nggi faollik Card */}
              <div className="bg-[#0d1224]/40 border border-white/5 rounded-[24px] p-6 sm:p-8 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <h2 className="text-lg font-bold text-white mb-6">So'nggi faollik</h2>
                
                <div className="space-y-6 relative">
                  {/* Timeline line */}
                  <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/5 z-0"></div>
                  
                  {/* Activity 1 */}
                  <div className="flex gap-4 relative z-10">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-300">"Python Asoslari" kursini yakunladi</div>
                      <div className="text-xs text-gray-500 mt-1">2 soat oldin</div>
                    </div>
                  </div>

                  {/* Activity 2 */}
                  <div className="flex gap-4 relative z-10">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 border border-[#0d1224] mt-1.5 shrink-0 opacity-50"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-400">Yangi sertifikat oldi</div>
                      <div className="text-xs text-gray-500 mt-1">Kecha, 14:30</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Barchasini ko'rish
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
        
        {/* OTHER TABS PLACEHOLDER */}
        {activeTab === "Obunalar" && (
          <div className="text-center py-20 text-gray-500 bg-[#0d1224]/40 border border-white/5 rounded-[24px]">
            Obunalar bo'limi hali ishlab chiqilmoqda...
          </div>
        )}
        
        {activeTab === "Faollik" && (
          <div className="text-center py-20 text-gray-500 bg-[#0d1224]/40 border border-white/5 rounded-[24px]">
            Faollik bo'limi hali ishlab chiqilmoqda...
          </div>
        )}

      </div>
    </div>
  );
}
