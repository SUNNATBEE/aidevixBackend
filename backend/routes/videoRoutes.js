const express = require('express');
const router = express.Router();
const { getCourseVideos, getVideo, useVideoLink, createVideo, updateVideo, deleteVideo, askQuestion, getVideoQuestions, answerQuestion } = require('../controllers/videoController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { checkSubscriptions } = require('../middleware/subscriptionCheck');

// ════════════════════════════════════════════════════════════════
// GET /api/videos/course/:courseId
// ════════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/videos/course/{courseId}:
 *   get:
 *     summary: 🎬 Kurs videolari ro'yxati (Ochiq — token shart emas)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Bitta kursning barcha faol videolari ro'yxatini qaytaradi.
 *       **Ochiq endpoint** — token kerak emas.
 *       Faqat video sarlavhasi va davomiyligi qaytariladi — video linki emas!
 *       Video linkni olish uchun alohida `GET /api/videos/:id` (obuna kerak).
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. URL'dagi `courseId` olinadi
 *       2. Shu kursga tegishli `isActive: true` videolar olinadi
 *       3. `order` bo'yicha tartiblanadi (0, 1, 2, ...)
 *       4. Videolar ro'yxati qaytariladi (telegram link YO'Q!)
 *
 *       ### 🎯 Maqsad / Назначение:
 *       - Kurs sahifasida video ro'yxatini ko'rsatish
 *       - Foydalanuvchi qancha video borligini biladi
 *       - Har bir videoning nomi va davomiyligini ko'radi
 *       - **Lekin** video ko'rish uchun obuna kerak!
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // src/pages/CoursePage.jsx
 *       const { courseId } = useParams();
 *
 *       useEffect(() => {
 *         const fetchVideos = async () => {
 *           const res = await fetch(
 *             `http://localhost:5000/api/videos/course/${courseId}`
 *           );
 *           const data = await res.json();
 *           setVideos(data.data.videos); // videolar ro'yxati
 *         };
 *         fetchVideos();
 *       }, [courseId]);
 *
 *       // Har bir video uchun:
 *       // video._id, video.title, video.duration, video.order
 *       ```
 *
 *       ### 📦 Mavjud kurs videolari misollari:
 *
 *       **React.js kursi videolari:**
 *       - 0: React nima? (15 daqiqa)
 *       - 1: JSX sintaksisi (20 daqiqa)
 *       - 2: useState Hook (25 daqiqa)
 *       - 3: useEffect Hook (30 daqiqa)
 *       - 4: Props va Component (20 daqiqa)
 *
 *       **JavaScript kursi videolari:**
 *       - 0: JS nima? (10 daqiqa)
 *       - 1: Variables va Types (25 daqiqa)
 *       - 2: Functions (30 daqiqa)
 *       - 3: Arrays va Objects (35 daqiqa)
 *       - 4: Async/Await (40 daqiqa)
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Возвращает список всех активных видео одного курса.
 *       **Открытый эндпоинт** — токен не нужен.
 *       Возвращает только названия и длительность — без ссылок на видео!
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Videolar ro'yxati qaytarildi | ✅ Список видео возвращён |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Videos]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           example: "65f100000000000000000005"
 *         description: "Kurs ID si / ID курса"
 *     responses:
 *       200:
 *         description: ✅ Videolar ro'yxati / ✅ Список видео
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     videos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/VideoShort'
 *                     count:
 *                       type: integer
 *                       example: 5
 *             example:
 *               success: true
 *               data:
 *                 count: 5
 *                 videos:
 *                   - _id: "65f200000000000000000001"
 *                     title: "1-dars: React nima va nima uchun kerak?"
 *                     description: "React haqida umumiy ma'lumot, Virtual DOM va komponent arxitekturasi tushunchasi."
 *                     order: 0
 *                     duration: 900
 *                     thumbnail: null
 *                   - _id: "65f200000000000000000002"
 *                     title: "2-dars: JSX sintaksisi va ifodalar"
 *                     description: "JSX nima, JavaScript ichida HTML yozish, shart va tsikllar JSX da."
 *                     order: 1
 *                     duration: 1200
 *                     thumbnail: null
 *                   - _id: "65f200000000000000000003"
 *                     title: "3-dars: useState bilan State boshqarish"
 *                     description: "State nima, useState hook qanday ishlaydi, re-render tushunchasi."
 *                     order: 2
 *                     duration: 1500
 *                     thumbnail: null
 *                   - _id: "65f200000000000000000004"
 *                     title: "4-dars: useEffect va Side Effects"
 *                     description: "useEffect hook, dependencies array, cleanup function va API call."
 *                     order: 3
 *                     duration: 1800
 *                     thumbnail: null
 *                   - _id: "65f200000000000000000005"
 *                     title: "5-dars: Props va Komponent aloqasi"
 *                     description: "Props qanday uzatiladi, children prop, prop types va default values."
 *                     order: 4
 *                     duration: 1200
 *                     thumbnail: null
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/course/:courseId', getCourseVideos);

// ════════════════════════════════════════════════════════════════
// GET /api/videos/:id
// ════════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: 🔒 Video ko'rish + Bir martalik Telegram link (Token + Obuna kerak!)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Video ma'lumotlarini va **bir martalik Telegram video linkini** qaytaradi.
 *       Bu eng muhim endpoint — videoni faqat shu orqali ko'rish mumkin.
 *
 *       ### 🛡️ Himoya qatlamlari (3 ta):
 *       1. **authenticate** — JWT token tekshiruvi (login qilganmi?)
 *       2. **checkSubscriptions** — Real-time obuna tekshiruvi:
 *          - Instagram kanalga obunami? ← Telegram Bot API tekshiradi
 *          - Telegram kanalga obunami? ← Telegram Bot API tekshiradi
 *       3. **getVideo** — Video mavjudmi, link yaratiladi
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. `Authorization: Bearer TOKEN` tekshiriladi
 *       2. **Real-time**: Telegram Bot API orqali foydalanuvchi obunasi tekshiriladi
 *       3. Agar obunasi yo'q → `403` xatosi qaytariladi (qaysi obuna yo'qligi ko'rsatiladi)
 *       4. Video database'dan topiladi
 *       5. **Bir martalik Telegram link** yaratiladi va qaytariladi
 *       6. Bu linkni foydalanuvchi bir marta ishlatib video ko'radi
 *
 *       ### ⚡ Bir martalik link nima?
 *       - Har safar `/api/videos/:id` chaqirilganda **yangi link** yaratiladi
 *       - Link Telegram'ning private kanalidan video url
 *       - Link `isUsed: false` holda qaytariladi
 *       - Foydalanuvchi linkni bosganda `/api/videos/link/:id/use` chaqiriladi
 *       - Link `isUsed: true` bo'ladi va qayta ishlatib bo'lmaydi
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // src/components/VideoPlayer.jsx
 *       const watchVideo = async (videoId) => {
 *         const token = localStorage.getItem('accessToken');
 *         const res = await fetch(`http://localhost:5000/api/videos/${videoId}`, {
 *           headers: { 'Authorization': `Bearer ${token}` }
 *         });
 *
 *         if (res.status === 403) {
 *           // Obuna yo'q — obuna sahifasiga yo'naltirish
 *           const err = await res.json();
 *           console.log('Kerak obunalar:', err.missingSubscriptions);
 *           navigate('/subscribe');
 *           return;
 *         }
 *
 *         const data = await res.json();
 *         const { video, videoLink } = data.data;
 *
 *         // Telegram linkni ochish
 *         window.open(videoLink.telegramLink, '_blank');
 *
 *         // Linkni "ishlatilgan" deb belgilash
 *         await markLinkAsUsed(videoLink._id);
 *       };
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Возвращает данные видео и **одноразовую ссылку на Telegram видео**.
 *
 *       ### 🛡️ Три уровня защиты:
 *       1. **authenticate** — проверка JWT токена
 *       2. **checkSubscriptions** — проверка подписок в реальном времени (Instagram + Telegram)
 *       3. **getVideo** — получение видео и создание одноразовой ссылки
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Video + bir martalik link qaytarildi | ✅ Видео + одноразовая ссылка |
 *       | 401 | ❌ Token berilmagan yoki noto'g'ri | ❌ Токен не указан или неверный |
 *       | 403 | ❌ Obuna yo'q (Instagram/Telegram) | ❌ Нет подписки (Instagram/Telegram) |
 *       | 404 | ❌ Video topilmadi | ❌ Видео не найдено |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "65f200000000000000000001"
 *         description: "Video ID si / ID видео"
 *     responses:
 *       200:
 *         description: ✅ Video va bir martalik link / ✅ Видео и одноразовая ссылка
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoResponse'
 *             example:
 *               success: true
 *               data:
 *                 video:
 *                   _id: "65f200000000000000000001"
 *                   title: "1-dars: React nima va nima uchun kerak?"
 *                   description: "React haqida umumiy ma'lumot, Virtual DOM va komponent arxitekturasi."
 *                   course: "65f100000000000000000005"
 *                   order: 0
 *                   duration: 900
 *                   isActive: true
 *                 videoLink:
 *                   _id: "65f300000000000000000001"
 *                   telegramLink: "https://t.me/c/1234567890/42"
 *                   isUsed: false
 *                   expiresAt: "2026-03-12T10:00:00.000Z"
 *       401:
 *         description: ❌ Token kerak / ❌ Требуется токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Access token is required."
 *       403:
 *         description: ❌ Obuna yo'q / ❌ Нет подписки
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 subscriptions:
 *                   $ref: '#/components/schemas/Subscriptions'
 *                 missingSubscriptions:
 *                   type: array
 *                   items:
 *                     type: string
 *             examples:
 *               telegram_yoq:
 *                 summary: Telegram obunasi yo'q / Нет подписки Telegram
 *                 value:
 *                   success: false
 *                   message: "Siz obuna bekor qildingiz. Video ko'ra olmaysiz."
 *                   subscriptions:
 *                     instagram:
 *                       subscribed: true
 *                       username: "ahmadjon_dev"
 *                     telegram:
 *                       subscribed: false
 *                       username: "ahmadjon_dev"
 *                   missingSubscriptions: ["telegram"]
 *               ikkalasi_yoq:
 *                 summary: Ikki obuna ham yo'q / Обе подписки отсутствуют
 *                 value:
 *                   success: false
 *                   message: "Video ko'rish uchun obuna bo'ling."
 *                   missingSubscriptions: ["instagram", "telegram"]
 *       404:
 *         description: ❌ Video topilmadi / ❌ Видео не найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Video not found."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authenticate, checkSubscriptions, getVideo);

