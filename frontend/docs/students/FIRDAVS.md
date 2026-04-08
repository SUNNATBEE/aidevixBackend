# 🔐 FIRDAVS — Login | Register | User Profile (Next.js + TypeScript)

> [!IMPORTANT]
> **DIQQAT:** Loyiha **Next.js 14 (App Router)** ga o'tkazildi. Davom etishdan oldin [Next.js Migratsiya Qo'llanmasini](../MIGRATION_GUIDE.md) to'liq o'qib chiqing.


## 📋 Vazifa Qisqacha
Sen **Login**, **Register** va **User Profile** sahifalarini **Next.js App Router** va **TypeScript** yordamida yasaysan.

---

## 🌿 Branch
```
feature/firdavs-auth
```
> ⚠️ **DIQQAT:** Hech qachon `main` branchga to'g'ridan-to'g'ri kod yozma!

```bash
git clone https://github.com/[repo-link]/AidevixBackend.git
cd AidevixBackend
git checkout -b feature/firdavs-auth

# Ishni saqlab push qilish
git add .
git commit -m "feat: login page completed"
git push origin feature/firdavs-auth
```

---

## ⚡ Nega Next.js + TypeScript?

### Next.js (React o'rniga)
| React (CSR) | Next.js (SSR/SSG) |
|-------------|-------------------|
| Brauzer bo'sh HTML oladi, keyin JS yuklab render qiladi | Server tayyor HTML yuboradi — **SEO 10x yaxshi** |
| Bitta `index.html` — Google bot sahifani tushunmaydi | Har sahifa alohida HTML — Google **har sahifani indekslaydi** |
| `react-router-dom` kerak | Fayl tizimi = routing (`/app/login/page.tsx` = `/login`) |
| `useEffect` da API chaqirish kerak | Server Component'da **to'g'ridan-to'g'ri `fetch`** — tezroq |

### TypeScript (JavaScript o'rniga)
| JavaScript | TypeScript |
|-----------|------------|
| Xatolar faqat **brauzerda** ko'rinadi (runtime) | Xatolar **yozish paytida** ko'rinadi (compile-time) |
| `user.nmae` — brauzerda `undefined` | `user.nmae` — **IDE qizil chiziq chiqaradi** |
| API javobini `console.log` qilib ko'rish kerak | Tip yozsang, `.` bosib **barcha pollar ko'rinadi** |

---

## 📁 Sening Fayllaring (Next.js App Router)

```
frontend/
├── app/
│   ├── login/
│   │   └── page.tsx              ← Sen yozasan (Login sahifasi)
│   ├── register/
│   │   └── page.tsx              ← Sen yozasan (Register sahifasi)
│   ├── profile/
│   │   └── page.tsx              ← Sen yozasan (Profile sahifasi)
│   └── layout.tsx                ← Root layout (allaqachon bor)
│
├── components/
│   └── auth/
│       ├── LoginForm.tsx          ← Sen yozasan
│       └── RegisterForm.tsx       ← Sen yozasan
│
├── types/
│   ├── auth.ts                    ← Tayyor turlar (pastda berilgan)
│   └── api.ts                     ← API javoblari turlari
│
├── lib/
│   ├── api/
│   │   ├── axiosInstance.ts       ← Allaqachon yozilgan
│   │   ├── authApi.ts             ← Allaqachon yozilgan
│   │   └── userApi.ts             ← updateProfile() ni ishlatasan
│   └── hooks/
│       └── useAuth.ts             ← Allaqachon yozilgan
│
└── store/slices/
    └── authSlice.ts               ← Allaqachon yozilgan
```

> **Muhim farq:** Next.js da `pages/` emas, `app/` papka ishlatiladi (App Router).
> Har sahifa `page.tsx` deb nomlanadi. Papka nomi = URL manzili.
> Masalan: `app/login/page.tsx` → brauzerda `/login`

---

## 🔑 TypeScript Turlari (Types)

Quyidagi turlarni `types/auth.ts` fayliga yozing. Ular **backenddan keladigan har qanday javob** uchun tayyor qolib:

