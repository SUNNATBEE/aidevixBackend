'use client';

/**
 * Client-side xavfsizlik qatlamlari (yumshatilgan rejim).
 *
 * MUHIM: Asosiy himoya backend'da (httpOnly cookies, CSP, rate limit,
 * server-side validation). Bu komponent endi DevTools'ni bloklamaydi —
 * F12, Ctrl+Shift+I, right-click, anti-debugger loop hammasi olib
 * tashlangan. Qoldirilgan qatlamlar:
 *
 *  1. Console banner — Self-XSS hujumlaridan ogohlantirish
 *  2. Production'da `console.*` ni neytrallash — log'larda token sizishini kamaytirish
 *  3. window.__REDUX_DEVTOOLS_EXTENSION__ ni o'chirish (Redux state himoyasi)
 *  4. React DevTools hook'ini neytrallash
 *
 * Faqat production'da ishlaydi (NODE_ENV === 'production').
 */

import { useEffect } from 'react';

const isProd = process.env.NODE_ENV === 'production';

export default function SecurityHardening() {
  useEffect(() => {
    if (!isProd) return;
    if (typeof window === 'undefined') return;

    // ────────────────────────────────────────────────────────────────
    // 1. Self-XSS console warning — Facebook/Google style
    //    Hacker "paste this code in console" hujumi (kuki o'g'irlash)
    //    qiluvchilarga qarshi vizual ogohlantirish.
    // ────────────────────────────────────────────────────────────────
    try {
      const bigStyle = 'color:#ef4444;font-size:48px;font-weight:bold;text-shadow:2px 2px 0 #000';
      const warnStyle = 'color:#f59e0b;font-size:16px;font-weight:bold';
      const textStyle = 'color:#94a3b8;font-size:13px';
      // eslint-disable-next-line no-console
      console.log('%c🛑 STOP!', bigStyle);
      // eslint-disable-next-line no-console
      console.log(
        '%cBu — dasturchilar uchun mo\'ljallangan brauzer oynasi.',
        warnStyle
      );
      // eslint-disable-next-line no-console
      console.log(
        '%cAgar kimdir bu yerga kod nusxalashni so\'rasa — bu firibgarlik. ' +
        'Hech qachon noma\'lum kod yopishtirmang. Akkauntingizdan ' +
        'pul o\'g\'irlashlari yoki obro\'ngizga zarar yetkazishlari mumkin.',
        textStyle
      );
      // eslint-disable-next-line no-console
      console.log(
        '%cMurojaat: security@aidevix.uz',
        textStyle
      );
    } catch { /* console mavjud bo'lmasa, jim */ }

    // ────────────────────────────────────────────────────────────────
    // 2. Production'da console.* ni neytrallash
    //    Next.js compiler.removeConsole allaqachon dev-vaqt log'larini
    //    olib tashlaydi. Bu yerda runtime'da qo'shimcha himoya:
    //    har qanday log'lar (3rd-party kutubxonalardan ham) so'ndiriladi.
    //    error/warn qoldiriladi — Sentry kabi monitoring uchun.
    // ────────────────────────────────────────────────────────────────
    try {
      const noop = () => undefined;
      const keep = new Set(['error', 'warn']);
      // Faqat console mavjud bo'lsa
      if (typeof console !== 'undefined') {
        (['log', 'info', 'debug', 'trace', 'table', 'dir', 'group', 'groupCollapsed', 'groupEnd'] as const)
          .forEach((m) => {
            if (!keep.has(m) && typeof (console as unknown as Record<string, unknown>)[m] === 'function') {
              try {
                (console as unknown as Record<string, unknown>)[m] = noop;
              } catch { /* readonly, jim */ }
            }
          });
      }
    } catch { /* jim */ }

    // ────────────────────────────────────────────────────────────────
    // 3. React/Redux DevTools'ni neytrallash (production'da)
    //    Redux state'ni DevTools orqali ko'rish va o'zgartirishni
    //    qiyinlashtirish.
    // ────────────────────────────────────────────────────────────────
    try {
      const w = window as unknown as Record<string, unknown>;
      if (typeof w.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object' && w.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const hook = w.__REACT_DEVTOOLS_GLOBAL_HOOK__ as Record<string, unknown>;
        for (const key in hook) {
          // Funksiyalarni stub bilan almashtirish
          if (typeof hook[key] === 'function') {
            try { hook[key] = () => undefined; } catch { /* jim */ }
          }
        }
      }
      // Redux DevTools extension — production'da yo'q qilish
      try {
        delete (w as Record<string, unknown>).__REDUX_DEVTOOLS_EXTENSION__;
        delete (w as Record<string, unknown>).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
      } catch { /* jim */ }
    } catch { /* jim */ }

    return () => {};
  }, []);

  return null;
}
