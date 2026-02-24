# Aidevix Backend API - O'quvchilar uchun qo'llanma

## 🎯 Kirish

Bu qo'llanma sizga Aidevix Backend API'ni qanday ishlatishni o'rgatadi. API online kurs platformasi uchun yaratilgan va quyidagi funksiyalarni ta'minlaydi:

- ✅ Foydalanuvchi ro'yxatdan o'tish va kirish
- ✅ Instagram va Telegram obuna tekshiruvi
- ✅ Kurslar va videolar bilan ishlash
- ✅ Real-time obuna tekshiruvi (video ko'rish uchun)

## 📍 API Base URL

**Production (Ishlayotgan server):**
```
https://aidevixbackend.onrender.com
```

**Local Development (Lokal server):**
```
http://localhost:5000
```

## 🚀 Qanday boshlash?

### 1-qadam: Health Check

Avval server ishlayotganini tekshiring:

```bash
GET https://aidevixbackend.onrender.com/health
```

**Javob:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-24T12:45:37.780Z"
}
```

### 2-qadam: Ro'yxatdan o'tish

Yangi foydalanuvchi yarating:

```bash
POST https://aidevixbackend.onrender.com/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Muvaffaqiyatli javob (201):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "subscriptions": {
        "instagram": { "subscribed": false },
        "telegram": { "subscribed": false }
      }
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ Muhim:** `accessToken` va `refreshToken` ni saqlang! Keyingi so'rovlarda ishlatishingiz kerak.

### 3-qadam: Login (Agar allaqachon ro'yxatdan o'tgan bo'lsangiz)

```bash
POST https://aidevixbackend.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Javob:** Register bilan bir xil format, `accessToken` va `refreshToken` qaytadi.

## 🔐 Authentication (Kimlik tasdiqlash)

Barcha protected endpoint'lar uchun `Authorization` header kerak:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Misol:**
```bash
GET https://aidevixbackend.onrender.com/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📱 Obuna Tekshiruvi

Video ko'rish uchun Instagram va Telegram'ga obuna bo'lishingiz kerak.

### Instagram Obuna Tekshiruvi

```bash
POST https://aidevixbackend.onrender.com/api/subscriptions/verify-instagram
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "username": "your_instagram_username"
}
```

**Status kodlar:**
- `200` - Muvaffaqiyatli (obuna bo'lgan yoki bo'lmagan)
- `400` - Username berilmagan
- `401` - Token noto'g'ri yoki muddati o'tgan

### Telegram Obuna Tekshiruvi

```bash
POST https://aidevixbackend.onrender.com/api/subscriptions/verify-telegram
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "username": "your_telegram_username",
  "telegramUserId": "123456789"
}
```

**⚠️ Muhim:** `telegramUserId` real-time verification uchun majburiy!

**Status kodlar:**
- `200` - Muvaffaqiyatli
- `400` - Username yoki telegramUserId berilmagan
- `401` - Token noto'g'ri

### Obuna Holatini Tekshirish

```bash
GET https://aidevixbackend.onrender.com/api/subscriptions/status
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Javob:**
```json
{
  "success": true,
  "data": {
    "subscriptions": {
      "instagram": {
        "subscribed": true,
        "username": "your_username",
        "verifiedAt": "2026-02-24T..."
      },
      "telegram": {
        "subscribed": true,
        "username": "your_username",
        "telegramUserId": "123456789",
        "verifiedAt": "2026-02-24T..."
      }
    },
    "hasAllSubscriptions": true
  }
}
```

## 📚 Kurslar

### Barcha Kurslarni Olish (Public)

```bash
GET https://aidevixbackend.onrender.com/api/courses
```

**Status kodlar:**
- `200` - Muvaffaqiyatli
- `500` - Server xatosi

**Javob:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "...",
        "title": "JavaScript Fundamentals",
        "description": "Learn JavaScript from scratch",
        "price": 99.99,
        "thumbnail": "https://example.com/thumbnail.jpg",
        "instructor": {
          "_id": "...",
          "username": "instructor"
        }
      }
    ],
    "count": 1
  }
}
```

### Bitta Kursni Olish

```bash
GET https://aidevixbackend.onrender.com/api/courses/:id
```

**Status kodlar:**
- `200` - Muvaffaqiyatli
- `404` - Kurs topilmadi
- `500` - Server xatosi

## 🎥 Videolar

### Kurs Videolarini Olish (Public)

```bash
GET https://aidevixbackend.onrender.com/api/videos/course/:courseId
```

**Status kodlar:**
- `200` - Muvaffaqiyatli
- `500` - Server xatosi

### Video Olish (Obuna Kerak)

**⚠️ Muhim:** Bu endpoint uchun Instagram va Telegram'ga obuna bo'lishingiz kerak!

