// LeaderboardPage.jsx — SUHROB
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { HiBolt } from 'react-icons/hi2'
import { FaTrophy } from 'react-icons/fa'

import { useUserStats } from '@hooks/useUserStats'
import { selectUser, selectIsLoggedIn } from '@store/slices/authSlice'
import LeaderboardTable from '@components/leaderboard/LeaderboardTable'
import LevelUpModal from '@components/leaderboard/LevelUpModal'

// To'g'ridan-to'g'ri Railway API
const API = 'https://aidevix-backend-production.up.railway.app/api'

const TABS = [
  { key:'all',        label:'GLOBAL'     },
  { key:'javascript', label:'JAVASCRIPT' },
  { key:'react',      label:'REACT'      },
  { key:'python',     label:'PYTHON'     },
  { key:'ui/ux',      label:'UI/UX'      },
]

const XP_ENGINE = [
  { label:'Video Darslar', xp:'+50 XP',  color:'text-blue-400',   dot:'bg-blue-500'   },
  { label:'Quizlar',       xp:'+100 XP', color:'text-purple-400', dot:'bg-purple-500' },
  { label:'Amaliy Mashq',  xp:'+150 XP', color:'text-indigo-400', dot:'bg-indigo-500' },
  { label:'Challenge',     xp:'+500 XP', color:'text-orange-400', dot:'bg-orange-500' },
]

const LEVEL_NAMES = {
  1:'Yangi Boshlovchi',5:'Qiziquvchan',10:'Izlanuvchi',
  15:'Bilimdon',20:'Ekspert',25:'Mantiq Ustasi',
  30:'Grandmaster',35:'Ustoz',40:'Afsonaviy',50:'Immortal',
}
const getLevelName = (lvl) => {
  if (!lvl) return 'Yangi Boshlovchi'
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a,b)=>b-a)
  return LEVEL_NAMES[keys.find(k=>lvl>=k)] || 'Yangi Boshlovchi'
}
const getInitials = (name='') =>
  name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)

// Mock — API bo'sh bo'lganda
const MOCK = {
  all:[
    {rank:1,xp:145200,level:99,streak:84,badges:['🏆'],user:{_id:'m1',username:'Jamshid K.'}},
    {rank:2,xp:92450, level:80,streak:42,badges:['🥈'],user:{_id:'m2',username:'Malika R.'}},
    {rank:3,xp:86100, level:80,streak:30,badges:['🥉'],user:{_id:'m3',username:'Azizbek T.'}},
    {rank:4,xp:75400, level:78,streak:20,badges:['🔥'],user:{_id:'m4',username:'Rustam B.'}},
    {rank:5,xp:72150, level:76,streak:15,badges:['⭐'],user:{_id:'m5',username:'Sevara M.'}},
    {rank:6,xp:69800, level:74,streak:10,badges:[],    user:{_id:'m6',username:'Javlon D.'}},
    {rank:7,xp:64200, level:71,streak:8, badges:[],    user:{_id:'m7',username:'Nodira S.'}},
  ],
  javascript:[
    {rank:1,xp:98000,level:70,streak:50,badges:['🏆'],user:{_id:'j1',username:'Bobur A.'}},
    {rank:2,xp:87000,level:65,streak:30,badges:['🥈'],user:{_id:'j2',username:'Zafar T.'}},
    {rank:3,xp:76000,level:60,streak:20,badges:['🥉'],user:{_id:'j3',username:'Kamola N.'}},
    {rank:4,xp:65000,level:55,streak:15,badges:[],    user:{_id:'j4',username:'Sherzod M.'}},
    {rank:5,xp:54000,level:50,streak:10,badges:[],    user:{_id:'j5',username:'Dilnoza R.'}},
  ],
  react:[
    {rank:1,xp:112000,level:85,streak:60,badges:['🏆'],user:{_id:'r1',username:'Akbar Y.'}},
    {rank:2,xp:95000, level:75,streak:40,badges:['🥈'],user:{_id:'r2',username:'Feruza K.'}},
    {rank:3,xp:83000, level:68,streak:25,badges:['🥉'],user:{_id:'r3',username:'Ulugbek S.'}},
    {rank:4,xp:71000, level:60,streak:18,badges:[],    user:{_id:'r4',username:'Mohira T.'}},
  ],
  python:[
    {rank:1,xp:105000,level:80,streak:55,badges:['🏆'],user:{_id:'p1',username:'Sardor B.'}},
    {rank:2,xp:88000, level:70,streak:35,badges:['🥈'],user:{_id:'p2',username:'Nilufar A.'}},
    {rank:3,xp:74000, level:62,streak:22,badges:['🥉'],user:{_id:'p3',username:'Jasur M.'}},
    {rank:4,xp:62000, level:55,streak:12,badges:[],    user:{_id:'p4',username:'Barno X.'}},
  ],
  'ui/ux':[
    {rank:1,xp:91000,level:72,streak:45,badges:['🏆'],user:{_id:'u1',username:'Otabek R.'}},
    {rank:2,xp:79000,level:63,streak:28,badges:['🥈'],user:{_id:'u2',username:'Gulnora S.'}},
    {rank:3,xp:67000,level:55,streak:18,badges:['🥉'],user:{_id:'u3',username:'Farhod N.'}},
    {rank:4,xp:55000,level:48,streak:10,badges:[],    user:{_id:'u4',username:'Zulfiya M.'}},
  ],
}

