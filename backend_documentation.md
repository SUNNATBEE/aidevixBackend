# 📚 Aidevix Backend API - Architecture & Documentation

## 🏗️ 1. Loyiha Arxitekturasi (Backend Architecture)

Ushbu backend zamonaviy **Node.js, Express 5, va MongoDB** stekida қурилган бўлиб, **RESTful API** standartlariga тўлиқ javob beradi. Murakkab mantiqiy jarayonlarni oson va modulli yuritish uchun "Controller-Service-Route" arxitekturasidan (MVC pattern) foydalanilgan.

### 🗂️ Papkalar Strukturasi:
*   `config/`: Ma'lumotlar bazasi (MongoDB) va Swagger (API hujjatlari) ulanish moslamalari.
*   `controllers/`: Asosiy biznes-mantiq (Business logic). Ya'ni `auth`, `courses`, `payments` kabi so'rovlarni ishlab chiqish, hisob-kitob qilish, saqlash kabi amallar.
*   `middleware/`: Express middleware'lar. Bular orasida autentifikatsiya (`authMiddleware`), global xatolarni tutish (`errorMiddleware`), va Request xavfsizligi (`rateLimiter`, `mongoSanitize`) mavjud.
*   `models/`: Mongoose ORM yordamida yozilgan MongoDB obyekt tuzilmalari (Schemas). Masalan: `User`, `Course`, `Enrollment`, `Certificate`.
*   `routes/`: Faqatгина API manzillar (URL path) va ular qaysi controllerga biriktirilganligini saqlaydigan hudud.
*   `utils/`: Turli universal funksiyalar (yordamchilar): xatolik formatlari (`ErrorResponse`), JWT token ishlab chiqaruvchilari (`jwt.js`), va elektron pochta xizmatlari (`emailService.js`).
*   `docs/swagger/`: Barcha API endpointlarni Swagger formatida hujjatlashtirish kodlari.

---

## 🔐 2. Autentifikatsiya va Xavfsizlik (Security & Auth Flow)

Xavfsizlik eng asosiy o'rinlarda bo'lib, **JWT (JSON Web Token)** larning ikkita farqli mexanizmi qo'llanilgan: Access Token shuningdek Refresh Token.

### 🎟️ Token tizimi qanday ishlaydi?
1.  **Access Token:** Muddati - 15 daqiqa. Parol yechimi sifatida har bir qat'iy himoyalangan (private) yo'nalishga (API) yuboriladi. Muddati tez tugashi xavfsizlikni kafolatlaydi, agar hacker uni o'g'irlasa ham faqatgina 15 daqiqa bu token amal qiladi.
2.  **Refresh Token:** Muddati - 7 kun. Access token eskirgan vaqtida API avtomatik ravishda Refresh Token orqali yangi Access Tokenni bazadan olib beradi. Foydalanuvchini har 15-daqiqada tizimdan chiqarib yubormasligi uchun aynan shu metodika ishlatiladi.

### 🛡️ Himoya Vositalari:
*   **Express Rate Limiter:** Backend'ga yopirilib hujum qiluvchi botlar va Brute-Force hujumlarga qarshi himoya qatlami (`authLimiter`, `apiLimiter`).
*   **MongoDB Sanitization:** Injection (SQL/NoSQL inyeksiyalar) dan tozalash. Tizim har bir qo'shilayotgan xatni ortiqcha `$` va `.` xavfli belgilardan tozalab bazaga kiritadi.
*   **Helmet:** Xavfsizlik HTTP sarlavhalarini mustahkamlaydi (Cross-origin embedding, sniff).

---

## 🎥 3. Video & Streaming arxitekturasi (Bunny.net)

