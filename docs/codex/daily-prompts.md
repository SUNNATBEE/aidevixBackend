# Daily Prompts

Kunlik ish uchun eng ko'p kerak bo'ladigan 10 prompt.

## 1. Small Bug Fix

```text
Muammo:
[aniq bug]

Scope:
[1-3 ta aniq fayl]

Kutilgan natija:
Bug tuzalsin, boshqa joy buzilmasin.

Vazifa:
Avval root sababni top, keyin minimal patch qil.
```

## 2. Frontend UI Fix

```text
Muammo:
UI yoki state muammo bor.

Scope:
frontend/src/...

Kutilgan natija:
Mavjud dizayn saqlangan holda muammo tuzalsin.
```

## 3. Auth Session Fix

```text
Muammo:
Login/register/refresh/logout oqimida xato bor.

Scope:
frontend/src/store/slices/authSlice.ts
frontend/src/api/axiosInstance.ts
frontend/src/api/authApi.ts
backend/controllers/authController.js
backend/middleware/auth.js
```

## 4. Theme Fix

```text
Muammo:
Dark/light mode butun saytga to'liq ta'sir qilmayapti.

Scope:
frontend/src/context/ThemeContext.tsx
frontend/src/app/layout.tsx
frontend/src/styles/globals.css
```

## 5. I18n Fix

```text
Muammo:
Til almashtirish butun sahifalarda ishlamayapti.

Scope:
frontend/src/context/LangContext.tsx
frontend/src/utils/i18n.ts
frontend/src/components/layout/Navbar.tsx
frontend/src/components/layout/Footer.tsx
frontend/src/app/login/page.tsx
frontend/src/app/register/page.tsx
```

## 6. API Bug Fix

```text
Muammo:
API endpoint noto'g'ri ishlayapti.

Scope:
backend/controllers/...
backend/routes/...
backend/middleware/...
```

## 7. Coach Assistant Fix

```text
Muammo:
Coach assistant javob qaytarmayapti.

Scope:
frontend/src/components/common/AICoach.tsx
frontend/src/utils/coachAssistant.ts
frontend/src/app/api/coach/route.ts
```

## 8. Audit Only

```text
Muammo:
[aniq modul yoki bug]

Scope:
[aniq fayllar]

Vazifa:
Kod yozma, faqat root sababni top.
```

## 9. Plan First

```text
Muammo:
[aniq bug]

Scope:
[aniq fayllar]

Vazifa:
Avval plan yoz, keyin to'xta.
```

## 10. Big Task Controlled

```text
Muammo:
Bir nechta mustaqil muammo bor.

Scope:
[aniq papkalar/fayllar]

Vazifa:
Avval muammolarni bo'lib chiq, keyin kerak bo'lsa multi-agent ishlat.
```
