import { Link } from 'react-router-dom'
import { IoLogoInstagram, IoLogoGithub } from 'react-icons/io5'
import { FaTelegram } from 'react-icons/fa'
import { SOCIAL_LINKS, ROUTES } from '@utils/constants'

export default function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-surface mt-20">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm font-mono">AI</span>
              </div>
              <span className="font-display font-bold text-xl gradient-text">Aidevix</span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Professional dasturlash kurslarini o'zbek tilida o'rganish platformasi.
              HTML, CSS, JavaScript, React, TypeScript va Node.js.
            </p>
            <div className="flex gap-3 mt-4">
              <a href={SOCIAL_LINKS.telegram}  target="_blank" rel="noreferrer"
                 className="btn btn-ghost btn-sm btn-circle text-primary-400 hover:bg-primary-500/10">
                <FaTelegram className="text-xl" />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer"
                 className="btn btn-ghost btn-sm btn-circle text-pink-400 hover:bg-pink-500/10">
                <IoLogoInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Kurslar</h4>
            <ul className="space-y-2">
              {['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js'].map((c) => (
                <li key={c}>
                  <Link
                    to={`${ROUTES.COURSES}?category=${c.toLowerCase()}`}
                    className="text-zinc-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Platforma</h4>
            <ul className="space-y-2">
              {[
                { to: ROUTES.TOP,          label: 'Top kurslar' },
                { to: ROUTES.SUBSCRIPTION, label: 'Obuna' },
                { to: ROUTES.PROFILE,      label: 'Profil' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-zinc-400 hover:text-primary-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-border mt-10 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Aidevix. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-zinc-600 text-xs font-mono">
            v1.0.0
          </p>
        </div>
      </div>
    </footer>
  )
}
