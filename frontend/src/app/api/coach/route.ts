import { NextResponse } from 'next/server';
import { generateCoachReply } from '@/utils/coachAssistant';

const generateAIReply = async (message: string) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return null;
  }

  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  const systemInstruction = `Sen "Aidevix" IT-Ta'lim platformasining tajribali ustozi va AI Assistantisan.
Sening maqsading o'quvchilarga kodlash (React, Node.js, AI va h.k) hamda platformadan foydalanish bo'yicha maslahatlar berish.
Faqat o'zbek tilida, haqiqiy inson kabi qisqa, tushunarli, samimiy va do'stona javob ber. Hech qachon o'zingni oddiy "AI model" ekaningni aytma, men Aidevix ustoziman deb o'zingni tut. Emoji lardan xushmuomalalik bilan foydalan.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error:", response.status, errorData);
      return {
        reply: `Xato: AI API dan xato qaytdi (Status: ${response.status}). ${errorData}`,
        suggestions: ["Qayta urinib ko'rish"],
        mode: 'error'
      };
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (text) {
      return {
        reply: text,
        suggestions: ["Misol kod yozib bering", "Batafsilroq tushuntiring 💡", "Aidevix da qanday kurslar bor?"],
        mode: 'ai_groq'
      };
    }

    return {
      reply: `Xato: AI API dan bo'sh javob qaytdi.`,
      suggestions: [],
      mode: 'error'
    };
  } catch (error: any) {
    console.error("Groq AI xatosi:", error);
    return {
      reply: `Server xatosi: ${error?.message || 'Nomalum xato'}`,
      suggestions: [],
      mode: 'error'
    };
  } finally {
    clearTimeout(timeout);
  }
};

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const message = typeof payload?.message === 'string' ? payload.message.trim() : '';

  if (!message) {
    return NextResponse.json(
      { success: false, message: 'Message is required' },
      { status: 400 },
    );
  }

  // 1. Groq API orqali AI javob
  const aiPayload = await generateAIReply(message);
  if (aiPayload) {
    return NextResponse.json({
      success: true,
      data: aiPayload
    });
  }

  // 2. Agar API kaliti yo'q bo'lsa: lokal javoblar
  const fallback = generateCoachReply(message);
  return NextResponse.json({
    success: true,
    data: {
      reply: fallback.reply + "\n\n*(Eslatma: AI assistantni to'laqonli ishlashi uchun .env fayliga GROQ_API_KEY ulanishi kerak)*",
      suggestions: fallback.suggestions,
      mode: 'fallback',
    },
  });
}
