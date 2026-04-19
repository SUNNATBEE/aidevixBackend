# Deploy Qo'llanmasi

Backend → **Railway** | Frontend → **Vercel**

---

## Backend — Railway

### Avtomatik Deploy

```bash
git push origin main   # Railway main branchga push bo'lganda avtomatik deploy qiladi
```

### Birinchi Marta Setup

1. [railway.app](https://railway.app) ga kiring
2. **New Project** → **Deploy from GitHub repo**
3. `AidevixBackend` reponi tanlang
4. **Root Directory:** `backend` (yoki `railway.toml` dan o'qiydi)
5. **Start Command:** `npm start`

### Environment Variables (Railway Dashboard)

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aidevix
JWT_SECRET=<min 32 belgi, random>

FRONTEND_URL=https://aidevix.uz

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_USERNAME=aidevix
TELEGRAM_PRIVATE_CHANNEL_USERNAME=
TELEGRAM_ADMIN_CHAT_ID=697727022

GROQ_API_KEY=
NEWS_ENABLED=true
CHALLENGE_SCHEDULER_ENABLED=true

BUNNY_STREAM_API_KEY=
BUNNY_LIBRARY_ID=
BUNNY_CDN_HOSTNAME=

PAYME_MERCHANT_ID=
PAYME_SECRET_KEY=
CLICK_SERVICE_ID=
CLICK_MERCHANT_ID=
CLICK_SECRET_KEY=

SMTP_HOST=
SMTP_USER=
SMTP_PASS=

SWAGGER_USERNAME=Aidevix
SWAGGER_PASSWORD=<swagger parol>
```

### Tekshirish

```bash
curl https://aidevix-backend-production.up.railway.app/health
```

---

## Frontend — Vercel

```bash
cd frontend
npx vercel --prod   # aidevix.uz ga deploy
```

### Vercel Env Vars

```
NEXT_PUBLIC_API_BASE_URL=https://aidevix-backend-production.up.railway.app
NEXT_PUBLIC_TELEGRAM_CHANNEL=https://t.me/aidevix
NEXT_PUBLIC_TELEGRAM_BOT=https://t.me/aidevix_bot
```

---

## MongoDB Atlas

1. **Network Access** → **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Yoki Railway static IP ni qo'shing (Railway dashboard → Settings)
2. Database user credentials to'g'ri ekanligini tekshiring

---

## Troubleshooting

| Muammo | Yechim |
|--------|--------|
| Server ishlamayapti | Railway Logs → env vars tekshiring |
| DB ulanmayapti | Atlas Network Access → 0.0.0.0/0 |
| CORS xatosi | `FRONTEND_URL` to'g'ri ekanligini tekshiring |
| Bot ishlamayapti | `TELEGRAM_BOT_TOKEN` to'g'ri ekanligini tekshiring |
| News/Challenge kelmayyapti | `NEWS_ENABLED=true`, `GROQ_API_KEY` tekshiring |

---

## Production Checklist

- [ ] `JWT_SECRET` kuchli va unikal (min 32 belgi)
- [ ] `FRONTEND_URL` aniq domain (`*` emas)
- [ ] MongoDB Atlas Network Access sozlangan
- [ ] `GROQ_API_KEY` mavjud (news + AI coach uchun)
- [ ] `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHANNEL_USERNAME` to'g'ri
- [ ] Swagger parol o'rnatilgan
- [ ] Health check ishlayapti
