'use client';

import { useMemo, useState } from 'react';

type TeamMember = {
  id: string;
  name: string;
  age: number;
  stack: string[];
  contribution: string;
  imageFile: string;
  badge: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'firdavs',
    name: 'Firdavs',
    age: 16,
    stack: ['React', 'TypeScript', 'Next.js'],
    contribution: 'Aidevix platformasida Auth qismini bajargan.',
    imageFile: 'Firdavs.HEIC',
    badge: 'Auth Specialist',
  },
  {
    id: 'abduvoris',
    name: 'Abduvoris',
    age: 16,
    stack: ['React', 'TypeScript', 'Next.js'],
    contribution: 'Aidevix platformasida Video Player qismini bajargan.',
    imageFile: 'Abduvoris.HEIC',
    badge: 'Video Engineer',
  },
  {
    id: 'doniyor',
    name: 'Doniyor',
    age: 16,
    stack: ['React', 'TypeScript', 'Next.js', 'Node.js', 'React Native'],
    contribution: "Aidevix platformasida kurslar ro'yxati sahifasini bajargan.",
    imageFile: 'Doniyor.HEIC',
    badge: 'Course Architect',
  },
  {
    id: 'suhrob',
    name: 'Suhrob',
    age: 14,
    stack: ['React', 'TypeScript', 'Next.js', 'Node.js', 'React Native'],
    contribution: "Aidevix platformasida qahramonlar reytingi sahifasini bajargan.",
    imageFile: 'Suhrob.HEIC',
    badge: 'Ranking Builder',
  },
  {
    id: 'qudrat',
    name: 'Qudrat',
    age: 14,
    stack: ['React', 'TypeScript', 'Next.js', 'Node.js', 'React Native'],
    contribution: 'Aidevix platformasida GSAP bilan 3D loading qismini bajargan.',
    imageFile: 'Qudrat.HEIC',
    badge: 'Motion Creator',
  },
  {
    id: 'sardor',
    name: 'Sardor',
    age: 15,
    stack: ['React', 'TypeScript', 'Next.js', 'Node.js', 'React Native'],
    contribution:
      "Aidevix platformasini production-ready darajaga olib chiqqan tester, bug fixer, qisman team lead va app asoschisi.",
    imageFile: 'Sardor.HEIC',
    badge: 'Founder • Team Lead',
  },
];

const featuredIds = new Set(['sardor']);

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function TeamPage() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const totalStacks = useMemo(() => {
    const skills = new Set<string>();
    TEAM_MEMBERS.forEach((member) => {
      member.stack.forEach((tech) => skills.add(tech));
    });
    return skills.size;
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06080f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(79,70,229,0.24),transparent_42%),radial-gradient(circle_at_85%_20%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_55%_85%,rgba(14,165,233,0.2),transparent_38%)]" />

      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 md:pt-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
            Aidevix Team
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            Platformani yozgan yosh
            <span className="block bg-gradient-to-r from-indigo-300 via-cyan-300 to-blue-200 bg-clip-text text-transparent">
              qahramonlar
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Bu sahifada Aidevix loyihasida qatnashgan o&apos;quvchilar, ularning texnologik steki va platformadagi asosiy hissalari jamlangan.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ishtirokchilar</p>
            <p className="mt-2 text-3xl font-black text-white">{TEAM_MEMBERS.length}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Texnologiyalar</p>
            <p className="mt-2 text-3xl font-black text-white">{totalStacks}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Yadro yo&apos;nalish</p>
            <p className="mt-2 text-3xl font-black text-white">Frontend</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {TEAM_MEMBERS.map((member) => {
            const isFeatured = featuredIds.has(member.id);
            const imageSrc = new URL(`../../assets/images/${member.imageFile}`, import.meta.url).toString();
            const imageFailed = imageErrors[member.id];

            return (
              <article
                key={member.id}
                className={`group overflow-hidden rounded-3xl border p-5 transition duration-300 ${
                  isFeatured
                    ? 'border-amber-300/45 bg-[linear-gradient(165deg,rgba(234,179,8,0.22),rgba(10,10,20,0.88))] shadow-[0_26px_80px_rgba(250,204,21,0.24)]'
                    : 'border-white/15 bg-[linear-gradient(165deg,rgba(79,70,229,0.14),rgba(9,12,24,0.95))] hover:border-white/30 hover:bg-[linear-gradient(165deg,rgba(56,189,248,0.2),rgba(9,12,24,0.95))]'
                }`}
              >
                <div className="relative">
                  <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                    {!imageFailed && (
                      <img
                        src={imageSrc}
                        alt={member.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={() => setImageErrors((prev) => ({ ...prev, [member.id]: true }))}
                      />
                    )}

                    {imageFailed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.3),rgba(30,41,59,0.95))]">
                        <span className="text-6xl font-black tracking-tight text-white/90">{getInitials(member.name)}</span>
                      </div>
                    )}
                  </div>
                  <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/45 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
                    {member.badge}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-white">{member.name}</h2>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                      {member.age} yosh
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{member.contribution}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.stack.map((tech) => (
                      <span
                        key={`${member.id}-${tech}`}
                        className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-cyan-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
