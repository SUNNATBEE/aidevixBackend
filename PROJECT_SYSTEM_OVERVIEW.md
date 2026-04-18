# Aidevix Project: AI & Bot System Overview

Technical overview of AI integrations, Telegram bot, and automation systems.

**Last Updated:** 2026-04-18
**Status:** Production Ready

---

## 1. AI-Powered News & Tips Engine (`backend/utils/newsScheduler.js`)
RSS feed'lardan IT/AI yangiliklar olib, AI bilan tarjima qilib, Telegram kanalga yuboradigan avtomatik tizim.

- **AI Integration:** Uses **Groq Cloud (Llama 3.3 70B)** for semantic translation and "Prompt Engineering Tip" generation.
- **Frequency:** 3x daily (10:00, 16:00, 20:00 Tashkent Time).
- **Features:** 
    - Automatic Image Extraction from RSS feeds.
    - Interactive Telegram Inline Buttons (🔥, 🚀, 💡).
    - Professional Uzbek localization with high-tech terminology.
    - Auto-share tracking links.

## 2. Telegram Bot Ecosystem (`backend/utils/telegramBot.js`)
Singleton pattern bilan qurilgan Telegram bot — foydalanuvchi interaksiyasi va admin boshqaruvi.

- **UI/UX:** Premium HTML formatting with custom iconography.
- **Commands:**
    - `/start`: Interactive dashboard for Mini App access.
    - `/stats`: Real-time user progress analyzer with visual progress bars (`▓▓▓░░`).
    - `/referral`: Modular referral tracking system with unique link generation.
    - `/postnews`: Admin-only manual trigger for the news engine.
- **Automations:**
    - **Graduation Alerts:** Automatically posts to the @aidevix channel when a user earns a professional certificate.
    - **Leaderboard Integration:** Weekly TOP-10 students announcement.

## 3. Mini App & Frontend Integration (`frontend/src/app/layout.tsx`)
Seamless connection between the Telegram Bot and the Web Platform.

- **Telegram WebApp SDK:** Injected via `telegram-web-app.js` to enable native-like features (Haptics, User Data, External Links).
- **Deep Linking:** Custom logic to navigate users from bot buttons directly to specific course or profile sections within the Mini App.

## 4. Environment Configuration
Crucial variables for the system to operate:

| Key | Description |
|-----|-------------|
| `TELEGRAM_BOT_TOKEN` | Main bot token. |
| `TELEGRAM_CHANNEL_USERNAME` | Target channel for news and graduations. |
| `GROQ_API_KEY` | AI engine for translation and tips. |
| `ADMIN_ID` | Telegram ID allowed to trigger admin commands. |
| `SEND_NEWS` | Boolean to toggle news automation. |
| `NEWS_HOUR` | Default target hour for scheduler. |

---

## Architecture Notes
- **Polling Mode:** Bot persistent long-polling ishlatadi. Serverless muhitlarda (Vercel) webhook'ga o'tish kerak bo'lishi mumkin.
- **Error Handling:** Barcha tashqi API chaqiruvlari (Telegram, Groq, RSS) try-catch bilan o'ralgan, silent fallback bilan server uptime ta'minlanadi.
- **Data Integrity:** Stats va Referrallar MongoDB'dan `User` va `UserStats` modellari orqali lean query bilan olinadi.
- **Full backend structure:** Batafsil arxitektura uchun `BACKEND_STRUCTURE.md` ga qarang.
