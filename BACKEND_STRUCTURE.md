# AIDEVIX BACKEND — PROFESSIONAL ARCHITECTURE

Ushbu hujjat Aidevix platformasining backend qismi (Node.js, Express, MongoDB) arxitekturasini batafsil tushuntiradi.

**Oxirgi yangilanish:** 2026-04-18

---

## Core Structure: `backend/index.js` (Entry Point)
Serverning asosi: Middleware'larni ulash, DB bog'lanishi va barcha yo'llarni (routes) boshqarish.

### Controllers (`backend/controllers/`) — 16 ta

| Fayl | Vazifasi va Logikasi |
| :--- | :--- |
| `authController.js` | Ro'yxatdan o'tish, Login, Refresh Token, Parolni tiklash va Kunlik mukofot (Daily Reward) logikasi. |
| `adminController.js` | Adminlar uchun statistika, foydalanuvchilarni va kontentni boshqarish funksiyalari. |
| `courseController.js` | Kurslarni yaratish (CRUD), qidiruv va darslar tartibini boshqarish. |
| `sectionController.js` | Kurs tarkibidagi bo'limlarni (Modullar) boshqarish. |
| `videoController.js` | Videolarni yuklash, BunnyCDN havolalari bilan ishlash va dars kontenti. |
| `subscriptionController.js` | **Real-time Obuna:** Telegram/Instagram obunasini tekshirish va tasdiqlash tokenlarini yaratish. |
| `xpController.js` | **Gamification:** XP berish, Quizlarni tekshirish, User Stats va Leaderboard logikasi. |
| `rankingController.js` | Global va kurslar bo'yicha reytinglarni hisoblash. |
| `enrollmentController.js` | Foydalanuvchining kurslarga yozilishi va darslarga ruxsat olishi. |
| `paymentController.js` | Payme/Click integratsiyasi va to'lovlar tarixi. |
| `certificateController.js` | Kursni bitirganda avtomatik PDF sertifikat generatsiya qilish. |
| `challengeController.js` | Kunlik va haftalik vazifalar (Challenges) boshqaruvi. |
| `projectController.js` | Foydalanuvchilar yuklagan amaliy loyihalar (Portfolio) boshqaruvi. |
| `followController.js` | Foydalanuvchilar bir-birini kuzatish (Following) tizimi. |
| `uploadController.js` | Avatar va kurs thumbnail'larni Cloudinary'ga yuklash va boshqarish. |
| `wishlistController.js` | Foydalanuvchining saqlangan kurslar ro'yxatini qo'shish, olib tashlash va ko'rish. |

### Models (`backend/models/`) — 18 ta
Ma'lumotlar bazasi sxemalari (MongoDB/Mongoose).

| Fayl | Tavsifi |
| :--- | :--- |
| `User.js` | Asosiy profil: ismi, email, paroli, XP (mirror), streak va auth ma'lumotlari. |
| `UserStats.js` | **Detailed Stats:** XP, level, badge'lar va haftalik XP bo'yicha aniq statistika. |
| `VerifyToken.js` | Telegramni avtomatik bog'lash uchun ishlatiladigan vaqtinchalik xavfsiz tokenlar. |
| `Course.js` | Kurs nomi, tavsifi, muallifi va umumiy sozlamalari. |
| `CourseRating.js` | Kurslarga 1-5 ball reyting va sharhlar saqlash. |
| `Section.js` | Kurs ichidagi bo'limlar (masalan: "1-Modul: Kirish"). |
| `Video.js` | Dars videolari: sarlavha, havola, tartib raqami va ko'rishlar soni. |
| `VideoLink.js` | Video uchun Telegram linki va ishlatilish holati. |
| `VideoQuestion.js` | Video uchun foydalanuvchi savollar va javoblar. |
| `Quiz.js` | Video darsdan keyingi test savollari va to'g'ri javoblar. |
| `QuizResult.js` | Foydalanuvchining test natijalari, xatolari va olgan XP'si. |
| `Enrollment.js` | Qaysi foydalanuvchi qaysi kursga a'zo ekanligi haqida ma'lumot. |
| `Certificate.js` | Berilgan sertifikatlar kodi va ularni tekshirish (verify). |
| `DailyChallenge.js` | Kunlik vazifalar va foydalanuvchilarga bonus XP berish tizimi. |
| `Follow.js` | Foydalanuvchilar orasidagi obuna munosabatlari. |
| `Payment.js` | Payme va Click to'lov provayderlaridagi to'lovlar tarixini saqlash. |
| `Project.js` | Kurs ichidagi amaliy loyiha va vazifalar tizimi. |
| `Wishlist.js` | Foydalanuvchi wishlist'idagi saqlangan kurslar ro'yxati. |

