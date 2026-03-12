# 🚫 BOISXON — 404 Error Page

## 📋 Vazifa Qisqacha
Sen **404 xato sahifasini** yasaysan. Bu sahifa mavjud bo'lmagan URL ga kirilganda ko'rsatiladi.

---

## 🌿 Branch
```
feature/boisxon-404
```
> ⚠️ **DIQQAT:** Faqat `feature/boisxon-404` branchida ishlash!

```bash
git checkout -b feature/boisxon-404
git push origin feature/boisxon-404
```

---

## 📁 Sening Fayllaring

```
frontend/src/
└── pages/
    └── NotFoundPage.jsx        ← Sen yozasan (faqat shu fayl!)
```

Router'da allaqachon qo'shilgan:
```jsx
// AppRouter.jsx da:
<Route path="*" element={<NotFoundPage />} />
```

---

## 🎨 Dizayn (Figma)

### NotFoundPage

**Navbar:** Oddiy Aidevix navbar

**Asosiy qism (centered):**
- **Chap tomonda:** Animatsiyali monitor ikonkasi
  - Monitor ekranida: `<Route not Found />`  matni
  - Qizil xato belgisi
  - `Error: 404` tag
- **O'ng tomonda:**
  - Katta "**404**" raqami (very big, slightly transparent)
  - "**Sahifa topilmadi**" — katta sarlavha
  - Tavsif: "Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki manzili o'zgartirilgan bo'lishi mumkin. Keling, sizni to'g'ri yo'lga qaytaramiz."
  - **"🏠 Bosh sahifa"** tugmasi (primary)
  - **"← Ortga qaytish"** tugmasi (outline/ghost)

**Footer:** Oddiy footer

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
framer-motion      # Animatsiyalar (monitor titraydi)
react-icons        # FaHome, FaArrowLeft, BsDisplay
react-router-dom   # useNavigate, Link
```

---

## 🎨 Tailwind + DaisyUI

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Chap: Monitor animatsiya */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            {/* Monitor SVG yoki react-icons BsDisplay */}
            <div className="relative w-64 h-48 mx-auto">
              <div className="bg-base-300 rounded-xl p-6 border border-error/30">
                <code className="text-error text-sm">
                  &lt;Route not Found /&gt;
                </code>
                <br />
                <code className="text-warning text-xs mt-2 block">
                  Error: 404
                </code>
              </div>
            </div>
          </motion.div>

          {/* O'ng: Matn */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-right"
          >
            {/* Katta 404 raqami */}
            <p className="text-[12rem] font-black text-base-content/10 leading-none select-none">
              404
            </p>
            <h1 className="text-4xl font-bold -mt-8">Sahifa topilmadi</h1>
            <p className="text-base-content/60 mt-4 max-w-md ml-auto">
              Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki manzili
              o'zgartirilgan bo'lishi mumkin.
            </p>
            <div className="flex gap-4 justify-end mt-8">
              <Link to="/" className="btn btn-primary gap-2">
                🏠 Bosh sahifa
              </Link>
              <button onClick={() => navigate(-1)} className="btn btn-outline gap-2">
                ← Ortga qaytish
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
```

---

## 💡 Qo'shimcha Vazifalar (ixtiyoriy)
Agar asosiy vazifani tez tugatsan, quyidagilarni qo'shishingiz mumkin:
1. **Titroq animatsiya** (monitor sahifa yo'qligida chayqalsin)
2. **Countdown** (5 soniyada bosh sahifaga qaytish)
3. **"Nima qidirmoqda edingiz?"** qidiruv inputi
4. **Random 404 quotes** ("Hazillar" — mashhur 404 xabarlar)

---

## ✅ Tekshiruv Ro'yxati
- [ ] Mavjud bo'lmagan URL ga kirishda 404 ko'rsatiladi (masalan `/abc`)
- [ ] "Bosh sahifa" tugmasi `/` ga yo'naltiradi
- [ ] "Ortga qaytish" tugmasi ishlaydi
- [ ] Animatsiya ishlaydi
- [ ] Dizayn Figma bilan mos keladi
- [ ] Responsive (mobil va desktop)
