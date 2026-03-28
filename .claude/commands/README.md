# Aidevix Backend Agentlari

Bu papkadagi har bir `.md` fayl — bir ixtisoslashgan Claude Code agenti.

## Ishlatish usuli

**Bir terminal ichida:**
```
/payment-agent
```

**Parallel (bir vaqtda 3-4 terminal ochib):**
```
Terminal 1: /payment-agent
Terminal 2: /security-agent
Terminal 3: /db-optimizer-agent
Terminal 4: /gamification-agent
```

## Agentlar va ular nima qiladi

| Agent | Slash Command | Nima qiladi | Qanchalik muhim |
|-------|--------------|-------------|-----------------|
| Payment Integration | `/payment-agent` | Payme + Click to'lov integratsiyasi | 🔴 Juda muhim |
| Subscription Fix | `/subscription-agent` | Instagram verifikatsiya + Telegram mustahkamlash | 🔴 Juda muhim |
| Security Audit | `/security-agent` | Input validation, XSS, injection himoya | 🔴 Juda muhim |
| DB Optimizer | `/db-optimizer-agent` | MongoDB indexlar, query optimallashtirish | 🟠 Muhim |
| Gamification | `/gamification-agent` | Badge, XP log, haftalik reset, streak notif | 🟠 Muhim |
| Certificate PDF | `/certificate-agent` | Haqiqiy PDF sertifikat generatsiya | 🟡 O'rta |
| Notifications | `/notification-agent` | Email templates + Telegram bot bildirishnomalar | 🟡 O'rta |
| Swagger Docs | `/swagger-docs-agent` | Barcha API docs sinxronlashtirish | 🟢 Tavsiya |
| Search & Filter | `/search-filter-agent` | Full-text search, recommendation, autocomplete | 🟢 Tavsiya |

## Tavsiya etilgan parallel guruhlar

### Guruh 1 (Birinchi bajaring — kritik):
```
Terminal 1: /security-agent
Terminal 2: /subscription-agent
Terminal 3: /db-optimizer-agent
```

### Guruh 2 (Keyin):
```
Terminal 1: /payment-agent
Terminal 2: /gamification-agent
Terminal 3: /notification-agent
```

### Guruh 3 (Oxirida):
```
Terminal 1: /certificate-agent
Terminal 2: /swagger-docs-agent
Terminal 3: /search-filter-agent
```
