import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@utils/constants'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { RiCodeSSlashLine } from 'react-icons/ri'

const NAV_LINKS = [
  { label: "Kurslar",      to: ROUTES.COURSES },
  { label: "Yo'nalishlar", to: '/courses' },
  { label: "Hamjamiyat",   to: '/leaderboard' },
  { label: "Blog",         to: '/top' },
]

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
    navigate(ROUTES.HOME)
  }

  const avatarLetter = user?.username?.[0]?.toUpperCase() ?? 'U'

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0c14]/95 backdrop-blur-md shadow-lg shadow-black/30'
            : 'bg-[#0a0c14]/80 backdrop-blur-sm'
        }`}
        style={{ borderBottom: '1px solid rgba(99,102,241,0.25)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* ─── Logo ─── */}
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 group"
            >
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500 transition-colors">
                <RiCodeSSlashLine className="text-white text-sm" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Aidevix
              </span>
            </Link>

            {/* ─── Desktop Nav Links ─── */}
            <ul className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* ─── Desktop Right Side ─── */}
            <div className="hidden lg:flex items-center gap-2">
              {isLoggedIn ? (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold group-hover:bg-indigo-500 transition-colors">
                      {avatarLetter}
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {user?.username}
                    </span>
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu mt-3 w-48 rounded-xl shadow-xl bg-[#12141f] border border-white/10 p-1.5 z-50"
                  >
                    <li>
                      <Link to={ROUTES.PROFILE} className="text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-sm py-2">
                        👤 Profil
                      </Link>
                    </li>
                    <li>
                      <Link to={ROUTES.SUBSCRIPTION} className="text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-sm py-2">
                        🔗 Obuna holati
                      </Link>
                    </li>
                    <div className="divider my-1 h-px bg-white/10" />
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-sm py-2 w-full text-left"
                      >
                        🚪 Chiqish
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="px-4 py-1.5 text-sm text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                  >
                    Kirish
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="px-4 py-1.5 text-sm text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors font-medium flex items-center gap-1"
                  >
                    Boshlash <span className="text-indigo-300">→</span>
                  </Link>
                </>
              )}
            </div>

            {/* ─── Mobile Hamburger ─── */}
            <button
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menyu"
            >
              {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Menu ─── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ borderTop: menuOpen ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
        >
          <div className="bg-[#0a0c14] px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-gray-300 hover:text-white hover:bg-white/8 rounded-lg text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/8 flex gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2 text-sm text-gray-300 hover:text-white bg-white/8 hover:bg-white/12 rounded-lg transition-colors"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2 text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2 text-sm text-gray-300 hover:text-white bg-white/8 hover:bg-white/12 rounded-lg transition-colors"
                  >
                    Kirish
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-medium"
                  >
                    Boshlash →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Navbar height spacer */}
      <div className="h-14" />
    </>
  )
}
