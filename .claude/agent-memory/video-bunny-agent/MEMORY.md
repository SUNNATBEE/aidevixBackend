# Video & Bunny.net Agent Memory — Aidevix

## Video Response Struktura (KRITIK)
```json
{
  "video": { "title", "bunnyVideoId", "bunnyStatus", "order", "materials" },
  "player": {
    "embedUrl": "https://iframe.mediadelivery.net/embed/{libId}/{videoId}?token=...&expires=...",
    "expiresAt": "ISO string"
  }
}
```

## Signed URL Generatsiya
```javascript
// Token = HMAC-SHA256(BUNNY_TOKEN_KEY + videoId + expires)
// expires = Math.floor(Date.now()/1000) + 7200  (Unix, soniyada!)
// URL: iframe.mediadelivery.net/embed/{LIBRARY_ID}/{videoId}?token={token}&expires={expires}
```

## Env Vars
```
BUNNY_STREAM_API_KEY  — management API (create/delete video)
BUNNY_LIBRARY_ID      — library ID
BUNNY_TOKEN_KEY       — signed URL token generation uchun
```

## Status Kodlar
- `200` — video tayyor, embedUrl qaytarildi
- `503` — bunnyStatus !== 'ready' (hali processing)
- `403` — obuna yo'q (checkSubscriptions middleware)
- `404` — video topilmadi

## Admin Upload Flow
```
1. POST /api/videos → { videoId }
2. GET  /api/videos/:id/upload-credentials → { tusUrl }
3. Tus upload | PATCH /api/videos/:id/link-bunny { bunnyVideoId }
4. Bunny processes → bunnyStatus: 'ready'
5. GET /api/videos/:id → embedUrl qaytaradi
```

## videoController.js (591 qator) — GREP pattern
```bash
grep -n "^const\|exports\.\|bunny\|503\|embedUrl" backend/controllers/videoController.js
```

## Taniqli Muammolar
- expires soniyada (Unix) — millisekund EMAS
- VideoLink model — DEPRECATED, lekin o'chirma (kod mavjud)
- Tus upload — frontend `@uppy/tus` yoki native tus-js ishlatadi
