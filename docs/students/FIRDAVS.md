# 🔐 FIRDAVS — Login | Register | User Profile

## 📋 Vazifa Qisqacha
Sen **Login**, **Register** va **User Profile** sahifalarini yasaysan.

---

## 🌿 Branch
```
feature/firdavs-auth
```
> ⚠️ **DIQQAT:** Hech qachon `main` branchga to'g'ridan-to'g'ri kod yozma!
> Faqat o'z branchingda ishlash kerak.

```bash
# GitHub'dan clone qilish
git clone https://github.com/[repo-link]/AidevixBackend.git
cd AidevixBackend

# O'z branchingni yaratish
git checkout -b feature/firdavs-auth

# Ishni saqlab push qilish
git add .
git commit -m "feat: login page completed"
git push origin feature/firdavs-auth
```

---

## 📁 Sening Fayllaring (faqat shu fayllarni o'zgartir)

```
frontend/src/
├── pages/
│   ├── LoginPage.jsx           ← Sen yozasan
│   ├── RegisterPage.jsx        ← Sen yozasan
│   └── ProfilePage.jsx         ← Sen yozasan
│
├── components/
│   └── auth/
│       ├── LoginForm.jsx        ← Sen yozasan
│       └── RegisterForm.jsx     ← Sen yozasan
│
├── store/slices/
│   └── authSlice.js             ← Allaqachon yozilgan, faqat o'qib tush
│
├── hooks/
│   └── useAuth.js               ← Allaqachon yozilgan, faqat o'qib tush
│
└── api/
    ├── authApi.js               ← Allaqachon yozilgan
    └── userApi.js               ← updateProfile() ni ishlatasan
```

---

## 🎨 Dizayn (Figma)

