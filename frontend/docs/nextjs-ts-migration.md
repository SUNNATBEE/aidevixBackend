# ⚡ Next.js va TypeScript: O'tish Uchun Professional Qo'llanma

Hurmatli loyiha ishtirokchilari (O'quvchilar)! Aidevix loyihasida saytning SEO va mustahkamligini Professional Enterprise darajasiga ko'tarish uchun oldimizda ikkita muhim qadam yotibdi:
1. Sof React dan **Next.js** frameworkiga o'tishimiz.
2. Sof JavaScript dan **TypeScript** da arxitektura qurishimiz.

Ushbu hujjatda nima uchun biz buni qilishimiz kerakligi va backendimiz qanday qilib ushbu texnologiyalarga tayyorlab qo'yilganligi haqida bilib olasiz. Asosiy o'zgartirishlarni esa Frontend jamoasi (Siz) amalga oshirishingiz kerak bo'ladi.

---

## 1. Nima uchun Next.js? (SEO va Arxitektura)

Oddiy `React.js` (hozir ishlatayotganingiz) **CSR (Client-Side Rendering)** asosida ishlaydi. Ya'ni foydalanuvchiga faqat bitta bo'sh HTML fayl jo'natiladi, keyin u JS orqali virtual dom ni yuklaydi.
*   **Muammo:** Google, Yandex qidiruv tizimlari botlari bo'sh sahifani ko'radi va saytni tushunmaydi (SEO pastlaydi).
*   **Next.js Yechimi (SSR/SSG):** Kodlaringiz Backend serverning o'zida yig'ilib (Server-Side Rendering) foydalanuvchiga tayyor oynaga kelib tushadi. Botlar sahifani to'liq o'qiy oladi, va tezlik keskin oshadi.

**Bizning Backend qanday moslashtirildi?**
Backend tizimi endi *Cross-Origin Server Requests* ni inobatga oladi. Agar siz so'rovni Next.js Server Components lari ichida sser qilsangiz (`fetch`), brauzer emas balki serverdan so'rov kelayotgan bo'ladi va Backend CORS bu ruxsatnomalarni avtomatik ochiq qoldirish uchun moslangan. Ma'lumotlarni bemalol server side tortib olaverasiz.

---

## 2. Nima uchun TypeScript? (Xavfsizlik va Tezlik)

JavaScript ochiq turdagi til (dynamic typing) bo'lgani uchun, xatolar faqat kod yozilib brovzerga borganda bilinadi (Runtime error).
*   **Muammo:** Backenddan kurs obyekti kelganida unda qanaqa qatorlar borligini (`price`, `rating`, `thumbnail`) izlash uchun console.log() qilib ko'rib chiqishga to'g'ri keladi. Arzimagan bitta harfni esdan chiqarish ekranni "oq oyna" qilib qo'yishi mumkin.
*   **TypeScript Yechimi:** Ma'lumotlarni tipizatsiya qilamiz. Kod yozayotgan paytdayoq tipizatsiya sizga xatolarni yozishingiz bilan chizib ko'rsatadi, IDE (VS Code) da nimalar kelayotganini nuqta `.` qo'yish bilan topib yozasiz.

### Bizning Backenddan keladigan tayyor TS Turlari (Types)
Frontend jamoasi uchun backendni strukturalari asosida tayyor turlarni ishlab chiqdik. Quyidagi kodlarni o'zingizning `.ts` / `.tsx` fayllaringizda interfaces yoki types sifatida foydalaning:

```typescript
// ─── 1. Foydalanuvchi Turi
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  subscriptions: {
    instagram: { subscribed: boolean; username: string };
    telegram:  { subscribed: boolean; username: string };
  };
}

// ─── 2. Kurslar ro'yxati Turi
export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  instructor: {
    username: string;
    email: string;
    jobTitle: string;
  };
}

// ─── 3. Video oqimi Turi (Bunny.net Player uchun)
export interface VideoPlayerResponse {
  success: boolean;
  data: {
    video: {
      _id: string;
      title: string;
      duration: number;
      viewCount: number;
    };
    player: {
      embedUrl: string; // Iframe ichiga qo'yiladi
      expiresAt: string;
    }
  }
}
```

## 3. Loyihani Ko'chirish Yo'riqnomasi (Migration Guide)

O'quvchilar ushbu ketma-ketlikka rioya qilishlari so'raladi:
1.  **TypeScript'ga o'tish:** App.js kabi oddiy kodlarni avval `App.tsx` ga o'zgartiring. Yuqorida berilgan typelarni API va komponentlarga biriktiring. Barcha xatolarni kompyilyator orqali tozalang.
2.  **Auth holati:** JWT tokenlari React da `localStorage` ga saqlansa, Next.js da SEO ishlayotganida (SSR) muammo qilmasligi uchun ularni `Cookies` API siga o'tkazishni boshlang.
3.  **Hujjat va API-docs (Swagger):** Qanday API qanday ma'lumot qaytarayotganini aniq bilish uchun har doim faqat Swagger ro'yxatini (`/api-docs` URL) kuzatib boring, kodlarning TypeScript qoliplarini shu orqali osongina terib olasiz.
