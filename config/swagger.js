const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aidevix Backend API',
      version: '1.0.0',
      description: 'Online kurs platformasi API - Authentication va ijtimoiy tarmoq obuna tekshiruvi bilan. Asosiy funksiyalar: Foydalanuvchi ro\'yxatdan o\'tish va kirish, Instagram va Telegram obuna tekshiruvi, Kurslar va videolar bilan ishlash, Real-time obuna tekshiruvi (video ko\'rish uchun). Qanday ishlatish: 1. Avval ro\'yxatdan o\'ting yoki kirish qiling, 2. Instagram va Telegram obunasini tekshiring, 3. Kurslarni ko\'ring, 4. Videolarni ko\'ring (obuna talab qilinadi). Muhim: Video ko\'rish uchun Instagram va Telegram\'ga obuna bo\'lish majburiy, Real-time tekshiruv har safar obuna holati tekshiriladi, Agar obuna bekor qilsangiz video ko\'ra olmaysiz.',
      contact: {
        name: 'API Support',
        email: 'support@aidevix.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
      {
        url: 'https://aidevixbackend.onrender.com',
        description: 'Production Server (Render)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT access token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Success message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