// ════════════════════════════════════════════════════════════════
// POST /api/videos/link/:linkId/use
// ════════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/videos/link/{linkId}/use:
 *   post:
 *     summary: ✅ Video linkni ishlatilgan deb belgilash (Token kerak)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Bir martalik video linkni **"ishlatilgan"** deb belgilaydi (`isUsed: true`).
 *       Bu endpoint foydalanuvchi Telegram linkni bosgandan keyin chaqiriladi.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. Token tekshiriladi (authenticate)
 *       2. URL'dagi `linkId` bo'yicha VideoLink topiladi
 *       3. Link allaqachon ishlatilganmi? → 400
 *       4. Link muddati o'tganmi? → 400
 *       5. Real-time obuna tekshiruvi o'tkaziladi
 *       6. `isUsed: true` ga o'zgartiriladi
 *       7. Muvaffaqiyat qaytariladi
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // Foydalanuvchi Telegram linkni bosganda
 *       const markLinkAsUsed = async (linkId) => {
 *         const token = localStorage.getItem('accessToken');
 *         const res = await fetch(
 *           `http://localhost:5000/api/videos/link/${linkId}/use`,
 *           {
 *             method: 'POST',
 *             headers: { 'Authorization': `Bearer ${token}` }
 *           }
 *         );
 *         const data = await res.json();
 *         if (data.success) {
 *           console.log('Link ishlatildi, keyingi safar yangi link kerak');
 *         }
 *       };
 *       ```
 *
 *       ### 🔄 To'liq video ko'rish oqimi:
 *       ```
 *       1. GET /api/videos/:id → videoLink._id va telegramLink olinadi
 *       2. window.open(telegramLink)  → foydalanuvchi videoni ko'radi
 *       3. POST /api/videos/link/:linkId/use → link "ishlatilgan" belgilanadi
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Помечает одноразовую ссылку как **"использованную"** (`isUsed: true`).
 *       Вызывается после того, как пользователь нажал на ссылку Telegram.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Link ishlatilgan deb belgilandi | ✅ Ссылка помечена как использованная |
 *       | 400 | ❌ Link allaqachon ishlatilgan | ❌ Ссылка уже использована |
 *       | 400 | ❌ Link muddati o'tgan | ❌ Срок ссылки истёк |
 *       | 401 | ❌ Token kerak | ❌ Токен не указан |
 *       | 403 | ❌ Obuna yo'q | ❌ Нет подписки |
 *       | 404 | ❌ Link topilmadi | ❌ Ссылка не найдена |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: linkId
 *         required: true
 *         schema:
 *           type: string
 *           example: "65f300000000000000000001"
 *         description: "VideoLink ID si (GET /videos/:id dan olinadi) / ID VideoLink (получается из GET /videos/:id)"
 *     responses:
 *       200:
 *         description: ✅ Link ishlatildi / ✅ Ссылка использована
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Video link marked as used."
 *       400:
 *         description: ❌ Link allaqachon ishlatilgan / ❌ Ссылка уже использована
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               already_used:
 *                 summary: Allaqachon ishlatilgan / Уже использована
 *                 value:
 *                   success: false
 *                   message: "This video link has already been used."
 *               expired:
 *                 summary: Muddati o'tgan / Срок истёк
 *                 value:
 *                   success: false
 *                   message: "This video link has expired."
 *       401:
 *         description: ❌ Token kerak / ❌ Требуется токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: ❌ Obuna yo'q / ❌ Нет подписки
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: ❌ Link topilmadi / ❌ Ссылка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Video link not found."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/link/:linkId/use', authenticate, useVideoLink);

