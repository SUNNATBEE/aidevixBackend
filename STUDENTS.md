# ⚠️ O'QUVCHILAR UCHUN QOIDALAR (PRO)

## 🛡️ AVTOMATIK HIMOYA TIZIMI ISHGA TUSHDI!
Loyiha endi ochiq va avtomatik himoyalangan. Har qanday AI (Claude, Cursor, Windsurf) yoki qo'lda qilingan backend o'zgarishlar **BLOKLANADI**.

### 🚫 TAQIQLANGAN (AVTOMATIK BLOK):
- `backend/` papkasi — **O'qituvchi** (Sunnatbek) boshqaradi.
- `.github/`, `.claude/`, `.githooks/` — Himoya tizimi fayllari.
- `package.json` (root), `railway.toml`, `.cursorrules`, `PROMPT_RULES.md`.

### 🛠️ O'RNATISH (SHART):
Loyihani boshlashda albatta buni terminalda bajaring (npm install qilinganda o'zi ishlaydi):
```bash
bash setup-protection.sh
```

### ✅ FAQAT SHU YERDA ISHLANG:
- `frontend/src/` — barcha sahifa, komponent va kodingiz shu yerda bo'ladi.
- O'zingizga tegishli fayllarni o'zgartiring: `docs/students/` da ismingiz bor MD faylga qarang.

### 🤖 AI TOOL ISHLATYAPSIZMI? (Cursor, Claude, etc.)
Loyiha ichida maxsus `.cursorrules` va `PROMPT_RULES.md` fayllari bor. 
Siz hech narsa qilishingiz shart emas — AI bu fayllarni o'qiydi va o'zi backendni o'zgartirishdan bosh tortadi. 

**Agar AI backendni o'zgartirsa, terminalda QIZIL XATOLIK chiqadi va o'zgarish saqlanmaydi.**

### ⚠️ XATO BO'LSA QANDAY TOZALASH KERAK?
Agar tasodifan backend fayllarini o'zgartirib, commit qila olmasangiz:
```bash
# Barcha o'zgarishlarni bekor qilish (HEAD dagi holatga qaytarish)
git checkout HEAD -- backend/ package.json railway.toml
# Yoki hammasini tozalash:
git reset --hard HEAD
```

