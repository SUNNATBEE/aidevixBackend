const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '📚 Aidevix Backend API',
      version: '2.0.0',
      description: `
## 🇺🇿 O'ZBEKCHA TUSHUNTIRISH

**Aidevix** — onlayn kurs platformasi uchun backend API.
Bu dokumentatsiya orqali siz barcha endpointlarni brauzerda sinab ko'rishingiz mumkin.

### ⚡ Qanday boshlash kerak?
1. **Register** yoki **Login** qiling → \`accessToken\` oling
2. Yuqoridagi **"Authorize"** tugmasini bosing → \`Bearer YOUR_TOKEN\` kiriting
3. Istalgan endpointni **"Try it out"** → **"Execute"** orqali sinab ko'ring

### 🔐 Token tizimi:
- **accessToken** — 15 daqiqa ishlaydi (har so'rovda yuboriladi)
- **refreshToken** — 7 kun ishlaydi (accessToken yangilash uchun)

### 👁 Obuna talabi:
Video ko'rish uchun Instagram + Telegram kanallariga obuna bo'lish MAJBURIY.
Real-time tekshiruv: har safar video ko'rganda obuna holati tekshiriladi.

---

## 🇷🇺 ОПИСАНИЕ НА РУССКОМ

**Aidevix** — Backend API для платформы онлайн-курсов.
Через эту документацию вы можете протестировать все эндпоинты прямо в браузере.

### ⚡ Как начать?
1. **Register** или **Login** → получите \`accessToken\`
2. Нажмите **"Authorize"** вверху → введите \`Bearer YOUR_TOKEN\`
3. Любой эндпоинт → **"Try it out"** → **"Execute"**

### 🔐 Система токенов:
- **accessToken** — живёт 15 минут (отправляется в каждом запросе)
- **refreshToken** — живёт 7 дней (для обновления accessToken)

### 👁 Требование подписки:
Для просмотра видео подписка на Instagram + Telegram ОБЯЗАТЕЛЬНА.
Проверка в реальном времени: при каждом просмотре статус подписки проверяется.

---

### 📚 Mavjud kurslar / Доступные курсы:
| Kategoriya | Kurs nomi | Narxi |
|-----------|-----------|-------|
| html | HTML Asoslari | 99,000 so'm |
| css | CSS Stillar va Dizayn | 129,000 so'm |
| javascript | JavaScript Dasturlash | 299,000 so'm |
| tailwind | Tailwind CSS Framework | 149,000 so'm |
| react | React.js Frontend | 349,000 so'm |
| redux | Redux Holat Boshqaruvi | 199,000 so'm |
      `,
      contact: {
        name: 'Aidevix Support',
        email: 'support@aidevix.com',
        url: 'https://aidevix.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: '🖥️ Local Development Server (mahalliy server)',
      },
      {
        url: 'https://aidevixbackend.onrender.com',
        description: '🌐 Production Server — Render (ishchi server)',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: '💓 Server holati tekshiruvi / Проверка состояния сервера',
      },
      {
        name: 'Authentication',
        description: '🔐 Ro\'yxatdan o\'tish, kirish, token boshqaruvi / Регистрация, вход, управление токенами',
      },
      {
        name: 'Courses',
        description: '📚 Kurslarni ko\'rish (ochiq) / Просмотр курсов (открыто)',
      },
      {
        name: 'Videos',
        description: '🎥 Videolarni ko\'rish (obuna talab qilinadi) / Просмотр видео (требуется подписка)',
      },
      {
        name: 'Subscriptions',
        description: '📡 Instagram va Telegram obuna tekshiruvi / Проверка подписок Instagram и Telegram',
      },
      {
        name: 'Admin Panel - Courses',
        description: '👑 Admin: Kurs boshqaruvi / Управление курсами (только для администраторов)',
      },
      {
        name: 'Admin Panel - Videos',
        description: '👑 Admin: Video boshqaruvi / Управление видео (только для администраторов)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: `
**🇺🇿 O'ZBEKCHA:**
JWT access token kiriting. Login yoki register qilib token oling.
Format: \`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\`

**🇷🇺 РУССКИЙ:**
Введите JWT access token. Получите токен через login или register.
Формат: \`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\`
          `,
        },
      },
      schemas: {
        // ─── ERROR ───────────────────────────────────────────
        Error: {
          type: 'object',
          description: 'Xato javob / Ответ с ошибкой',
          properties: {
            success: {
              type: 'boolean',
              example: false,
              description: 'Har doim false (xato bo\'lsa) / Всегда false (при ошибке)',
            },
            message: {
              type: 'string',
              example: 'Xato xabari / Сообщение об ошибке',
              description: 'Xato tavsifi / Описание ошибки',
            },
          },
        },

        // ─── USER ─────────────────────────────────────────────
        User: {
          type: 'object',
          description: 'Foydalanuvchi modeli / Модель пользователя',
          properties: {
            _id: {
              type: 'string',
              example: '65f1a2b3c4d5e6f7a8b9c0d1',
              description: 'MongoDB unique ID',
            },
            username: {
              type: 'string',
              example: 'ahmadjondev',
              description: 'Foydalanuvchi nomi / Имя пользователя',
            },
            email: {
              type: 'string',
              example: 'ahmadjon@gmail.com',
              description: 'Email manzil / Email адрес',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
              description: 'user = oddiy foydalanuvchi, admin = administrator',
            },
            isActive: {
              type: 'boolean',
              example: true,
              description: 'Hisob faol yoki yo\'q / Активен ли аккаунт',
            },
            subscriptions: {
              $ref: '#/components/schemas/Subscriptions',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-15T08:30:00.000Z',
            },
          },
        },

        // ─── SUBSCRIPTIONS ────────────────────────────────────
        Subscriptions: {
          type: 'object',
          description: 'Foydalanuvchi obuna holati / Статус подписок пользователя',
          properties: {
            instagram: {
              type: 'object',
              properties: {
                subscribed: {
                  type: 'boolean',
                  example: true,
                  description: 'Instagram kanalga obuna bo\'lganmi / Подписан на Instagram',
                },
                username: {
                  type: 'string',
                  example: 'ahmadjon_dev',
                  description: 'Instagram username',
                },
                verifiedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2026-01-15T10:00:00.000Z',
                  description: 'Qachon tekshirilgan / Когда проверено',
                },
              },
            },
            telegram: {
              type: 'object',
              properties: {
                subscribed: {
                  type: 'boolean',
                  example: true,
                  description: 'Telegram kanalga obuna bo\'lganmi / Подписан на Telegram',
                },
                username: {
                  type: 'string',
                  example: 'ahmadjon_dev',
                  description: 'Telegram username',
                },
                telegramUserId: {
                  type: 'string',
                  example: '987654321',
                  description: 'Telegram User ID (real-time tekshiruv uchun / для проверки в реальном времени)',
                },
                verifiedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2026-01-15T10:05:00.000Z',
                },
              },
            },
          },
        },

        // ─── AUTH RESPONSE ────────────────────────────────────
        AuthResponse: {
          type: 'object',
          description: 'Login/Register javobi / Ответ на Login/Register',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login successful.',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                accessToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjFhMmIzYzRkNWU2ZjdhOGI5YzBkMSIsImlhdCI6MTcwNjAwMDAwMCwiZXhwIjoxNzA2MDAwOTAwfQ.SIGNATURE',
                  description: '⏰ 15 daqiqa amal qiladi / Действует 15 минут',
                },
                refreshToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjFhMmIzYzRkNWU2ZjdhOGI5YzBkMSIsImlhdCI6MTcwNjAwMDAwMCwiZXhwIjoxNzA2NjA0ODAwfQ.SIGNATURE',
                  description: '⏰ 7 kun amal qiladi / Действует 7 дней',
                },
              },
            },
          },
        },

        // ─── COURSE ───────────────────────────────────────────
        Course: {
          type: 'object',
          description: 'Kurs modeli / Модель курса',
          properties: {
            _id: {
              type: 'string',
              example: '65f1a2b3c4d5e6f7a8b9c0d2',
              description: 'MongoDB unique ID',
            },
            title: {
              type: 'string',
              example: 'React.js Frontend Development',
              description: 'Kurs nomi / Название курса',
            },
            description: {
              type: 'string',
              example: 'React.js yordamida zamonaviy veb-ilovalar yaratishni o\'rganasiz. Hooks, Redux, Router va boshqa mavzular.',
              description: 'Kurs tavsifi / Описание курса',
            },
            thumbnail: {
              type: 'string',
              example: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
              description: 'Kurs rasmi URL / URL изображения курса',
            },
            price: {
              type: 'number',
              example: 349000,
              description: 'Kurs narxi (so\'mda) / Стоимость курса (в сумах)',
            },
            category: {
              type: 'string',
              enum: ['html', 'css', 'javascript', 'tailwind', 'react', 'redux', 'nodejs', 'general'],
              example: 'react',
              description: 'Kurs kategoriyasi / Категория курса',
            },
            instructor: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d0' },
                username: { type: 'string', example: 'aidevix_admin' },
                email: { type: 'string', example: 'admin@aidevix.com' },
              },
              description: 'Kurs muallifi / Автор курса',
            },
            videos: {
              type: 'array',
              items: { $ref: '#/components/schemas/VideoShort' },
              description: 'Kurs videolari / Видео курса',
            },
            isActive: {
              type: 'boolean',
              example: true,
              description: 'true = faol, false = yashirin / true = активен, false = скрыт',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-03-01T12:00:00.000Z',
            },
          },
        },

        // ─── COURSE SHORT (list uchun) ─────────────────────────
        CourseShort: {
          type: 'object',
          description: 'Kurs qisqa ma\'lumoti (ro\'yxat uchun) / Краткая информация курса (для списка)',
          properties: {
            _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2' },
            title: { type: 'string', example: 'HTML Asoslari' },
            description: { type: 'string', example: 'HTML teglar, atributlar, formalar va zamonaviy HTML5 elementlarini o\'rganasiz.' },
            thumbnail: { type: 'string', example: 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg' },
            price: { type: 'number', example: 99000 },
            category: { type: 'string', example: 'html' },
            instructor: {
              type: 'object',
              properties: {
                username: { type: 'string', example: 'aidevix_admin' },
                email: { type: 'string', example: 'admin@aidevix.com' },
              },
            },
            videos: {
              type: 'array',
              description: 'Kurs videolari soni / Количество видео',
            },
          },
        },

        // ─── VIDEO SHORT ──────────────────────────────────────
        VideoShort: {
          type: 'object',
          description: 'Video qisqa ma\'lumoti / Краткая информация видео',
          properties: {
            _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d3' },
            title: { type: 'string', example: '1-dars: HTML nima?' },
            description: { type: 'string', example: 'HTML haqida umumiy ma\'lumot va tarix.' },
            order: { type: 'number', example: 0, description: 'Video tartibi / Порядок видео (0 dan boshlanadi)' },
            duration: { type: 'number', example: 1200, description: 'Davomiylik soniyalarda / Длительность в секундах (1200 = 20 daqiqa)' },
            thumbnail: { type: 'string', example: 'https://example.com/thumb.jpg' },
          },
        },

        // ─── VIDEO FULL ───────────────────────────────────────
        Video: {
          type: 'object',
          description: 'Video to\'liq ma\'lumoti / Полная информация видео',
          properties: {
            _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d3' },
            title: { type: 'string', example: '1-dars: HTML nima?' },
            description: { type: 'string', example: 'HTML haqida umumiy ma\'lumot va tarix.' },
            course: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d2', description: 'Kurs ID / ID курса' },
            order: { type: 'number', example: 0 },
            duration: { type: 'number', example: 1200 },
            thumbnail: { type: 'string', example: 'https://example.com/thumb.jpg' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time', example: '2026-01-05T08:00:00.000Z' },
          },
        },

        // ─── VIDEO LINK ───────────────────────────────────────
        VideoLink: {
          type: 'object',
          description: 'Bir martalik video havolasi / Одноразовая ссылка на видео',
          properties: {
            _id: { type: 'string', example: '65f1a2b3c4d5e6f7a8b9c0d4' },
            telegramLink: {
              type: 'string',
              example: 'https://t.me/c/1234567890/42',
              description: 'Telegram private channel video linki (BIR MARTA ishlatiladi!) / Ссылка на видео (используется ОДИН РАЗ!)',
            },
            isUsed: {
              type: 'boolean',
              example: false,
              description: 'false = hali ishlatilmagan, true = ishlatilgan / false = ещё не использована, true = использована',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-03-12T10:00:00.000Z',
              description: 'Link muddati tugashi / Срок действия ссылки',
            },
          },
        },

        // ─── VIDEO RESPONSE (GET /videos/:id) ─────────────────
        VideoResponse: {
          type: 'object',
          description: 'Video + bir martalik link javobi / Ответ видео + одноразовая ссылка',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                video: { $ref: '#/components/schemas/Video' },
                videoLink: { $ref: '#/components/schemas/VideoLink' },
              },
            },
          },
        },

        // ─── SUBSCRIPTION STATUS ──────────────────────────────
        SubscriptionStatus: {
          type: 'object',
          description: 'Obuna holati javobi / Ответ статуса подписки',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                subscriptions: { $ref: '#/components/schemas/Subscriptions' },
                hasAllSubscriptions: {
                  type: 'boolean',
                  example: true,
                  description: 'true = ikkala obuna ham bor, video ko\'rish mumkin / true = обе подписки есть, видео можно смотреть',
                },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js', './index.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
