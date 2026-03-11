const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// ════════════════════════════════════════════════════════════════
// POST /api/auth/register
// ════════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 📝 Yangi foydalanuvchi ro'yxatdan o'tkazish
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Bu endpoint yangi foydalanuvchini tizimga ro'yxatdan o'tkazadi.
 *       Muvaffaqiyatli bo'lsa — **accessToken** (15 daqiqa) va **refreshToken** (7 kun) qaytariladi.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. Foydalanuvchi `username`, `email`, `password` yuboradi
 *       2. Server emailni tekshiradi (allaqachon ro'yxatdan o'tganmi?)
 *       3. Parol hash qilinadi (MD5/bcrypt — oddiy matn saqlanmaydi)
 *       4. Ma'lumotlar bazasiga saqlanadi
 *       5. **accessToken** + **refreshToken** yaratiladi va qaytariladi
 *
 *       ### 💻 Frontend (React) da qanday ishlatish:
 *       ```javascript
 *       // src/api/authApi.js
 *       const response = await fetch('http://localhost:5000/api/auth/register', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({
 *           username: 'ahmadjon',
 *           email: 'ahmadjon@gmail.com',
 *           password: 'secret123'
 *         })
 *       });
 *       const data = await response.json();
 *       localStorage.setItem('accessToken', data.data.accessToken);
 *       localStorage.setItem('refreshToken', data.data.refreshToken);
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Эндпоинт регистрирует нового пользователя в системе.
 *       При успехе возвращает **accessToken** (15 мин) и **refreshToken** (7 дней).
 *
 *       ### 📋 Как работает?
 *       1. Пользователь отправляет `username`, `email`, `password`
 *       2. Сервер проверяет email (не зарегистрирован ли уже?)
 *       3. Пароль хешируется (bcrypt — текст не хранится)
 *       4. Данные сохраняются в базе данных
 *       5. Создаются и возвращаются **accessToken** + **refreshToken**
 *
 *       ### 💻 Использование во Frontend (React):
 *       ```javascript
 *       // src/api/authApi.js
 *       const response = await fetch('https://aidevixbackend.onrender.com/api/auth/register', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({
 *           username: 'ahmadjon',
 *           email: 'ahmadjon@gmail.com',
 *           password: 'secret123'
 *         })
 *       });
 *       const data = await response.json();
 *       // Tokenlarni localStorage ga saqlang
 *       localStorage.setItem('accessToken', data.data.accessToken);
 *       ```
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 201 | ✅ Muvaffaqiyatli ro'yxatdan o'tildi | ✅ Успешная регистрация |
 *       | 400 | ❌ Username/email/password berilmagan | ❌ Не указано имя/email/пароль |
 *       | 400 | ❌ Email allaqachon ro'yxatdan o'tgan | ❌ Email уже зарегистрирован |
 *       | 400 | ❌ Parol 6 belgidan kam | ❌ Пароль меньше 6 символов |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: ahmadjondev
 *                 description: "Foydalanuvchi nomi (3-30 belgi) / Имя пользователя (3-30 символов)"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmadjon@gmail.com
 *                 description: "Email manzil (to'g'ri format bo'lishi kerak) / Email адрес (правильный формат)"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: secret123
 *                 description: "Parol (kamida 6 belgi) / Пароль (минимум 6 символов)"
 *           examples:
 *             oddiy_foydalanuvchi:
 *               summary: Oddiy foydalanuvchi / Обычный пользователь
 *               value:
 *                 username: ahmadjondev
 *                 email: ahmadjon@gmail.com
 *                 password: secret123
 *             developer:
 *               summary: Developer
 *               value:
 *                 username: sardor_programmer
 *                 email: sardor@aidevix.com
 *                 password: strongPass456
 *     responses:
 *       201:
 *         description: ✅ Muvaffaqiyatli ro'yxatdan o'tildi / ✅ Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "User registered successfully."
 *               data:
 *                 user:
 *                   _id: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                   username: "ahmadjondev"
 *                   email: "ahmadjon@gmail.com"
 *                   role: "user"
 *                   isActive: true
 *                   subscriptions:
 *                     instagram:
 *                       subscribed: false
 *                       username: null
 *                     telegram:
 *                       subscribed: false
 *                       username: null
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: ❌ Xato ma'lumotlar / ❌ Неверные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               email_exists:
 *                 summary: Email allaqachon mavjud / Email уже существует
 *                 value:
 *                   success: false
 *                   message: "User with this email already exists."
 *               missing_fields:
 *                 summary: Maydonlar to'ldirilmagan / Поля не заполнены
 *                 value:
 *                   success: false
 *                   message: "Please provide username, email, and password."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', register);

// ════════════════════════════════════════════════════════════════
// POST /api/auth/login
// ════════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 🔑 Tizimga kirish (Login)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Mavjud foydalanuvchi tizimga kiradi. Email va parol tekshiriladi.
 *       Muvaffaqiyatli bo'lsa — **accessToken** va **refreshToken** qaytariladi.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. Email va parol yuboriladi
 *       2. Server emailni bazadan qidiradi
 *       3. Parol hash bilan taqqoslanadi
 *       4. Hisob faolmi tekshiriladi (`isActive: true`)
 *       5. Token yaratiladi va qaytariladi
 *
 *       ### ⚡ Muhim tokenlar haqida:
 *       - **accessToken** — 15 daqiqa, har bir so'rovda `Authorization` headerda yuboriladi
 *       - **refreshToken** — 7 kun, faqat accessToken yangilash uchun
 *       - Tokenlar `localStorage` yoki `httpOnly cookie` da saqlanishi kerak
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // 1. Login qilish
 *       const login = async (email, password) => {
 *         const res = await fetch('http://localhost:5000/api/auth/login', {
 *           method: 'POST',
 *           headers: { 'Content-Type': 'application/json' },
 *           body: JSON.stringify({ email, password })
 *         });
 *         const data = await res.json();
 *
 *         if (data.success) {
 *           localStorage.setItem('accessToken', data.data.accessToken);
 *           localStorage.setItem('refreshToken', data.data.refreshToken);
 *         }
 *       };
 *
 *       // 2. Token bilan so'rov yuborish
 *       const token = localStorage.getItem('accessToken');
 *       const res = await fetch('http://localhost:5000/api/auth/me', {
 *         headers: { 'Authorization': `Bearer ${token}` }
 *       });
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Существующий пользователь входит в систему. Email и пароль проверяются.
 *       При успехе возвращаются **accessToken** и **refreshToken**.
 *
 *       ### ⚡ Важно о токенах:
 *       - **accessToken** — 15 минут, отправляется в заголовке `Authorization` каждого запроса
 *       - **refreshToken** — 7 дней, только для обновления accessToken
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Muvaffaqiyatli kirish | ✅ Успешный вход |
 *       | 400 | ❌ Email yoki parol berilmagan | ❌ Email или пароль не указан |
 *       | 401 | ❌ Noto'g'ri email yoki parol | ❌ Неверный email или пароль |
 *       | 403 | ❌ Hisob faol emas (ban qilingan) | ❌ Аккаунт деактивирован |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmadjon@gmail.com
 *                 description: "Ro'yxatdan o'tilgan email / Зарегистрированный email"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *                 description: "Hisob paroli / Пароль аккаунта"
 *           examples:
 *             user_login:
 *               summary: Oddiy foydalanuvchi kirishi / Вход обычного пользователя
 *               value:
 *                 email: ahmadjon@gmail.com
 *                 password: secret123
 *             admin_login:
 *               summary: Admin kirishi / Вход администратора
 *               value:
 *                 email: admin@aidevix.com
 *                 password: adminPass789
 *     responses:
 *       200:
 *         description: ✅ Muvaffaqiyatli kirish / ✅ Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "Login successful."
 *               data:
 *                 user:
 *                   _id: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                   username: "ahmadjondev"
 *                   email: "ahmadjon@gmail.com"
 *                   role: "user"
 *                   subscriptions:
 *                     instagram:
 *                       subscribed: true
 *                       username: "ahmadjon_dev"
 *                     telegram:
 *                       subscribed: true
 *                       username: "ahmadjon_dev"
 *                       telegramUserId: "987654321"
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: ❌ Email yoki parol berilmagan / ❌ Email или пароль не указан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Please provide email and password."
 *       401:
 *         description: ❌ Noto'g'ri ma'lumotlar / ❌ Неверные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid email or password."
 *       403:
 *         description: ❌ Hisob faol emas / ❌ Аккаунт деактивирован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Account is deactivated. Please contact support."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', login);

// ════════════════════════════════════════════════════════════════
// POST /api/auth/refresh-token
// ════════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: 🔄 Access token yangilash (Refresh)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       AccessToken muddati o'tganda (15 daqiqadan keyin), bu endpoint orqali
 *       **refreshToken** yordamida yangi **accessToken** olinadi.
 *       Foydalanuvchi qayta login qilmasdan davom etadi.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. Frontend accessToken muddati o'tganligini biladi (401 javob)
 *       2. `localStorage`dagi `refreshToken` yuboriladi
 *       3. Server refresh tokenni tekshiradi (haqiqiyligini va muddatini)
 *       4. Yangi **accessToken** yaratiladi va qaytariladi
 *       5. Frontend yangi tokenni `localStorage`ga saqlaydi
 *
 *       ### 💻 Frontend da Axios Interceptor bilan:
 *       ```javascript
 *       // src/api/axiosInstance.js
 *       axiosInstance.interceptors.response.use(
 *         (response) => response,
 *         async (error) => {
 *           if (error.response?.status === 401) {
 *             // Token eskirgan — yangilash
 *             const refreshToken = localStorage.getItem('refreshToken');
 *             const res = await fetch('http://localhost:5000/api/auth/refresh-token', {
 *               method: 'POST',
 *               headers: { 'Content-Type': 'application/json' },
 *               body: JSON.stringify({ refreshToken })
 *             });
 *             const data = await res.json();
 *             localStorage.setItem('accessToken', data.data.accessToken);
 *             // Asl so'rovni qayta yuborish
 *             error.config.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
 *             return axiosInstance(error.config);
 *           }
 *           return Promise.reject(error);
 *         }
 *       );
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Когда accessToken истёк (через 15 минут), этот эндпоинт позволяет
 *       получить новый **accessToken** используя **refreshToken**.
 *       Пользователь продолжает без повторного входа.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Yangi accessToken olindi | ✅ Новый accessToken получен |
 *       | 400 | ❌ refreshToken berilmagan | ❌ refreshToken не указан |
 *       | 401 | ❌ refreshToken noto'g'ri yoki muddati o'tgan | ❌ Неверный или просроченный refreshToken |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjFhMmIzYzRkNWU2ZjdhOGI5YzBkMSIsImlhdCI6MTcwNjAwMDAwMCwiZXhwIjoxNzA2NjA0ODAwfQ.SIGNATURE
 *                 description: "Login/Register da olingan 7 kunlik token / Токен на 7 дней, полученный при login/register"
 *     responses:
 *       200:
 *         description: ✅ Yangi token olindi / ✅ Новый токен получен
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
 *                   example: "Token refreshed successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       description: "Yangi 15 daqiqalik token / Новый токен на 15 минут"
 *       400:
 *         description: ❌ refreshToken berilmagan / ❌ refreshToken не указан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Refresh token is required."
 *       401:
 *         description: ❌ Token noto'g'ri / ❌ Неверный токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid or expired refresh token."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh-token', refreshToken);

