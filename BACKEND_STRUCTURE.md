# 🚀 AIDEVIX BACKEND — PROFESSIONAL ARCHITECTURE

Ushbu hujjat Aidevix platformasining backend qismi (Node.js, Express, MongoDB) arxitekturasini batafsil tushuntiradi.

---

## 📂 Core Structure: `backend/index.js` (Entry Point)
Serverning asosi: Middleware'larni ulash, DB bog'lanishi va barcha yo'llarni (routes) boshqarish.

### 🎮 Controllers (`backend/controllers/`)
Biznes logikani o'zida saqlaydigan asosiy "miya" qismi.

| Fayl | Vazifasi va Logikasi |
| :--- | :--- |
| `authController.js` | Ro'yxatdan o'tish, Login, Refresh Token, Parolni tiklash va Kunlik mukofot (Daily Reward) logikasi. |
| `adminController.js` | Adminlar uchun statistika, foydalanuvchilarni va kontentni boshqarish funksiyalari. |
| `courseController.js` | Kurslarni yaratish (CRUD), qidiruv va darslar tartibini boshqarish. |
| `sectionController.js` | Kurs tarkibidagi bo'limlarni (Modullar) boshqarish. |
| `videoController.js` | Videolarni yuklash, BunnyCDN havolalari bilan ishlash va dars kontenti. |
| `subscriptionController.js`| **Real-time Obuna:** Telegram/Instagram obunasini tekshirish va tasdiqlash tokenlarini yaratish. |
| `xpController.js` | **Gamification:** XP berish, Quizlarni tekshirish, User Stats va Leaderboard logikasi. |
| `rankingController.js` | Global va kurslar bo'yicha reytinglarni hisoblash. |
| `enrollmentController.js`| Foydalanuvchining kurslarga yozilishi va darslarga ruxsat olishi. |
| `paymentController.js` | Payme/Click integratsiyasi va to'lovlar tarixi. |
| `certificateController.js`| Kursni bitirganda avtomatik PDF sertifikat generatsiya qilish. |
| `challengeController.js` | Kunlik va haftalik vazifalar (Challenges) boshqaruvi. |
| `projectController.js` | Foydalanuvchilar yuklagan amaliy loyihalar (Portfolio) boshqaruvi. |
| `followController.js` | Foydalanuvchilar bir-birini kuzatish (Following) tizimi. |

### 🗄️ Models (`backend/models/`)
Ma'lumotlar bazasi sxemalari (MongoDB/Mongoose).

| Fayl | Tavsifi |
| :--- | :--- |
| `User.js` | Asosiy profil: ismi, email, paroli, XP (mirror), streak va auth ma'lumotlari. |
| `UserStats.js` | **Detailed Stats:** XP, level, badge'lar va haftalik XP bo'yicha aniq statistika. |
| `VerifyToken.js` | Telegramni avtomatik bog'lash uchun ishlatiladigan vaqtinchalik xavfsiz tokenlar. |
| `Course.js` | Kurs nomi, tavsifi, muallifi va umumiy sozlamalari. |
| `Section.js` | Kurs ichidagi bo'limlar (masalan: "1-Modul: Kirish"). |
| `Video.js` | Dars videolari: sarlavha, havola, tartib raqami va ko'rishlar soni. |
| `Quiz.js` | Video darsdan keyingi test savollari va to'g'ri javoblar. |
| `QuizResult.js` | Foydalanuvchining test natijalari, xatolari va olgan XP'si. |
| `Enrollment.js` | Qaysi foydalanuvchi qaysi kursga a'zo ekanligi haqida ma'lumot. |
| `Certificate.js` | Berilgan sertifikatlar kodi va ularni tekshirish (verify). |

### 🛣️ Routes (`backend/routes/`)
API endpointlari: `authRoutes.js`, `courseRoutes.js`, `subscriptionRoutes.js`, `xpRoutes.js` va boshqalar.

### 🛡️ Middleware (`backend/middleware/`)
| Fayl | Vazifasi |
| :--- | :--- |
| `auth.js` | JWT tokenni tekshirish va `req.user` ni aniqlash. |
| `subscriptionCheck.js` | Foydalanuvchi kanallarga obuna bo'lmaguncha videoni ko'rsatmaslik. |
| `errorMiddleware.js` | Serverdagi barcha xatolarni chiroyli formatda qaytarish. |
| `rateLimiter.js` | Spam va botlarga qarshi API so'rovlar limitini o'rnatish. |

### 🛠️ Utils (`backend/utils/`)
| Fayl | Vazifasi |
| :--- | :--- |
| `telegramBot.js` | Bot xabarlari, auto-link va admin bildirishnomalari. |
| `socialVerification.ts` | Telegram API orqali kanaldan chiqqan-chiqmaganini tekshirish. |
| `xpLevel.js` | Level va unvonlarni hisoblash formulalari. |
| `bunny.js` | BunnyCDN bilan xavfsiz video havolalarini yaratish. |
| `badgeService.js` | Foydalanuvchi ma'lum shartlarni bajarganda avtomatik Badge berish. |

---

> [!TIP]
> **Single Source of Truth:** Platformada XP va Streak ma'lumotlari `User` va `UserStats` modellarida sinxron saqlanadi. `getUserStats` endpointi ularni doimiy ravishda auto-repair qilib boradi.
