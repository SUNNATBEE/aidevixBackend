'use client';

import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { IoClose, IoSend, IoSparkles } from 'react-icons/io5';
import { gsap } from 'gsap';
import { generateCoachReply, type CoachMessage } from '@/utils/coachAssistant';

const makeMessageId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const initialMessages: CoachMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Salom. Men sizga oqish, auth, theme yoki umumiy product muammolarida qisqa va aniq yol korsataman.',
    timestamp: Date.now(),
  },
];

export default function AICoach() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<CoachMessage[]>(initialMessages);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const toggleCoach = () => {
    setIsOpen((current) => !current);
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return undefined;

    const tween = gsap.to(button, {
      boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
      repeat: -1,
      yoyo: true,
      duration: 1.5,
    });

    return () => tween.kill();
  }, []);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    gsap.fromTo(
      panelRef.current,
      { scale: 0.92, opacity: 0, y: 24 },
      { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' },
    );
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage: CoachMessage = {
      id: makeMessageId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Coach API error: ${response.status}`);
      }

      const payload = await response.json();
      const assistantReply = payload?.data?.reply || payload?.reply;
      const assistantSuggestions = payload?.data?.suggestions || payload?.suggestions;
      const fallback = generateCoachReply(trimmed);

      setMessages((current) => [
        ...current,
        {
          id: makeMessageId(),
          role: 'assistant',
          content: assistantReply || fallback.reply,
          timestamp: Date.now(),
          suggestions: Array.isArray(assistantSuggestions) && assistantSuggestions.length > 0
            ? assistantSuggestions
            : fallback.suggestions,
        },
      ]);
    } catch {
      const fallback = generateCoachReply(trimmed);
      setMessages((current) => [
        ...current,
        {
          id: makeMessageId(),
          role: 'assistant',
          content: fallback.reply,
          timestamp: Date.now(),
          suggestions: fallback.suggestions,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      <button
        ref={buttonRef}
        onClick={toggleCoach}
        className="coach-btn group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Open coach assistant"
      >
        {isOpen ? <IoClose className="text-2xl" /> : <IoSparkles className="text-2xl transition-transform group-hover:rotate-12" />}
        {!isOpen && (
          <div className="absolute -right-1 -top-1 h-4 w-4 animate-bounce rounded-full border-2 border-[#0a0a0c] bg-red-500" />
        )}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="coach-window absolute bottom-20 right-0 flex h-[460px] w-[350px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#12141c]/95 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/5 bg-indigo-600/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
                <IoSparkles className="text-lg" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight text-white">Aidevix AI Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="mt-1 text-[10px] font-black uppercase tracking-widest leading-none text-white/40">Online Coach</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[84%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                  message.role === 'assistant'
                    ? 'self-start rounded-tl-none border-white/5 bg-indigo-600/10 text-white/85'
                    : 'ml-auto rounded-tr-none border-indigo-500/20 bg-white/10 text-white'
                }`}
              >
                {message.content}
                {message.role === 'assistant' && message.suggestions?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setInput(suggestion)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/75 transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-1 p-2">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex items-center gap-3 border-t border-white/5 bg-black/40 p-4">
            <input
              type="text"
              placeholder="Savol sorang..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white outline-none transition-colors placeholder:text-white/20 focus:border-indigo-500/50"
              disabled={isTyping}
            />
            <button
              onClick={() => void sendMessage()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isTyping || !input.trim()}
              aria-label="Send message"
            >
              <IoSend className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
