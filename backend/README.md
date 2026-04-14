# Aidevix Backend

Online course platform backend with authentication, social media subscription verification, and one-time video link system.

## Features

- 🔐 **Authentication System**
  - User registration and login
  - Access token and refresh token
  - JWT-based authentication

- 📱 **Social Media Subscription Verification**
  - Instagram subscription check
  - Telegram subscription check
  - **Real-time subscription verification** - Checks subscription status every time before video access
  - Automatic blocking if user unsubscribes during video viewing
  - Required subscriptions for video access

- 🎥 **Video Course System**
  - Course management
  - Video management
  - One-time use video links from Telegram private channels

- 🔒 **Security**
  - Password hashing with bcrypt
  - Token-based authentication
  - One-time video links to prevent sharing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secrets
   - Telegram bot token and channel username
   - Instagram API credentials (if using)

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Subscriptions
- `POST /api/subscriptions/verify-instagram` - Verify Instagram subscription
  - Body: `{ "username": "instagram_username" }`
- `POST /api/subscriptions/verify-telegram` - Verify Telegram subscription
  - Body: `{ "username": "telegram_username", "telegramUserId": "user_id" }`
  - Note: `telegramUserId` is required for real-time verification
- `GET /api/subscriptions/status` - Get subscription status

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/:id` - Update course (Admin only)
- `DELETE /api/courses/:id` - Delete course (Admin only)

### Videos
- `GET /api/videos/course/:courseId` - Get videos for a course
- `GET /api/videos/:id` - Get video (requires subscriptions, real-time check)
  - **Real-time subscription verification** - Checks if user is still subscribed before granting access
- `POST /api/videos/link/:linkId/use` - Use video link (mark as used)
  - **Real-time subscription verification** - Checks subscription status before allowing video access
  - If user unsubscribed, returns error: "Siz obuna bekor qildingiz. Video ko'ra olmaysiz."
- `POST /api/videos` - Create video (Admin only)
- `PUT /api/videos/:id` - Update video (Admin only)
- `DELETE /api/videos/:id` - Delete video (Admin only)

## Project Structure

```
AidevixBackend/
├── config/
│   ├── database.js       # MongoDB connection
│   └── jwt.js            # JWT configuration
├── controllers/
│   ├── authController.js
│   ├── subscriptionController.js
│   ├── courseController.js
│   └── videoController.js
├── middleware/
│   ├── auth.js           # Authentication middleware
│   └── subscriptionCheck.js
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Video.js
│   └── VideoLink.js
├── routes/
│   ├── authRoutes.js
│   ├── subscriptionRoutes.js
│   ├── courseRoutes.js
│   └── videoRoutes.js
├── utils/
│   ├── jwt.js            # JWT utilities
│   └── socialVerification.js
├── index.js              # Main server file
├── package.json
└── .env.example
```

## Important Notes

1. **Real-time Subscription Verification**: 
   - The system performs real-time subscription checks every time a user tries to access a video
   - If a user unsubscribes from Instagram or Telegram during video viewing, access is immediately blocked
   - Error message: "Siz obuna bekor qildingiz. Video ko'ra olmaysiz. Iltimos, [platform] ga qayta obuna bo'ling."
   - Subscription status is automatically updated in the database when changes are detected

2. **Social Media Verification**: 
   - The Instagram and Telegram verification functions in `utils/socialVerification.js` need actual API implementation
   - For Telegram: Implement `checkTelegramSubscriptionRealTime()` using Telegram Bot API's `getChatMember` method
   - For Instagram: Implement `checkInstagramSubscriptionRealTime()` using Instagram Graph API
   - Telegram requires `telegramUserId` (not just username) for real-time verification

3. **Telegram Video Links**: 
   - The video link generation in `videoController.js` needs to be customized based on your Telegram channel setup
   - Links are one-time use and expire after being used
   - Real-time subscription check is performed before allowing link usage

4. **Security**: Make sure to:
   - Change JWT secrets in production
   - Use strong passwords
   - Keep your `.env` file secure
   - Use HTTPS in production
   - Store Telegram Bot Token securely

5. **Database**: Make sure MongoDB is running and accessible.

## Development

- Development mode: `npm run dev` (uses nodemon)
- Production mode: `npm start`

## Deployment to Render

### Prerequisites
1. GitHub account va repository
2. Render account (bepul: https://render.com)
3. MongoDB Atlas cluster

### Deploy Steps

1. **GitHub'ga kod push qiling:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Render'da yangi Web Service yarating:**
   - Render dashboard'ga kiring
   - "New +" → "Web Service"
   - GitHub repository'ni ulang
   - Quyidagi sozlamalarni tanlang:
     - **Name:** `aidevix-backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free (yoki istalgan plan)

