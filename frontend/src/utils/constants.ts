/** Brauzerda admin havolalari uchun (Swagger / admin-docs). Localda NEXT_PUBLIC_BACKEND_URL qo‘ying. */
export const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_ORIGIN ||
  'https://aidevix-backend-production.up.railway.app'
).replace(/\/$/, '')

const base = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/proxy'
const withLeading = (base.startsWith('/') || base.startsWith('http')) ? base : `/${base}`
export const API_BASE_URL = withLeading.endsWith('/') ? withLeading : `${withLeading}/`


export const CATEGORIES = [
  { id: 'all',        label: 'Barchasi',   icon: '🌐', color: '#6366f1' },
  { id: 'ai',         label: 'AI va Agentlar', icon: 'AI', color: '#06b6d4' },
  { id: 'html',       label: 'HTML',       icon: '🟠', color: '#f97316' },
  { id: 'css',        label: 'CSS',        icon: '🔵', color: '#3b82f6' },
  { id: 'javascript', label: 'JavaScript', icon: '🟡', color: '#eab308' },
  { id: 'react',      label: 'React',      icon: '⚛️',  color: '#06b6d4' },
  { id: 'typescript', label: 'TypeScript', icon: '🔷', color: '#2563eb' },
  { id: 'nodejs',     label: 'Node.js',    icon: '🟢', color: '#22c55e' },
  { id: 'telegram',   label: 'Telegram TMA', icon: '✈️', color: '#0ea5e9' },
  { id: 'security',   label: 'Kiberxavfsizlik', icon: '🛡️', color: '#ef4444' },
  { id: 'career',     label: 'Karyera/Freelance', icon: '💼', color: '#10b981' },
  { id: 'nocode',     label: 'No-Code',    icon: '⚡', color: '#f59e0b' },
  { id: 'web3',       label: 'Web3/Kripto', icon: '💎', color: '#8b5cf6' },
  { id: 'general',    label: 'Boshqalar',  icon: '📚', color: '#94a3b8' },
]


export const SORT_OPTIONS = [
  { value: 'newest',    label: 'Yangi kurslar' },
  { value: 'popular',   label: 'Eng ommabop' },
  { value: 'rating',    label: 'Yuqori reyting' },
  { value: 'views',     label: 'Ko\'p ko\'rilgan' },
]


export const SOCIAL_LINKS = {
  telegram:  process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL || 'https://t.me/aidevix',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL    || 'https://instagram.com/aidevix',
  bot:       process.env.NEXT_PUBLIC_TELEGRAM_BOT     || 'https://t.me/aidevix_bot',
}


export const REQUIRED_SUBSCRIPTIONS = ['telegram', 'instagram']


export const PAGE_SIZE = 12


export const MAX_RATING = 5


export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'aidevix_access_token',
  REFRESH_TOKEN: 'aidevix_refresh_token',
  USER:          'aidevix_user',
  THEME:         'aidevix_theme',
}


export const ROUTES = {
  HOME:           '/',
  COURSES:        '/courses',
  COURSE:         (id: string) => `/courses/${id}`,
  VIDEO:          (id: string) => `/videos/${id}`,
  TOP:            '/top',
  LOGIN:          '/login',
  REGISTER:       '/register',
  PROFILE:        '/profile',
  SUBSCRIPTION:   '/subscription',
  CAREERS:        '/careers',
  CHALLENGES:     '/challenges',
  LEADERBOARD:    '/leaderboard',
  REFERRAL:       '/referral',
  PROMPTS:        '/prompts',
  ROADMAP:        '/roadmap',
  PUBLIC_PROFILE: (username: string) => `/u/${username}`,
}