// ── Podium Card ──────────────────────────────────────────────
function PodiumCard({ user, rank }) {
  if (!user) return null
  const username = user.user?.username || user.username || 'Foydalanuvchi'
  const s = {
    1:{ wrap:'order-2 z-10 scale-110', card:'border-yellow-500/60 bg-[#1c1500]', shadow:'0 0 40px rgba(234,179,8,0.25)', badge:'bg-yellow-500', ab:'border-yellow-500', sz:'w-[72px] h-[72px]' },
    2:{ wrap:'order-1', card:'border-gray-500/30 bg-[#111318]', shadow:'none', badge:'bg-gray-400', ab:'border-gray-400/60', sz:'w-14 h-14' },
    3:{ wrap:'order-3', card:'border-amber-600/30 bg-[#130e00]', shadow:'none', badge:'bg-amber-600', ab:'border-amber-600/50', sz:'w-14 h-14' },
  }[rank]

  return (
    <motion.div
      initial={{opacity:0,y:60}} animate={{opacity:1,y:0}}
      transition={{delay:rank*0.1,type:'spring',stiffness:160,damping:18}}
      className={`${s.wrap} flex-1 max-w-[160px]`}
    >
      <div className={`relative flex flex-col items-center px-3 pt-6 pb-4 rounded-2xl border ${s.card}`} style={{boxShadow:s.shadow}}>
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${s.badge} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
          {rank}
        </div>
        {rank===1 && <FaTrophy className="text-yellow-400 text-3xl mb-2 drop-shadow-lg" />}
        <div className={`${s.sz} rounded-full border-2 ${s.ab} flex items-center justify-center font-bold text-lg overflow-hidden bg-base-300 flex-shrink-0`}>
          {user.user?.avatar || user.avatar
            ? <img src={user.user?.avatar||user.avatar} alt={username} className="w-full h-full object-cover" />
            : <span>{getInitials(username)}</span>}
        </div>
        <p className={`${rank===1?'text-base font-black':'text-sm font-bold'} mt-2 text-center truncate w-full`}>{username}</p>
        {rank===1 ? (
          <>
            <span className="mt-1 px-2 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] font-black tracking-wider">GRANDMASTER</span>
            <p className="text-yellow-400 font-black text-base mt-2">{(user.xp||0).toLocaleString()} XP</p>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="flex flex-col items-center"><span className="text-white/40 text-[9px]">LEVEL</span><b className="text-white">{user.level??99}</b></span>
              <span className="flex flex-col items-center"><span className="text-white/40 text-[9px]">QUIZZES</span><b className="text-white">{user.quizzesCompleted??450}</b></span>
              <span className="flex flex-col items-center"><span className="text-white/40 text-[9px]">STREAK</span><b className="text-orange-400">{user.streak??84}🔥</b></span>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-base-content/40 mt-0.5">{getLevelName(user.level||1)}</p>
            <p className="text-primary font-bold text-sm mt-1">{(user.xp||0).toLocaleString()} XP</p>
            <div className="w-full h-1 bg-base-300 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary/60 rounded-full" style={{width:'55%'}} />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [activeTab, setActiveTab]       = useState('all')
  const [pageNum, setPageNum]           = useState(1)
  const [apiUsers, setApiUsers]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [pagination, setPagination]     = useState(null)
  const [userPosition, setUserPosition] = useState(null)

  const isLoggedIn  = useSelector(selectIsLoggedIn)
  const currentUser = useSelector(selectUser)

  const { xp, level, levelProgress, xpToNextLevel, streak, badges,
          justLeveledUp, newLevel, quizResult, dismissLevelUp } = useUserStats()

  // API dan userlarni olish — to'g'ridan-to'g'ri Railway ga
  const fetchUsers = async (page=1, replace=true) => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API}/ranking/users`, {
        params: { page, limit: 20 }
      })
      const list  = data?.data?.users || data?.users || []
      const pages = data?.data?.pagination || data?.pagination || {}
      if (replace) setApiUsers(list)
      else setApiUsers(prev => [...prev, ...list])
      setPagination(pages)
    } catch (e) {
      console.error('Ranking API xato:', e.message)
    } finally {
      setLoading(false)
    }
  }

  // User pozitsiyasi
  const fetchPosition = async () => {
    if (!isLoggedIn || !currentUser?._id) return
    try {
      const token = localStorage.getItem('aidevix_access_token')
      const { data } = await axios.get(`${API}/ranking/users/${currentUser._id}/position`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserPosition(data?.data?.position || data?.data || null)
    } catch {}
  }

  useEffect(() => { fetchUsers(1, true) }, [])
  useEffect(() => { fetchPosition() }, [isLoggedIn, currentUser?._id])

  const handleLoadMore = () => {
    const next = pageNum + 1
    setPageNum(next)
    fetchUsers(next, false)
  }

  // API bo'sh bo'lsa mock
  const displayUsers = apiUsers.length > 0 ? apiUsers : (MOCK[activeTab] || MOCK.all)
  const podiumUsers  = displayUsers.slice(0, 3)
  const tableUsers   = displayUsers.slice(3)

  const rank       = userPosition?.rank
  const topPercent = userPosition?.percentile
  const nextLevelXP    = xpToNextLevel || 1000
  const currentLevelXP = xp % nextLevelXP
  const progressPct    = levelProgress || Math.round((currentLevelXP/nextLevelXP)*100)

  return (
    <div className="min-h-screen bg-base-100">
      <LevelUpModal
        isOpen={justLeveledUp}
        level={newLevel}
        levelName={getLevelName(newLevel)}
        xp={xp}
        quizResult={quizResult}
        onClose={dismissLevelUp}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* User banner */}
        {isLoggedIn && (
          <motion.div
            initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}}
            className="w-full rounded-xl border border-primary/30 overflow-hidden mb-6"
            style={{background:'linear-gradient(135deg,rgba(99,102,241,0.2) 0%,rgba(139,92,246,0.12) 50%,rgba(15,15,25,0.98) 100%)'}}
          >
            <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center"
                style={{background:'rgba(99,102,241,0.3)',border:'1px solid rgba(99,102,241,0.5)'}}>
                <span className="text-xl font-black text-white leading-none">{rank??'—'}</span>
                <span className="text-[8px] text-indigo-300/60 uppercase">o'rin</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-white">SIZNING REYTINGINGIZ</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
                    {getLevelName(level).toUpperCase()}
                  </span>
                  {topPercent && <span className="text-[10px] text-primary font-semibold">Top {topPercent}%</span>}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.08)'}}>
                    <motion.div
                      initial={{width:0}} animate={{width:`${progressPct}%`}}
                      transition={{duration:1.2,ease:'easeOut'}}
                      className="h-full rounded-full"
                      style={{background:'linear-gradient(90deg,#6366f1,#ec4899)'}}
                    />
                  </div>
                  <span className="text-[10px] text-white/40 whitespace-nowrap">
                    {currentLevelXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right px-3 border-l border-white/10">
                <p className="text-[10px] text-white/40 uppercase">Jami XP</p>
                <p className="font-black text-primary text-sm">{xp.toLocaleString()}</p>
              </div>
              <div className="flex-shrink-0 text-center px-3 border-l border-white/10">
                <p className="text-[10px] text-white/40 uppercase">STREAK</p>
                <p className="font-bold text-sm text-orange-400">🔥 {streak}</p>
              </div>
              <div className="flex-shrink-0 text-center px-3 border-l border-white/10">
                <p className="text-[10px] text-white/40 uppercase">BADGE</p>
                <p className="font-bold text-sm text-yellow-400">🏆 {badges?.length??0}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1 initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} className="text-4xl font-black tracking-tight mb-5">
          GLOBAL <span className="text-primary">AUTHORITY</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setPageNum(1) }}
                  className={`btn btn-sm rounded-lg font-bold transition-all ${
                    activeTab===tab.key
                      ? 'btn-primary shadow-lg shadow-primary/30'
                      : 'btn-ghost border border-base-300 text-base-content/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Podium */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex justify-center items-end gap-4 py-8">
                  {[160,220,160].map((h,i) => (
                    <div key={i} className="skeleton rounded-2xl flex-1 max-w-[160px]" style={{height:h}} />
                  ))}
                </div>
              ) : (
                <motion.div
                  key={activeTab+'-p'}
                  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="flex items-end justify-center gap-3 py-4"
                >
                  <PodiumCard user={podiumUsers[1]} rank={2} />
                  <PodiumCard user={podiumUsers[0]} rank={1} />
                  <PodiumCard user={podiumUsers[2]} rank={3} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Table */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_,i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
                </div>
              ) : (
                <motion.div key={activeTab+'-t'} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <LeaderboardTable users={tableUsers} currentUserId={currentUser?._id} loading={false} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load more */}
            {pagination && pageNum < (pagination.totalPages||pagination.pages||1) && (
              <div className="text-center py-4">
                <button onClick={handleLoadMore} disabled={loading} className="btn btn-outline btn-sm px-10 gap-2 font-bold tracking-wider">
                  {loading && <span className="loading loading-spinner loading-xs" />}
                  + YANA YUKLASH
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <motion.div
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.2}}
              className="rounded-xl border border-base-300 bg-base-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
                <div className="flex items-center gap-2">
                  <HiBolt className="text-yellow-400 text-lg" />
                  <span className="font-bold text-sm tracking-wide">XP ENGINE</span>
                </div>
                <HiBolt className="text-yellow-400/20 text-2xl" />
              </div>
              <div className="p-3 space-y-1">
                {XP_ENGINE.map(item => (
                  <div key={item.label} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-base-300/40 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                      <span className="text-sm text-base-content/80">{item.label}</span>
                    </div>
                    <span className={`font-black text-sm ${item.color}`}>{item.xp}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.35}}
              className="rounded-xl border border-primary/20 bg-primary/5 p-4"
            >
              <p className="text-[10px] text-base-content/40 uppercase tracking-widest mb-3">Haftalik Missiya</p>
              <div className="bg-base-200/80 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-bold text-sm">JavaScript Master</p>
                  <span className="badge badge-primary badge-xs whitespace-nowrap flex-shrink-0">3 kun qoldi</span>
                </div>
                <p className="text-xs text-base-content/40 leading-relaxed">5 ta JavaScript quizini 100% natija bilan yakunlang.</p>
                <div className="w-full h-1.5 bg-base-300 rounded-full mt-3 overflow-hidden">
                  <motion.div initial={{width:0}} animate={{width:'40%'}} transition={{delay:0.6,duration:0.8}} className="h-full bg-primary rounded-full" />
                </div>
                <p className="text-[10px] text-base-content/30 mt-1 text-right">2/5 bajarildi</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}
