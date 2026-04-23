'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-6">📡</div>
      <h1 className="text-3xl font-black text-white mb-3">Internetga ulanmagan</h1>
      <p className="text-slate-400 max-w-md mb-8">
        Aidevix ga ulanish uchun internet kerak. Tarmoqni tekshiring va qaytadan urinib ko'ring.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-colors"
      >
        Qaytadan urinish
      </button>
    </div>
  );
}