### Routes (`backend/routes/`) — 16 ta
API endpointlari:

| Fayl |
| :--- |
| `authRoutes.js` |
| `adminRoutes.js` |
| `courseRoutes.js` |
| `sectionRoutes.js` |
| `videoRoutes.js` |
| `subscriptionRoutes.js` |
| `xpRoutes.js` |
| `rankingRoutes.js` |
| `enrollmentRoutes.js` |
| `paymentRoutes.js` |
| `certificateRoutes.js` |
| `challengeRoutes.js` |
| `projectRoutes.js` |
| `followRoutes.js` |
| `uploadRoutes.js` |
| `wishlistRoutes.js` |

### Middleware (`backend/middleware/`) — 8 ta

| Fayl | Vazifasi |
| :--- | :--- |
| `auth.js` | JWT tokenni tekshirish va `req.user` ni aniqlash. |
| `subscriptionCheck.js` | Foydalanuvchi kanallarga obuna bo'lmaguncha videoni ko'rsatmaslik. |
| `errorMiddleware.js` | Serverdagi barcha xatolarni chiroyli formatda qaytarish. |
| `rateLimiter.js` | Spam va botlarga qarshi API so'rovlar limitini o'rnatish. |
| `asyncHandler.js` | Express route'larda try-catch yozmasligini osonlashtirish wrapper'i. |
| `swaggerAuth.js` | Swagger UI dokumentatsiyasini timing-safe basic autentifikatsiya bilan himoya qilish. |
| `uploadMiddleware.js` | Cloudinary orqali avatar va thumbnail'larni yuklash konfiguratsiyasi. |
| `validateObjectId.js` | MongoDB ObjectId formatni tekshirish middleware'i. |

### Utils (`backend/utils/`) — 10 ta

| Fayl | Vazifasi |
| :--- | :--- |
| `telegramBot.js` | Bot xabarlari, auto-link va admin bildirishnomalari. |
| `socialVerification.js` | Telegram API orqali kanaldan chiqqan-chiqmaganini tekshirish. |
| `checkSubscriptions.js` | Real-time Telegram va Instagram obuna holati tekshiruvi. |
| `bunny.js` | BunnyCDN bilan xavfsiz video havolalarini yaratish. |
| `badgeService.js` | Foydalanuvchi ma'lum shartlarni bajarganda avtomatik Badge berish. |
| `jwt.js` | Access, refresh va reset tokenlarni yaratish va tekshirish. |
| `emailService.js` | Nodemailer orqali xush kelish, level up va sertifikat emaillarini yuborish. |
| `newsScheduler.js` | Kuniga 3 marta AI trendlar va maslahatlarni RSS feed'lardan yuborish scheduler'i. |
| `authSecurity.js` | Secure cookie va JWT token boshqaruvi utilitylari. |
| `errorResponse.js` | Xatolik xabarlarini standart formatda qaytarish class'i. |

### Config (`backend/config/`) — 4 ta

| Fayl | Vazifasi |
| :--- | :--- |
| `database.js` | MongoDB ulanishi va DNS konfiguratsiyasi. |
| `jwt.js` | JWT token secretlari va vaqt muddatlari konfiguratsiyasi. |
| `swagger.js` | Asosiy Swagger API dokumentatsiyasi konfiguratsiyasi. |
| `swaggerAdmin.js` | Admin panel API dokumentatsiyasi Swagger konfiguratsiyasi. |

### Swagger Docs (`backend/docs/swagger/`)
Har bir controller uchun alohida Swagger dokumentatsiya fayllari mavjud (16 ta).

### Seeders (`backend/seeders/`)
- `seedCourses.js` — **DESTRUCTIVE:** Faqat `ALLOW_DESTRUCTIVE_SEED=true` bilan ishlaydi.

---

> [!TIP]
> **Single Source of Truth:** Platformada XP va Streak ma'lumotlari `User` va `UserStats` modellarida sinxron saqlanadi. `getUserStats` endpointi ularni doimiy ravishda auto-repair qilib boradi.
