'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SCRIPT_ID = 'cf-turnstile-script';

type Props = {
  /** Public site key — set via NEXT_PUBLIC_TURNSTILE_SITE_KEY */
  siteKey?: string;
  onToken: (token: string) => void;
  onError?: () => void;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
};

/**
 * Cloudflare Turnstile widget — renders nothing if `siteKey` is unset (env-driven opt-in).
 * Backend `captchaCheck` middleware also no-ops when no provider configured, so the
 * register/login forms remain functional during gradual rollout.
 */
export default function TurnstileWidget({
  siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  onToken,
  onError,
  className,
  theme = 'auto',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    if (typeof window === 'undefined') return;

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        callback: (token: string) => onToken(token),
        'error-callback': () => onError?.(),
        'expired-callback': () => onError?.(),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      // Script already loading — poll briefly
      const intv = setInterval(() => {
        if (window.turnstile) {
          clearInterval(intv);
          renderWidget();
        }
      }, 200);
      return () => clearInterval(intv);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* noop */ }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onToken, onError, theme]);

  if (!siteKey) return null;
  return <div ref={containerRef} className={className} />;
}
