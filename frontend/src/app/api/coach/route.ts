import { NextResponse } from 'next/server';
import { generateCoachReply } from '@/utils/coachAssistant';

const readBackendReply = async (message: string) => {
  const endpoint = process.env.COACH_ASSISTANT_API_URL || process.env.NEXT_PUBLIC_COACH_ASSISTANT_API_URL;

  if (!endpoint) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
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

  const backendPayload = await readBackendReply(message);
  if (backendPayload) {
    return NextResponse.json(backendPayload);
  }

  const fallback = generateCoachReply(message);
  return NextResponse.json({
    success: true,
    data: {
      reply: fallback.reply,
      suggestions: fallback.suggestions,
      mode: 'fallback',
    },
  });
}
