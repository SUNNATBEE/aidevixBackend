# Render Deployment Guide

## Render'ga Deploy Qilish

### 1. GitHub Repository Yaratish

```bash
# Git init (agar yo'q bo'lsa)
git init
git add .
git commit -m "Initial commit"

# GitHub'da yangi repository yarating, keyin:
git remote add origin https://github.com/YOUR_USERNAME/aidevix-backend.git
git branch -M main
git push -u origin main
```

### 2. Render'da Web Service Yaratish

1. **Render.com** ga kiring va sign up qiling
2. **Dashboard** → **New +** → **Web Service**
3. GitHub repository'ni ulang va tanlang
4. Quyidagi sozlamalarni kiriting:

   - **Name:** `aidevix-backend`
   - **Region:** Eng yaqin region (masalan: Singapore)
   - **Branch:** `main`
   - **Root Directory:** (bo'sh qoldiring)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (yoki istalgan plan)

### 3. Environment Variables Qo'shish

Render dashboard'da **Environment** bo'limiga quyidagilarni qo'shing:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Production mode |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `ACCESS_TOKEN_SECRET` | `kuchli-secret-key-32+` | JWT access token secret (min 32 chars) |
| `REFRESH_TOKEN_SECRET` | `kuchli-secret-key-32+` | JWT refresh token secret (min 32 chars) |
| `ACCESS_TOKEN_EXPIRE` | `15m` | Access token expiration |
| `REFRESH_TOKEN_EXPIRE` | `7d` | Refresh token expiration |
| `TELEGRAM_BOT_TOKEN` | `8668053876:AAF...` | Telegram bot token |
| `TELEGRAM_CHANNEL_USERNAME` | `aidevix` | Obuna tekshiruvi kanali |
| `TELEGRAM_PRIVATE_CHANNEL_USERNAME` | `sunnatbee_lessons` | Video linklar kanali |
| `FRONTEND_URL` | `*` yoki `https://your-frontend.com` | Frontend URL (CORS uchun) |

**Muhim:** 
- `ACCESS_TOKEN_SECRET` va `REFRESH_TOKEN_SECRET` kuchli bo'lishi kerak (min 32 belgi)
- `FRONTEND_URL` ni frontend domain'ingizga moslashtiring
- Yoki `*` qo'ying (barcha domain'lar uchun, lekin production'da tavsiya etilmaydi)

### 4. MongoDB Atlas Sozlash

1. **MongoDB Atlas** → **Network Access**
2. **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
3. Yoki Render server IP'ni qo'shing

### 5. Deploy

1. **Create Web Service** tugmasini bosing
2. Render avtomatik deploy qiladi (5-10 daqiqa)
3. Deploy tugagandan keyin URL olasiz:
   ```
   https://aidevix-backend.onrender.com
   ```

### 6. Tekshirish

Deploy qilingandan keyin:

```bash
# Health check
curl https://aidevix-backend.onrender.com/health

# Yoki browser'da
https://aidevix-backend.onrender.com/health
```

### 7. Frontend'da Ishlatish

React yoki boshqa frontend'da:

```javascript
const API_URL = 'https://aidevix-backend.onrender.com';

// Misol
fetch(`${API_URL}/api/courses`)
  .then(res => res.json())
  .then(data => console.log(data));
```

## Custom Domain (Ixtiyoriy)

1. Render dashboard → **Settings** → **Custom Domains**
2. Domain'ingizni qo'shing
3. DNS sozlamalarini qiling (Render ko'rsatadi)

## Monitoring

- **Logs:** Render dashboard → **Logs** bo'limida ko'rasiz
- **Metrics:** CPU, Memory, Network ko'rsatkichlari
- **Events:** Deploy, restart va boshqa event'lar

## Troubleshooting

### Server ishlamayapti:
1. Logs'ni tekshiring (Render dashboard)
2. Environment variables to'g'ri ekanligini tekshiring
3. MongoDB Atlas Network Access tekshiring

### Database ulanmayapti:
1. MongoDB Atlas → Network Access → `0.0.0.0/0` qo'shilganini tekshiring
2. Connection string to'g'ri ekanligini tekshiring
3. Database user credentials to'g'ri ekanligini tekshiring

### CORS xatosi:
1. `FRONTEND_URL` environment variable to'g'ri sozlanganini tekshiring
2. Frontend URL Render'da sozlangan URL bilan mos kelishini tekshiring

## Production Best Practices

1. ✅ Kuchli JWT secrets ishlating (min 32 belgi, random)
2. ✅ `FRONTEND_URL` ni maxsus domain'ga sozlang (`*` emas)
3. ✅ MongoDB Atlas'da Network Access'ni cheklang (faqat Render IP)
4. ✅ Regular backup qiling
5. ✅ Monitoring sozlang
6. ✅ Error logging qo'shing

## Support

Agar muammo bo'lsa:
- Render Logs'ni tekshiring
- MongoDB Atlas Logs'ni tekshiring
- Environment variables'ni tekshiring
