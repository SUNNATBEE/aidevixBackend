export type CoachRole = 'assistant' | 'user';

export type CoachMessage = {
  id: string;
  role: CoachRole;
  content: string;
  timestamp: number;
  suggestions?: string[];
};

export type CoachReply = {
  reply: string;
  suggestions: string[];
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildSuggestions = (message: string): string[] => {
  const text = normalize(message);

  if (/auth|login|kirish|register|token|session|cookie/.test(text)) {
    return [
      'Auth flow qanday ishlaydi?',
      '401 xato chiqyapti, nima qilishim kerak?',
      'Cookie va token farqi nima?',
    ];
  }

  if (/theme|dark|light|mode|ui/.test(text)) {
    return [
      'Dark mode qo\'shish kerak',
      'Theme global state orqali boshqarish',
      'Tailwind dark mode sozlash',
    ];
  }

  if (/react|component|hook|state|redux/.test(text)) {
    return [
      'React hook misolini ko\'rsat',
      'Redux Toolkit qanday ishlaydi?',
      'React video darslar',
    ];
  }

  if (/node|express|backend|api|server/.test(text)) {
    return [
      'Node.js kurslarni ko\'rsat',
      'Express middleware nima?',
      'REST API qanday yaratiladi?',
    ];
  }

  if (/kurs|course|video|dars|lesson/.test(text)) {
    return [
      'Qanday kurslar bor?',
      'Bepul kurslar bormi?',
      'React kursni ko\'rsat',
    ];
  }

  return [
    'Qanday kurslar bor?',
    'React o\'rganmoqchiman',
    'Kod yozishda yordam ber',
  ];
};

export const generateCoachReply = (message: string): CoachReply => {
  const text = normalize(message);

  if (!text) {
    return {
      reply: 'Savolingizni yozing — kurs, video yoki kodlash bo\'yicha yordam beraman.',
      suggestions: ['Qanday kurslar bor?', 'React o\'rganmoqchiman'],
    };
  }

  if (/salom|hello|hi|assalomu|hey/.test(text)) {
    return {
      reply: 'Salom! Men Aidevix AI ustozingizman. Sizga kurs topish, video dars ko\'rish yoki kodlashda yordam bera olaman. Nima haqida qiziqasiz?',
      suggestions: buildSuggestions(message),
    };
  }

  if (/kurs|course/.test(text)) {
    return {
      reply: 'Aidevix da turli kurslar mavjud — React, Node.js, JavaScript va boshqalar. Qaysi texnologiya sizni qiziqtiradi? Aniq yozsangiz, mos kurslarni topib beraman.',
      suggestions: ['React kurslarni ko\'rsat', 'Node.js kurslar', 'Bepul kurslar bormi?'],
    };
  }

  if (/video|dars|lesson|tutorial/.test(text)) {
    return {
      reply: 'Video darslar har bir kurs ichida mavjud. Qaysi mavzu bo\'yicha video qidiryapsiz? Masalan: "React video darslar" yoki "JavaScript asoslari" deb yozing.',
      suggestions: ['React video darslar', 'JavaScript asoslari', 'Node.js darslar'],
    };
  }

  if (/react/.test(text)) {
    return {
      reply: 'React — eng mashhur frontend kutubxona. Componentlar, hooks, state management (Redux) va boshqalarni o\'rganishingiz kerak. Aidevix da React kursi bor — boshlashni tavsiya qilaman.',
      suggestions: ['React kursini ko\'rsat', 'React hooks nima?', 'Redux qanday ishlaydi?'],
    };
  }

  if (/node|express|backend/.test(text)) {
    return {
      reply: 'Node.js + Express — backend uchun eng mashhur stack. REST API, middleware, database (MongoDB) bilan ishlashni o\'rganish kerak. Aidevix da Node.js kursi bor.',
      suggestions: ['Node.js kursini ko\'rsat', 'Express middleware nima?', 'MongoDB asoslari'],
    };
  }

  if (/javascript|js/.test(text)) {
    return {
      reply: 'JavaScript — web dasturlashning asosi. Variables, functions, async/await, DOM va ES6+ sintaksisini yaxshi bilish kerak. Boshlang\'ich darajadan boshlaymizmi?',
      suggestions: ['JavaScript video darslar', 'ES6 nima?', 'Async/await tushuntiring'],
    };
  }

  if (/auth|login|kirish|register|token|session|cookie/.test(text)) {
    return {
      reply: 'Auth qatlamida odatda muammo token saqlash, refresh flow yoki cookie nomlari mos kelmasligidan chiqadi. Network da `/auth/me` va refresh requestlarini tekshiring.',
      suggestions: buildSuggestions(message),
    };
  }

  if (/obuna|subscribe|telegram|kanal/.test(text)) {
    return {
      reply: 'Kurslarni ko\'rish uchun @aidevix Telegram kanaliga obuna bo\'lish kerak. Saytda "Telegram orqali bog\'lanish" tugmasini bosing va bot orqali akkauntni bog\'lang.',
      suggestions: ['Obuna qanday tekshiriladi?', 'Bot ishlamayapti', 'Kurslarni ko\'rsat'],
    };
  }

  if (/xp|level|daraja|ball|coin/.test(text)) {
    return {
      reply: 'Aidevix da XP tizimi bor — video ko\'rish, quiz yechish va har kunlik kirish uchun XP olasiz. Leaderboard da eng faol o\'quvchilar ko\'rinadi.',
      suggestions: ['Leaderboard ko\'rsat', 'Qanday XP olish mumkin?', 'Sertifikat olish'],
    };
  }

  return {
    reply: 'Savolingizni tushundim. Aniqroq ma\'lumot bering — qaysi mavzu, qaysi muammo? Men kurs topib beraman, video dars ko\'rsataman yoki kodlashda yordam beraman.',
    suggestions: buildSuggestions(message),
  };
};