### Login Page
- Dark background (space navy: `#0A0E1A`)
- Chap: 3D particle sahna (Qudrat yasaydi — siz faqat joy qoldirasiz)
- O'ng: Login forma
  - Email input
  - Password input (ko'rsatish/yashirish toggle)
  - "Kirish →" tugmasi (primary gradient)
  - "Parolni unutdingizmi?" link
  - "Ro'yxatdan o'tish" link

### Register Page
- Bosqichlar ro'yxati (Stepper) — `1. Asosiy`, `2. Ijtimoiy`, `3. Parol`
- Asosiy qism:
  - Ism, Familiya inputlar
  - Email input
  - Parol + Tasdiqlash paroli
  - Checkbox: "Foydalanish shartlari"
  - Telegram ID input
  - Instagram username input
- "Ro'yxatdan o'tish →" tugmasi

### Profile Page
- Navbar'da: Profil, Kurslar, Quvestlar
- Chap panel:
  - Avatar + "Online" badge
  - Ism, Level nomi
  - Bio matn
  - XP, Kvestlar, O'rin statistikasi
  - Skills (badge'lar)
  - "Profilni tahrirlash" tugmasi
- O'ng panel:
  - Shaxsiy ma'lumotlar (Ism, Familiya, Kasb)
  - Kontakt (Telegram, Instagram, Email)
  - So'ngi faollik
- **Daily Streak** widget (ko'p kunlik ketma-ket faollik)
- **Yutuqlar** (Badges) 3ta ikonka
- **Jarayon** (progress bars har kurs uchun)

---

## 🔑 JWT va localStorage — Tushuntirish

### Nima bu JWT?
JWT (JSON Web Token) — bu server foydalanuvchiga bergan **maxsus raqamli kalit**. Uni klient `localStorage`da saqlaydi va har so'rovda serverga yuboradi.

### Token turlari:
| Token | Muddati | Vazifasi |
|-------|---------|----------|
| `accessToken` | 15 daqiqa | API so'rovlar uchun (Authorization header) |
| `refreshToken` | 7 kun | Yangi accessToken olish uchun |

### localStorage da qanday saqlanadi?
```javascript
// Bu kod authSlice.js da allaqachon yozilgan:
localStorage.setItem('accessToken', 'eyJhbGci...')
localStorage.setItem('refreshToken', 'eyJhbGci...')
localStorage.setItem('user', JSON.stringify({ id, username, email, role }))
```

### Har so'rovda token qanday yuboriladi?
```javascript
// axiosInstance.js da interceptor bor (allaqachon yozilgan):
// Har so'rovga avtomatik qo'shiladi:
headers: { Authorization: `Bearer ${accessToken}` }
```

### Token eskirsa nima bo'ladi?
1. Server `401 Unauthorized` qaytaradi
2. `axiosInstance.js` interceptor bu xatoni ushlaydi
3. `refreshToken` yordamida yangi `accessToken` oladi
4. So'rovni qayta yuboradi
5. Agar `refreshToken` ham eskirsa → logout qilinadi

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `admin`
- **Password:** `admin123`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/auth/register` | POST | ❌ Yo'q | Ro'yxatdan o'tish |
| `/api/auth/login` | POST | ❌ Yo'q | Kirish |
| `/api/auth/logout` | POST | ✅ Bearer | Chiqish |
| `/api/auth/refresh` | POST | ❌ Yo'q | Token yangilash |
| `/api/auth/me` | GET | ✅ Bearer | Profil ma'lumotlari |
| `/api/xp/stats` | GET | ✅ Bearer | XP, level, streak |
| `/api/xp/profile` | PUT | ✅ Bearer | Bio, skills yangilash |

### Misol — Register:
```javascript
import { authApi } from '@api/authApi'

const handleRegister = async (formData) => {
  try {
    const { data } = await authApi.register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    })
    // data.data.accessToken, data.data.refreshToken, data.data.user
  } catch (err) {
    console.error(err.response.data.message)
  }
}
```

### Misol — Login:
```javascript
import { useDispatch } from 'react-redux'
import { login } from '@store/slices/authSlice'

const dispatch = useDispatch()

const handleLogin = async (formData) => {
  const result = await dispatch(login({
    email: formData.email,
    password: formData.password,
  }))
  if (login.fulfilled.match(result)) {
    navigate('/') // Bosh sahifaga yo'naltirish
  }
}
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
react-hook-form    # Forma validation
react-hot-toast    # Xato/muvaffaqiyat xabarlari
react-router-dom   # navigate() uchun
framer-motion      # Animatsiyalar
react-icons        # Ikonkalar (FiEye, FiEyeOff, FiMail, ...)
@reduxjs/toolkit   # Redux state
```

### Ishlatish misoli:
```javascript
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi'
import { motion } from 'framer-motion'
```

---

## 🎨 Tailwind + DaisyUI Komponentlar

```jsx
{/* Input */}
<input className="input input-bordered w-full bg-base-200" />

{/* Button */}
<button className="btn btn-primary w-full">Kirish →</button>

{/* Error xabar */}
<p className="text-error text-sm mt-1">{errors.email?.message}</p>

{/* Avatar */}
<div className="avatar">
  <div className="w-24 rounded-full ring ring-primary">
    <img src={user.avatar} />
  </div>
</div>

{/* Badge */}
<span className="badge badge-primary">Level 12</span>
```

---

## 📊 Redux State Ishlatish

```javascript
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectIsLoggedIn, selectAuthLoading } from '@store/slices/authSlice'

const user = useSelector(selectUser)
const isLoggedIn = useSelector(selectIsLoggedIn)
const loading = useSelector(selectAuthLoading)
```

---

## ✅ Tekshiruv Ro'yxati (Pull Request oldidan)
- [ ] Login sahifasi ishlaydi (email/parol bilan kirish)
- [ ] Register sahifasi ishlaydi (yangi user yaratiladi)
- [ ] Xato xabarlari ko'rsatiladi (noto'g'ri parol va h.k.)
- [ ] Token `localStorage`da saqlanadi
- [ ] Profile sahifasi foydalanuvchi ma'lumotlarini ko'rsatadi
- [ ] Bio va skills yangilanadi
- [ ] Dizayn Figma bilan mos keladi
- [ ] `main` branchga kod yozilmagan

---

> 💡 **Maslahat:** Swagger UI da endpointlarni sinab ko'r, so'ng frontend'da ishlatgin.

---

## 🌐 BACKEND API — TO'LIQ QO'LLANMA

**Backend:** Node.js + Express.js | **Port:** 5000 | **Database:** MongoDB Atlas
**Jami endpointlar: ~75 ta**

### 🔗 Server URL'lari

| Muhit | URL |
|-------|-----|
| Local (Development) | `http://localhost:5000` |
| Production (Render) | `https://aidevixbackend.onrender.com` |

---

### 📖 Swagger UI — Interaktiv Hujjat

```
URL:      http://localhost:5000/api-docs
Username: admin
Password: admin123
```