```typescript
// types/auth.ts

/** Foydalanuvchi obyekti — backenddan keladi */
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';       // faqat ikki xil qiymat bo'lishi mumkin
  isActive: boolean;
  firstName?: string;            // ? = ixtiyoriy (bo'lmasligi mumkin)
  lastName?: string;
  subscriptions: {
    instagram: {
      subscribed: boolean;
      username: string | null;
      verifiedAt?: string;
    };
    telegram: {
      subscribed: boolean;
      username: string | null;
      telegramUserId?: string;
      verifiedAt?: string;
    };
  };
  createdAt: string;
}

/** Login/Register javob turi */
export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

/** Register uchun form turi */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/** Login uchun form turi */
export interface LoginFormData {
  email: string;
  password: string;
}

/** XP statistika — profil sahifasi uchun */
export interface UserStats {
  xp: number;
  level: number;
  levelProgress: number;
  xpToNextLevel: number;
  streak: number;
  lastActivityDate: string;
  badges: Badge[];
  videosWatched: number;
  quizzesCompleted: number;
  bio: string | null;
  skills: string[];
  avatar: string | null;
  streakFreezes: number;
}

export interface Badge {
  name: string;
  icon: string;
  earnedAt: string;
}

/** Umumiy API xato javobi */
export interface ApiError {
  success: false;
  message: string;
}
```

---

## 🎨 Dizayn (Figma)

