# 🚀 Aidevix: Full-Stack Online Kurs Platformasi

Aidevix — bu o'zbek tilidagi eng zamonaviy va professional dasturlash o'quv platformasi. Loyiha ham o'quvchilar, ham adminlar uchun mo'ljallangan to'liq ekotizimdir.

---

## 📚 O'quvchilar uchun Muhim Havolalar!

> [!IMPORTANT]
> **Loyihani yangilash (Git pull) va Next.js-da ishlash bo'yicha professional yo'riqnoma:**
> 👉 [**STUDENTS_GUIDE.md**](./frontend/docs/STUDENTS_GUIDE.md)

---

## 🏗️ Loyiha Strukturasi

Loyiha ikkita asosiy qismdan iborat:

### 1. 🌐 Frontend (Next.js 14)
*   **Texnologiyalar**: React 18, Next.js 14 (App + Pages Router), Tailwind CSS, Redux Toolkit, Framer Motion, Three.js, GSAP.
*   **Manzil**: `/frontend` papkasida.
*   **Xususiyatlar**:
    *   Responsive dizayn (Premium UI/UX)
    *   3D animatsiyalar va interaktiv interfeys
    *   Dashboard va Kurslar tizimi
    *   Admin Panel (`/admin`)

### 2. ⚙️ Backend (Node.js/Express)
*   **Texnologiyalar**: Express 5.x, MongoDB (Mongoose), JWT, Swagger.
*   **Manzil**: `/backend` papkasida.
*   **Xususiyatlar**:
    *   JWT-based Authentication
    *   Kurslar va Videolar boshqaruvi
    *   Rate Limiting va Xavfsizlik (Helmet, Sanitization)
    *   API Dokumentatsiya (Swagger)

---

## 🛠️ Tezkor Ishga Tushirish (Quick Start)

### 1. Backendni ishga tushirish:
```bash
cd backend
npm install
npm start
```

### 2. Frontendni ishga tushirish:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 Jonli Demo va API

*   **Veb-sayt**: [https://www.aidevix.uz](https://www.aidevix.uz)
*   **API Dokumentatsiya (Swagger)**: [https://aidevix-backend-production.up.railway.app/api-docs/](https://aidevix-backend-production.up.railway.app/api-docs/)

---

## 🛡️ Xavfsizlik va Ma'lumot Uzatish
Barcha ma'lumotlar Railway backend va Vercel frontend o'rtasida uzatiladi. API xavfsizligi JWT va CORS policy orqali ta'minlangan.

**Aidevix - Kelajakni kodlashni bugundan boshlang!** 💎🚀
