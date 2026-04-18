import { NextResponse } from 'next/server';
import { generateCoachReply } from '@/utils/coachAssistant';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// ------- Video & Course search helpers -------

type VideoResult = {
  _id: string;
  title: string;
  description?: string;
  duration?: number;
  course?: { _id: string; title: string; category?: string };
};

type CourseResult = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  price?: number;
  isFree?: boolean;
  thumbnail?: string;
};

async function searchVideos(query: string): Promise<VideoResult[]> {
  try {
    const url = `${BACKEND_URL}/videos/search?q=${encodeURIComponent(query)}&limit=5`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.videos ?? [];
  } catch {
    return [];
  }
}

async function searchCourses(query: string): Promise<CourseResult[]> {
  try {
    const url = `${BACKEND_URL}/courses?search=${encodeURIComponent(query)}&limit=5`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.courses ?? [];
  } catch {
    return [];
  }
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function buildVideoCards(videos: VideoResult[]): string {
  if (!videos.length) return '';
  let text = '\n\n📹 **Topilgan videolar:**\n';
  for (const v of videos) {
    const dur = formatDuration(v.duration);
    const courseTitle = v.course?.title ?? '';
    text += `\n• **${v.title}**${dur ? ` (${dur})` : ''}`;
    if (courseTitle) text += ` — _${courseTitle}_`;
    text += `\n  [▶️ Ko'rish](/courses/${v.course?._id || ''}#video-${v._id})`;
  }
  return text;
}

function buildCourseCards(courses: CourseResult[]): string {
  if (!courses.length) return '';
  let text = '\n\n📚 **Tegishli kurslar:**\n';
  for (const c of courses) {
    const price = c.isFree ? 'Bepul' : c.price ? `${c.price.toLocaleString()} so'm` : '';
    const level = c.level ? ` | ${c.level}` : '';
    text += `\n• **${c.title}**${price ? ` (${price}${level})` : ''}`;
    if (c.description) text += `\n  ${c.description.slice(0, 80)}...`;
    text += `\n  [📖 Kursga o'tish](/courses/${c._id})`;
  }
  return text;
}

// ------- Intent detection -------

type UserIntent = 'search_video' | 'search_course' | 'learn_topic' | 'general';

function detectIntent(message: string): { intent: UserIntent; searchQuery: string } {
  const text = message.toLowerCase();

  // Video qidiruv
  const videoPatterns = [
    /(?:video|dars|lesson|tutorial|mavzu)[\s:]*(.+)/i,
    /(.+?)(?:\s+haqida\s+video|\s+dars|\s+tutorial)/i,
    /(?:qidir|izla|top|kor).*?(?:video|dars).*?(.+)/i,
    /(.+?)\s+(?:video|darslik)(?:lar)?(?:ini|ni|i)?\s*(?:ber|kor|top|qidir)/i,
  ];
  for (const pat of videoPatterns) {
    const match = text.match(pat);
    if (match?.[1]?.trim()) {
      return { intent: 'search_video', searchQuery: match[1].trim() };
    }
  }

  // Kurs qidiruv
  const coursePatterns = [
    /(?:kurs|course)[\s:]*(.+)/i,
    /(.+?)(?:\s+haqida\s+kurs|\s+kursi|\s+course)/i,
    /(?:qidir|izla|top|kor).*?(?:kurs|course).*?(.+)/i,
    /(.+?)\s+(?:kurs|course)(?:lar)?(?:ini|ni|i)?\s*(?:ber|kor|top|qidir)/i,
    /(?:o'rgan|uqit|orgat|ornat).*?(.+)/i,
  ];
  for (const pat of coursePatterns) {
    const match = text.match(pat);
    if (match?.[1]?.trim()) {
      return { intent: 'search_course', searchQuery: match[1].trim() };
    }
  }

  // Mavzu bo'yicha o'rganish (ham video ham kurs)
  const learnPatterns = [
    /(?:react|node|javascript|typescript|python|next\.?js|express|mongodb|tailwind|css|html|ai|machine.?learning|web|mobile|flutter|git)/i,
  ];
  for (const pat of learnPatterns) {
    const match = text.match(pat);
    if (match?.[0]) {
      return { intent: 'learn_topic', searchQuery: match[0].trim() };
    }
  }

  return { intent: 'general', searchQuery: '' };
}

// ------- AI reply generation -------

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

async function generateAIReply(message: string, history: ChatMessage[]) {
  if (!GROQ_API_KEY) return null;

  const systemInstruction = `Sen "Aidevix" IT-Ta'lim platformasining tajribali ustozi va AI Assistantisan.

VAZIFALARING:
1. O'quvchilarga kodlash (React, Node.js, JavaScript, TypeScript, Python, AI, Web va h.k) bo'yicha aniq, amaliy maslahatlar berish
2. Platformadagi kurs va videolarni tavsiya qilish
3. Savolga qarab kod misollar yozish
4. O'quvchini motivatsiya qilish va o'sishga undash

QOIDALAR:
- Faqat o'zbek tilida javob ber (agar foydalanuvchi boshqa tilda yozsa ham)
- Haqiqiy tajribali ustoz kabi gapir — samimiy, qisqa, tushunarli
- Hech qachon "men AI modeliman" dema, sen Aidevix ustozisan
- Kod misollar berganingda, qisqa izoh ham qo'sh
- Agar savol platformaga tegishli bo'lsa (kurs, video, obuna), yo'naltir
- Agar foydalanuvchi bir narsani o'rganmoqchi bo'lsa, qadamba-qadam rejani ber
- Emoji ishlatishda haddan oshirma, 1-2 ta kifoya
- Javob 500 so'zdan oshmasin

AIDEVIX PLATFORMASI HAQIDA:
- IT kurslar: React, Node.js, JavaScript, va boshqa texnologiyalar
- Har bir kursda video darslar mavjud
- Telegram kanalga obuna bo'lish kerak: @aidevix
- Saytda XP tizimi, leaderboard, sertifikat bor`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemInstruction },
    ...history.slice(-8), // oxirgi 8 ta xabar kontekst
    { role: 'user', content: message },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('Groq API Error:', response.status);
      return null;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Groq AI xatosi:', error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ------- Main POST handler -------

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const message = typeof payload?.message === 'string' ? payload.message.trim() : '';
  const history: ChatMessage[] = Array.isArray(payload?.history) ? payload.history : [];

  if (!message) {
    return NextResponse.json(
      { success: false, message: 'Message is required' },
      { status: 400 },
    );
  }

  // 1. Intent aniqlash
  const { intent, searchQuery } = detectIntent(message);

  // 2. Parallel: AI javob + content qidiruv
  const tasks: [Promise<string | null>, Promise<VideoResult[]>, Promise<CourseResult[]>] = [
    generateAIReply(message, history),
    (intent === 'search_video' || intent === 'learn_topic') && searchQuery
      ? searchVideos(searchQuery)
      : Promise.resolve([]),
    (intent === 'search_course' || intent === 'learn_topic') && searchQuery
      ? searchCourses(searchQuery)
      : Promise.resolve([]),
  ];

  const [aiReply, videos, courses] = await Promise.all(tasks);

  // 3. Javobni yig'ish
  let reply = '';
  let mode = 'ai_groq';
  const suggestions: string[] = [];

  if (aiReply) {
    reply = aiReply;
  } else {
    // Fallback
    const fallback = generateCoachReply(message);
    reply = fallback.reply;
    mode = 'fallback';
    suggestions.push(...fallback.suggestions);
  }

  // Video/kurs natijalarini qo'shish
  const videoCards = buildVideoCards(videos);
  const courseCards = buildCourseCards(courses);

  if (videoCards || courseCards) {
    reply += videoCards + courseCards;
  }

  // Smart suggestions
  if (suggestions.length === 0) {
    if (videos.length > 0) {
      suggestions.push('Boshqa videolarni ko\'rsat');
    }
    if (courses.length > 0) {
      suggestions.push('Kurs haqida batafsil');
    }

    if (intent === 'learn_topic') {
      suggestions.push(`${searchQuery} bo'yicha darslar`);
      suggestions.push('Qaysi kursdan boshlashim kerak?');
    } else if (intent === 'general') {
      suggestions.push('React o\'rganmoqchiman');
      suggestions.push('Qanday kurslar bor?');
      suggestions.push('Kod yozishda yordam ber');
    }

    // Har doim 1-2 ta umumiy taklif
    if (suggestions.length < 3) {
      suggestions.push('Misol kod yozib bering');
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      reply,
      suggestions: suggestions.slice(0, 4),
      mode,
      hasVideos: videos.length > 0,
      hasCourses: courses.length > 0,
      videos: videos.slice(0, 3).map(v => ({
        _id: v._id,
        title: v.title,
        duration: v.duration,
        courseId: v.course?._id,
        courseTitle: v.course?.title,
      })),
      courses: courses.slice(0, 3).map(c => ({
        _id: c._id,
        title: c.title,
        category: c.category,
        level: c.level,
        isFree: c.isFree,
        price: c.price,
      })),
    },
  });
}
