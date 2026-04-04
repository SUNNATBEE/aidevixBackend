# 🚀 Optimizatsiya va Performanceni Oshirish (Qo'llanma)

Hurmatli o'quvchilar, Aidevix loyihasining Frontend qismini tezroq va xotirasiz ishlashini ta'minlash uchun quyidagi amaliyotlarni qo'llashingiz talab qilinadi.

## 1. Kodlarni Bo'laklash (Code Splitting) va Lazy Loading
Hozirgi vaqtda loyihada React Router ishlatilgan bo'lsa, hamma sahifalar bir vaqtda yuklanmoqda. Buni oldini olish va foydalanuvchining internet trefikینی tejash uchun `React.lazy()` ni qo'llang.

**Qanday qilinadi?**
`App.js` faylingizda importlarni quyidagicha o'zgartiring:
```javascript
import React, { Suspense, lazy } from 'react';

// Oddiy import O'RNIGA:
// import CourseDetails from './pages/CourseDetails';

// Lazy loading importdan foydalaning:
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div className="loading-spinner">Yuklanmoqda...</div>}>
      <Routes>
         <Route path="/course/:id" element={<CourseDetails />} />
      </Routes>
    </Suspense>
  );
}
```

## 2. Rasmlar va Media Optimizatsiyasi
Katta hajmdagi `.jpg` yoki `.png` rasmlar saytni juda sekinlashtiradi.
- Barcha statik rasmlarni **WebP** formatiga o'tkazing (u 80% gacha yengil).
- Rasmlar darhol yuklanmasligi uchun `loading="lazy"` atributini bering taglarga.
```html
<img src="/assets/course-bg.webp" alt="React Kursi" loading="lazy" />
```

## 3. Uzluksiz Re-renderlarni To'xtatish
React statelari o'zgarganda sahifa qayta o'qilishni boshlaydi. Katta modullar yuzasida:
- Funksiyalarni `useCallback` hook iga o'rang.
- Qayta hisoblanishi qiyin bo'lgan mantiqlarni `useMemo` ichiga oling.
- O'zgarmaydigan UI komponentlarni ham `React.memo(Component)` formatiga o'zgartiring.

## 4. Xotira Sızıqlarini (Memory Leaks) Tozalash
Agar siz taymerlar (setInterval) yoki event listenerlar (window.addEventListener) ochsangiz, u sahifadan chiqib ketayotganda tozalanmasa performans o'ladi.
```javascript
useEffect(() => {
  const timer = setInterval(() => { /* logic */ }, 1000);
  
  // TOZALASH (Unmount)
  return () => clearInterval(timer);
}, []);
```
