# Aidevix Backend API Documentation

## Base URL

**Local Development:**
```
http://localhost:5000
```

**Production (Render):**
```
https://aidevix-backend.onrender.com
```

## Authentication

Barcha protected endpoint'lar uchun `Authorization` header kerak:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
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

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:** (Register bilan bir xil format)

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📱 Subscription Endpoints

### Verify Instagram
```http
POST /api/subscriptions/verify-instagram
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "username": "instagram_username"
}
```

### Verify Telegram
```http
POST /api/subscriptions/verify-telegram
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "username": "telegram_username",
  "telegramUserId": "123456789"
}
```

**Muhim:** `telegramUserId` real-time verification uchun kerak.

### Get Subscription Status
```http
GET /api/subscriptions/status
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptions": {
      "instagram": {
        "subscribed": true,
        "username": "instagram_user",
        "verifiedAt": "2026-02-24T..."
      },
      "telegram": {
        "subscribed": true,
        "username": "telegram_user",
        "telegramUserId": "123456789",
        "verifiedAt": "2026-02-24T..."
      }
    },
    "hasAllSubscriptions": true
  }
}
```

---

## 📚 Course Endpoints

### Get All Courses (Public)
```http
GET /api/courses
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "...",
        "title": "Course Title",
        "description": "Course Description",
        "price": 99.99,
        "thumbnail": "url",
        "instructor": {
          "_id": "...",
          "username": "instructor"
        },
        "videos": [...]
      }
    ],
    "count": 1
  }
}
```

### Get Single Course (Public)
```http
GET /api/courses/:id
```

### Create Course (Admin Only)
```http
POST /api/courses
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "New Course",
  "description": "Course Description",
  "price": 99.99,
  "thumbnail": "url",
  "category": "programming"
}
```

---

## 🎥 Video Endpoints

### Get Course Videos (Public)
```http
GET /api/videos/course/:courseId
```

### Get Video (Requires Subscriptions)
```http
GET /api/videos/:id
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Muhim:** 
- User Instagram va Telegram'ga obuna bo'lishi kerak
- Real-time subscription check qilinadi
- Agar obuna bekor qilingan bo'lsa, xato qaytadi

**Response:**
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

**Error (obuna bekor qilingan bo'lsa):**
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

### Use Video Link
```http
POST /api/videos/link/:linkId/use
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Muhim:**
- Real-time subscription check qilinadi
- Link bir martalik (isUsed bo'lgandan keyin ishlamaydi)

---

## 🔍 Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-24T12:45:37.780Z"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

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

### 404 Not Found
```json
{
  "success": false,
  "message": "Route not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📝 Frontend Integration Example

### React Example

```javascript
// API Service
const API_URL = 'https://aidevix-backend.onrender.com';

// Register
const register = async (username, email, password) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
  }
  return data;
};

// Get Courses
const getCourses = async () => {
  const response = await fetch(`${API_URL}/api/courses`);
  return await response.json();
};

// Get Video (with token)
const getVideo = async (videoId) => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

---

## 🔒 Security Notes

1. **Token Storage:** Frontend'da token'larni `localStorage` yoki `httpOnly` cookie'da saqlang
2. **HTTPS:** Production'da faqat HTTPS ishlating
3. **CORS:** `FRONTEND_URL` ni to'g'ri sozlang
4. **Rate Limiting:** Production'da rate limiting qo'shing (keyinroq)

---

## 📞 Support

Agar muammo bo'lsa:
- Health check: `GET /health`
- Server logs'ni tekshiring
- MongoDB Atlas connection'ni tekshiring
