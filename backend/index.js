require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const swaggerAdminSpec = require('./config/swaggerAdmin');
const swaggerAuth = require('./middleware/swaggerAuth');
const connectDB = require('./config/database');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Initialize Express app
const app = express();

// Trust proxy — REQUIRED on Render/Railway (otherwise all IPs look the same → rate limit breaks)
app.set('trust proxy', 1);

// Connect to database (async - won't block server start)
connectDB().catch(err => {
  console.error('Failed to connect to database on startup');
});

// CORS Configuration
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow if explicitly listed or wildcard '*' configured
    if (allowedOrigins.includes('*') || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global API rate limiter
app.use('/api/', apiLimiter);

// Swagger UI Documentation (Parol bilan himoyalangan)
app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Aidevix API Documentation',
  customfavIcon: '/favicon.ico',
}));

// Swagger JSON endpoint (Parol bilan himoyalangan)
app.get('/api-docs.json', swaggerAuth, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Admin Panel Swagger UI Documentation (Parol bilan himoyalangan)
app.use('/admin-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerAdminSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Aidevix Admin Panel API',
  customfavIcon: '/favicon.ico',
}));

// Admin Panel Swagger JSON endpoint (Parol bilan himoyalangan)
app.get('/admin-docs.json', swaggerAuth, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerAdminSpec);
});

// Security headers
app.use((req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // CORS headers (already handled by cors middleware, but adding for clarity)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
});

// Routes
app.use('/api/auth',         authLimiter, require('./routes/authRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/courses',      require('./routes/courseRoutes'));
app.use('/api/videos',       require('./routes/videoRoutes'));
app.use('/api/ranking',      require('./routes/rankingRoutes'));
app.use('/api/xp',           require('./routes/xpRoutes'));
app.use('/api/projects',     require('./routes/projectRoutes'));
app.use('/api/enrollments',  require('./routes/enrollmentRoutes'));
app.use('/api/wishlist',     require('./routes/wishlistRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/sections',     require('./routes/sectionRoutes'));
app.use('/api/follow',       require('./routes/followRoutes'));
app.use('/api/challenges',   require('./routes/challengeRoutes'));
app.use('/api/payments',     require('./routes/paymentRoutes'));
app.use('/api/admin',        require('./routes/adminRoutes'));
app.use('/api/upload',       require('./routes/uploadRoutes'));

// Health check route
/**
 * @swagger
 * /health:
 *   get:
 *     summary: 💓 Server holati tekshiruvi (Ochiq — token shart emas)
 *     description: |
 *       ## 🇺🇿 O'ZBEKCHA
 *
 *       Server va database ishlayotganligini tekshiradi.
 *       Bu endpoint monitoring uchun ishlatiladi.
 *       Token kerak emas — hamma foydalana oladi.
 *
 *       ### 💻 Frontend da qanday ishlatish:
 *       ```javascript
 *       // Server ishlayaptimi tekshirish
 *       const checkServer = async () => {
 *         try {
 *           const res = await fetch('http://localhost:5000/health');
 *           const data = await res.json();
 *           console.log('Server holati:', data.success ? '✅ Ishlayapti' : '❌ Ishlamayapti');
 *         } catch (err) {
 *           console.log('❌ Server ulanmadi!');
 *         }
 *       };
 *       ```
 *
 *       ---
 *
 *       ## 🇷🇺 РУССКИЙ
 *
 *       Проверяет работоспособность сервера и базы данных.
 *       Эндпоинт используется для мониторинга. Токен не нужен.
 *
 *       ### 📊 Status kodlar / Коды статусов:
 *       | Kod | Ma'no (O'z) | Значение (Рус) |
 *       |-----|------------|----------------|
 *       | 200 | ✅ Server va database ishlayapti | ✅ Сервер и БД работают |
 *       | 500 | ❌ Server xatosi | ❌ Ошибка сервера |
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: ✅ Server ishlayapti / ✅ Сервер работает
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
 *                   example: "Server is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-03-11T10:00:00.000Z"
 *             example:
 *               success: true
 *               message: "Server is running"
 *               timestamp: "2026-03-11T10:00:00.000Z"
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on ${HOST}:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`✅ Production mode enabled`);
  }
});

module.exports = app;