// ════════════════════════════════════════════════════════════════
// POST /api/videos  |  PUT /api/videos/:id  |  DELETE /api/videos/:id
// ════════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: 👑 Yangi video yaratish (Faqat Admin)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Kursga yangi video qo'shadi. **Faqat admin** foydalana oladi.
 *       Video yaratilgandan keyin admin Telegram kanalga video yuklab,
 *       VideoLink orqali havolasini qo'shishi kerak.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. Admin token va rol tekshiriladi
 *       2. `title` va `courseId` majburiy maydonlar tekshiriladi
 *       3. Kurs database'da mavjudmi tekshiriladi
 *       4. Video yaratiladi va kursga qo'shiladi
 *       5. Yaratilgan video qaytariladi
 *
 *       ### 📦 Mavjud kurslar ID lari (misollar):
 *       - HTML kursi: `65f100000000000000000001`
 *       - CSS kursi: `65f100000000000000000002`
 *       - JavaScript kursi: `65f100000000000000000003`
 *       - Tailwind kursi: `65f100000000000000000004`
 *       - React kursi: `65f100000000000000000005`
 *       - Redux kursi: `65f100000000000000000006`
 *
 *       ### 💻 Frontend (Admin panel) da ishlatish:
 *       ```javascript
 *       const createVideo = async ({ title, courseId, description, order, duration }) => {
 *         const token = localStorage.getItem('accessToken');
 *         const res = await fetch('http://localhost:5000/api/videos', {
 *           method: 'POST',
 *           headers: {
 *             'Content-Type': 'application/json',
 *             'Authorization': `Bearer ${token}`
 *           },
 *           body: JSON.stringify({
 *             title: '1-dars: React nima?',
 *             courseId: '65f100000000000000000005',
 *             description: 'React va Virtual DOM haqida.',
 *             order: 0,
 *             duration: 900  // 15 daqiqa = 900 soniya
 *           })
 *         });
 *         return await res.json();
 *       };
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Добавляет новое видео в курс. **Только для администратора**.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 201 | ✅ Video yaratildi | ✅ Видео создано |
 *       | 400 | ❌ title yoki courseId berilmagan | ❌ title или courseId не указан |
 *       | 401 | ❌ Token berilmagan | ❌ Токен не указан |
 *       | 403 | ❌ Admin huquqi yo'q | ❌ Нет прав администратора |
 *       | 404 | ❌ Kurs topilmadi | ❌ Курс не найден |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Admin Panel - Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "1-dars: React nima va nima uchun kerak?"
 *                 description: "Video nomi (majburiy) / Название видео (обязательно)"
 *               courseId:
 *                 type: string
 *                 example: "65f100000000000000000005"
 *                 description: "Kurs ID si (majburiy) / ID курса (обязательно)"
 *               description:
 *                 type: string
 *                 example: "React haqida umumiy ma'lumot, Virtual DOM va komponent arxitekturasi tushunchasi."
 *                 description: "Video tavsifi (ixtiyoriy) / Описание видео (необязательно)"
 *               order:
 *                 type: number
 *                 example: 0
 *                 description: "Video tartibi 0 dan boshlanadi (ixtiyoriy) / Порядок видео от 0 (необязательно)"
 *               duration:
 *                 type: number
 *                 example: 900
 *                 description: "Davomiylik soniyalarda: 900=15daq, 1200=20daq, 1800=30daq (ixtiyoriy) / Длительность в секундах (необязательно)"
 *               thumbnail:
 *                 type: string
 *                 example: "https://example.com/video-thumb.jpg"
 *                 description: "Video rasmi URL (ixtiyoriy) / URL превью (необязательно)"
 *           examples:
 *             react_dars1:
 *               summary: React kursi 1-dars
 *               value:
 *                 title: "1-dars: React nima va nima uchun kerak?"
 *                 courseId: "65f100000000000000000005"
 *                 description: "React haqida umumiy ma'lumot, Virtual DOM va komponent arxitekturasi tushunchasi."
 *                 order: 0
 *                 duration: 900
 *             js_dars1:
 *               summary: JavaScript kursi 1-dars
 *               value:
 *                 title: "1-dars: JavaScript nima?"
 *                 courseId: "65f100000000000000000003"
 *                 description: "JavaScript tarixi, nima uchun muhim va qayerlarda ishlatiladi."
 *                 order: 0
 *                 duration: 600
 *             redux_dars3:
 *               summary: Redux kursi 3-dars
 *               value:
 *                 title: "3-dars: createSlice va Reducerlar"
 *                 courseId: "65f100000000000000000006"
 *                 description: "Redux Toolkit da createSlice ishlatish, actions va reducerlar."
 *                 order: 2
 *                 duration: 2400
 *     responses:
 *       201:
 *         description: ✅ Video yaratildi / ✅ Видео создано
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Video created successfully."
 *               data:
 *                 video:
 *                   _id: "65f200000000000000000001"
 *                   title: "1-dars: React nima va nima uchun kerak?"
 *                   description: "React haqida umumiy ma'lumot..."
 *                   course: "65f100000000000000000005"
 *                   order: 0
 *                   duration: 900
 *                   isActive: true
 *                   createdAt: "2026-03-11T10:00:00.000Z"
 *       400:
 *         description: ❌ Xato ma'lumotlar / ❌ Неверные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Please provide title and courseId."
 *       401:
 *         description: ❌ Token kerak / ❌ Требуется токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: ❌ Admin huquqi kerak / ❌ Требуются права администратора
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: ❌ Kurs topilmadi / ❌ Курс не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticate, requireAdmin, createVideo);

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: ✏️ Videoni yangilash (Faqat Admin)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Mavjud videoning ma'lumotlarini yangilaydi. **Faqat admin**.
 *       Faqat yuborilgan maydonlar yangilanadi.
 *
 *       ### 💡 isActive — Videoni yashirish:
 *       `isActive: false` qilib videoni vaqtincha yashirish mumkin.
 *       Foydalanuvchilar uni ko'ra olmaydi, lekin database'da saqlanib turadi.
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Обновляет данные существующего видео. **Только для администратора**.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Video yangilandi | ✅ Видео обновлено |
 *       | 401 | ❌ Token kerak | ❌ Токен не указан |
 *       | 403 | ❌ Admin huquqi yo'q | ❌ Нет прав администратора |
 *       | 404 | ❌ Video topilmadi | ❌ Видео не найдено |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Admin Panel - Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "65f200000000000000000001"
 *         description: "Video ID si / ID видео"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "1-dars: React 19 nima?"
 *                 description: "Yangi nom / Новое название"
 *               description:
 *                 type: string
 *                 example: "React 19 yangi features bilan yangilangan dars."
 *                 description: "Yangi tavsif / Новое описание"
 *               order:
 *                 type: number
 *                 example: 0
 *                 description: "Yangi tartib / Новый порядок"
 *               duration:
 *                 type: number
 *                 example: 1050
 *                 description: "Yangi davomiylik soniyalarda / Новая длительность в секундах"
 *               thumbnail:
 *                 type: string
 *                 example: "https://example.com/new-thumb.jpg"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: "true = ko'rsatish, false = yashirish / true = показать, false = скрыть"
 *           examples:
 *             yashirish:
 *               summary: Videoni vaqtincha yashirish / Временно скрыть
 *               value:
 *                 isActive: false
 *             nom_yangilash:
 *               summary: Faqat nomni yangilash / Только обновить название
 *               value:
 *                 title: "1-dars: React 19 nima va nima uchun kerak?"
 *             toliq_yangilash:
 *               summary: To'liq yangilash / Полное обновление
 *               value:
 *                 title: "1-dars: React 19 nima?"
 *                 description: "React 19 bilan yangilangan dars."
 *                 duration: 1050
 *                 isActive: true
 *     responses:
 *       200:
 *         description: ✅ Video yangilandi / ✅ Видео обновлено
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Video updated successfully."
 *               data:
 *                 video:
 *                   _id: "65f200000000000000000001"
 *                   title: "1-dars: React 19 nima?"
 *                   isActive: true
 *       401:
 *         description: ❌ Token kerak / ❌ Требуется токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: ❌ Admin huquqi kerak / ❌ Требуются права администратора
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: ❌ Video topilmadi / ❌ Видео не найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Video not found."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: 🗑️ Videoni o'chirish (Faqat Admin)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Videoni database'dan butunlay o'chiradi. **Bu amalni qaytarib bo'lmaydi!**
 *       Video bilan bog'liq barcha VideoLink yozuvlari ham o'chiriladi.
 *
 *       ### ⚠️ DIQQAT!
 *       O'chirish o'rniga `PUT` orqali `isActive: false` qilish tavsiya qilinadi.
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Полностью удаляет видео из базы данных. **Действие необратимо!**
 *       Все VideoLink записи для этого видео также удаляются.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Video o'chirildi | ✅ Видео удалено |
 *       | 401 | ❌ Token kerak | ❌ Токен не указан |
 *       | 403 | ❌ Admin huquqi yo'q | ❌ Нет прав администратора |
 *       | 404 | ❌ Video topilmadi | ❌ Видео не найдено |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Admin Panel - Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "65f200000000000000000001"
 *         description: "O'chiriladigan video ID si / ID удаляемого видео"
 *     responses:
 *       200:
 *         description: ✅ Video o'chirildi / ✅ Видео удалено
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Video deleted successfully."
 *       401:
 *         description: ❌ Token kerak / ❌ Требуется токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: ❌ Admin huquqi kerak / ❌ Требуются права администратора
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: ❌ Video topilmadi / ❌ Видео не найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Video not found."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticate, requireAdmin, updateVideo);
router.delete('/:id', authenticate, requireAdmin, deleteVideo);

/**
 * @swagger
 * /api/videos/{id}/questions:
 *   get:
 *     summary: ❓ Video savol-javoblari ro'yxati
 *     tags: [Videos]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Savollar ro'yxati
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 total: 5
 *                 page: 1
 *                 pages: 1
 *                 questions:
 *                   - _id: "q1"
 *                     question: "useState bilan useReducer farqi nima?"
 *                     answer: "useState oddiy holatlar uchun, useReducer murakkab holatlar uchun."
 *                     isAnswered: true
 *                     userId:
 *                       username: "ahmadjon"
 *                     answeredBy:
 *                       username: "admin"
 *   post:
 *     summary: ❓ Videoga savol berish
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [question]
 *             properties:
 *               question:
 *                 type: string
 *                 example: "useState bilan useReducer farqi nima?"
 *     responses:
 *       201:
 *         description: Savol yuborildi
 */
router.get('/:id/questions', getVideoQuestions);
router.post('/:id/questions', authenticate, askQuestion);

/**
 * @swagger
 * /api/videos/{id}/questions/{questionId}/answer:
 *   post:
 *     summary: ✅ Savolga javob berish (Admin)
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [answer]
 *             properties:
 *               answer:
 *                 type: string
 *                 example: "useState oddiy, useReducer murakkab holatlar uchun."
 *     responses:
 *       200:
 *         description: Javob saqlandi
 */
router.post('/:id/questions/:questionId/answer', authenticate, requireAdmin, answerQuestion);

module.exports = router;
