// Auto-extracted swagger docs from subscriptionRoutes.js
// Edit here to update API docs

/**
 * @swagger
 * /api/subscriptions/verify-instagram:
 *   post:
 *     summary: 📸 Instagram obunasini tekshirish (Token kerak)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Foydalanuvchining Aidevix Instagram sahifasiga obuna bo'lganligini tekshiradi.
 *       Natija database'da saqlanadi va keyingi video ko'rish tekshiruvida ishlatiladi.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. Token tekshiriladi (authenticate)
 *       2. `username` (Instagram username) olinadi
 *       3. Instagram API yoki tekshiruv mexanizmi orqali obuna holati aniqlanadi
 *       4. Natija database'ga saqlanadi:
 *          - `subscriptions.instagram.subscribed: true/false`
 *          - `subscriptions.instagram.username: "username"`
 *          - `subscriptions.instagram.verifiedAt: Date`
 *       5. Natija qaytariladi
 *
 *       ### ⚡ Muhim / Важно:
 *       - Video ko'rish uchun bu tekshiruv **o'tishi kerak** (`subscribed: true`)
 *       - Real-time: har bir video ko'rganda obuna qayta tekshiriladi
 *       - Obunani bekor qilsangiz → videolar bloklanadi
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // src/pages/SubscriptionPage.jsx
 *       const verifyInstagram = async (username) => {
 *         const token = localStorage.getItem('accessToken');
 *         const res = await fetch(
 *           'http://localhost:5000/api/subscriptions/verify-instagram',
 *           {
 *             method: 'POST',
 *             headers: {
 *               'Content-Type': 'application/json',
 *               'Authorization': `Bearer ${token}`
 *             },
 *             body: JSON.stringify({ username: 'aidevix_official' })
 *           }
 *         );
 *         const data = await res.json();
 *
 *         if (data.data.subscription.instagram.subscribed) {
 *           console.log('✅ Instagram obunasi tasdiqlandi!');
 *         } else {
 *           console.log('❌ Instagram obuna topilmadi. Avval obuna bo\'ling!');
 *         }
 *       };
 *       ```
 *
 *       ### 🔄 Obuna oqimi / Поток подписки:
 *       ```
 *       1. Foydalanuvchi Instagram ga obuna bo'ladi (@aidevix)
 *       2. Saytda "Obunani tasdiqlash" tugmasi bosiladi
 *       3. POST /api/subscriptions/verify-instagram yuboriladi
 *       4. Server obunani tekshiradi
 *       5. subscribed: true → video ko'rishga ruxsat
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Проверяет подписку пользователя на Instagram страницу Aidevix.
 *       Результат сохраняется в базе данных и используется при проверке доступа к видео.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Tekshiruv o'tkazildi (obuna bor yoki yo'q) | ✅ Проверка пройдена (подписан или нет) |
 *       | 400 | ❌ username berilmagan | ❌ username не указан |
 *       | 401 | ❌ Token kerak | ❌ Токен не указан |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *
 *       > **Eslatma**: 200 holat kodi obuna borligini bildirmaydi! `data.subscription.instagram.subscribed` ni tekshiring.
 *       > **Примечание**: Код 200 не означает наличие подписки! Проверьте `data.subscription.instagram.subscribed`.
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: "aidevix_official"
 *                 description: "Foydalanuvchining Instagram usernamei / Instagram username пользователя"
 *           examples:
 *             aidevix:
 *               summary: Aidevix sahifasiga obuna tekshirish
 *               value:
 *                 username: "aidevix_official"
 *             shaxsiy:
 *               summary: Shaxsiy username bilan
 *               value:
 *                 username: "ahmadjon_dev"
 *     responses:
 *       200:
 *         description: ✅ Tekshiruv o'tkazildi / ✅ Проверка выполнена
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscription:
 *                       type: object
 *                       properties:
 *                         instagram:
 *                           type: object
 *                           properties:
 *                             subscribed:
 *                               type: boolean
 *                             username:
 *                               type: string
 *                             verifiedAt:
 *                               type: string
 *                               format: date-time
 *             examples:
 *               obuna_bor:
 *                 summary: Obuna bor / Подписан
 *                 value:
 *                   success: true
 *                   message: "Instagram subscription verified successfully."
 *                   data:
 *                     subscription:
 *                       instagram:
 *                         subscribed: true
 *                         username: "aidevix_official"
 *                         verifiedAt: "2026-03-11T10:00:00.000Z"
 *               obuna_yoq:
 *                 summary: Obuna yo'q / Не подписан
 *                 value:
 *                   success: true
 *                   message: "Instagram subscription not found."
 *                   data:
 *                     subscription:
 *                       instagram:
 *                         subscribed: false
 *                         username: "aidevix_official"
 *                         verifiedAt: "2026-03-11T10:00:00.000Z"
 *       400:
 *         description: ❌ username berilmagan / ❌ username не указан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Instagram username is required."
 *       401:
 *         description: ❌ Token kerak / ❌ Требуется токен
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

/**
 * @swagger
 * /api/subscriptions/verify-telegram:
 *   post:
 *     summary: 📱 Telegram obunasini tekshirish (Token kerak)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Foydalanuvchining Aidevix Telegram kanaliga obuna bo'lganligini tekshiradi.
 *       **Telegram Bot API** orqali real-time tekshiruv o'tkaziladi.
 *       `telegramUserId` majburiy — foydalanuvchini Telegram da aniq aniqlash uchun.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. Token tekshiriladi (authenticate)
 *       2. `username` va `telegramUserId` olinadi
 *       3. **Telegram Bot API** chaqiriladi: `getChatMember` metodi
 *          - Bot Aidevix Telegram kanalining memberlari ro'yxatini tekshiradi
 *          - `telegramUserId` bo'yicha foydalanuvchi topiladi
 *       4. Status tekshiriladi: `member`, `administrator`, `creator` → obuna bor
 *       5. `left`, `kicked`, `restricted` → obuna yo'q
 *       6. Natija database'ga saqlanadi
 *       7. Natija qaytariladi
 *
 *       ### ❓ Telegram User ID ni qanday topish?
 *       ```
 *       1. Telegram'da @userinfobot ga yozing
 *       2. Bot sizning Telegram User ID'ingizni ko'rsatadi
 *       3. Yoki @myidbot dan foydalaning
 *       ```
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // src/pages/SubscriptionPage.jsx
 *       const verifyTelegram = async (username, telegramUserId) => {
 *         const token = localStorage.getItem('accessToken');
 *         const res = await fetch(
 *           'http://localhost:5000/api/subscriptions/verify-telegram',
 *           {
 *             method: 'POST',
 *             headers: {
 *               'Content-Type': 'application/json',
 *               'Authorization': `Bearer ${token}`
 *             },
 *             body: JSON.stringify({
 *               username: 'aidevix_channel',
 *               telegramUserId: '987654321'  // Foydalanuvchi Telegram ID
 *             })
 *           }
 *         );
 *         const data = await res.json();
 *
 *         if (data.data.subscription.telegram.subscribed) {
 *           console.log('✅ Telegram obunasi tasdiqlandi!');
 *           // Keyingi qadamga o'tish
 *         } else {
 *           console.log('❌ Telegram kanalga obuna bo\'ling!');
 *           // t.me/aidevix_channel sahifasiga yo'naltirish
 *         }
 *       };
 *       ```
 *
 *       ### 🔄 Obuna oqimi:
 *       ```
 *       1. Foydalanuvchi Telegram kanalga qo'shiladi (t.me/aidevix)
 *       2. Saytda Telegram User ID kiradi va "Tasdiqlash" bosadi
 *       3. POST /api/subscriptions/verify-telegram yuboriladi
 *       4. Bot API orqali real-time tekshiruv
 *       5. subscribed: true → video ko'rishga ruxsat
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Проверяет подписку пользователя на Telegram канал Aidevix.
 *       Проверка осуществляется через **Telegram Bot API** в реальном времени.
 *       `telegramUserId` обязателен — для точного определения пользователя в Telegram.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Tekshiruv o'tkazildi | ✅ Проверка выполнена |
 *       | 400 | ❌ username yoki telegramUserId berilmagan | ❌ username или telegramUserId не указан |
 *       | 401 | ❌ Token kerak | ❌ Токен не указан |
 *       | 500 | ❌ Server xatosi (Bot API bilan muammo) | ❌ Ошибка сервера (проблема с Bot API) |
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - telegramUserId
 *             properties:
 *               username:
 *                 type: string
 *                 example: "aidevix_channel"
 *                 description: "Telegram kanal username (@ belgisisiz) / Username Telegram канала (без @)"
 *               telegramUserId:
 *                 type: string
 *                 example: "987654321"
 *                 description: "Foydalanuvchi Telegram User ID (@userinfobot dan olish mumkin) / Telegram User ID пользователя"
 *           examples:
 *             standart:
 *               summary: Standart tekshiruv / Стандартная проверка
 *               value:
 *                 username: "aidevix_channel"
 *                 telegramUserId: "987654321"
 *             test_foydalanuvchi:
 *               summary: Test foydalanuvchi / Тестовый пользователь
 *               value:
 *                 username: "aidevix_dev"
 *                 telegramUserId: "123456789"
 *     responses:
 *       200:
 *         description: ✅ Tekshiruv o'tkazildi / ✅ Проверка выполнена
 *         content:
 *           application/json:
 *             examples:
 *               obuna_bor:
 *                 summary: Obuna bor / Подписан
 *                 value:
 *                   success: true
 *                   message: "Telegram subscription verified successfully."
 *                   data:
 *                     subscription:
 *                       telegram:
 *                         subscribed: true
 *                         username: "aidevix_channel"
 *                         telegramUserId: "987654321"
 *                         verifiedAt: "2026-03-11T10:05:00.000Z"
 *               obuna_yoq:
 *                 summary: Obuna yo'q / Не подписан
 *                 value:
 *                   success: true
 *                   message: "Telegram subscription not found. Please join the channel."
 *                   data:
 *                     subscription:
 *                       telegram:
 *                         subscribed: false
 *                         username: "aidevix_channel"
 *                         telegramUserId: "987654321"
 *                         verifiedAt: "2026-03-11T10:05:00.000Z"
 *       400:
 *         description: ❌ Maydonlar berilmagan / ❌ Поля не указаны
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               username_yoq:
 *                 summary: Username berilmagan / Username не указан
 *                 value:
 *                   success: false
 *                   message: "Telegram username is required."
 *               id_yoq:
 *                 summary: Telegram ID berilmagan / Telegram ID не указан
 *                 value:
 *                   success: false
 *                   message: "Telegram User ID is required."
 *       401:
 *         description: ❌ Token kerak / ❌ Требуется токен
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
 *             example:
 *               success: false
 *               message: "Error verifying Telegram subscription."
 */

