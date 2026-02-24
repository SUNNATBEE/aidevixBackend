# Aidevix Admin Panel API

## 🎯 Admin Panel Swagger Dokumentatsiya

Admin panel uchun to'liq API dokumentatsiyasi:

**Production:**
```
https://aidevixbackend.onrender.com/admin-docs
```

**Local:**
```
http://localhost:5000/admin-docs
```

**Parol:**
- Username: `Aidevix`
- Password: `sunnatbee`

## 📋 Admin Endpoint'lar

### 🎓 Kurslar Boshqaruvi

#### 1. Yangi Kurs Yaratish
```http
POST /api/courses
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "description": "JavaScript asoslarini o'rganing",
  "price": 99.99,
  "thumbnail": "https://example.com/image.jpg",
  "category": "programming"
}
```

**Vazifasi:**
- Platformaga yangi kurs qo'shish
- Kurs ma'lumotlarini saqlash
- Instructor'ni avtomatik tayinlash (hozirgi admin)

**Majburiy maydonlar:**
- `title` - Kurs nomi
- `description` - Kurs tavsifi
- `price` - Kurs narxi

**Status kodlar:**
- `201` - Kurs muvaffaqiyatli yaratildi
- `400` - Validation xatosi
- `401` - Token noto'g'ri
- `403` - Admin huquqi yo'q

#### 2. Kursni Yangilash
```http
PUT /api/courses/:id
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Yangi Kurs Nomi",
  "price": 149.99,
  "isActive": true
}
```

**Vazifasi:**
- Kurs ma'lumotlarini o'zgartirish
- Kurs narxini yangilash
- Kurs holatini o'zgartirish (faol/yashirin)

**Ixtiyoriy maydonlar:**
- `title`, `description`, `price`, `thumbnail`, `category`, `isActive`

**Status kodlar:**
- `200` - Kurs muvaffaqiyatli yangilandi
- `404` - Kurs topilmadi
- `403` - Admin huquqi yo'q

#### 3. Kursni O'chirish
```http
DELETE /api/courses/:id
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**⚠️ MUHIM:**
- Kurs o'chirilgandan keyin qayta tiklash mumkin emas!
- Kurs videolari ham o'chiriladi!
- Maslahat: O'chirish o'rniga `isActive: false` qilib yashirin qilish yaxshiroq

**Status kodlar:**
- `200` - Kurs muvaffaqiyatli o'chirildi
- `404` - Kurs topilmadi
- `403` - Admin huquqi yo'q

### 🎥 Videolar Boshqaruvi

#### 1. Yangi Video Yaratish
```http
POST /api/videos
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "JavaScript Kirish",
  "description": "JavaScript asoslari",
  "courseId": "course_id_here",
  "order": 0,
  "duration": 1200,
  "thumbnail": "https://example.com/thumbnail.jpg"
}
```

**Vazifasi:**
- Kursga yangi video qo'shish
- Video ma'lumotlarini saqlash
- Videoni kursga bog'lash

**Majburiy maydonlar:**
- `title` - Video nomi
- `courseId` - Kurs ID

**Ixtiyoriy maydonlar:**
- `description` - Video tavsifi
- `order` - Video tartibi (0, 1, 2, ...)
- `duration` - Video davomiyligi (soniyalarda)
- `thumbnail` - Video rasmi URL

**Status kodlar:**
- `201` - Video muvaffaqiyatli yaratildi
- `400` - Validation xatosi
- `404` - Kurs topilmadi
- `403` - Admin huquqi yo'q

#### 2. Videoni Yangilash
```http
PUT /api/videos/:id
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Yangi Video Nomi",
  "order": 1,
  "isActive": true
}
```

**Vazifasi:**
- Video ma'lumotlarini o'zgartirish
- Video tartibini yangilash
- Video holatini o'zgartirish (faol/yashirin)

**Status kodlar:**
- `200` - Video muvaffaqiyatli yangilandi
- `404` - Video topilmadi
- `403` - Admin huquqi yo'q

#### 3. Videoni O'chirish
```http
DELETE /api/videos/:id
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

