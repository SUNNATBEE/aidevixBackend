# CLAUDE.md — Firdavs Auth Context

## Vazifa: Login | Register | Profile sahifalari
Branch: `feature/firdavs-auth` | Backend tegma!

## Mening fayllari (faqat shu)
```
pages/LoginPage.jsx        ✅ mavjud
pages/RegisterPage.jsx     ✅ mavjud
pages/ProfilePage.jsx      ✅ mavjud
components/auth/LoginForm.jsx    ✅ mavjud
components/auth/RegisterForm.jsx ✅ mavjud
```

## O'qib chiqiladigan (o'zgartirma)
```
store/slices/authSlice.js   — Redux auth state
hooks/useAuth.js            — isLoggedIn, user, loading, error
api/authApi.js              — register(), login(), logout(), me()
api/userApi.js              — updateProfile()
```

## API Endpointlar (ishlataman)
| Method | URL | Auth |
|--------|-----|------|
| POST | `/api/auth/register` | ❌ |
| POST | `/api/auth/login` | ❌ |
| POST | `/api/auth/logout` | ✅ Bearer |
| GET  | `/api/auth/me` | ✅ Bearer |
| GET  | `/api/xp/stats` | ✅ Bearer |
| PUT  | `/api/xp/profile` | ✅ Bearer |

## Register body:
```json
{ "username": "ali", "email": "ali@gmail.com", "password": "secret123" }
```

## Login body:
```json
{ "email": "ali@gmail.com", "password": "secret123" }
```

## Javob formati:
```javascript
data.data.accessToken  // token
data.data.user         // user object
```

## Redux ishlatish:
```javascript
import { useSelector, useDispatch } from 'react-redux'
import { login, register } from '@store/slices/authSlice'
import { selectUser, selectIsLoggedIn, selectAuthLoading } from '@store/slices/authSlice'

const dispatch = useDispatch()
const user = useSelector(selectUser)
const isLoggedIn = useSelector(selectIsLoggedIn)
```

## Texnologiyalar (allaqachon o'rnatilgan):
```javascript
import { useForm } from 'react-hook-form'         // forma validation
import { toast } from 'react-hot-toast'           // xato xabarlar
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi'
import { motion } from 'framer-motion'            // animatsiya
import { useNavigate } from 'react-router-dom'
```

## DaisyUI + Tailwind:
```jsx
<input className="input input-bordered w-full bg-base-200" />
<button className="btn btn-primary w-full">Kirish →</button>
<p className="text-error text-sm mt-1">{errors.email?.message}</p>
```

## Dizayn:
- Background: `#0A0E1A` (space navy)
- Primary gradient: indigo-500 → purple-600
- Login: 2 column (chap: placeholder 3D joy, o'ng: form)
- Register: 3-qadam stepper (Asosiy → Ijtimoiy → Parol)
- Profile: chap panel (avatar/stats) + o'ng panel (ma'lumotlar)

## XP Stats javob:
```javascript
{ xp, level, levelProgress, xpToNextLevel, streak, badges,
  videosWatched, bio, skills, avatar }
```

## Path aliases:
`@components` `@pages` `@store` `@hooks` `@api` `@utils`
