import Link from 'next/link';
import { FaTelegram, FaInstagram, FaYoutube } from 'react-icons/fa'
import { RiCodeSSlashLine } from 'react-icons/ri'
import { ROUTES, SOCIAL_LINKS } from '@utils/constants'

const FOOTER_LINKS = {
  platforma: {
    title: 'Platforma',
    links: [
      { label: 'Kurslar',            to: ROUTES.COURSES },
      { label: 'Mentorlar',          to: '/mentors' },
      { label: 'Narxlar',            to: '/pricing' },
      { label: "Kompaniyalar uchun", to: '/enterprise' },
    ],
  },
  kompaniya: {
    title: 'Kompaniya',
    links: [
      { label: 'Biz haqimizda', to: '/about' },
      { label: 'Blog',          to: '/blog' },
      { label: 'Karyera',       to: '/careers' },
      { label: 'Aloqa',         to: '/contact' },
    ],
  },
  resurslar: {
    title: 'Resurslar',
    links: [
      { label: 'Yordam markazi',        to: '/help' },
      { label: 'Maxfiylik siyosati',    to: '/privacy' },
      { label: 'Foydalanish shartlari', to: '/terms' },
      { label: 'Sitemap',               to: '/sitemap' },
    ],
  },
}

const SOCIAL = [
  { icon: <FaTelegram size={15} />,  href: SOCIAL_LINKS.telegram,  label: 'tg'  },
  { icon: <FaInstagram size={15} />, href: SOCIAL_LINKS.instagram, label: 'in'  },
  { icon: <FaYoutube size={15} />,   href: 'https://youtube.com/@aidevix', label: 'yt' },
]

export default function Footer() {
  return (
    <footer
      className="mt-20"
      style={{
        backgroundColor: '#0a0c14',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ─── Main Grid ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ─── Col 1: Brand ─── */}
          <div className="lg:col-span-1">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 group w-fit">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500 transition-colors">
                <RiCodeSSlashLine className="text-white text-sm" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Aidevix
              </span>
            </Link>

            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs">
              O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi.
              Biz bilan kelajak kasbini o'rganing.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)')}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ─── Cols 2–4: Link Groups ─── */}
          {Object.values(FOOTER_LINKS).map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-gray-200 mb-4 tracking-wide">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.to}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p className="text-xs text-gray-600">
          © 2023 Aidevix Inc. Barcha huquqlar himoyalangan.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span>Toshkent, O'zbekiston</span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Tizim ishlamoqda
          </span>
        </div>
      </div>
    </footer>
  )
}