// ════════════════════════════════════════════════════════════════
// POST /api/auth/logout
// ════════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 🚪 Tizimdan chiqish (Logout)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Foydalanuvchini tizimdan chiqaradi. Server tomonida refreshToken o'chiriladi.
 *       Frontend tokenlarni `localStorage`dan o'chirishi kerak.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. `Authorization: Bearer TOKEN` headerda accessToken yuboriladi
 *       2. Server tokendan foydalanuvchini aniqlaydi
 *       3. Database'da refreshToken o'chiriladi (null qilinadi)
 *       4. Keyinchalik bu refreshToken ishlamaydi
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       const logout = async () => {
 *         const token = localStorage.getItem('accessToken');
 *         await fetch('http://localhost:5000/api/auth/logout', {
 *           method: 'POST',
 *           headers: { 'Authorization': `Bearer ${token}` }
 *         });
 *         // Tokenlarni o'chirish
 *         localStorage.removeItem('accessToken');
 *         localStorage.removeItem('refreshToken');
 *         // Login sahifasiga yo'naltirish
 *         window.location.href = '/login';
 *       };
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Выход пользователя из системы. На сервере refreshToken удаляется.
 *       Frontend должен удалить токены из `localStorage`.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Muvaffaqiyatli chiqildi | ✅ Успешный выход |
 *       | 401 | ❌ Token berilmagan yoki noto'g'ri | ❌ Токен не указан или неверный |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Muvaffaqiyatli chiqildi / ✅ Успешный выход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               success: true
 *               message: "Logged out successfully."
 *       401:
 *         description: ❌ Token kerak / ❌ Требуется токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Access token is required."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout', authenticate, logout);

