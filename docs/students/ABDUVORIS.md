# 🎬 ABDUVORIS — Video Lesson Pages (2 ta sahifa)

## 📋 Vazifa Qisqacha
Sen **2 ta Video Lesson sahifasini** yasaysan:
1. **VideoPage** — Video player + Telegram link modal
2. **VideoPlaygroundPage** — Video + Code Editor + Quiz

---

## 🌿 Branch
```
feature/abduvoris-lessons
```
> ⚠️ **DIQQAT:** Faqat o'z branchingda ishlash. `main`ga hech narsa yozma!

```bash
git checkout -b feature/abduvoris-lessons
git push origin feature/abduvoris-lessons
```

---

## 📁 Sening Fayllaring

```
frontend/src/
├── pages/
│   ├── VideoPage.jsx               ← Sen yozasan (1-sahifa)
│   └── VideoPlaygroundPage.jsx     ← Sen yozasan (2-sahifa)
│
├── components/
│   └── videos/
│       ├── VideoCard.jsx            ← Allaqachon bor, o'qib tush
│       ├── VideoLinkModal.jsx       ← Allaqachon bor, ishlatasan
│       └── VideoRating.jsx          ← Allaqachon bor, ishlatasan
│
├── hooks/
│   └── useVideos.js                 ← Allaqachon yozilgan, ishlatasan
│
└── api/
    ├── videoApi.js                  ← Allaqachon yozilgan
    └── userApi.js                   ← addVideoWatchXP() ishlatasan
```

---

## 🎨 Dizayn (Figma)

### 1-Sahifa: VideoPage (`/videos/:id`)
- **Tepada:** Aidevix logo + KURSLAR navigatsiyasi
- **Video player** (asosiy qism):
  - Ko'k gradient background
  - Play/Pause controls
  - Progress bar
  - Dars nomi pastda
  - Rating yulduzchalar
- **Chap panel:** Telegram Havola modal:
  - Telegram ikonkasi + URL matn
  - "Ko'chirish" tugmasi (clipboard)
  - "Telegramda ochish" tugmasi (primary)
- **O'ng panel:** Materiallar ro'yxati
  - Darsga tegishli PDF, ZIP fayllar
- **Pastda:** Dars nomi + tavsif

### 2-Sahifa: VideoPlaygroundPage (`/videos/:id/playground`)
- **Tepada:** Navigatsiya tabs: `KURSLAR` | `PLAYGROUND`
- **KURSLAR tab:**
  - Video player (kichikroq)
  - Savol va Javoblar bo'limi (Q&A)
  - Materiallar
- **PLAYGROUND tab:**
  - `bash.js` kabi fayl nomi ko'rsatiladi
  - **Code Editor** (solda):
    - Dark theme (monaco-editor)
    - Syntax highlighting
    - Line numbers
  - **Terminal** (o'ngda yoki pastda):
    - Output natija
    - Green cursor blink
  - **"RUN CODE" tugmasi** (neon green)
- **O'ng panel:**
  - Reytinglar ro'yxati (O'quvchilar)
  - Shartli topshiriqlar

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `admin`
- **Password:** `admin123`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/videos/:id` | GET | ✅ Bearer | Video ma'lumotlari |
| `/api/videos/course/:courseId` | GET | ❌ Yo'q | Kurs videolari ro'yxati |
| `/api/videos/link/:linkId/use` | POST | ✅ Bearer | Telegram linkni bir martalik ishlatish |
| `/api/xp/video-watched/:videoId` | POST | ✅ Bearer | Video ko'rganlik uchun +50 XP |
| `/api/xp/quiz/video/:videoId` | GET | ✅ Bearer | Video quizini olish |

### Misol — Video ma'lumotlari olish:
```javascript
import { useVideos } from '@hooks/useVideos'

const { video, loading } = useVideos()
// yoki to'g'ridan-to'g'ri:
import { videoApi } from '@api/videoApi'
const { data } = await videoApi.getVideo(videoId)
```

### Misol — Telegram link ishlatish:
```javascript
import { videoApi } from '@api/videoApi'

const handleOpenTelegram = async (linkId) => {
  const { data } = await videoApi.useVideoLink(linkId)
  // data.data.telegramUrl — bu URL faqat bir marta ishlaydi!
  window.open(data.data.telegramUrl, '_blank')
}
```

### Misol — Video tugaganida XP olish:
```javascript
import { userApi } from '@api/userApi'

const handleVideoEnd = async () => {
  await userApi.addVideoWatchXP(videoId)
  // +50 XP beriladi
}
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
react-player       # Video player komponenti
react-icons        # Ikonkalar
framer-motion      # Animatsiyalar
react-hot-toast    # Xabarlar
```

### Code Editor uchun (qo'shish kerak):
```bash
cd frontend
npm install @monaco-editor/react
```

### Ishlatish:
```javascript
import { useRef } from 'react'
import ReactPlayer from 'react-player'
import Editor from '@monaco-editor/react'

// Video Player:
<ReactPlayer
  url={telegramUrl}
  controls
  width="100%"
  onEnded={handleVideoEnd}
  className="rounded-xl overflow-hidden"
/>

// Code Editor:
<Editor
  height="400px"
  defaultLanguage="javascript"
  theme="vs-dark"
  value={code}
  onChange={setCode}
/>
```

---

## 🎨 Tailwind + DaisyUI

```jsx
{/* Video container */}
<div className="relative aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl overflow-hidden">
  <ReactPlayer ... />
</div>

{/* Telegram link modal */}
<div className="bg-base-200 rounded-xl p-4 border border-primary/30">
  <div className="flex items-center gap-3">
    <FaTelegram className="text-blue-400 text-2xl" />
    <code className="text-sm text-primary truncate">{telegramUrl}</code>
  </div>
</div>

{/* Run Code tugmasi */}
<button className="btn bg-green-500 hover:bg-green-400 text-black font-bold gap-2">
  ▶ RUN CODE
</button>
```

---

## 📊 Redux State

```javascript
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '@store/slices/authSlice'
import { useUserStats } from '@hooks/useUserStats'

const isLoggedIn = useSelector(selectIsLoggedIn)
const { xp, level } = useUserStats()
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] VideoPage'da video ma'lumotlari yuklanadi
- [ ] Telegram link modal ochiladi va URL ko'rsatiladi
- [ ] Link faqat bir marta ishlatilishi tekshiriladi
- [ ] Video tugaganida +50 XP beriladi
- [ ] VideoPlaygroundPage'da kod muharriri ishlaydi
- [ ] KURSLAR / PLAYGROUND tabs ishlaydi
- [ ] Q&A bo'limi ko'rsatiladi
- [ ] Dizayn Figma bilan mos keladi