```bash
GET https://aidevixbackend.onrender.com/api/videos/:id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Status kodlar:**
- `200` - Muvaffaqiyatli (obuna bo'lgan)
- `403` - Obuna bekor qilingan yoki obuna bo'lmagan
  ```json
  {
    "success": false,
    "message": "Siz obuna bekor qildingiz. Video ko'ra olmaysiz. Iltimos, Instagram va Telegram ga qayta obuna bo'ling.",
    "subscriptions": {
      "instagram": false,
      "telegram": false
    },
    "missingSubscriptions": ["Instagram", "Telegram"]
  }
  ```
- `401` - Token noto'g'ri
- `404` - Video topilmadi
- `500` - Server xatosi

**Muvaffaqiyatli javob:**
```json
{
  "success": true,
  "data": {
    "video": {
      "id": "...",
      "title": "Video Title",
      "description": "Video Description",
      "duration": 1200,
      "course": {...}
    },
    "videoLink": {
      "id": "...",
      "telegramLink": "https://t.me/...",
      "isUsed": false,
      "expiresAt": null
    }
  }
}
```

### Video Linkni Ishlatish

```bash
POST https://aidevixbackend.onrender.com/api/videos/link/:linkId/use
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Status kodlar:**
- `200` - Link muvaffaqiyatli ishlatildi
- `400` - Link allaqachon ishlatilgan yoki muddati o'tgan
- `403` - Obuna bekor qilingan (real-time check)
- `404` - Link topilmadi
- `401` - Token noto'g'ri
- `500` - Server xatosi

## ❌ Xato Kodlari

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

**Sabablar:**
- Majburiy maydonlar berilmagan
- Noto'g'ri format (masalan, email)
- Parol 6 belgidan qisqa

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

**Yechim:**
- Token'ni qayta oling (login yoki refresh-token)
- Token'ni to'g'ri yuborayotganingizni tekshiring

### 403 Forbidden
```json
{
  "success": false,
  "message": "Siz obuna bekor qildingiz. Video ko'ra olmaysiz.",
  "subscriptions": {
    "instagram": false,
    "telegram": false
  }
}
```

**Yechim:**
- Instagram va Telegram'ga qayta obuna bo'ling
- Obuna holatini tekshiring: `GET /api/subscriptions/status`

### 404 Not Found
```json
{
  "success": false,
  "message": "Route not found"
}
```

**Yechim:**
- URL'ni to'g'ri yozganingizni tekshiring
- Resource ID'ni to'g'ri yuborayotganingizni tekshiring

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

**Yechim:**
- Server ishlayotganini tekshiring: `GET /health`
- Keyinroq qayta urinib ko'ring

## 🔄 Token Refresh

Access token muddati o'tganda, refresh token bilan yangi token oling:

```bash
POST https://aidevixbackend.onrender.com/api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

**Status kodlar:**
- `200` - Yangi access token olingan
- `400` - Refresh token berilmagan
- `401` - Refresh token noto'g'ri yoki muddati o'tgan

## 📝 Frontend'da Ishlatish (React Misol)

```javascript
// API Service
const API_URL = 'https://aidevixbackend.onrender.com';

// Register
const register = async (username, email, password) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  
  if (response.status === 201) {
    const data = await response.json();
    // Token'larni saqlash
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    return data;
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

// Get Courses
const getCourses = async () => {
  const response = await fetch(`${API_URL}/api/courses`);
  
  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error('Failed to fetch courses');
  }
};

// Get Video (with token)
const getVideo = async (videoId) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 200) {
    return await response.json();
  } else if (response.status === 403) {
    const error = await response.json();
    throw new Error(error.message); // Obuna bekor qilingan
  } else {
    throw new Error('Failed to fetch video');
  }
};
```

## 🛠️ Postman'da Ishlatish

1. Postman'ni oching
2. `postman_collection.json` faylini import qiling
3. Collection variables'ni sozlang:
   - `baseUrl`: `https://aidevixbackend.onrender.com`
4. Register yoki Login qiling (token avtomatik saqlanadi)
5. Boshqa endpoint'larni sinab ko'ring

## 📖 Swagger Dokumentatsiya

Interaktiv API dokumentatsiyasini ko'rish:

```
https://aidevixbackend.onrender.com/api-docs
```

Bu yerda:
- ✅ Barcha endpoint'lar ko'rinadi
- ✅ Har bir endpoint'ni to'g'ridan-to'g'ri test qilish mumkin
- ✅ Request/Response misollari bor
- ✅ Authentication token qo'shish mumkin

## ⚠️ Muhim Eslatmalar

1. **Real-time Obuna Tekshiruvi:**
   - Video ko'rishdan oldin har safar obuna tekshiriladi
   - Agar obuna bekor qilsangiz, video ko'ra olmaysiz
   - Xabar: "Siz obuna bekor qildingiz. Video ko'ra olmaysiz."

2. **Token Saqlash:**
   - `accessToken` - 15 daqiqa (qisqa muddat)
   - `refreshToken` - 7 kun (uzoq muddat)
   - Token'larni xavfsiz saqlang (localStorage yoki httpOnly cookie)

3. **Telegram User ID:**
   - Real-time verification uchun `telegramUserId` kerak
   - Username yetarli emas

4. **Video Linklar:**
   - Bir martalik (isUsed bo'lgandan keyin ishlamaydi)
   - Real-time obuna tekshiruvi qilinadi

## 🆘 Yordam

Agar muammo bo'lsa:
1. Health check qiling: `GET /health`
2. Swagger dokumentatsiyasini ko'ring: `/api-docs`
3. Postman Collection'ni ishlating
4. Server loglarini tekshiring

## 📞 Aloqa

- API Base URL: `https://aidevixbackend.onrender.com`
- Swagger Docs: `https://aidevixbackend.onrender.com/api-docs`
- Health Check: `https://aidevixbackend.onrender.com/health`

---

**Omad! 🚀**