// ════════════════════════════════════════════════════════════════
// GET /api/auth/me
// ════════════════════════════════════════════════════════════════
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 👤 Mening profilim (Joriy foydalanuvchi)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Hozirgi tizimga kirgan foydalanuvchining barcha ma'lumotlarini qaytaradi.
 *       **Token majburiy** — bu endpoint token orqali kim ekanligingizni aniqlaydi.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. `Authorization: Bearer TOKEN` headerdan token olinadi
 *       2. Token dekodlanadi → foydalanuvchi ID aniqlanadi
 *       3. Database'dan foydalanuvchi ma'lumotlari olinadi
 *       4. Ma'lumotlar qaytariladi (parolsiz!)
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // Sahifa ochilganda foydalanuvchini tekshirish
 *       const checkAuth = async () => {
 *         const token = localStorage.getItem('accessToken');
 *         if (!token) return null;
 *
 *         const res = await fetch('http://localhost:5000/api/auth/me', {
 *           headers: { 'Authorization': `Bearer ${token}` }
 *         });
 *
 *         if (res.status === 401) {
 *           // Token eskirgan — refresh qilish
 *           await refreshAccessToken();
 *           return checkAuth();
 *         }
 *
 *         const data = await res.json();
 *         return data.data.user; // { _id, username, email, role, subscriptions }
 *       };
 *       ```
 *
 *       ### 📦 Qaytariladigan ma'lumotlar / Возвращаемые данные:
 *       - `_id` — Foydalanuvchi ID
 *       - `username` — Foydalanuvchi nomi
 *       - `email` — Email
 *       - `role` — `user` yoki `admin`
 *       - `subscriptions.instagram` — Instagram obuna holati
 *       - `subscriptions.telegram` — Telegram obuna holati
 *       - `isActive` — Hisob faolmi
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Возвращает все данные текущего вошедшего пользователя.
 *       **Токен обязателен** — эндпоинт определяет кто вы через токен.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Ma'lumotlar qaytarildi | ✅ Данные возвращены |
 *       | 401 | ❌ Token berilmagan yoki noto'g'ri | ❌ Токен не указан или неверный |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Foydalanuvchi ma'lumotlari / ✅ Данные пользователя
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               data:
 *                 user:
 *                   _id: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                   username: "ahmadjondev"
 *                   email: "ahmadjon@gmail.com"
 *                   role: "user"
 *                   isActive: true
 *                   subscriptions:
 *                     instagram:
 *                       subscribed: true
 *                       username: "ahmadjon_dev"
 *                       verifiedAt: "2026-03-10T08:00:00.000Z"
 *                     telegram:
 *                       subscribed: true
 *                       username: "ahmadjon_dev"
 *                       telegramUserId: "987654321"
 *                       verifiedAt: "2026-03-10T08:05:00.000Z"
 *                   createdAt: "2026-01-15T08:30:00.000Z"
 *       401:
 *         description: ❌ Token kerak / ❌ Требуется токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Access token is required."
 *       500:
 *         description: ❌ Server xatosi / ❌ Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', authenticate, getMe);

module.exports = router;
