import { NextResponse } from 'next/server';
import { generateCoachReply } from '@/utils/coachAssistant';

const generateGeminiReply = async (message: string) => {
  // .env yoki .env.local dagi GEMINI_API_KEY ni olamiz
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return null;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemInstruction = `Sen "Aidevix" IT-Ta'lim platformasining tajribali ustozi va AI Assistantisan. 
Sening maqsading o'quvchilarga kodlash (React, Node.js, AI va h.k) hamda platformadan foydalanish bo'yicha maslahatlar berish. 
Faqat o'zbek tilida, haqiqiy inson kabi qisqa, tushunarli, samimiy va do'stona javob ber. Hech qachon o'zingni oddiy "AI model" ekaningni aytma, men Aidevix ustoziman deb o'zingni tut. Emoji lardan xushmuomalalik bilan foydalan.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000); // 12 sec timeout gacha kutadi

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { 
          parts: [{ text: systemInstruction }] 
        },
        contents: [{
          role: "user",
          parts: [{ text: message }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API Error:", response.status, errorData);
      return {
        reply: `Lokal Xato: Google API dan xato qaytdi (Status: ${response.status}). Xato matni: ${errorData}`,
        suggestions: ["Qayta urinib ko'rish"],
        mode: 'error'
      };
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      return {
        reply: text,
        suggestions: ["Misol kod yozib bering", "Batafsilroq tushuntiring 💡", "Aidevix da qanday kurslar bor?"],
        mode: 'ai_gemini'
      };
    }
    
    return {
      reply: `Xato: Google API dan bo'sh javob qaytdi.`,
      suggestions: [],
      mode: 'error'
    };
  } catch (error: any) {
    console.error("Gemini AI xatosi:", error);
    return {
      reply: `Server xatosi (gemini_fetch): ${error?.message || 'Nomalum xato'}`,
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

  // 1. Google Gemini API orqali haqiqiy insonday fikrlash!
  const aiPayload = await generateGeminiReply(message);
  if (aiPayload) {
    return NextResponse.json({
      success: true,
      data: aiPayload
    });
  }

  // 2. Agar .env faylida API kaliti ko'rsatilmagan bo'lsa yoki API ishlamasa: (Lokal javoblar qaytaramiz)
  const fallback = generateCoachReply(message);
  return NextResponse.json({
    success: true,
    data: {
      reply: fallback.reply + "\n\n*(Eslatma: AI assistantni to'laqonli ishlashi uchun .env fayliga GEMINI_API_KEY ulanishi kerak)*",
      suggestions: fallback.suggestions,
      mode: 'fallback',
    },
  });
}
