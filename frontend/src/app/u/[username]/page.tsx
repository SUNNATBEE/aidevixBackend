import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicProfileClient from './PublicProfileClient';
import { API_BASE_URL } from '@/utils/constants';

async function fetchProfile(username: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}users/${username}/public`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const profile = await fetchProfile(params.username);
  if (!profile) return { title: 'Foydalanuvchi topilmadi' };
  return {
    title: `${profile.user.username} — Aidevix`,
    description: profile.stats.bio || `${profile.user.username} — Level ${profile.stats.level}, ${profile.stats.xp.toLocaleString()} XP`,
    openGraph: {
      title: `${profile.user.username} | Aidevix`,
      description: profile.stats.bio || `Level ${profile.stats.level} dasturchi`,
      images: profile.user.avatar ? [profile.user.avatar] : ['/og-image.jpg'],
    },
  };
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const profile = await fetchProfile(params.username);
  if (!profile) notFound();
  return <PublicProfileClient profile={profile} />;
}
