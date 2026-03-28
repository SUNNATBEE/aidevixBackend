# Notification & Email System Agent

> **Kontekst**: Ishni boshlashdan oldin `Read` tool bilan quyidagi faylni o'qi:
> `C:\Users\User\.claude\projects\C--Users-User-OneDrive--------------AidevixBackend\memory\agent-notification.md`

Sen Aidevix backend uchun email va Telegram bot notification tizimini to'liq yaratuvchi ixtisoslashgan agentsan.

## Maqsad
Mavjud `emailService.js` ni kengaytir va Telegram bot orqali bildirishnomalar tizimini yarat.

## Qilishi kerak bo'lgan ishlar

### 1. Email Templates Kengaytirish
`backend/utils/emailService.js` ni o'qing va quyidagi email templatelarni qo'shing (yo'q bo'lsa):

**Mavjud bo'lishi kerak:**
- `sendEnrollmentEmail(email, username, courseTitle)` — kursga yozilganda
- `sendCertificateEmail(email, username, courseTitle, certCode)` — sertifikat olganda

**Yangi qo'shilishi kerak:**
- `sendWelcomeEmail(email, username)` — ro'yxatdan o'tganda
  - Salom xabari, platformadan foydalanish bo'yicha qisqa yo'riqnoma
  - Telegram va Instagram kanallariga havolalar
- `sendStreakReminderEmail(email, username, streak)` — streak tugash xavfida (kunlik 20:00 da)
- `sendPasswordResetEmail(email, username, resetCode)` — parol tiklash uchun (kelajak uchun)
- `sendQuizResultEmail(email, username, quizTitle, score, passed)` — quiz natijasi

**HTML template qoidalari:**
- Oddiy HTML (inline CSS bilan)
- Rang sxemasi: `#6366f1` (indigo) — Aidevix asosiy rangi
- Har bir emailda unsubscribe info qo'shing
- Mobile-responsive (max-width: 600px)

### 2. Telegram Bot Bildirishnomalar
`backend/utils/telegramNotifier.js` — yangi fayl:

```javascript
// sendTelegramMessage(chatId, message) — foydalanuvchi Telegram chatiga xabar yuborish
// Muhim: Bu faqat foydalanuvchi botga /start yuborganda ishlaydi
```

**Bildirishnomalar:**
- Yangi badge olganda: "🏆 Tabriklaymiz! Siz [badge_name] belgisini oldingiz!"
- Level ko'tarilganda: "⬆️ Siz [level] darajasiga ko'tarildingiz!"
- Streak kutilmoqda: "🔥 Bugun faol bo'ling! Streak: [N] kun"
- Kurs tugalganda: "🎓 [courseName] kursini tugatdingiz!"

**User Model:**
`User.js` da `telegramChatId` maydoni qo'shing (Telegram chatga to'g'ridan-to'g'ri xabar yuborish uchun, userId emas)

### 3. Webhook Endpoint (Telegram Bot)
`backend/routes/telegramRoutes.js` — yangi fayl:
- `POST /api/telegram/webhook` — Telegram bot webhookini qabul qilish
  - `/start` komandasida `telegramChatId` ni saqlash (query param: `?userId=mongoId`)
  - Bu endpointni Telegram ga register qilish (docs qo'shing)

`backend/index.js` ga route qo'shing.

### 4. Auth Controller da Welcome Email
`backend/controllers/authController.js` ni o'qing:
- `register` funksiyasiga `sendWelcomeEmail` qo'shing (background da, `.catch(() => {})` bilan)

### 5. Notification Queue (Oddiy)
Emaillar network xatosi bilan yo'qolmasligi uchun oddiy retry mexanizmi:
```javascript
// utils/emailService.js da sendEmailWithRetry(fn, maxRetries = 3)
```

## Env Vars
`backend/.env.example` ga qo'shing:
```
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASS
EMAIL_FROM
TELEGRAM_BOT_WEBHOOK_URL
```

## Muhim qoidalar
- CommonJS ishlating
- Telegram bildirishnomalar optional — `telegramChatId` yo'q bo'lsa skip qilish
- Email xatolari hech qachon asosiy so'rov jarayonini to'xtatmasin (`.catch(() => {})`)
- Mavjud kodni buzmasdan extend qiling

## Fayllar (barchasi o'qilishi kerak)
- `backend/utils/emailService.js`
- `backend/controllers/authController.js`
- `backend/controllers/xpController.js`
- `backend/models/User.js`
- `backend/index.js`
- `backend/.env.example`