/**
 * @swagger
 * /api/subscriptions/status:
 *   get:
 *     summary: 📊 Mening obuna holatim (Token kerak)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Hozirgi foydalanuvchining Instagram va Telegram obuna holatini qaytaradi.
 *       Bu endpoint frontend'da obuna sahifasi uchun ishlatiladi.
 *
 *       ### 📋 Qanday ishlaydi?
 *       1. Token tekshiriladi
 *       2. Database'dan foydalanuvchining obuna ma'lumotlari olinadi
 *       3. `hasAllSubscriptions` hisoblanadi:
 *          - `instagram.subscribed === true` AND `telegram.subscribed === true` → `true`
 *          - Bittasi ham `false` bo'lsa → `false`
 *       4. Barcha ma'lumotlar qaytariladi
 *
 *       ### 💡 hasAllSubscriptions nima?
 *       - `true` → ikkala obuna ham bor → video ko'rish mumkin
 *       - `false` → kamida bitta obuna yo'q → video bloklanadi
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // src/components/SubscriptionGate.jsx
 *       const checkSubscriptions = async () => {
 *         const token = localStorage.getItem('accessToken');
 *         const res = await fetch(
 *           'http://localhost:5000/api/subscriptions/status',
 *           { headers: { 'Authorization': `Bearer ${token}` } }
 *         );
 *         const data = await res.json();
 *         const { subscriptions, hasAllSubscriptions } = data.data;
 *
 *         if (hasAllSubscriptions) {
 *           // Video ko'rish sahifasiga ruxsat
 *           return true;
 *         } else {
 *           // Qaysi obuna yo'qligini ko'rsatish
 *           if (!subscriptions.instagram.subscribed) {
 *             showMessage('Instagram sahifamizga obuna bo\'ling!');
 *           }
 *           if (!subscriptions.telegram.subscribed) {
 *             showMessage('Telegram kanalimizga qo\'shiling!');
 *           }
 *           return false;
 *         }
 *       };
 *
 *       // Redux da:
 *       dispatch(fetchSubscriptionStatus()); // subscriptionSlice da
 *       const { hasAllSubscriptions } = useSelector(state => state.subscription);
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Возвращает статус подписок текущего пользователя на Instagram и Telegram.
 *       Используется на странице подписок во фронтенде.
 *
 *       ### 💡 hasAllSubscriptions:
 *       - `true` → обе подписки есть → видео можно смотреть
 *       - `false` → хотя бы одной подписки нет → доступ к видео заблокирован
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Obuna holati qaytarildi | ✅ Статус подписок возвращён |
 *       | 401 | ❌ Token kerak | ❌ Токен не указан |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ✅ Obuna holati / ✅ Статус подписок
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionStatus'
 *             examples:
 *               ikkalasi_bor:
 *                 summary: Ikki obuna ham bor (video ko'rish mumkin) / Обе подписки есть
 *                 value:
 *                   success: true
 *                   data:
 *                     subscriptions:
 *                       instagram:
 *                         subscribed: true
 *                         username: "aidevix_official"
 *                         verifiedAt: "2026-03-10T08:00:00.000Z"
 *                       telegram:
 *                         subscribed: true
 *                         username: "aidevix_channel"
 *                         telegramUserId: "987654321"
 *                         verifiedAt: "2026-03-10T08:05:00.000Z"
 *                     hasAllSubscriptions: true
 *               instagram_yoq:
 *                 summary: Instagram obunasi yo'q / Нет подписки Instagram
 *                 value:
 *                   success: true
 *                   data:
 *                     subscriptions:
 *                       instagram:
 *                         subscribed: false
 *                         username: null
 *                         verifiedAt: null
 *                       telegram:
 *                         subscribed: true
 *                         username: "aidevix_channel"
 *                         telegramUserId: "987654321"
 *                         verifiedAt: "2026-03-10T08:05:00.000Z"
 *                     hasAllSubscriptions: false
 *               hech_qaysi_yoq:
 *                 summary: Hech qaysi obuna yo'q (yangi foydalanuvchi) / Нет ни одной подписки
 *                 value:
 *                   success: true
 *                   data:
 *                     subscriptions:
 *                       instagram:
 *                         subscribed: false
 *                         username: null
 *                         verifiedAt: null
 *                       telegram:
 *                         subscribed: false
 *                         username: null
 *                         telegramUserId: null
 *                         verifiedAt: null
 *                     hasAllSubscriptions: false
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
