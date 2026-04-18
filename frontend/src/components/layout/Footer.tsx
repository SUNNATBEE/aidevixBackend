'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaInstagram, FaTelegram, FaYoutube } from 'react-icons/fa'
import { RiCodeSSlashLine } from 'react-icons/ri'
import { ROUTES, SOCIAL_LINKS } from '@utils/constants'
import { useLang } from '@/context/LangContext'
import { useTheme } from '@/context/ThemeContext'

const SOCIAL = [
  { icon: <FaTelegram size={15} />, href: SOCIAL_LINKS.telegram, label: 'tg' },
  { icon: <FaInstagram size={15} />, href: SOCIAL_LINKS.instagram, label: 'in' },
  { icon: <FaYoutube size={15} />, href: 'https://youtube.com/@aidevix', label: 'yt' },
]

export default function Footer() {
  const { t } = useLang()
  const { isDark } = useTheme()

  const FOOTER_LINKS = [
    {
      title: t('footer.platform'),
      links: [
        { label: t('footer.fCourses'), to: ROUTES.COURSES },
        { label: t('footer.fMentors'), to: '#' },
        { label: t('footer.fPricing'), to: '#' },
        { label: t('footer.fEnterprise'), to: '#' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.fAbout'), to: '#' },
        { label: t('footer.fBlog'), to: '#' },
        { label: t('footer.fCareers'), to: ROUTES.CAREERS },
        { label: t('footer.fContact'), to: '#' },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('footer.fHelp'), to: '#' },
        { label: t('footer.fPrivacy'), to: '#' },
        { label: t('footer.fTerms'), to: '#' },
        { label: t('footer.sitemap'), to: '#' },
      ],
    },
  ]

  const shell = isDark ? 'bg-[#07090d] text-white' : 'bg-[#f7f8fc] text-slate-950'
  const borderClr = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'
  const brandText = isDark ? 'text-white' : 'text-slate-950'
  const descText = isDark ? 'text-slate-400' : 'text-slate-600'
  const headingText = isDark ? 'text-slate-200' : 'text-slate-800'
  const linkText = isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-950'
  const socialText = isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'
  const copyText = isDark ? 'text-slate-500' : 'text-slate-500'

  return (
    <footer className={`border-t ${shell}`} style={{ borderTopColor: borderClr }}>
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr] lg:gap-8">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="section-kicker text-indigo-400">Aidevix</div>
            <Link href={ROUTES.HOME} className="group mt-5 flex w-fit items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-[0_12px_30px_rgba(86,98,246,0.3)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-indigo-400">
                <RiCodeSSlashLine className="text-sm" />
              </div>
              <span className={`font-display text-2xl font-semibold tracking-[-0.04em] ${brandText}`}>Aidevix</span>
            </Link>
            <p className={`mt-6 max-w-sm text-sm leading-7 ${descText}`}>{t('footer.desc')}</p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 ${socialText}`}
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)', borderColor: borderClr }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {FOOTER_LINKS.map((group, idx) => (
            <motion.div 
              key={group.title} 
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * (idx + 1), ease: 'easeOut' }}
              className="border-t pt-5 lg:border-0 lg:pt-0" 
              style={{ borderColor: borderClr }}
            >
              <h4 className={`mb-5 text-sm font-semibold uppercase tracking-[0.24em] ${headingText}`}>{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.to} className={`text-sm transition-colors duration-300 ${linkText}`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8" 
        style={{ borderTop: `1px solid ${borderClr}` }}
      >
        <p className={`text-xs ${copyText}`}>{t('footer.copyright')}</p>
        <div className={`flex items-center gap-1.5 text-xs ${copyText}`}>
          <span>{t('footer.location')}</span>
          <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t('footer.status')}
          </span>
        </div>
      </motion.div>
    </footer>
  )
}
