import '../styles/globals.css';
import '../styles/animations.css';
import { Metadata } from 'next';
import Script from 'next/script';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { Providers } from '@components/Providers';
import ClientLayoutWrapper from '@components/layout/ClientLayoutWrapper';
import ExitIntentModal from '@components/common/ExitIntentModal';
import PWAInstallPrompt from '@components/common/PWAInstallPrompt';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--app-font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--app-font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aidevix.uz'),
  title: {
    template: '%s | Aidevix',
    default: 'Aidevix - O\'zbek tilida dasturlashni o\'rganing',
  },
  description: 'Aidevix - O\'zbek tilidagi eng yirik va zamonaviy dasturlash o\'quv platformasi. React, Node.js, Python, Mobile va boshqa yo\'nalishlarda sifatli kurslar.',
  keywords: [
    'dasturlash', 'online ta\'lim', 'uzbek tilida', 'react', 'nextjs', 'javascript', 
    'backend o\'rganish', 'frontend kurslar', 'python uzbekcha', 'it kurslar'
  ],
  authors: [{ name: 'Aidevix Team' }],
  creator: 'Aidevix',
  publisher: 'Aidevix',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://aidevix.uz',
  },
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: 'https://aidevix.uz',
    siteName: 'Aidevix',
    title: 'Aidevix - Kelajakni kodlashni boshlang',
    description: 'O\'zbek tilidagi eng yirik va zamonaviy dasturlash o\'quv platformasi.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Aidevix Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aidevix - Kelajakni kodlashni boshlang',
    description: 'O\'zbek tilidagi eng yirik va zamonaviy dasturlash o\'quv platformasi.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'TUCRHfBmNAFXN61L3px29vaGKe1epzTfbY1lB0zeydk',
  },
};

export const viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const themeAndLangBootstrap = `
(function () {
  try {
    var root = document.documentElement;
    var theme = localStorage.getItem('aidevix_theme');
    var lang = localStorage.getItem('aidevix_lang');
    var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    var browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
    var resolvedTheme = theme === 'light' || theme === 'dark' ? theme : (prefersLight ? 'light' : 'dark');
    var resolvedLang = (lang === 'uz' || lang === 'ru' || lang === 'en')
      ? lang
      : (browserLang === 'ru' || browserLang === 'en' ? browserLang : 'uz');

    root.dataset.theme = resolvedTheme;
    root.classList.toggle('light-mode', resolvedTheme === 'light');
    root.classList.toggle('dark-mode', resolvedTheme === 'dark');
    root.lang = resolvedLang;
    root.dataset.lang = resolvedLang;
    root.style.colorScheme = resolvedTheme;
  } catch (error) {}
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} min-w-0 w-full max-w-full antialiased selection:bg-indigo-500/30`}>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <Script id="theme-and-lang-bootstrap" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeAndLangBootstrap }} />
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
          }
        `}</Script>
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
          <ExitIntentModal />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
