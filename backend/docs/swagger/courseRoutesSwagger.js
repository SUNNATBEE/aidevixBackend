// Auto-extracted swagger docs from courseRoutes.js
// Edit here to update API docs

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: 📚 Barcha kurslar ro'yxati (Ochiq — token shart emas)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Platformadagi barcha faol kurslarni qaytaradi.
 *       Bu endpoint **ochiq** — hech qanday token kerak emas.
 *       Sayt landing page'ida, katalog sahifasida ishlatiladi.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. GET so'rov yuboriladi (token shart emas)
 *       2. Database'dan `isActive: true` bo'lgan kurslar olinadi
 *       3. Eng yangi kurslar avval keladi (`createdAt: -1` tartibi)
 *       4. Har bir kursda instructor va video ma'lumotlari to'ldirilgan
 *
 *       ### 📦 Mavjud kurslar (hozirda):
 *       | # | Kurs | Kategoriya | Narxi |
 *       |---|------|-----------|-------|
 *       | 1 | HTML Asoslari | html | 99,000 so'm |
 *       | 2 | CSS Stillar va Dizayn | css | 129,000 so'm |
 *       | 3 | JavaScript Dasturlash | javascript | 299,000 so'm |
 *       | 4 | TypeScript Asoslari | typescript | 249,000 so'm |
 *       | 5 | React.js Frontend | react | 349,000 so'm |
 *       | 6 | Node.js Backend | nodejs | 299,000 so'm |
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // src/api/courseApi.js
 *       export const getAllCourses = async () => {
 *         const res = await fetch('http://localhost:5000/api/courses');
 *         const data = await res.json();
 *         return data.data.courses; // kurslar massivi
 *       };
 *
 *       // React komponentda:
 *       useEffect(() => {
 *         getAllCourses().then(courses => {
 *           dispatch(setCourses(courses)); // Redux slice ga
 *         });
 *       }, []);
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Возвращает все активные курсы платформы.
 *       Эндпоинт **открытый** — токен не нужен.
 *       Используется на лендинге и странице каталога.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Kurslar ro'yxati qaytarildi | ✅ Список курсов возвращён |
 *       | 500 | ❌ Server xatosi (database bilan muammo) | ❌ Ошибка сервера (проблема с БД) |
 *     tags: [Courses]
 *     security: []
 *     responses:
 *       200:
 *         description: ✅ Kurslar muvaffaqiyatli olinди / ✅ Курсы успешно получены
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
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CourseShort'
 *                     count:
 *                       type: integer
 *                       example: 6
 *                       description: "Jami kurslar soni / Всего курсов"
 *             example:
 *               success: true
 *               data:
 *                 count: 6
 *                 courses:
 *                   - _id: "65f100000000000000000001"
 *                     title: "HTML Asoslari"
 *                     description: "HTML teglar, atributlar, formalar va zamonaviy HTML5 elementlarini o'rganasiz. Veb-sahifalarning asosiy tili."
 *                     thumbnail: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg"
 *                     price: 99000
 *                     category: "html"
 *                     instructor:
 *                       username: "aidevix_admin"
 *                       email: "admin@aidevix.com"
 *                     videos: []
 *                   - _id: "65f100000000000000000002"
 *                     title: "CSS Stillar va Dizayn"
 *                     description: "CSS selektorlar, Flexbox, Grid, animatsiyalar va responsive dizayn. Chiroyli sahifalar yaratishni o'rganasiz."
 *                     thumbnail: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg"
 *                     price: 129000
 *                     category: "css"
 *                     instructor:
 *                       username: "aidevix_admin"
 *                       email: "admin@aidevix.com"
 *                     videos: []
 *                   - _id: "65f100000000000000000003"
 *                     title: "JavaScript Dasturlash"
 *                     description: "JavaScript asoslari, ES6+, asinxron dasturlash (async/await), DOM boshqaruvi va zamonaviy JS patterns."
 *                     thumbnail: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
 *                     price: 299000
 *                     category: "javascript"
 *                     instructor:
 *                       username: "aidevix_admin"
 *                       email: "admin@aidevix.com"
 *                     videos: []
 *                   - _id: "65f100000000000000000004"
 *                     title: "TypeScript Asoslari"
 *                     description: "TypeScript turlari, interfeyslari, generics va zamonaviy TS patterns. Type-safe dasturlash."
 *                     thumbnail: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg"
 *                     price: 249000
 *                     category: "typescript"
 *                     instructor:
 *                       username: "aidevix_admin"
 *                       email: "admin@aidevix.com"
 *                       jobTitle: "Senior Developer"
 *                       position: "Tech Lead @ Aidevix"
 *                     videos: []
 *                   - _id: "65f100000000000000000005"
 *                     title: "React.js Frontend Development"
 *                     description: "React hooks, komponentlar, state management, React Router, API integratsiya va production-ready ilovalar."
 *                     thumbnail: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
 *                     price: 349000
 *                     category: "react"
 *                     instructor:
 *                       username: "aidevix_admin"
 *                       email: "admin@aidevix.com"
 *                       jobTitle: "Frontend Developer"
 *                       position: "Senior React Dev @ Aidevix"
 *                     videos: []
 *                   - _id: "65f100000000000000000006"
 *                     title: "Node.js Backend Development"
 *                     description: "Node.js, Express, REST API, MongoDB, JWT auth va production-ready backend ilovalar yaratish."
 *                     thumbnail: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg"
 *                     price: 299000
 *                     category: "nodejs"
 *                     instructor:
 *                       username: "aidevix_admin"
 *                       email: "admin@aidevix.com"
 *                       jobTitle: "Backend Developer"
 *                       position: "Node.js Expert @ Aidevix"
 *                     videos: []
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Error fetching courses."
 *
 *   post:
 *     summary: 👑 Yangi kurs yaratish (Faqat Admin)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Platformaga yangi kurs qo'shadi. **Faqat admin** foydalana oladi.
 *       Instructor avtomatik ravishda so'rov yuborgan admin bo'ladi.
 *
 *       ### 🔐 Qanday kirish huquqi kerak?
 *       - Admin sifatida **login** qiling
 *       - `accessToken` ni **Authorize** qismiga kiriting
 *       - So'rov yuborish mumkin
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. Admin token tekshiriladi (`authenticate` middleware)
 *       2. Rol tekshiriladi (`requireAdmin` middleware — `role === 'admin'`)
 *       3. `title`, `description`, `price` majburiy maydonlar tekshiriladi
 *       4. Kurs database'ga saqlanadi
 *       5. Yaratilgan kurs qaytariladi
 *
 *       ### 📦 Kurs kategoriyalari / Категории курсов:
 *       `html` | `css` | `javascript` | `react` | `typescript` | `nodejs` | `general`
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       const createCourse = async (courseData) => {
 *         const token = localStorage.getItem('accessToken');
 *         const res = await fetch('http://localhost:5000/api/courses', {
 *           method: 'POST',
 *           headers: {
 *             'Content-Type': 'application/json',
 *             'Authorization': `Bearer ${token}`
 *           },
 *           body: JSON.stringify({
 *             title: 'React.js Frontend Development',
 *             description: 'React hooks, komponentlar, state management...',
 *             price: 349000,
 *             category: 'react',
 *             thumbnail: 'https://example.com/react.svg'
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
 *       Добавляет новый курс на платформу. **Только для администратора**.
 *       Инструктором автоматически становится отправляющий запрос администратор.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 201 | ✅ Kurs muvaffaqiyatli yaratildi | ✅ Курс успешно создан |
 *       | 400 | ❌ Majburiy maydonlar (title/description/price) berilmagan | ❌ Не указаны обязательные поля |
 *       | 401 | ❌ Token berilmagan yoki noto'g'ri | ❌ Токен не указан или неверный |
 *       | 403 | ❌ Foydalanuvchi admin emas | ❌ Пользователь не является администратором |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Admin Panel - Courses]
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
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: "React.js Frontend Development"
 *                 description: "Kurs nomi (majburiy) / Название курса (обязательно)"
 *               description:
 *                 type: string
 *                 example: "React hooks, komponentlar, state management, React Router va production ilovalar yaratish."
 *                 description: "Kurs tavsifi (majburiy) / Описание курса (обязательно)"
 *               price:
 *                 type: number
 *                 example: 349000
 *                 description: "Narx so'mda (majburiy, 0 dan katta) / Цена в сумах (обязательно, больше 0)"
 *               thumbnail:
 *                 type: string
 *                 example: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
 *                 description: "Kurs rasmi URL (ixtiyoriy) / URL изображения (необязательно)"
 *               category:
 *                 type: string
 *                 enum: [html, css, javascript, react, typescript, nodejs, general]
 *                 example: "react"
 *                 description: "Kategoriya (ixtiyoriy, default: general) / Категория (необязательно)"
 *           examples:
 *             html_course:
 *               summary: HTML kursi
 *               value:
 *                 title: "HTML Asoslari"
 *                 description: "HTML teglar, atributlar, formalar va zamonaviy HTML5 elementlarini o'rganasiz. Veb-sahifalarning asosiy tili. Semantic HTML, tables, forms, multimedia elementlar."
 *                 price: 99000
 *                 category: "html"
 *                 thumbnail: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg"
 *             css_course:
 *               summary: CSS kursi
 *               value:
 *                 title: "CSS Stillar va Dizayn"
 *                 description: "CSS selektorlar, Flexbox, Grid, animatsiyalar va responsive dizayn. Chiroyli va zamonaviy sahifalar yaratishni o'rganasiz."
 *                 price: 129000
 *                 category: "css"
 *                 thumbnail: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg"
 *             javascript_course:
 *               summary: JavaScript kursi
 *               value:
 *                 title: "JavaScript Dasturlash"
 *                 description: "JavaScript asoslari, ES6+, asinxron dasturlash (async/await, Promises), DOM boshqaruvi, OOP va zamonaviy JS patterns."
 *                 price: 299000
 *                 category: "javascript"
 *                 thumbnail: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
 *             typescript_course:
 *               summary: TypeScript kursi
 *               value:
 *                 title: "TypeScript Asoslari"
 *                 description: "TypeScript turlari, interfeyslari, generics va zamonaviy TS patterns. Type-safe dasturlashni o'rganasiz."
 *                 price: 249000
 *                 category: "typescript"
 *                 thumbnail: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg"
 *             react_course:
 *               summary: React.js kursi
 *               value:
 *                 title: "React.js Frontend Development"
 *                 description: "React hooks (useState, useEffect, useContext, useMemo), komponentlar, React Router v6, API integratsiya va production-ready ilovalar yaratish."
 *                 price: 349000
 *                 category: "react"
 *                 thumbnail: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
 *             nodejs_course:
 *               summary: Node.js kursi
 *               value:
 *                 title: "Node.js Backend Development"
 *                 description: "Node.js, Express, REST API, MongoDB, JWT auth va production-ready backend ilovalar yaratish."
 *                 price: 299000
 *                 category: "nodejs"
 *                 thumbnail: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg"
 *     responses:
 *       201:
 *         description: ✅ Kurs yaratildi / ✅ Курс создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Course created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *             example:
 *               success: true
 *               message: "Course created successfully."
 *               data:
 *                 course:
 *                   _id: "65f100000000000000000005"
 *                   title: "React.js Frontend Development"
 *                   description: "React hooks, komponentlar, state management..."
 *                   price: 349000
 *                   category: "react"
 *                   thumbnail: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
 *                   instructor: "65f1a2b3c4d5e6f7a8b9c0d0"
 *                   videos: []
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
 *               message: "Please provide title, description, and price."
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
 *         description: ❌ Admin huquqi kerak / ❌ Требуются права администратора
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Admin access required."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: 📖 Bitta kurs to'liq ma'lumoti (Ochiq)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Bitta kursning barcha ma'lumotlarini qaytaradi — title, description, price,
 *       instructor, videolar ro'yxati. Token kerak emas.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. URL'dagi `:id` (MongoDB ObjectId) olinadi
 *       2. Database'dan kurs qidiriladi
 *       3. `isActive: false` bo'lsa — 404 qaytariladi
 *       4. Instructor va videolar to'ldiriladi (populate)
 *       5. To'liq kurs ma'lumoti qaytariladi
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // src/pages/CoursePage.jsx
 *       const { id } = useParams(); // React Router dan
 *       const res = await fetch(`http://localhost:5000/api/courses/${id}`);
 *       const data = await res.json();
 *       // data.data.course — kurs ma'lumotlari
 *       // data.data.course.videos — kurs videolari (qisqa)
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Возвращает все данные одного курса — название, описание, цена,
 *       инструктор, список видео. Токен не нужен.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Kurs topildi va qaytarildi | ✅ Курс найден и возвращён |
 *       | 404 | ❌ Kurs topilmadi yoki faol emas | ❌ Курс не найден или неактивен |
 *       | 500 | ❌ Server xatosi (noto'g'ri ID format) | ❌ Ошибка сервера (неверный формат ID) |
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "65f100000000000000000005"
 *         description: "Kurs MongoDB ID si / MongoDB ID курса"
 *     responses:
 *       200:
 *         description: ✅ Kurs topildi / ✅ Курс найден
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
 *                     course:
 *                       $ref: '#/components/schemas/Course'
 *             example:
 *               success: true
 *               data:
 *                 course:
 *                   _id: "65f100000000000000000005"
 *                   title: "React.js Frontend Development"
 *                   description: "React hooks, komponentlar, state management, React Router v6, API integratsiya va production-ready ilovalar yaratish."
 *                   thumbnail: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
 *                   price: 349000
 *                   category: "react"
 *                   instructor:
 *                     _id: "65f1a2b3c4d5e6f7a8b9c0d0"
 *                     username: "aidevix_admin"
 *                     email: "admin@aidevix.com"
 *                   videos:
 *                     - _id: "65f200000000000000000001"
 *                       title: "1-dars: React nima?"
 *                       description: "React haqida umumiy ma'lumot, Virtual DOM va komponent tushunchasi."
 *                       order: 0
 *                       duration: 900
 *                       thumbnail: null
 *                     - _id: "65f200000000000000000002"
 *                       title: "2-dars: JSX sintaksisi"
 *                       description: "JSX nima, JavaScript ichida HTML yozish, ifodalar va shartlar."
 *                       order: 1
 *                       duration: 1200
 *                       thumbnail: null
 *                     - _id: "65f200000000000000000003"
 *                       title: "3-dars: useState Hook"
 *                       description: "State nima, useState bilan ishlash, re-render tushunchasi."
 *                       order: 2
 *                       duration: 1500
 *                       thumbnail: null
 *                   isActive: true
 *                   createdAt: "2026-01-01T00:00:00.000Z"
 *       404:
 *         description: ❌ Kurs topilmadi / ❌ Курс не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Course not found."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   put:
 *     summary: ✏️ Kursni yangilash (Faqat Admin)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Mavjud kursning ma'lumotlarini yangilaydi. **Faqat admin** foydalana oladi.
 *       Faqat yuborilgan maydonlar yangilanadi — boshqalari o'zgarishsiz qoladi.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. URL'dagi kurs ID olinydi
 *       2. Token va rol tekshiriladi (admin bo'lishi kerak)
 *       3. Database'dan kurs topiladi
 *       4. Yuborilgan maydonlar yangilanadi (partial update)
 *       5. Yangilangan kurs qaytariladi
 *
 *       ### 💡 isActive — Kursni yashirish:
 *       ```javascript
 *       // Kursni o'chirish o'rniga yashirish (tavsiya):
 *       await fetch(`http://localhost:5000/api/courses/${courseId}`, {
 *         method: 'PUT',
 *         headers: {
 *           'Content-Type': 'application/json',
 *           'Authorization': `Bearer ${token}`
 *         },
 *         body: JSON.stringify({ isActive: false }) // Yashirildi!
 *       });
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Обновляет данные существующего курса. **Только для администратора**.
 *       Обновляются только отправленные поля — остальные не меняются.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Kurs yangilandi | ✅ Курс обновлён |
 *       | 401 | ❌ Token berilmagan | ❌ Токен не указан |
 *       | 403 | ❌ Admin huquqi yo'q | ❌ Нет прав администратора |
 *       | 404 | ❌ Kurs topilmadi | ❌ Курс не найден |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Admin Panel - Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "65f100000000000000000005"
 *         description: "Yangilanadigan kurs ID si / ID обновляемого курса"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "React.js — To'liq Kurs 2026"
 *                 description: "Yangi kurs nomi / Новое название"
 *               description:
 *                 type: string
 *                 example: "React 19 yangilangan kurs. Hooks, Server Components va boshqalar."
 *                 description: "Yangi tavsif / Новое описание"
 *               price:
 *                 type: number
 *                 example: 399000
 *                 description: "Yangi narx / Новая цена"
 *               thumbnail:
 *                 type: string
 *                 example: "https://example.com/new-react.svg"
 *                 description: "Yangi rasm URL / Новый URL изображения"
 *               category:
 *                 type: string
 *                 enum: [html, css, javascript, react, typescript, nodejs, general]
 *                 example: "react"
 *                 description: "Yangi kategoriya / Новая категория"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: "true = ko'rsatish, false = yashirish / true = показать, false = скрыть"
 *           examples:
 *             narx_yangilash:
 *               summary: Faqat narxni yangilash / Только обновить цену
 *               value:
 *                 price: 399000
 *             yashirish:
 *               summary: Kursni vaqtincha yashirish / Временно скрыть курс
 *               value:
 *                 isActive: false
 *             toliq_yangilash:
 *               summary: To'liq yangilash / Полное обновление
 *               value:
 *                 title: "React.js — To'liq Kurs 2026"
 *                 description: "React 19 va yangi features bilan yangilangan kurs."
 *                 price: 399000
 *                 category: "react"
 *                 isActive: true
 *     responses:
 *       200:
 *         description: ✅ Kurs yangilandi / ✅ Курс обновлён
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Course updated successfully."
 *               data:
 *                 course:
 *                   _id: "65f100000000000000000005"
 *                   title: "React.js — To'liq Kurs 2026"
 *                   price: 399000
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
 *         description: ❌ Kurs topilmadi / ❌ Курс не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Course not found."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: 🗑️ Kursni o'chirish (Faqat Admin)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Kursni database'dan butunlay o'chiradi. **Bu amalni qaytarib bo'lmaydi!**
 *       O'chirish o'rniga `isActive: false` (PUT endpoint) ishlatish tavsiya qilinadi.
 *
 *       ### ⚠️ DIQQAT / ВНИМАНИЕ:
 *       - Kurs o'chirilgandan keyin **qayta tiklab bo'lmaydi**
 *       - Kurs bilan bog'liq videolar ham o'chirilishi mumkin
 *       - Foydalanuvchilar bu kursga kirish huquqini yo'qotadi
 *
 *       ### 💡 Maslahat / Совет:
 *       ```javascript
 *       // O'chirish o'rniga yashirish (xavfsizroq):
 *       PUT /api/courses/:id  →  { isActive: false }
 *
 *       // Faqat kerak bo'lsa o'chirish:
 *       DELETE /api/courses/:id
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Полностью удаляет курс из базы данных. **Это действие необратимо!**
 *       Рекомендуется использовать `isActive: false` вместо удаления.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Kurs o'chirildi | ✅ Курс удалён |
 *       | 401 | ❌ Token berilmagan | ❌ Токен не указан |
 *       | 403 | ❌ Admin huquqi yo'q | ❌ Нет прав администратора |
 *       | 404 | ❌ Kurs topilmadi | ❌ Курс не найден |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Admin Panel - Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "65f100000000000000000005"
 *         description: "O'chiriladigan kurs ID si / ID удаляемого курса"
 *     responses:
 *       200:
 *         description: ✅ Kurs o'chirildi / ✅ Курс удалён
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Course deleted successfully."
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
 *             example:
 *               success: false
 *               message: "Course not found."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/courses/{id}/recommended:
 *   get:
 *     summary: 🎯 Tavsiya etilgan kurslar (Doniyor uchun)
 *     description: |
 *       Berilgan kurs bilan bir xil kategoriyadan, eng yuqori reytingli kurslarni qaytaradi.
 *       **Frontend'da ishlatish:** `CourseDetailPage.jsx` dagi "Tavsiya etilgan kurslar" bo'limida.
 *
 *       ```javascript
 *       const { data } = await courseApi.getRecommendedCourses(courseId, { limit: 4 })
 *       // data.courses — tavsiya etilgan kurslar
 *       ```
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asosiy kurs ID si
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Nechta tavsiya qaytarish (default 4)
 *     responses:
 *       200:
 *         description: Tavsiya etilgan kurslar ro'yxati
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 courses:
 *                   - _id: "65f100000000000000000002"
 *                     title: "React Advanced Patterns"
 *                     category: "react"
 *                     rating: 4.9
 *                     price: 349000
 *                     instructor:
 *                       username: "aidevix_admin"
 *                       jobTitle: "Senior Frontend Developer"
 *                       position: "Tech Lead @ Epam"
 *       404:
 *         description: Kurs topilmadi
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Kurs topilmadi"
 */

/**
 * @swagger
 * /api/courses/{id}/rate:
 *   post:
 *     summary: ⭐ Kursni baholash (1-5 yulduz)
 *     description: |
 *       Foydalanuvchi kursni 1 dan 5 gacha baholaydi. Har bir foydalanuvchi
 *       bitta kursni faqat bir marta baholay oladi (keyingi baholash yangilaydi).
 *       Kurs reytingi avtomatik qayta hisoblanadi.
 *     tags: [Courses]
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
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               review:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Juda yaxshi kurs, ko'p narsani o'rgandim!"
 *     responses:
 *       200:
 *         description: Baholash saqlandi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Baholash saqlandi"
 *               data:
 *                 rating: 4.7
 *                 ratingCount: 128
 *       400:
 *         description: Noto'g'ri reyting qiymati
 *       404:
 *         description: Kurs topilmadi
 */
