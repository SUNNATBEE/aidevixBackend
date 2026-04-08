# Prompt Templates

## Universal Template

```text
Muammo:
[aniq bug]

Scope:
[aniq fayllar]

Kutilgan natija:
[nima ishlashi kerak]

Vazifa:
Avval root sababni top, keyin minimal patch qil.

Tekshirma:
Faqat kerakli verification qil.

Cheklov:
Keraksiz refactor qilma.
Faqat shu scope ichida ishlagin.
Butun repo audit qilma.
Multi-agent ochma.
Oxirida qisqa summary ber.
```

## Bugfix

```text
Muammo:
[aniq bugni yozing]

Scope:
[1-3 ta aniq fayl]

Kutilgan natija:
Bug tuzalsin, boshqa joy buzilmasin.

Vazifa:
Muammoni top va minimal patch bilan tuzat.

Tekshirma:
Minimal verification qil.

Cheklov:
Keraksiz refactor qilma.
Multi-agent ochma.
```

## Frontend Fix

```text
Muammo:
Frontend UI/state muammo bor.

Scope:
frontend/src/...

Kutilgan natija:
Mavjud dizayn saqlangan holda muammo tuzalsin.

Cheklov:
Backendga tegma.
Minimal patch qil.
```

## Backend Fix

```text
Muammo:
Backend API/auth/controller oqimida xato bor.

Scope:
backend/...

Kutilgan natija:
API ishlashi to'g'rilansin, response contract buzilmasin.

Cheklov:
Frontendga tegma.
Keraksiz refactor qilma.
```

## Auth Fix

```text
Muammo:
Auth/login/register/refresh/logout oqimida xato bor.

Scope:
frontend/src/store/slices/authSlice.ts
frontend/src/api/axiosInstance.ts
frontend/src/api/authApi.ts
frontend/src/components/auth/
backend/controllers/authController.js
backend/middleware/auth.js
backend/utils/authSecurity.js

Kutilgan natija:
Cookie/session auth barqaror ishlasin.

Vazifa:
Root sababni top va minimal coherent patch qil.

Tekshirma:
401, refresh, me, logout flow ni tekshir.

Cheklov:
Contractni buzma.
Keraksiz refactor qilma.
```

## Theme Fix

```text
Muammo:
Dark/light mode butun saytga to'liq ta'sir qilmayapti.

Scope:
frontend/src/context/ThemeContext.tsx
frontend/src/app/layout.tsx
frontend/src/styles/globals.css

Kutilgan natija:
Theme global ishlasin va reload dan keyin saqlansin.

Cheklov:
Faqat theme qatlamida ishlagin.
```

## I18n Fix

```text
Muammo:
Til almashtirish butun saytda ishlamayapti.

Scope:
frontend/src/context/LangContext.tsx
frontend/src/utils/i18n.ts
frontend/src/components/layout/Navbar.tsx
frontend/src/components/layout/Footer.tsx
frontend/src/app/login/page.tsx
frontend/src/app/register/page.tsx

Kutilgan natija:
Til butun app bo'ylab almashsin.

Cheklov:
Butun repo audit qilma.
Minimal patch qil.
```

## Coach Fix

```text
Muammo:
Coach assistant javob qaytarmayapti.

Scope:
frontend/src/components/common/AICoach.tsx
frontend/src/utils/coachAssistant.ts
frontend/src/app/api/coach/route.ts

Kutilgan natija:
Assistant javob qaytarsin, backend bo'lmasa fallback ishlasin.

Cheklov:
UI ni noldan qayta yozma.
```

## Audit Only

```text
Muammo:
[aniq modul yoki bug]

Scope:
[aniq fayllar]

Vazifa:
1. Root sababni top
2. Risklarni ayt
3. Qaysi fayllarda xato borligini ko'rsat
4. Kod yozma

Cheklov:
Faqat shu scope ichida qol.
Butun repo audit qilma.
```

## Plan First

```text
Muammo:
[aniq bug]

Scope:
[aniq fayllar]

Vazifa:
Kod yozishdan oldin:
1. ehtimoliy sabablarni ayt
2. tekshiriladigan fayllarni ayt
3. eng kichik fix rejasini yoz
keyin to'xta
```