### Login Page (`/login`)
- Dark background (space navy: `#0A0E1A`)
- Chap: 3D particle sahna (Qudrat yasaydi — siz faqat joy qoldirasiz)
- O'ng: Login forma
  - Email input
  - Password input (ko'rsatish/yashirish toggle)
  - "Kirish →" tugmasi (primary gradient)
  - "Parolni unutdingizmi?" link
  - "Ro'yxatdan o'tish" link

### Register Page (`/register`)
- Bosqichlar ro'yxati (Stepper) — `1. Asosiy`, `2. Ijtimoiy`, `3. Parol`
- Asosiy qism:
  - Ism, Familiya inputlar
  - Email input
  - Parol + Tasdiqlash paroli
  - Checkbox: "Foydalanish shartlari"
  - Telegram ID input
  - Instagram username input
- "Ro'yxatdan o'tish →" tugmasi

### Profile Page (`/profile`)
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

## 🔑 JWT va Token — Next.js da qanday ishlaydi?

### React'dagi eski usul (localStorage):
```javascript
// ❌ Eski — React'da localStorage ishlatardik
localStorage.setItem('accessToken', 'eyJ...')
```

### Next.js dagi yangi usul (Cookies):
```typescript
// ✅ Yangi — Next.js da cookies ishlatamiz (SSR ishlashi uchun)
// Server Component'larda localStorage mavjud EMAS, faqat cookies ishlaydi.

// Login qilgandan keyin token saqlash:
import Cookies from 'js-cookie'

const handleLogin = async (data: LoginFormData) => {
  const res = await authApi.login(data)
  // Token cookie ga saqlash — server ham o'qiy oladi
  Cookies.set('accessToken', res.data.accessToken, { expires: 1/96 })  // 15 daqiqa
  Cookies.set('refreshToken', res.data.refreshToken, { expires: 7 })   // 7 kun
}
```

### Token turlari:
| Token | Muddati | Vazifasi |
|-------|---------|----------|
| `accessToken` | 15 daqiqa | API so'rovlar uchun (Authorization header) |
| `refreshToken` | 7 kun | Yangi accessToken olish uchun |

### Token eskirsa nima bo'ladi?
1. Server `401 Unauthorized` qaytaradi
2. `axiosInstance.ts` interceptor bu xatoni ushlaydi
3. `refreshToken` yordamida yangi `accessToken` oladi
4. So'rovni qayta yuboradi
5. Agar `refreshToken` ham eskirsa → logout → `/login` ga redirect

---

## 📝 Kod Misollari (Next.js + TypeScript)

### Login sahifasi (`app/login/page.tsx`):
```tsx
'use client'   // ← Bu client component ekanini bildiradi

import { useState } from 'react'
import { useRouter } from 'next/navigation'       // next/router EMAS!
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Link from 'next/link'                       // react-router Link EMAS!
import type { LoginFormData, AuthResponse } from '@/types/auth'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>()

  const onSubmit = async (formData: LoginFormData): Promise<void> => {
    try {
      const res: AuthResponse = await authApi.login(formData)
      // Token saqlash (cookie yoki store)
      toast.success('Muvaffaqiyatli kirdingiz!')
      router.push('/')   // navigate() EMAS, router.push() ishlatiladi
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0E1A]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-base-200 w-full max-w-md p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Tizimga Kirish</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-base-content/50" />
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                placeholder="email@example.com"
                {...register('email', {
                  required: 'Email kiriting',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email noto\'g\'ri' }
                })}
              />
            </div>
            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label"><span className="label-text">Parol</span></label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-base-content/50" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input input-bordered w-full pl-10 pr-10"
                placeholder="••••••••"
                {...register('password', { required: 'Parol kiriting' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-base-content/50"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? <span className="loading loading-spinner" /> : 'Kirish →'}
          </button>
        </form>

        <div className="text-center mt-4 space-y-2">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Parolni unutdingizmi?
          </Link>
          <p className="text-sm">
            Hisobingiz yo'qmi?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
```

> **Muhim farqlar (React vs Next.js):**
> - `navigate('/login')` → `router.push('/login')`
> - `import { Link } from 'react-router-dom'` → `import Link from 'next/link'`
> - `<Link to="/login">` → `<Link href="/login">`
> - `useNavigate()` → `useRouter()` (`next/navigation` dan)
> - Fayl nomi `.jsx` → `.tsx`
> - Har bir client-side component tepasiga `'use client'` yozish **SHART**

---

## 🛠️ Texnologiyalar

```bash
# Next.js loyihada o'rnatilgan:
next                 # Framework (SSR, routing, bundler)
typescript           # Tip xavfsizlik
react-hook-form      # Forma validation
react-hot-toast      # Xato/muvaffaqiyat xabarlari
framer-motion        # Animatsiyalar
react-icons          # Ikonkalar (FiEye, FiEyeOff, FiMail, ...)
js-cookie            # Cookie bilan ishlash (token saqlash)

# O'CHIRILADIGAN (React uchun edi, Next.js da kerak emas):
# react-router-dom   ← Next.js o'zida routing bor
```

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `Aidevix`
- **Password:** `sunnatbee`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/auth/register` | POST | ❌ Yo'q | Ro'yxatdan o'tish |
| `/api/auth/login` | POST | ❌ Yo'q | Kirish |
| `/api/auth/logout` | POST | ✅ Bearer | Chiqish |
| `/api/auth/refresh-token` | POST | ❌ Yo'q | Token yangilash |
| `/api/auth/me` | GET | ✅ Bearer | Profil ma'lumotlari |
| `/api/xp/stats` | GET | ✅ Bearer | XP, level, streak |
| `/api/xp/profile` | PUT | ✅ Bearer | Bio, skills yangilash |

### Misol — Register (TypeScript bilan):
```typescript
import { authApi } from '@/lib/api/authApi'
import type { RegisterFormData, AuthResponse } from '@/types/auth'

const handleRegister = async (formData: RegisterFormData): Promise<void> => {
  try {
    const { data }: { data: AuthResponse } = await authApi.register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    })
    // data.data.accessToken — tip bilan himoyalangan
    // data.data.user.role — faqat 'user' | 'admin'
  } catch (err: unknown) {
    const error = err as { response?: { data?: ApiError } }
    console.error(error.response?.data?.message)
  }
}
```

---

## ✅ Tekshiruv Ro'yxati (Pull Request oldidan)
- [ ] Login sahifasi ishlaydi (email/parol bilan kirish)
- [ ] Register sahifasi ishlaydi (yangi user yaratiladi)
- [ ] Xato xabarlari ko'rsatiladi (noto'g'ri parol va h.k.)
- [ ] Token **cookie** da saqlanadi (localStorage EMAS)
- [ ] Profile sahifasi foydalanuvchi ma'lumotlarini ko'rsatadi
- [ ] Bio va skills yangilanadi
- [ ] Barcha fayl nomlari `.tsx` yoki `.ts` (`.jsx` EMAS)
- [ ] Har qanday `any` tip ishlatilmagan (strict TypeScript)
- [ ] `'use client'` faqat kerakli komponentlarda yozilgan
- [ ] Dizayn Figma bilan mos keladi
- [ ] `main` branchga kod yozilmagan

---

> 💡 **Maslahat:** Swagger UI da endpointlarni sinab ko'r, so'ng frontend'da ishlatgin.
> TypeScript tiplarini yozish qiyin tuyulsa — Swagger JSON javobidan nusxa olib, `types/` ga yasagin.