**⚠️ MUHIM:**
- Video o'chirilgandan keyin qayta tiklash mumkin emas!
- Video linklar ham o'chiriladi!
- Maslahat: O'chirish o'rniga `isActive: false` qilib yashirin qilish yaxshiroq

**Status kodlar:**
- `200` - Video muvaffaqiyatli o'chirildi
- `404` - Video topilmadi
- `403` - Admin huquqi yo'q

## 🔐 Admin Huquqlari

### Admin Role Qanday Olinadi?

Hozircha User model'da `role` field'i bor. Admin qilish uchun:

1. MongoDB'da User'ni toping
2. `role` field'ini `'admin'` ga o'zgartiring

Yoki admin yaratish endpoint'i qo'shish mumkin (keyinroq).

### Admin Token Qanday Olinadi?

1. Admin sifatida login qiling (admin email va parol bilan)
2. Login response'dan `accessToken` oling
3. Bu token'ni barcha admin endpoint'larida ishlating

## 📝 Qadam-baqadam Ko'rsatma

### 1. Admin sifatida Kirish

```bash
POST https://aidevixbackend.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "role": "admin"
    }
  }
}
```

### 2. Kurs Yaratish

```bash
POST https://aidevixbackend.onrender.com/api/courses
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "description": "JavaScript asoslarini o'rganing",
  "price": 99.99,
  "category": "programming"
}
```

### 3. Video Yaratish

```bash
POST https://aidevixbackend.onrender.com/api/videos
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "JavaScript Kirish",
  "description": "JavaScript asoslari",
  "courseId": "course_id_from_step_2",
  "order": 0,
  "duration": 1200
}
```

## 🛠️ Swagger UI'da Ishlatish

1. **Admin Panel Swagger'ni oching:**
   ```
   https://aidevixbackend.onrender.com/admin-docs
   ```

2. **Parolni kiriting:**
   - Username: `Aidevix`
   - Password: `sunnatbee`

3. **Authorize tugmasini bosing:**
   - "Authorize" tugmasini bosing
   - Admin token'ni kiriting: `Bearer YOUR_ADMIN_TOKEN`
   - "Authorize" tugmasini bosing

4. **Endpoint'larni test qiling:**
   - Har bir endpoint'ni kengaytiring
   - "Try it out" tugmasini bosing
   - Ma'lumotlarni kiriting
   - "Execute" tugmasini bosing

## 💡 Maslahatlar

1. **Kurs yaratish:**
   - Kurs nomi va tavsifi aniq bo'lishi kerak
   - Narxni to'g'ri belgilang
   - Thumbnail uchun yaxshi sifatli rasm ishlating

2. **Video yaratish:**
   - Video tartibini (order) to'g'ri belgilang
   - Duration'ni soniyalarda kiriting (1 daqiqa = 60 soniya)
   - Thumbnail uchun yaxshi sifatli rasm ishlating

3. **O'chirish:**
   - O'chirish o'rniga `isActive: false` qilib yashirin qilish yaxshiroq
   - Keyinroq kerak bo'lsa, qayta faollashtirish mumkin

## 📊 Admin Panel Endpoint'lar Ro'yxati

| Method | Endpoint | Vazifasi | Status |
|--------|----------|----------|--------|
| POST | `/api/courses` | Kurs yaratish | ✅ |
| PUT | `/api/courses/:id` | Kurs yangilash | ✅ |
| DELETE | `/api/courses/:id` | Kurs o'chirish | ✅ |
| POST | `/api/videos` | Video yaratish | ✅ |
| PUT | `/api/videos/:id` | Video yangilash | ✅ |
| DELETE | `/api/videos/:id` | Video o'chirish | ✅ |

## 🔒 Xavfsizlik

- Barcha admin endpoint'lar admin role talab qiladi
- Token tekshiruvi har safar qilinadi
- Admin huquqi yo'q bo'lsa, 403 xatosi qaytadi

## 📞 Yordam

Agar muammo bo'lsa:
1. Admin Panel Swagger'ni tekshiring: `/admin-docs`
2. Token'ni tekshiring (admin role borligini)
3. Server loglarini tekshiring

---

**Admin Panel Swagger:** `https://aidevixbackend.onrender.com/admin-docs`
