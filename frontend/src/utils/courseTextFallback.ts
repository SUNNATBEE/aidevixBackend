import type { Lang } from '@/utils/i18n';

type CourseFallback = {
  ru?: { title?: string; description?: string };
  en?: { title?: string; description?: string };
};

const FALLBACKS_BY_TITLE: Record<string, CourseFallback> = {
  'Etik Xakerlik va Kiberxavfsizlik': {
    ru: {
      title: 'Этичный хакинг и кибербезопасность',
    },
    en: {
      title: 'Ethical Hacking and Cybersecurity',
    },
  },
  'Telegram Mini Apps & Botlar': {
    ru: {
      title: 'Telegram Mini Apps и боты',
      description:
        'Современная разработка Telegram Mini Apps (WebApps), создание сложных ботов и интеграция платёжных систем (Payme, Click, Telegram Stars).',
    },
    en: {
      title: 'Telegram Mini Apps & Bots',
      description:
        'Modern Telegram Mini Apps (WebApps), advanced bot development, and payment integrations (Payme, Click, Telegram Stars).',
    },
  },
  'ChatGPT & OpenAI: Professional API Integratsiya': {
    ru: {
      title: 'ChatGPT и OpenAI: профессиональная API-интеграция',
    },
    en: {
      title: 'ChatGPT & OpenAI: Professional API Integration',
    },
  },
};

export function localizeCourseText(lang: Lang, title?: string, description?: string) {
  if (!title || lang === 'uz') {
    return { title: title || '', description: description || '' };
  }

  const fallback = FALLBACKS_BY_TITLE[title]?.[lang];
  return {
    title: fallback?.title || title,
    description: fallback?.description || description || '',
  };
}