3. **Environment Variables qo'shing:**
   Render dashboard'da "Environment" bo'limiga quyidagilarni qo'shing:

   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   ACCESS_TOKEN_SECRET=your_strong_secret_key_here
   REFRESH_TOKEN_SECRET=your_strong_secret_key_here
   ACCESS_TOKEN_EXPIRE=15m
   REFRESH_TOKEN_EXPIRE=7d
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHANNEL_USERNAME=aidevix
   TELEGRAM_PRIVATE_CHANNEL_USERNAME=sunnatbee_lessons
   FRONTEND_URL=https://your-frontend-domain.com (yoki *)
   ```

4. **Deploy:**
   - "Create Web Service" tugmasini bosing
   - Render avtomatik deploy qiladi
   - Deploy tugagandan keyin URL olasiz: `https://aidevix-backend.onrender.com`

5. **MongoDB Atlas Network Access:**
   - MongoDB Atlas → Network Access
   - "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
   - Yoki Render server IP'ni qo'shing

### API Base URL

Deploy qilingandan keyin API base URL:
```
https://aidevixbackend.onrender.com
```

### Health Check

Deploy qilingandan keyin tekshiring:
```
https://aidevix-backend.onrender.com/health
```

### Frontend uchun API URL

React yoki boshqa frontend'da:
```javascript
const API_URL = 'https://aidevixbackend.onrender.com';
```

## API Dokumentatsiya

### Swagger UI (Interaktiv)

**Umumiy API Dokumentatsiya:**
- **Production:** `https://aidevixbackend.onrender.com/api-docs`
- **Local:** `http://localhost:5000/api-docs`
- **Auth:** `SWAGGER_USERNAME` va `SWAGGER_PASSWORD` env o'zgaruvchilari orqali himoyalangan.

**Admin Panel API Dokumentatsiya:**
- **Production:** `https://aidevixbackend.onrender.com/admin-docs`
- **Local:** `http://localhost:5000/admin-docs`
- **Auth:** `SWAGGER_USERNAME` va `SWAGGER_PASSWORD` env o'zgaruvchilari orqali himoyalangan.

**Xususiyatlar:**
- ✅ Barcha endpoint'lar ko'rinadi
- ✅ Har bir endpoint'ni to'g'ridan-to'g'ri test qilish mumkin
- ✅ Request/Response misollari bor
- ✅ Authentication token qo'shish mumkin
- ✅ Status kodlar ko'rsatiladi
- ✅ O'zbek tilida to'liq tushuntirishlar
- ✅ Admin endpoint'lar alohida ko'rsatilgan

### Swagger JSON

Swagger JSON formatida export qilish:

```
https://aidevixbackend.onrender.com/api-docs.json
```

### Postman Collection

Postman'da ishlatish uchun:

1. Postman'ni oching
2. `Import` tugmasini bosing
3. `postman_collection.json` faylini tanlang
4. Collection variables'ni sozlang:
   - `baseUrl`: `https://aidevixbackend.onrender.com`

### Qo'shimcha Dokumentatsiya

- **API_DOCUMENTATION.md** - To'liq API dokumentatsiyasi (status kodlar bilan)
- **OQUVCHILAR_UCHUN.md** - O'zbek tilida qo'llanma (boshlang'ich uchun)
- **DEPLOY.md** - Render'ga deploy qo'llanmasi

## Production Checklist

- [ ] MongoDB Atlas cluster ishlayapti
- [ ] Network Access sozlangan (0.0.0.0/0)
- [ ] Environment variables to'g'ri sozlangan
- [ ] JWT secrets kuchli va xavfsiz
- [ ] CORS sozlamalari to'g'ri (FRONTEND_URL)
- [ ] HTTPS ishlayapti (Render avtomatik qiladi)
- [ ] Health check endpoint ishlayapti

## License

ISC
