/**
 * Swagger UI Authentication Middleware
 * Basic auth orqali Swagger UI'ni himoya qiladi
 */

const swaggerAuth = (req, res, next) => {
  // Development'da parol kerak emas
  if (process.env.NODE_ENV === 'development' && !process.env.SWAGGER_USERNAME) {
    return next();
  }

  // Production'da yoki SWAGGER_USERNAME sozlangan bo'lsa, parol talab qilinadi
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Documentation"');
    return res.status(401).send('Swagger UI uchun autentifikatsiya talab qilinadi');
  }

  // Basic auth decode qilish
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Environment variables'dan username va password olish
  const validUsername = process.env.SWAGGER_USERNAME || 'admin';
  const validPassword = process.env.SWAGGER_PASSWORD || 'admin123';

  // Tekshirish
  if (username === validUsername && password === validPassword) {
    return next();
  }

  // Noto'g'ri parol
  res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Documentation"');
  return res.status(401).send('Noto\'g\'ri username yoki parol');
};

module.exports = swaggerAuth;
