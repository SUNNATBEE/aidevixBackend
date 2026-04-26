'use client';

import { useLang } from '@/context/LangContext';

type PrivacyContent = {
  title: string;
  subtitle: string;
  updated: string;
  sections: Array<{ heading: string; items: string[] }>;
  contact: string;
};

const CONTENT: Record<'uz' | 'ru' | 'en', PrivacyContent> = {
  uz: {
    title: 'Maxfiylik siyosati',
    subtitle: "Aidevix platformasida shaxsiy ma'lumotlarni qayta ishlash tartibi.",
    updated: 'Oxirgi yangilanish: 26-aprel, 2026',
    sections: [
      {
        heading: "1. Qanday ma'lumotlarni yig'amiz",
        items: [
          "Hisob ma'lumotlari: ism, username, email, avatar.",
          "O'quv ma'lumotlari: kurslar, progress, natijalar, XP/streak.",
          "Texnik ma'lumotlar: brauzer turi, qurilma, IP, cookie/session identifikatorlari.",
        ],
      },
      {
        heading: "2. Ma'lumotlardan foydalanish maqsadi",
        items: [
          "Platformani ishlatish, hisobni autentifikatsiya qilish va xavfsizlikni ta'minlash.",
          "Shaxsiylashtirilgan o'quv tajribasi, tavsiyalar va progress statistikasi.",
          "Xatolarni aniqlash, servis sifatini yaxshilash va analitika.",
        ],
      },
      {
        heading: "3. Uchinchi tomon servislar",
        items: [
          'Video, analitika, to‘lov va infratuzilma xizmatlari uchun ishonchli hamkorlar ishlatilishi mumkin.',
          "Uchinchi tomonlar ma'lumotni faqat xizmatni bajarish doirasida qayta ishlaydi.",
          "Biz hech qachon foydalanuvchi parollarini ochiq shaklda saqlamaymiz.",
        ],
      },
      {
        heading: "4. Ma'lumotlarni saqlash va himoya",
        items: [
          'Transport qatlamida shifrlash (HTTPS/TLS) qo‘llaniladi.',
          'Ruxsat cheklovlari, audit va texnik himoya choralaridan foydalaniladi.',
          "Ma'lumotlar faqat zarur muddat davomida saqlanadi va qonuniy asosda o'chiriladi.",
        ],
      },
      {
        heading: '5. Sizning huquqlaringiz',
        items: [
          "Ma'lumotlaringizga kirish, tuzatish, o'chirish yoki qayta ishlashni cheklashni so'rash huquqi.",
          'Marketing xabarnomalaridan istalgan vaqtda voz kechish huquqi.',
          "Hisobni yopish bo'yicha so'rov yuborish huquqi.",
        ],
      },
      {
        heading: '6. Bolalar maxfiyligi',
        items: [
          "Platforma 13 yoshdan kichik foydalanuvchilar uchun mo'ljallanmagan.",
          "Agar bolaga oid ma'lumot noto'g'ri yig'ilgan bo'lsa, murojaat asosida tezda o'chiriladi.",
        ],
      },
    ],
    contact: "Savollar uchun: support@aidevix.uz",
  },
  ru: {
    title: 'Политика конфиденциальности',
    subtitle: 'Порядок обработки персональных данных на платформе Aidevix.',
    updated: 'Последнее обновление: 26 апреля 2026',
    sections: [
      {
        heading: '1. Какие данные мы собираем',
        items: [
          'Данные аккаунта: имя, username, email, аватар.',
          'Учебные данные: курсы, прогресс, результаты, XP/streak.',
          'Технические данные: тип браузера, устройство, IP, cookie/session идентификаторы.',
        ],
      },
      {
        heading: '2. Для чего используются данные',
        items: [
          'Обеспечение работы платформы, авторизация и безопасность.',
          'Персонализация обучения, рекомендации и статистика прогресса.',
          'Диагностика ошибок, улучшение сервиса и аналитика.',
        ],
      },
      {
        heading: '3. Сторонние сервисы',
        items: [
          'Для видео, аналитики, платежей и инфраструктуры могут использоваться проверенные партнёры.',
          'Партнёры обрабатывают данные только в рамках оказания услуги.',
          'Пароли пользователей никогда не хранятся в открытом виде.',
        ],
      },
      {
        heading: '4. Хранение и защита данных',
        items: [
          'Используется шифрование на транспортном уровне (HTTPS/TLS).',
          'Применяются контроль доступа, аудит и технические меры защиты.',
          'Данные хранятся только необходимый срок и удаляются на законных основаниях.',
        ],
      },
      {
        heading: '5. Ваши права',
        items: [
          'Право на доступ, исправление, удаление и ограничение обработки ваших данных.',
          'Право отказаться от маркетинговых уведомлений в любое время.',
          'Право отправить запрос на закрытие аккаунта.',
        ],
      },
      {
        heading: '6. Конфиденциальность детей',
        items: [
          'Платформа не предназначена для пользователей младше 13 лет.',
          'Если данные ребёнка были собраны ошибочно, они удаляются по обращению.',
        ],
      },
    ],
    contact: 'По вопросам: support@aidevix.uz',
  },
  en: {
    title: 'Privacy Policy',
    subtitle: 'How personal data is processed on the Aidevix platform.',
    updated: 'Last updated: April 26, 2026',
    sections: [
      {
        heading: '1. Data we collect',
        items: [
          'Account data: name, username, email, avatar.',
          'Learning data: courses, progress, outcomes, XP/streak.',
          'Technical data: browser type, device, IP, and cookie/session identifiers.',
        ],
      },
      {
        heading: '2. Why we use data',
        items: [
          'To operate the platform, authenticate accounts, and keep services secure.',
          'To personalize learning, recommendations, and progress insights.',
          'To detect issues, improve product quality, and run analytics.',
        ],
      },
      {
        heading: '3. Third-party services',
        items: [
          'Trusted partners may be used for video delivery, analytics, payments, and infrastructure.',
          'Partners process data only to provide contracted services.',
          'User passwords are never stored in plain text.',
        ],
      },
      {
        heading: '4. Data retention and protection',
        items: [
          'Transport encryption is enforced (HTTPS/TLS).',
          'Access controls, audit procedures, and technical safeguards are applied.',
          'Data is kept only as long as needed and deleted on legal grounds.',
        ],
      },
      {
        heading: '5. Your rights',
        items: [
          'You may request access, correction, deletion, or restriction of your data.',
          'You can opt out of marketing communications at any time.',
          'You can request account closure.',
        ],
      },
      {
        heading: '6. Children’s privacy',
        items: [
          'The platform is not intended for users under 13.',
          'If children’s data is collected by mistake, it will be removed upon request.',
        ],
      },
    ],
    contact: 'Questions: support@aidevix.uz',
  },
};

export default function PrivacyPage() {
  const { lang } = useLang();
  const current = CONTENT[lang];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{current.title}</h1>
        <p className="mt-3 text-sm text-base-content/70 sm:text-base">{current.subtitle}</p>
        <p className="mt-2 text-xs uppercase tracking-wider text-base-content/50">{current.updated}</p>
      </header>

      <div className="space-y-6">
        {current.sections.map((section) => (
          <section key={section.heading} className="rounded-2xl border border-white/10 bg-base-100/40 p-5 sm:p-6">
            <h2 className="text-lg font-bold sm:text-xl">{section.heading}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-base-content/80 sm:text-base">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="mt-8 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-sm text-indigo-300">
        {current.contact}
      </footer>
    </main>
  );
}
