import '../styles/globals.css';
import '../styles/animations.css';
import { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: {
    template: '%s | Aidevix',
    default: 'Aidevix - O\'zbek tilida dasturlashni o\'rganing',
  },
  description: 'O\'zbek tilidagi eng yirik va zamonaviy dasturlash o\'quv platformasi. React, Node.js, Python va boshqa kurslar.',
  keywords: ['dasturlash', 'online ta\'lim', 'uzbek tilida', 'react', 'nextjs', 'javascript'],
  authors: [{ name: 'Aidevix Team' }],
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
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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