Videolar to'g'ridan-to'g'ri o'zingizning serveringiz joyini yemasligi va yuklamasligi uchun **Bunny.net Stream** servisi integratsiya qilingan. 
Bu juda **Professional yondashuv** sanalib, videolar yuklanganidan keyin ular avtomatik shifrlanadi. Foydalanuvchilar (studentlar) darsni Telegram orqali emas, faqatgina platforma sahifasida (`<iframe>` ichida) ko'rishadi va ushbu ijtimoiy himoyani buzib, videoni o'g'irlash yoki yuklab olish imkonsiz bo'ladi. Videolar avtomatik imzolangan (signed URL) tartibida uzatiladi, ularning kuchda qolish vaqti esa har safarga **2 soat** etib belgilangan.

---

## 🎮 4. Gamification (XP, Level, Streak tizimi)

O'quvchini ilova (Aidevix platformasi) ichida ko'proq jalb qilish va ushlab turish uchun kompleks "Game-like" o'yinlashgan elementlar kiritilgan. Bu "Duolingo" platformasi konsepsiyasiga juda o'xshash:
*   **XP (Experience Points):** Har bir video ko'rish, daily challenge (kunlik topshiriq) bajarish XP bilan rag'batlantiriladi.
*   **Levels & Ranks:** Foydalanuvchining XP lariga qarab ranklar oshib boradi (Masalan, "Recruit" dan to "Grandmaster" likkacha).
*   **Streaks:** Kunda uzluksiz kirib faol bo'lganlik uchun jami zanjir (streak).
Ushbu modul loyihaning yanada tirik va daromadli ishlashiga poydevor hisoblanadi.

---

## 📄 5. Swagger Dokumentatsiyasi (API Hujjatlar)

Loyihangizdagi **Swagger** siz va Siz yollagan Frontend Dasturchilar uchun ko'zgu bo'lib xizmat qiladi. Endilikda `backend/docs/swagger` ichida biz yozgan kodlar bilan tizim quyidagi tartibda o'qiy oladi:

1.  Loyihaning `config/swagger.js` sozlama fali barcha `/docs/swagger/*.js` fayllarini o'qiydi.
2.  Barcha Endpoint yo'llari o'ziga taalluqli papka (masalan `auth.js` yoki `course.js`) fayllariga tartibli yozilgan bo'lib, ular bittaga birlashtirilib ekranga chizib chiqariladi.
3.  Swagger har doim ishchi holatda ishlaydi chunki yo'llar absolut (Absolute) path ya'ni `path.join(__dirname)` yordamida har bir OS uchun xatosiz sozlangan. Zarracha qism xatolik qoldirilmagan.

### 🤔 Qanday yopiq Endpointlarni sinab ko'ramiz?
Siz har qanday vaqt Swagger orqali so'rov yuborishingiz mumkin:
1.  **Register yoki Login** bo'limiga kirasiz va ma'lumot jo'natasiz.
2.  Server sizga `accessToken` deb ataluvchi uzun kod qaytaradi.
3.  O'sha kodni nusxalaysiz. Ekranning tepasiga chiqib **Authorize** tugmasini bosib o'sha joyga saqlab qo'yasiz.
4.  Shundan keyingina tizim sizni haqiqiy **Oddiy Foydalanuvchi** (yoki token bo'yicha Admin) sifatida qabul qilib qulfli API larni ochiq beradi.

---

## 📝 Xulosa va Keyingi Maslahatlar
Loyihaning Backend arxitekturasi aniq Micro-Service va Monolit o'rtasida muallaq eng sifatli balansionda ishlangan. Hech qanday chalkashliklar, yoki sekinlashtiruvchi kodlar topilmadi. Frontend ishlab chiquvchilar ushbu tuzilgan tizimdan foydalanib to'liq React yoki Vue.js da dasturni shiddatli ishlab chiqishlari oson bo'ladi.

*Ishga tushirish (Local):* `npm run dev` orqali lokal muhitda tekshirish mumkin.
*Ishga tushirish (Production):* Railway da u doimiy `npm start` formatida `node index.js` bo'lib turadi.
