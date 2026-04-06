# 🎓 Aidevix: O'quvchilar uchun Maxsus Yo'riqnoma

Salom, qadrli o'quvchi! Loyihamiz doimiy ravishda yangilanib boradi. Quyida loyihani o'z kompyuteringizda xatosiz yangilash (update) va ishlash bo'yicha to'liq yo'riqnoma berilgan.

---

## 🚀 1. Loyihani yangilash (Git Pull)

Agar sizda eski versiya (React) bo'lsa va yangi versiyaga (Next.js) o'tmoqchi bo'lsangiz, quyidagi qadamlarni bajaring:

### ⚠️ DIQQAT: O'zgarishlaringizni saqlang!
Pul qilishdan oldin o'z kodingizni commit qiling yoki `git stash` yordamida vaqtincha saqlab turing.

### 🔄 Yangilash buyruqlari:
Terminalda loyihaning asosiy papkasida (`AidevixBackend`) bo'lgan holda ushbu buyruqlarni bering:

```bash
# 1. Serverdan eng so'nggi kodni olish
git pull origin main

# 2. Frontend papkasiga o'tish
cd frontend

# 3. Eski kutubxonalarni tozalab, yangilarini o'rnatish (MUHIM!)
rm -rf node_modules .next
npm install
```

---

## 🏗️ 2. Yangi Texnologiyalar (Stack)

Loyiha endi yanada tezkor va professional. Biz foydalanayotgan texnologiyalar:
*   **Next.js 14**: React-ning eng zamonaviy "uglerodi".
*   **Tailwind CSS**: Dizaynlar endi klasslar orqali boshqariladi.
*   **DaisyUI**: Tayyor chiroyli komponentlar (tugmalar, modallar).
*   **Redux Toolkit**: Global state (foydalanuvchi ma'lumotlari) uchun.
*   **Three.js & GSAP**: Chiroyli animatsiyalar va 3D effektlar uchun.

---

## 🛠️ 3. Mahalliy ishga tushirish (Local Run)

Loyihani o'z kompyuteringizda ko'rish uchun:

1.  **Backendni yoqing**: `backend` papkasiga o'tib, `npm start` yoki `node index.js` ni yoqing.
2.  **Frontendni yoqing**: `frontend` papkasida `npm run dev` buyrug'ini bering.
3.  Brauzerda `http://localhost:3000` manzilini oching.

> [!TIP]
> Agar backend Railway-da bo'lsa, `frontend/.env` faylida `NEXT_PUBLIC_API_BASE_URL` Railway manziliga sozlanganligiga ishonch hosil qiling.

---

## ❓ 4. Ko'p uchraydigan muammolar (FAQ)

### 1. "Hydration mismatch" xatosi chiqsa nima qilish kerak?
Brauzerni bir marta `Ctrl + Shift + R` (Hard Reload) qilib yuboring. Bu keshni tozalaydi.

### 2. "Module not found" xatosi chiqsa?
Demak siz `npm install` qilishni unutgansiz. `frontend` papkasiga o'tib, qaytadan `npm install` qiling.

### 3. Git Conflict (ziddiyat) chiqsa-chi?
Agar siz ham bitta faylni o'zgartirgan bo'lsangiz va `git pull` qilsangiz, Visual Studio Code-da sizga "Accept Current" yoki "Accept Incoming" o'zgarishini tanlashni so'raydi. Maslahatimiz: "Incoming" (serverdagi yangi kodingiz)ni tanlang va o'z kodingizni keyin qo'shib qo'ying.

---

## 🎯 5. Admin Panelga kirish
Admin panel endi `/admin` manzilida. Unga kirish uchun profilingizda `role: "admin"` bo'lishi shart.

**Muvaffaqiyat tilaymiz! Savollaringiz bo'lsa, ustozlaringizga murojaat qiling.**
