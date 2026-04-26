'use client';

import { useLang } from '@/context/LangContext';

type TermsContent = {
  title: string;
  subtitle: string;
  updated: string;
  sections: Array<{ heading: string; items: string[] }>;
  contact: string;
};

const CONTENT: Record<'uz' | 'ru' | 'en', TermsContent> = {
  uz: {
    title: 'Foydalanish shartlari',
    subtitle: 'Platformadan foydalanish uchun asosiy huquq va majburiyatlar.',
    updated: 'Oxirgi yangilanish: 26-aprel, 2026',
    sections: [
      {
        heading: '1. Umumiy qoidalar',
        items: [
          "Aidevix'dan foydalanganingiz bilan ushbu shartlarga rozilik bildirasiz.",
          "Agar shartlarga rozi bo'lmasangiz, platformadan foydalanishni to'xtatishingiz kerak.",
        ],
      },
      {
        heading: '2. Hisob va xavfsizlik',
        items: [
          "Hisob ma'lumotlarini to'g'ri va dolzarb saqlash foydalanuvchi zimmasida.",
          'Parol va kirish ma’lumotlari maxfiyligi uchun foydalanuvchi javob beradi.',
          "Shubhali kirish yoki hisob buzilishi holatida darhol qo'llab-quvvatlashga yozing.",
        ],
      },
      {
        heading: '3. Ruxsat etilgan foydalanish',
        items: [
          "Platformadan faqat qonuniy, o'quv va professionallik maqsadida foydalaning.",
          'Spam, zararli kod, firibgarlik va ruxsatsiz kirish urinishlari taqiqlanadi.',
          "Boshqa foydalanuvchilarning huquqlarini buzuvchi kontent joylashtirmang.",
        ],
      },
      {
        heading: '4. Kontent va intellektual mulk',
        items: [
          'Platformadagi brend, dizayn, dars materiallari va kod namunalari Aidevix yoki hamkorlariga tegishli.',
          'Ruxsatsiz nusxalash, qayta sotish yoki tijorat maqsadida tarqatish taqiqlanadi.',
          "Foydalanuvchi yuklagan kontent uchun foydalanuvchining o'zi javobgar.",
        ],
      },
      {
        heading: "5. To'lovlar va obuna",
        items: [
          "Pullik xizmatlar uchun narxlar platformada ko'rsatiladi va yangilanib turishi mumkin.",
          "Obuna muddati, avtomatik yangilanish va bekor qilish qoidalari to'lov sahifasida ko'rsatiladi.",
          "Qaytarim masalalari amaldagi siyosat va qonunchilik asosida ko'rib chiqiladi.",
        ],
      },
      {
        heading: "6. Javobgarlikni cheklash",
        items: [
          'Platforma “mavjud holatda” taqdim etiladi; uzilishlar yoki tashqi omillar yuz berishi mumkin.',
          'Aidevix bilvosita zararlar uchun qonun ruxsat bergan doirada javobgar emas.',
          "Biz servis sifati va xavfsizligini doimiy yaxshilash uchun choralar ko'ramiz.",
        ],
      },
      {
        heading: '7. Shartlarni yangilash',
        items: [
          'Shartlar vaqti-vaqti bilan yangilanadi; yangi tahrir ushbu sahifada e’lon qilinadi.',
          "Yangilanishdan keyin platformadan foydalanish shartlarni qabul qilganingizni anglatadi.",
        ],
      },
    ],
    contact: "Yuridik savollar uchun: support@aidevix.uz",
  },
  ru: {
    title: 'Условия использования',
    subtitle: 'Основные права и обязанности при использовании платформы.',
    updated: 'Последнее обновление: 26 апреля 2026',
    sections: [
      {
        heading: '1. Общие положения',
        items: [
          'Используя Aidevix, вы принимаете настоящие условия.',
          'Если вы не согласны с условиями, прекратите использование платформы.',
        ],
      },
      {
        heading: '2. Аккаунт и безопасность',
        items: [
          'Пользователь обязан поддерживать корректные и актуальные данные аккаунта.',
          'Пользователь несёт ответственность за конфиденциальность пароля и данных входа.',
          'При подозрительной активности или взломе сразу обратитесь в поддержку.',
        ],
      },
      {
        heading: '3. Допустимое использование',
        items: [
          'Используйте платформу только в законных, учебных и профессиональных целях.',
          'Запрещены спам, вредоносный код, мошенничество и попытки несанкционированного доступа.',
          'Не размещайте контент, нарушающий права других пользователей.',
        ],
      },
      {
        heading: '4. Контент и интеллектуальная собственность',
        items: [
          'Бренд, дизайн, учебные материалы и примеры кода принадлежат Aidevix или партнёрам.',
          'Запрещено несанкционированное копирование, перепродажа и коммерческое распространение.',
          'Пользователь несёт ответственность за загружаемый им контент.',
        ],
      },
      {
        heading: '5. Платежи и подписка',
        items: [
          'Цены на платные услуги указываются на платформе и могут обновляться.',
          'Срок подписки, автопродление и отмена описываются на странице оплаты.',
          'Вопросы возврата рассматриваются по действующей политике и применимому праву.',
        ],
      },
      {
        heading: '6. Ограничение ответственности',
        items: [
          'Платформа предоставляется «как есть»; возможны перерывы и внешние сбои.',
          'Aidevix не несёт ответственности за косвенные убытки в пределах, разрешённых законом.',
          'Мы постоянно работаем над улучшением качества и безопасности сервиса.',
        ],
      },
      {
        heading: '7. Обновление условий',
        items: [
          'Условия могут периодически обновляться; новая редакция публикуется на этой странице.',
          'Продолжение использования платформы означает принятие обновлённых условий.',
        ],
      },
    ],
    contact: 'По юридическим вопросам: support@aidevix.uz',
  },
  en: {
    title: 'Terms of Service',
    subtitle: 'Core rights and responsibilities for using the platform.',
    updated: 'Last updated: April 26, 2026',
    sections: [
      {
        heading: '1. General terms',
        items: [
          'By using Aidevix, you agree to these terms.',
          'If you do not agree, you must stop using the platform.',
        ],
      },
      {
        heading: '2. Account and security',
        items: [
          'Users are responsible for keeping account information accurate and current.',
          'Users are responsible for protecting password and login credentials.',
          'Report suspicious access or account compromise to support immediately.',
        ],
      },
      {
        heading: '3. Acceptable use',
        items: [
          'Use the platform only for lawful educational and professional purposes.',
          'Spam, malicious code, fraud, and unauthorized access attempts are prohibited.',
          'Do not upload content that violates others’ rights.',
        ],
      },
      {
        heading: '4. Content and intellectual property',
        items: [
          'Brand assets, design, learning materials, and code samples belong to Aidevix or its partners.',
          'Unauthorized copying, resale, or commercial redistribution is prohibited.',
          'Users are responsible for the content they upload.',
        ],
      },
      {
        heading: '5. Payments and subscriptions',
        items: [
          'Prices for paid services are shown on the platform and may be updated.',
          'Subscription period, auto-renewal, and cancellation terms are defined on checkout pages.',
          'Refund requests are handled according to applicable policy and law.',
        ],
      },
      {
        heading: '6. Limitation of liability',
        items: [
          'The platform is provided “as is”; downtime and external disruptions may occur.',
          'Aidevix is not liable for indirect damages to the extent permitted by law.',
          'We continuously improve reliability, quality, and security.',
        ],
      },
      {
        heading: '7. Changes to terms',
        items: [
          'These terms may be updated from time to time; the latest version is posted here.',
          'Continued use after updates means you accept the revised terms.',
        ],
      },
    ],
    contact: 'Legal questions: support@aidevix.uz',
  },
};

export default function TermsPage() {
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
