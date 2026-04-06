import '../styles/globals.css';
import '../styles/animations.css';
import { Metadata } from 'next';
import { Providers } from '@components/Providers';
import ClientLayoutWrapper from '@components/layout/ClientLayoutWrapper';

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
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className="antialiased selection:bg-indigo-500/30">
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}