**Swagger'da token kiritish:**
1. `http://localhost:5000/api-docs` ni oching
2. Yuqori o'ngda **"Authorize 🔓"** tugmasini bosing
3. `Bearer eyJhbGciOiJ...` formatida token kiriting
4. **"Authorize"** bosing — endi `🔒` belgili endpointlar ishlaydi

> **Swagger'da token qanday olish?**
> Authentication → POST `/api/auth/login` → Execute → `accessToken` ni ko'chir → Authorize

---

## 📋 BARCHA ENDPOINTLAR (~75 ta)

### 1️⃣ AUTHENTICATION — `/api/auth` (5 ta) ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **POST** | **`/api/auth/register`** | ❌ | **Ro'yxatdan o'tish** |
| **POST** | **`/api/auth/login`** | ❌ | **Tizimga kirish** |
| **POST** | **`/api/auth/refresh-token`** | ❌ | **AccessToken yangilash** |
| **POST** | **`/api/auth/logout`** | ✅ | **Tizimdan chiqish** |
| **GET** | **`/api/auth/me`** | ✅ | **Mening profilim** |

**POST `/api/auth/register`** — Yangi foydalanuvchi
```json
// So'rov body:
{ "username": "ahmadjon", "email": "ahmadjon@gmail.com", "password": "secret123" }

// Muvaffaqiyatli javob (201):
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "username": "ahmadjon",
      "email": "ahmadjon@gmail.com",
      "role": "user",
      "isActive": true,
      "subscriptions": {
        "instagram": { "subscribed": false, "username": null },
        "telegram": { "subscribed": false, "username": null }
      }
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Xato javoblar:
// 400: { "success": false, "message": "User with this email already exists." }
// 400: { "success": false, "message": "Please provide username, email, and password." }
```

**POST `/api/auth/login`** — Tizimga kirish
```json
// So'rov body:
{ "email": "ahmadjon@gmail.com", "password": "secret123" }

// Muvaffaqiyatli javob (200):
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "_id": "65f1...", "username": "ahmadjon", "email": "ahmadjon@gmail.com",
      "role": "user",
      "subscriptions": {
        "instagram": { "subscribed": true, "username": "ahmadjon_ig" },
        "telegram": { "subscribed": true, "telegramUserId": "987654321" }
      }
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}

// Xato javoblar:
// 401: { "success": false, "message": "Invalid email or password." }
// 403: { "success": false, "message": "Account is deactivated." }
```

**POST `/api/auth/refresh-token`** — Token yangilash
```json
// So'rov: { "refreshToken": "eyJ..." }
// Javob: { "success": true, "data": { "accessToken": "eyJ...yangi token..." } }
// ⚠️ AccessToken 15 daqiqada eskiradi, keyin shu endpoint chaqiriladi
```

**GET `/api/auth/me`** — Mening profilim (Token kerak)
```json
// Javob (200):
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f1...", "username": "ahmadjon", "email": "ahmadjon@gmail.com",
      "role": "user", "isActive": true,
      "subscriptions": {
        "instagram": { "subscribed": true, "username": "ahmadjon_ig", "verifiedAt": "2026-03-10T08:00:00.000Z" },
        "telegram": { "subscribed": true, "telegramUserId": "987654321", "verifiedAt": "2026-03-10T08:05:00.000Z" }
      },
      "createdAt": "2026-01-15T08:30:00.000Z"
    }
  }
}
```

---

### 2️⃣ SUBSCRIPTIONS — `/api/subscriptions` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/subscriptions/status` | ✅ | Obuna holati |
| POST | `/api/subscriptions/verify-instagram` | ✅ | Instagram |
| POST | `/api/subscriptions/verify-telegram` | ✅ | Telegram |

---

### 3️⃣ COURSES — `/api/courses` (9 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/courses` | ❌ | Barcha kurslar |
| GET | `/api/courses/top` | ❌ | Top kurslar |
| GET | `/api/courses/categories` | ❌ | Kategoriyalar |
| GET | `/api/courses/:id` | ❌ | Bitta kurs |
| GET | `/api/courses/:id/recommended` | ❌ | Tavsiya etilgan |
| POST | `/api/courses/:id/rate` | ✅ | Baholash |
| POST | `/api/courses` | ✅ Admin | Yaratish |
| PUT | `/api/courses/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/courses/:id` | ✅ Admin | O'chirish |

---

