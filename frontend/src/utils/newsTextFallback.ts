import type { Lang } from '@/utils/i18n';

type NewsItem = {
  title: string;
  summary: string;
  cta: string;
};

const NEWS_TRANSLATIONS: Record<string, { ru: Partial<NewsItem>; en: Partial<NewsItem> }> = {
  'AI Agentlar davri boshlandi: Cursor va Claude ish oqimlari real biznesga kirib keldi': {
    ru: {
      title: 'Эра AI-агентов началась: workflows Cursor и Claude уже в реальном бизнесе',
      summary: 'Новый тренд: даже небольшие команды выходят на высокую скорость продукта с агентами.',
      cta: 'Полная новость в Telegram',
    },
    en: {
      title: 'The era of AI agents has begun: Cursor and Claude workflows entered real business',
      summary: 'New trend: even small teams are reaching major product speed with agents.',
      cta: 'Full story on Telegram',
    },
  },
  'Prompt engineering endi alohida kasb: kompaniyalar aniq skill bilan mutaxassis qidirmoqda': {
    ru: {
      title: 'Prompt engineering стал отдельной профессией: компании ищут точечный skill',
      summary: 'На senior-уровне промптинг одновременно оптимизирует качество, безопасность и затраты.',
      cta: 'Подробный пост в Instagram',
    },
    en: {
      title: 'Prompt engineering is now a separate profession: companies seek precise skills',
      summary: 'At senior level, prompt writing optimizes quality, safety, and costs at the same time.',
      cta: 'Detailed post on Instagram',
    },
  },
  "AI + kod review: bug'lar kamaydi, release tezligi oshdi": {
    ru: {
      title: 'AI + code review: меньше багов, быстрее релизы',
      summary: 'В agent-first разработке тест и review этапы автоматизируются сильнее.',
      cta: 'Следите за новостями в Telegram',
    },
    en: {
      title: 'AI + code review: fewer bugs, faster release speed',
      summary: 'In agent-first development, test and review blocks are getting more automated.',
      cta: 'Follow updates on Telegram',
    },
  },
  'Multi-agent stack: bitta loyiha ichida Claude, Cursor, Copilot birga ishlatilmoqda': {
    ru: {
      title: 'Multi-agent stack: в одном проекте вместе используют Claude, Cursor и Copilot',
      summary: 'Команды распределяют задачи по агентам и заметно повышают результат.',
      cta: 'Тренд-разбор в Instagram',
    },
    en: {
      title: 'Multi-agent stack: Claude, Cursor, and Copilot used together in one project',
      summary: 'Teams assign each agent to its best role and significantly improve results.',
      cta: 'Trend analysis on Instagram',
    },
  },
};

export function localizeNewsItem<T extends NewsItem>(lang: Lang, item: T): T {
  if (lang === 'uz') return item;
  const localized = NEWS_TRANSLATIONS[item.title]?.[lang];
  return localized ? ({ ...item, ...localized } as T) : item;
}

