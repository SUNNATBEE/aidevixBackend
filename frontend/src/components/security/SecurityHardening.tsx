'use client';

/**
 * Client-side xavfsizlik qatlamlari.
 *
 * MUHIM ESLATMA: Hech qanday client-side himoya 100% emas. Brauzer
 * o'rnatilgan tomonidan boshqariladi va hacker xohlasa har qanday
 * JS-deterrentni o'chiradi. Asosiy himoya backend'da (httpOnly
 * cookies, CSP, rate limit, server-side validation). Bu komponent —
 * "ko'rinadigan" sezilarli to'siq:
 *
 *  1. Console banner — Self-XSS hujumlaridan ogohlantirish
 *  2. Production'da `console.*` ni neytrallash — log'larda token sizishini kamaytirish
 *  3. Anti-debugger — DevTools ochilganda performance jarima
 *  4. window.__REDUX_DEVTOOLS_EXTENSION__ ni o'chirish
 *  5. React DevTools ni production'da yashirish
 *  6. Right-click va F12 — faqat ko'rinadigan UX deterrent (optional)
 *
 * Faqat production'da ishlaydi (NODE_ENV === 'production'). Dev'da
 * to'liq devtools mavjud bo'lishi shart.
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

    // ────────────────────────────────────────────────────────────────
    // 4. DevTools ochilganda anti-debugger — performance jarima
    //    Bu hackerlarni butunlay to'xtatmaydi (Sources panel'da
    //    "Never pause here" bilan o'chirilishi mumkin), lekin oddiy
    //    skript bolalari uchun yetarli to'siq.
    //
    //    setInterval bilan har 1 sek `debugger` chaqirilsa — DevTools
    //    ochiq bo'lsa sahifa muzlaydi, yopiq bo'lsa optimizator o'tib
    //    ketadi.
    // ────────────────────────────────────────────────────────────────
    const debuggerLoop = setInterval(() => {
      try {
        // eslint-disable-next-line no-debugger
        debugger;
      } catch { /* jim */ }
    }, 1500);

    // ────────────────────────────────────────────────────────────────
    // 5. DevTools open detection — vizual deterrent
    //    window.outerWidth - innerWidth > 160px → DevTools ochilgan
    //    deb taxmin qilamiz (docked panel). Detect bo'lsa — body'ga
    //    `data-devtools-open` attribute qo'yiladi (CSS overlay uchun).
    // ────────────────────────────────────────────────────────────────
    let lastDetected = false;
    const checkDevtools = () => {
      const threshold = 160;
      const horiz = window.outerWidth - window.innerWidth > threshold;
      const vert = window.outerHeight - window.innerHeight > threshold;
      const detected = horiz || vert;
      if (detected !== lastDetected) {
        lastDetected = detected;
        if (detected) {
          document.documentElement.setAttribute('data-devtools-open', 'true');
        } else {
          document.documentElement.removeAttribute('data-devtools-open');
        }
      }
    };
    const devtoolsTimer = setInterval(checkDevtools, 800);

    // ────────────────────────────────────────────────────────────────
    // 6. Page-level guards
    // ────────────────────────────────────────────────────────────────

    // Right-click — kontekst menyusini bloklash (oddiy deterrent)
    const onContext = (e: MouseEvent) => {
      // Form input'larida kontekst menyusi qoladi (UX uchun)
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
    };

    // F12, Ctrl+Shift+I/J/C, Ctrl+U — DevTools shortcut'larini bloklash
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      // F12
      if (k === 'F12') { e.preventDefault(); return; }
      // Ctrl+Shift+I/J/C (Inspector, Console, picker)
      if (ctrl && shift && ['I', 'J', 'C', 'i', 'j', 'c'].includes(k)) { e.preventDefault(); return; }
      // Ctrl+U — View Source
      if (ctrl && (k === 'U' || k === 'u')) { e.preventDefault(); return; }
      // Ctrl+S — Save page (HTML yuklab olish)
      if (ctrl && (k === 'S' || k === 's')) { e.preventDefault(); return; }
    };

    document.addEventListener('contextmenu', onContext);
    document.addEventListener('keydown', onKey);

    // ────────────────────────────────────────────────────────────────
    // 7. Drag-and-drop bloklash (rasm/fayl tekshiruvi orqali tahlil)
    // ────────────────────────────────────────────────────────────────
    const onDragStart = (e: DragEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.tagName === 'IMG') e.preventDefault();
    };
    document.addEventListener('dragstart', onDragStart);

    return () => {
      clearInterval(debuggerLoop);
      clearInterval(devtoolsTimer);
      document.removeEventListener('contextmenu', onContext);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('dragstart', onDragStart);
    };
  }, []);

  return null;
}