### 4️⃣ VIDEOS — `/api/videos` (9 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/videos/course/:courseId` | ❌ | Kurs videolari |
| GET | `/api/videos/:id` | ✅ + Obuna | Video + Telegram link |
| POST | `/api/videos/link/:linkId/use` | ✅ | Linkni belgilash |
| GET | `/api/videos/:id/questions` | ❌ | Q&A |
| POST | `/api/videos/:id/questions` | ✅ | Savol berish |
| POST | `/api/videos/:id/questions/:qId/answer` | ✅ Admin | Javob |
| POST | `/api/videos` | ✅ Admin | Yaratish |
| PUT | `/api/videos/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/videos/:id` | ✅ Admin | O'chirish |

---

### 5️⃣ XP TIZIMI — `/api/xp` (8 ta) ← SEN ISHLATASAN (Profil uchun)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **GET** | **`/api/xp/stats`** | ✅ | **XP, level, streak, badges** |
| **PUT** | **`/api/xp/profile`** | ✅ | **Bio, skills, avatar yangilash** |
| POST | `/api/xp/video-watched/:videoId` | ✅ | +50 XP |
| GET | `/api/xp/quiz/video/:videoId` | ✅ | Video quizi |
| POST | `/api/xp/quiz/:quizId` | ✅ | Quiz yechish |
| GET | `/api/xp/weekly-leaderboard` | ❌ | Haftalik TOP |
| POST | `/api/xp/streak-freeze` | ✅ | Freeze ishlatish |
| POST | `/api/xp/streak-freeze/add` | ✅ | Freeze qo'shish |

**GET `/api/xp/stats`** — Profil sahifasi uchun
```json
// Javob (200):
{
  "success": true,
  "data": {
    "xp": 1240, "level": 2, "levelProgress": 24, "xpToNextLevel": 760,
    "streak": 12, "lastActivityDate": "2026-03-17T10:00:00.000Z",
    "badges": [{ "name": "First Video", "icon": "🎬", "earnedAt": "..." }],
    "videosWatched": 42, "quizzesCompleted": 15,
    "bio": "Python dasturchi. Backend va AI ishlab chiqaman.",
    "skills": ["Python", "Django", "React"],
    "avatar": "https://cloudinary.com/avatar.jpg"
  }
}
```

**PUT `/api/xp/profile`** — Bio va skills yangilash
```json
// So'rov body:
{
  "bio": "Python dasturchi. Backend va AI ishlab chiqaman.",
  "skills": ["Python", "Django", "React"],
  "avatar": "https://cloudinary.com/new-avatar.jpg"
}
// Javob: { "success": true, "data": { "bio": "...", "skills": [...], "avatar": "..." } }
```

---

### 6️⃣ RANKING — `/api/ranking` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/ranking/courses` | ❌ | Top kurslar |
| GET | `/api/ranking/users` | ❌ | Top foydalanuvchilar |
| GET | `/api/ranking/users/:userId/position` | ✅ | O'z pozitsiyasi |

---

### 7️⃣–1️⃣6️⃣ QOLGAN ENDPOINTLAR

| Guruh | Endpoint | Soni |
|-------|----------|------|
| Projects | `/api/projects` | 6 ta |
| Enrollments | `/api/enrollments` | 4 ta |
| Wishlist | `/api/wishlist` | 3 ta |
| Certificates | `/api/certificates` | 2 ta |
| Sections | `/api/sections` | 5 ta |
| Follow | `/api/follow` | 4 ta |
| Challenges | `/api/challenges` | 3 ta |
| Payments | `/api/payments` | 3 ta |
| Admin | `/api/admin` | 5 ta |
| Upload | `/api/upload` | 2 ta |
| Health | `/health` | 1 ta |

---

### ❌ HTTP Status Kodlar

| Kod | Ma'no | Sabab |
|-----|-------|-------|
| `200` | OK | Muvaffaqiyat |
| `201` | Created | Yaratildi |
| `400` | Bad Request | Noto'g'ri ma'lumot |
| `401` | Unauthorized | Token yo'q/eskirgan |
| `403` | Forbidden | Ruxsat yo'q |
| `404` | Not Found | Topilmadi |
| `429` | Too Many Requests | Rate limit — Auth: 10 req/15min |
| `500` | Server Error | Server xatosi |

### 🔄 JWT Token Oqimi

```
1. Register/Login → accessToken (15min) + refreshToken (7kun) olindi
2. Har so'rovda: Authorization: Bearer {accessToken}
3. 401 xatosi → axiosInstance refresh qiladi → /api/auth/refresh-token
4. Yangi accessToken → so'rov qayta yuboriladi
5. RefreshToken ham eskirsa → logout → /login sahifasiga
```
