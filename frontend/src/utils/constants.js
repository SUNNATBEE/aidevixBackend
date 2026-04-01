// ─── API ─────────────────────────────────────────────────────
const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
export const API_BASE_URL = base.endsWith('/') ? base : `${base}/`

// ─── Course Categories ────────────────────────────────────────
export const CATEGORIES = [
  { id: 'all',        label: 'Barchasi',   icon: '🌐', color: '#6366f1' },
  { id: 'html',       label: 'HTML',       icon: '🟠', color: '#f97316' },
  { id: 'css',        label: 'CSS',        icon: '🔵', color: '#3b82f6' },
  { id: 'javascript', label: 'JavaScript', icon: '🟡', color: '#eab308' },
  { id: 'react',      label: 'React',      icon: '⚛️',  color: '#06b6d4' },
  { id: 'typescript', label: 'TypeScript', icon: '🔷', color: '#2563eb' },
  { id: 'nodejs',     label: 'Node.js',    icon: '🟢', color: '#22c55e' },
  { id: 'general',    label: 'Boshqalar',  icon: '📚', color: '#8b5cf6' },
]

// ─── Sort Options ─────────────────────────────────────────────
export const SORT_OPTIONS = [
  { value: 'newest',    label: 'Yangi kurslar' },
  { value: 'popular',   label: 'Eng ommabop' },
  { value: 'rating',    label: 'Yuqori reyting' },
  { value: 'views',     label: 'Ko\'p ko\'rilgan' },
]

// ─── Social Media ─────────────────────────────────────────────
export const SOCIAL_LINKS = {
  telegram:  import.meta.env.VITE_TELEGRAM_CHANNEL || 'https://t.me/aidevix',
  instagram: import.meta.env.VITE_INSTAGRAM_URL    || 'https://instagram.com/aidevix',
  bot:       import.meta.env.VITE_TELEGRAM_BOT     || 'https://t.me/aidevix_bot',
}

// ─── Subscription Requirements ───────────────────────────────
export const REQUIRED_SUBSCRIPTIONS = ['telegram', 'instagram']

// ─── Pagination ───────────────────────────────────────────────
export const PAGE_SIZE = 12

// ─── Rating ───────────────────────────────────────────────────
export const MAX_RATING = 5

// ─── Local Storage Keys ──────────────────────────────────────
export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'aidevix_access_token',
  REFRESH_TOKEN: 'aidevix_refresh_token',
  USER:          'aidevix_user',
  THEME:         'aidevix_theme',
}

// ─── Route Paths ─────────────────────────────────────────────
export const ROUTES = {
  HOME:         '/',
  COURSES:      '/courses',
  COURSE:       (id) => `/courses/${id}`,
  VIDEO:        (id) => `/videos/${id}`,
  TOP:          '/top',
  LOGIN:        '/login',
  REGISTER:     '/register',
  PROFILE:      '/profile',
  SUBSCRIPTION: '/subscription',
}
