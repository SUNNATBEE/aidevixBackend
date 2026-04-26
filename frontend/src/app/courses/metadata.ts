import { Metadata } from 'next';

export const coursesMetadata: Metadata = {
  title: "Barcha Kurslar | Aidevix",
  description:
    "Aidevix platformasida React, Node.js, Python, TypeScript va boshqa texnologiyalar bo'yicha professional kurslar. Har bir daraja uchun mos kurslar.",
  alternates: {
    canonical: 'https://aidevix.uz/courses',
  },
  openGraph: {
    type: 'website',
    url: 'https://aidevix.uz/courses',
    title: 'Barcha Kurslar | Aidevix',
    description: "O'zbek tilidagi eng keng dasturlash kurs kutubxonasi.",
    siteName: 'Aidevix',
    locale: 'uz_UZ',
    images: [
      {
        url: 'https://aidevix.uz/Logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Aidevix Kurslar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barcha Kurslar | Aidevix',
    description: "O'zbek tilidagi professional dasturlash kurslari.",
    images: ['https://aidevix.uz/Logo.jpg'],
  },
};
