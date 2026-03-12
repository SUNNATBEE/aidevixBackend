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
