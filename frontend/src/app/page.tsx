import { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';
import { API_BASE_URL } from '@/utils/constants';

// Professional Metadata for SEO
export const metadata: Metadata = {
  title: 'Aidevix - Dasturlashni O\'zbek tilida o\'rganing',
  description: 'O\'zbek tilidagi eng yirik va zamonaviy dasturlash o\'quv platformasi. Frontend, Backend, Mobile va AI yo\'nalishlari bo\'yicha sifatli kurslar.',
  openGraph: {
    title: 'Aidevix - Kelajakni kodlashni boshlang',
    description: 'Dasturlashni O\'zbek tilida sifatli o\'rganing.',
    images: ['/og-home.jpg'],
  },
};

// Server functions to fetch data (SSR/ISR)
async function getTopCourses() {
  try {
    const res = await fetch(`${API_BASE_URL}courses/top?limit=8`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.courses || [];
  } catch (e) {
    return [];
  }
}

async function getTopVideos() {
  try {
    const res = await fetch(`${API_BASE_URL}videos/top?limit=6`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.videos || [];
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  // Fetch data on server for SEO power
  const initialCourses = await getTopCourses();
  const initialVideos = await getTopVideos();

  return (
    <HomeClient 
      initialCourses={initialCourses} 
      initialVideos={initialVideos} 
    />
  );
}
