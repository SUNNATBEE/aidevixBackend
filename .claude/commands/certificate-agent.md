# Certificate PDF Generator Agent

> **Kontekst**: Ishni boshlashdan oldin `Read` tool bilan quyidagi faylni o'qi:
> `C:\Users\User\.claude\projects\C--Users-User-OneDrive--------------AidevixBackend\memory\agent-certificate.md`

Sen Aidevix backend uchun haqiqiy PDF sertifikat generatsiya tizimini yaratuvchi ixtisoslashgan agentsan.

## Maqsad
Hozirda sertifikat faqat DB recordini saqlaydi. Uni haqiqiy PDF sertifikat generatsiya qiladigan tizimga aylantir.

## Qilishi kerak bo'lgan ishlar

### 1. PDF Generatsiya
`pdfkit` package ishlatib PDF sertifikat yaratish:
```bash
npm install pdfkit
```

`backend/utils/certificateGenerator.js` — yangi fayl:
```javascript
const PDFDocument = require('pdfkit');
// generateCertificatePDF(recipientName, courseName, completedAt, certificateCode) => Buffer
```

**Sertifikat dizayni (professional):**
- Background: oq/krema
- Logo: "AIDEVIX" matn sarlavha sifatida (font katta, bold)
- Sarlavha: "SERTIFIKAT" / "CERTIFICATE OF COMPLETION"
- Matn: "Bu sertifikat [recipientName] ga [courseName] kursini muvaffaqiyatli tugatganligi uchun taqdim etiladi"
- Sana: completedAt ni `DD.MM.YYYY` formatida
- Sertifikat kodi: pastki qismda
- Ramka: kvadrat ramka (strokeRect)

### 2. Cloudinary ga Upload
PDF ni Cloudinary ga saqlash (mavjud Cloudinary config orqali):
- `backend/utils/certificateGenerator.js` ichiga `uploadCertificatePDF(buffer, code)` funksiyasi
- Cloudinary folder: `certificates/`
- Format: `certificate-{code}.pdf`
- Return: Cloudinary URL

### 3. Certificate Model Yangilash
`backend/models/Certificate.js` ni o'qing, quyidagi maydonlarni qo'shing (yo'q bo'lsa):
- `pdfUrl: String` — Cloudinary URL
- `isVerified: Boolean` — public tekshiruv uchun

### 4. Certificate Controller Yangilash
`backend/controllers/certificateController.js` ni o'qing va quyidagilarni qo'shing:

**Yangi endpoint:**
- `GET /api/certificates/:code/verify` — **Public** — sertifikat kodini tekshirish (embedding uchun)
  - Javob: `{ valid: true, recipientName, courseName, completedAt, pdfUrl }`

- `GET /api/certificates/:code/download` — **Private** — PDF ni download qilish
  - Agar `pdfUrl` yo'q bo'lsa, generatsiya qilib Cloudinary ga saqlash
  - Response: `{ downloadUrl: pdfUrl }`

- `GET /api/certificates/my` — **Private** — mening sertifikatlarim

### 5. Enrollment'da Sertifikat Berish Yangilash
`backend/controllers/enrollmentController.js` dagi `_issueCertificate` funksiyasini:
- PDF generatsiya qilsin
- Cloudinary ga upload qilsin
- `Certificate.pdfUrl` ni saqlash

### 6. Email ga PDF Biriktirish
`backend/utils/emailService.js` dagi `sendCertificateEmail` ni yangilash:
- PDF URL ni email template ga qo'shish (Nodemailer attachment emas, link)

## Muhim qoidalar
- CommonJS ishlating
- `pdfkit` ni install qiling: `cd backend && npm install pdfkit`
- Cloudinary credentials allaqachon backend/.env da bor
- Mavjud Certificate model ni buzmasdan extend qiling

## Fayllar (barchasi o'qilishi kerak)
- `backend/models/Certificate.js`
- `backend/controllers/certificateController.js`
- `backend/controllers/enrollmentController.js`
- `backend/routes/certificateRoutes.js`
- `backend/utils/emailService.js`
- `backend/middleware/uploadMiddleware.js` (Cloudinary config uchun)
- `backend/package.json`
