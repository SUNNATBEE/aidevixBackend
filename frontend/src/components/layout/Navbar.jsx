import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { IoMenu, IoClose, IoPerson, IoLogOut, IoBookmarks } from 'react-icons/io5'

import { logout, selectIsLoggedIn, selectUser } from '@store/slices/authSlice'
import { ROUTES } from '@utils/constants'

const NAV_LINKS = [
  { to: ROUTES.HOME,    label: 'Bosh sahifa' },
  { to: ROUTES.COURSES, label: 'Kurslar' },
  { to: ROUTES.TOP,     label: 'Top kurslar' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef  = useRef(null)
  const dispatch = useNavigate ? useDispatch() : null
  const navigate = useNavigate()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user       = useSelector(selectUser)

  useEffect(() => {
    // Initial animation
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
    )

    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.HOME)
    setMenuOpen(false)
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-base/90 backdrop-blur-xl border-b border-dark-border shadow-card'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center
                            group-hover:shadow-glow-sm transition-shadow">
              <span className="text-white font-bold text-sm font-mono">AI</span>
            </div>
            <span className="font-display font-bold text-xl gradient-text">Aidevix</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-sm gap-2 rounded-xl">
                  <div className="avatar placeholder">
                    <div className="w-7 rounded-full bg-primary-600">
                      <span className="text-xs font-bold text-white">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-zinc-300">{user?.username}</span>
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-card
                                            glass-card w-52 mt-2 text-sm">
                  <li>
                    <Link to={ROUTES.PROFILE} className="gap-2">
                      <IoPerson /> Profil
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.SUBSCRIPTION} className="gap-2">
                      <IoBookmarks /> Obuna holati
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="gap-2 text-error">
                      <IoLogOut /> Chiqish
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm">Kirish</Link>
                <Link to={ROUTES.REGISTER} className="btn-neon btn btn-sm">
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden btn btn-ghost btn-sm"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <IoClose className="text-xl" /> : <IoMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-card mx-4 mb-2 p-4 rounded-2xl border border-dark-border">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                  isActive ? 'text-primary-400 bg-primary-500/10' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-dark-border mt-3 pt-3 flex gap-2">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn btn-error btn-sm flex-1 gap-2">
                <IoLogOut /> Chiqish
              </button>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}    onClick={() => setMenuOpen(false)} className="btn btn-ghost btn-sm flex-1">Kirish</Link>
                <Link to={ROUTES.REGISTER} onClick={() => setMenuOpen(false)} className="btn-neon btn btn-sm flex-1">Ro'yxat</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
