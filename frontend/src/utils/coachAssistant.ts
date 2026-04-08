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
      'Auth flow ni cookie + `/api/auth/me` bilan tekshir.',
      '401 response bo`lsa refresh flow ishlayotganini tekshir.',
      'Frontend storage va backend cookie nomlari bir xil ekanini tekshir.',
    ];
  }

  if (/theme|dark|light|mode|ui/.test(text)) {
    return [
      'Root elementga theme class qo`llanayotganini tekshir.',
      'Theme state faqat local state emas, global contextdan o`tsin.',
      'Page reloaddan keyin `localStorage` dan tiklanishini tekshir.',
    ];
  }

  if (/lang|til|language|locale|i18n/.test(text)) {
    return [
      'Lang provider `html lang` va route-level renderingga ulanib tursin.',
      'Translations faqat navbar emas, barcha sectionsga context orqali berilsin.',
      'Fallback translation key yo`qolsa default til ishlasin.',
    ];
  }

  return [
    'Muammoni 1 ta component, 1 ta state, 1 ta API flow ga bo`lib tekshir.',
    'Console va Network tabda 401/404/500 ni alohida ajrat.',
    'Agar server yo`q bo`lsa, UI da local fallback javobni qoldir.',
  ];
};

export const generateCoachReply = (message: string): CoachReply => {
  const text = normalize(message);

  if (!text) {
    return {
      reply: 'Savol bo`sh. Qisqa qilib yozing: qaysi sahifa, qaysi xato va nimani kutgansiz.',
      suggestions: ['Masalan: "auth login 401 qaytaryapti"', 'Masalan: "dark mode home pagega ta`sir qilmayapti"'],
    };
  }

  if (/salom|hello|hi|assalomu/.test(text)) {
    return {
      reply: 'Salom. Men sizga UI, auth yoki backend flow bo`yicha amaliy yo`l beraman. Muammoni aniq yozing, men keyingi qadamni aytaman.',
      suggestions: buildSuggestions(message),
    };
  }

  if (/coach|assistant|reply|javob/.test(text)) {
    return {
      reply: 'Coach assistant hozir backendga bog`lanmagan bo`lsa ham, lokal fallback javob qaytaradi. Endi siz yozgan savolga mos tavsiya beraman.',
      suggestions: buildSuggestions(message),
    };
  }

  if (/auth|login|kirish|register|token|session|cookie/.test(text)) {
    return {
      reply: 'Auth qatlamida odatda muammo token saqlash, refresh flow yoki cookie nomlari mos kelmasligidan chiqadi. Network da `/auth/me` va refresh requestlarini tekshiring.',
      suggestions: buildSuggestions(message),
    };
  }

  if (/theme|dark|light|mode|ui/.test(text)) {
    return {
      reply: 'Theme odatda faqat bitta componentda ishlatilganda butun saytga ta`sir qilmaydi. Root konteyner va global context orqali class qo`yish kerak.',
      suggestions: buildSuggestions(message),
    };
  }

  if (/lang|til|language|locale|i18n/.test(text)) {
    return {
      reply: 'Til almashish faqat navbarni emas, layout va barcha child componentlarni context orqali re-render qilishi kerak. html lang ham yangilanishi lozim.',
      suggestions: buildSuggestions(message),
    };
  }

  return {
    reply: 'Muammoni qisqartirib beraman: avval user flow, keyin state flow, undan keyin API flow. Shu tartibda tekshirsangiz, xato tez topiladi.',
    suggestions: buildSuggestions(message),
  };
};
