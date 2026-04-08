# 📡 AZIZ — Subscription Page (Next.js + TypeScript)

> [!IMPORTANT]
> **DIQQAT:** Loyiha **Next.js 14 (App Router)** ga o'tkazildi. Davom etishdan oldin [Next.js Migratsiya Qo'llanmasini](../MIGRATION_GUIDE.md) to'liq o'qib chiqing.


## 📋 Vazifa Qisqacha
Sen **obuna bo'lish sahifasini** yasaysan. Buni qolgan jamoa kabi **Next.js App Router** va **TypeScript** da yozasan. 

---

## 🌿 Branch
```
feature/aziz-subscription
```
---

## ⚡ Nega Next.js + TypeScript?

### Next.js
React Router o'rniga to'g'ridan to'g'ri papka tuzilmasidan foydalanamiz. Sizning sahifangiz `app/subscription/page.tsx` manzilida bo'ladi. SSR evaziga sahifa tezroq ochiladi.

### TypeScript
Obuna statusi kabi datalarni (`instagram`, `telegram` status) o'qishda auto-complete (nuqta qo'yilishi bilan chiqarish) orqali kodingiz oson va tushunarli bo'ladi. Datalar oldindan struktura qilingan bo'ladi.

---

## 📁 Sening Fayllaring (Next.js)

```
frontend/
├── app/
│   └── subscription/
│       └── page.tsx                    ← Sen yozasan (Subscription Page)
│
├── components/
│   └── subscription/
│       ├── TelegramVerify.tsx          ← Sen yaxshilasan
│       ├── InstagramVerify.tsx         ← Sen yaxshilasan
│       └── SubscriptionGate.tsx        ← Boshqa sahifalarni himoyalovchi komponent
│
├── types/
│   └── subscription.ts                 ← Typelarni saqlash uchun
```

---

## 📝 Kod Misollari

### Turlar (`types/subscription.ts`):
```typescript
interface PlatformSubscription {
  subscribed: boolean;
  username?: string | null;
  telegramUserId?: string | null;
  verifiedAt?: string;
}

export interface SubscriptionStatus {
  subscriptions: {
    instagram: PlatformSubscription;
    telegram: PlatformSubscription;
  };
  hasAllSubscriptions: boolean;
}
```

### Subscription Page (`app/subscription/page.tsx`):
```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { subscriptionApi } from '@/lib/api/subscriptionApi'
import type { SubscriptionStatus } from '@/types/subscription'

export default function SubscriptionPage() {
  const router = useRouter()
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)

  useEffect(() => {
    subscriptionApi.getStatus().then(res => setStatus(res.data.data))
  }, [])

  if (!status) return <div>Loading...</div>

  const teleVerified = status.subscriptions.telegram.subscribed
  const instaVerified = status.subscriptions.instagram.subscribed

  return (
    <div className="container mx-auto p-8">
      <ul className="steps steps-horizontal w-full">
        <li className="step step-primary">Ro'yxatdan o'tish</li>
        <li className={`step ${teleVerified ? 'step-primary' : ''}`}>Telegram</li>
        <li className={`step ${instaVerified ? 'step-primary' : ''}`}>Instagram</li>
      </ul>

      {/* Forms will go here... */}
    </div>
  )
}
```

## ✅ Tekshiruv Ro'yxati 
- [ ] `page.tsx` app router papkasida `.tsx` fayl hisoblanadi.
- [ ] TypeScript aniq turlari kiritilgan.
- [ ] `useNavigate` emas, balki `next/navigation` router qo'llanilgan.
