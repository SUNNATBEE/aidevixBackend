# 📡 AZIZ — Subscription Page (Obuna bo'lish jarayoni)

## 📋 Vazifa Qisqacha
Sen **obuna bo'lish sahifasini** yasaysan. Foydalanuvchi video ko'rish uchun Instagram va Telegram kanallariga obuna bo'lishi shart. Sen bu jarayonni 3 bosqichli UI bilan amalga oshirasan.

---

## 🌿 Branch
```
feature/aziz-subscription
```
> ⚠️ **DIQQAT:** Faqat `feature/aziz-subscription` branchida ishlash!

---

## 📁 Sening Fayllaring

```
frontend/src/
├── pages/
│   └── SubscriptionPage.jsx          ← Sen yozasan
│
├── components/
│   └── subscription/
│       ├── TelegramVerify.jsx          ← Allaqachon bor, yaxshilasan
│       ├── InstagramVerify.jsx         ← Allaqachon bor, yaxshilasan
│       └── SubscriptionGate.jsx        ← Allaqachon bor, ishlatasan
│
├── hooks/
│   └── useSubscription.js              ← Allaqachon yozilgan
│
└── api/
    └── subscriptionApi.js              ← Allaqachon yozilgan
```

---

## 🎨 Dizayn (Figma)

### SubscriptionPage (`/subscription`)
- **Progress bar** tepada: `1/3 qadam` — `2/3 qadam` — `3/3 qadam`
- **3 bosqich:**

**1-qadam: Ro'yxatdan o'tish** (avtomatik — allaqachon bajarilgan)

**2-qadam: Telegram orqali tasdiqlash:**
- Telegram logosi + sarlavha
- Tavsif: "Aidevix platformasiga kirish uchun Telegram kanalimizga a'zo bo'ling"
- `Telegram ID` input maydoni
  - Placeholder: `Misol: 123456789`
  - Qisqacha izoh: "ID'ingizni `/start` buyrug'ini bot'ga yuborish orqali topishingiz mumkin"
- "Obuna o'lish" tugmasi (Telegram ko'k)
- "Tasdiqlash →" tugmasi (primary)

**3-qadam: Instagram tasdiqlash:**
- Instagram logosi + sarlavha
- Instagram username input
  - Placeholder: `@username`
- "Sahifani tekshirish" tugmasi
- Tasdiqlash statusu (✅ Obuna / ❌ Obuna emas)

- **Pastda:** `Yordam kerakmi?` + `Maxfiylik siyosati` linklar

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `admin`
- **Password:** `admin123`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/subscriptions/status` | GET | ✅ Bearer | Obuna holati (Instagram + Telegram) |
| `/api/subscriptions/verify/telegram` | POST | ✅ Bearer | Telegram obunasini tasdiqlash |
| `/api/subscriptions/verify/instagram` | POST | ✅ Bearer | Instagram obunasini tasdiqlash |

### Misol — Obuna holati tekshirish:
```javascript
import { subscriptionApi } from '@api/subscriptionApi'

const checkStatus = async () => {
  const { data } = await subscriptionApi.getStatus()
  // data.data.instagram.subscribed — true/false
  // data.data.telegram.subscribed — true/false
  // data.data.canAccessContent — ikkalasi ham true bo'lsa true
}
```

### Misol — Telegram tasdiqlash:
```javascript
const verifyTelegram = async (telegramUserId) => {
  const { data } = await subscriptionApi.verifyTelegram({ telegramUserId })
  // data.success === true bo'lsa tasdiqlandi
}
```

### Misol — Instagram tasdiqlash:
```javascript
const verifyInstagram = async (username) => {
  const { data } = await subscriptionApi.verifyInstagram({ username })
}
```

---

## 💡 SubscriptionGate Komponenti
Video sahifasiga kirishdan oldin bu komponent obuna tekshiriladi:

```javascript
// SubscriptionGate.jsx allaqachon yozilgan
// VideoPage.jsx da ishlatiladi:
import SubscriptionGate from '@components/subscription/SubscriptionGate'

const VideoPage = () => (
  <SubscriptionGate>
    {/* Obuna bo'lmasa bu ko'rsatilmaydi, /subscription ga yo'naltiradi */}
    <VideoPlayer ... />
  </SubscriptionGate>
)
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
react-icons         # FaTelegram, FaInstagram
framer-motion       # Bosqich o'tish animatsiyasi
react-hot-toast     # "Muvaffaqiyatli tasdiqlandi!" xabari
react-hook-form     # Forma validatsiya
```

---

## 🎨 Tailwind + DaisyUI

```jsx
{/* Progress steps */}
<ul className="steps steps-horizontal w-full mb-8">
  <li className="step step-primary">Ro'yxatdan o'tish</li>
  <li className={`step ${telegramVerified ? 'step-primary' : ''}`}>Telegram</li>
  <li className={`step ${instagramVerified ? 'step-primary' : ''}`}>Instagram</li>
</ul>

{/* Telegram verify card */}
<div className="card bg-base-200 shadow-xl max-w-md mx-auto">
  <div className="card-body">
    <div className="flex items-center gap-3 mb-4">
      <FaTelegram className="text-4xl text-blue-400" />
      <h2 className="card-title">Telegram orqali tasdiqlash</h2>
    </div>
    <input
      type="text"
      placeholder="Misol: 123456789"
      className="input input-bordered w-full"
    />
    <div className="card-actions justify-end mt-4">
      <button className="btn btn-primary w-full">Tasdiqlash →</button>
    </div>
  </div>
</div>

{/* Status badge */}
<div className="badge badge-success gap-2">
  ✅ Obuna bo'lingansiz
</div>
```

---

## 📊 Redux State

```javascript
import { useSubscription } from '@hooks/useSubscription'

const { status, loading, verifyTelegram, verifyInstagram } = useSubscription()
// status.instagram.subscribed
// status.telegram.subscribed
// status.canAccessContent
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] 3 bosqichli UI ko'rsatiladi
- [ ] Telegram ID kiritib tasdiqlash ishlaydi
- [ ] Instagram username kiritib tasdiqlash ishlaydi
- [ ] Obuna holati real-time ko'rsatiladi
- [ ] Ikkalasi ham tasdiqlanganda video sahifasiga yo'naltiradi
- [ ] Xato holatlarda toast xabar chiqadi
- [ ] Allaqachon obuna bo'lganlarga qayta tasdiqlash shart emas
- [ ] Dizayn Figma bilan mos keladi
