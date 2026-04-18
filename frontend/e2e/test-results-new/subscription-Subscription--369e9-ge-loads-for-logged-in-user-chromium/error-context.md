# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: subscription.spec.ts >> Subscription Verification >> subscription page loads for logged-in user
- Location: e2e\subscription.spec.ts:7:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/subscription", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "Aidevix" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e9]: Aidevix
      - list [ref=e10]:
        - listitem [ref=e11]:
          - link "Kurslar" [ref=e12] [cursor=pointer]:
            - /url: /courses
        - listitem [ref=e13]:
          - link "Musobaqalar" [ref=e14] [cursor=pointer]:
            - /url: /challenges
        - listitem [ref=e15]:
          - link "Qahramonlar" [ref=e16] [cursor=pointer]:
            - /url: /leaderboard
        - listitem [ref=e17]:
          - link "Vakansiyalar" [ref=e18] [cursor=pointer]:
            - /url: /careers
      - generic [ref=e19]:
        - button "Yorug'" [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - button "Ovozni o'chirish" [ref=e24] [cursor=pointer]:
          - img [ref=e25]
        - button "Til" [ref=e28] [cursor=pointer]:
          - generic [ref=e30]: Til
          - img [ref=e31]
        - generic [ref=e33]:
          - generic [ref=e34]:
            - generic "XP" [ref=e35]:
              - generic [ref=e36]: XP
              - generic [ref=e37]: 0 XP
            - generic [ref=e39]:
              - generic [ref=e40]: Hot
              - generic [ref=e41]: "0"
          - generic [ref=e43] [cursor=pointer]:
            - generic [ref=e44]: U
            - generic [ref=e46]: AMATEUR
  - main [ref=e48]:
    - generic [ref=e50]:
      - generic [ref=e51]:
        - img [ref=e53]
        - heading "Ijtimoiy tarmoqlarga obuna" [level=1] [ref=e55]
        - paragraph [ref=e56]: Kurslarni ko'rish uchun ijtimoiy tarmoqlarimizga a'zo bo'ling va accessni tasdiqlang.
      - list [ref=e58]:
        - listitem [ref=e59]: Telegram
        - listitem [ref=e60]: Instagram
        - listitem [ref=e61]: Tayyor!
      - generic [ref=e62]:
        - generic [ref=e64]:
          - generic [ref=e65]:
            - generic [ref=e66]:
              - img [ref=e68]
              - heading "Telegram Verifikatsiya" [level=3] [ref=e70]
              - paragraph [ref=e71]: Telegram kanalimizga obuna bo'lishingiz shart
            - generic [ref=e72]:
              - generic [ref=e73]:
                - generic [ref=e74]: "1"
                - generic [ref=e75]:
                  - paragraph [ref=e76]: Kanalga obuna bo'ling
                  - link "KANALNI OCHISH →" [ref=e77] [cursor=pointer]:
                    - /url: https://t.me/aidevix
              - generic [ref=e78]:
                - generic [ref=e79]: "2"
                - generic [ref=e80]:
                  - paragraph [ref=e81]: ID raqamingizni oling
                  - generic [ref=e82]:
                    - paragraph [ref=e83]:
                      - text: Botimizga
                      - code [ref=e84]: /id
                      - text: yoki
                      - code [ref=e85]: /start
                      - text: "yozing:"
                    - link "@aidevix_bot" [ref=e87] [cursor=pointer]:
                      - /url: https://t.me/aidevix_bot
              - generic [ref=e88]:
                - generic [ref=e89]: "3"
                - generic [ref=e90]:
                  - paragraph [ref=e91]: ID ni kiriting
                  - 'textbox "Masalan: 12345678" [ref=e92]'
                  - button "OBUNANI TEKSHIRISH" [disabled] [ref=e93]
          - generic [ref=e94]:
            - generic [ref=e95]:
              - img [ref=e96]
              - heading "Instagram'ga obuna bo'ling" [level=3] [ref=e99]
              - paragraph [ref=e100]: Sahifamizga obuna bo'ling, keyin username orqali tekshiring
            - generic [ref=e101]:
              - 'heading "1-qadam: Aidevix''ga obuna bo''ling" [level=4] [ref=e102]'
              - link "@aidevix ga obuna bo'lish →" [ref=e103] [cursor=pointer]:
                - /url: https://instagram.com/aidevix
              - paragraph [ref=e104]: Real follower API cheklangan. Server faqat tekshira olgan holatdagina tasdiqlaydi.
            - generic [ref=e105]:
              - heading "2-qadam:" [level=4] [ref=e106]
              - generic [ref=e107]:
                - generic [ref=e108]:
                  - img [ref=e109]
                  - paragraph [ref=e112]: Instagram username tekshiruvi
                - paragraph [ref=e113]: Username yuboriladi. Server tasdiqlamasa access berilmaydi.
              - generic [ref=e114]:
                - textbox "Instagram username (@username)" [ref=e115]
                - button "Obunani tekshirish" [disabled] [ref=e116]
                - button "Avval obunani tekshiring" [disabled] [ref=e117]
        - generic [ref=e118]:
          - paragraph [ref=e119]: Obuna holatingiz server tomonda tekshiriladi. Muammo bo'lsa yangilang.
          - button [ref=e120] [cursor=pointer]:
            - img [ref=e121]
  - contentinfo [ref=e124]:
    - generic [ref=e126]:
      - generic [ref=e127]:
        - generic [ref=e128]: Aidevix
        - link "Aidevix" [ref=e129] [cursor=pointer]:
          - /url: /
          - img [ref=e131]
          - generic [ref=e133]: Aidevix
        - paragraph [ref=e134]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e135]:
          - link "tg" [ref=e136] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e137]
          - link "in" [ref=e139] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e140]
          - link "yt" [ref=e142] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e143]
      - generic [ref=e145]:
        - heading "Platforma" [level=4] [ref=e146]
        - list [ref=e147]:
          - listitem [ref=e148]:
            - link "Kurslar" [ref=e149] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e150]:
            - link "Mentorlar" [ref=e151] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e152]:
            - link "Narxlar" [ref=e153] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e154]:
            - link "Kompaniyalar uchun" [ref=e155] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e156]:
        - heading "Kompaniya" [level=4] [ref=e157]
        - list [ref=e158]:
          - listitem [ref=e159]:
            - link "Biz haqimizda" [ref=e160] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e161]:
            - link "Blog" [ref=e162] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e163]:
            - link "Karyera" [ref=e164] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e165]:
            - link "Aloqa" [ref=e166] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e167]:
        - heading "Resurslar" [level=4] [ref=e168]
        - list [ref=e169]:
          - listitem [ref=e170]:
            - link "Yordam markazi" [ref=e171] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e172]:
            - link "Maxfiylik siyosati" [ref=e173] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e174]:
            - link "Foydalanish shartlari" [ref=e175] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e176]:
            - link "Sayt xaritasi" [ref=e177] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e178]:
      - paragraph [ref=e179]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e180]:
        - generic [ref=e181]: Toshkent, O'zbekiston
        - generic [ref=e182]: "|"
        - generic [ref=e183]: Tizim ishlamoqda
  - alert [ref=e185]
```

# Test source

```ts
  1   | import { test, expect } from './fixtures/test-fixtures';
  2   | import { ROUTES, TIMEOUTS } from './helpers/constants';
  3   | import { MOCK_SUBSCRIPTION_STATUS, MOCK_SUBSCRIPTION_UNVERIFIED, MOCK_USER } from './fixtures/mock-data';
  4   | import { waitForPageReady } from './helpers/test-utils';
  5   | 
  6   | test.describe('Subscription Verification', () => {
  7   |   test('subscription page loads for logged-in user', async ({ loggedInPage }) => {
  8   |     await loggedInPage.route('**/api/**/subscriptions/status*', (route) =>
  9   |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  10  |     );
  11  |     await loggedInPage.route('**/api/**/subscriptions/realtime-status*', (route) =>
  12  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  13  |     );
  14  | 
> 15  |     await loggedInPage.goto(ROUTES.SUBSCRIPTION);
      |                        ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  16  |     await waitForPageReady(loggedInPage);
  17  | 
  18  |     // Should show subscription verification UI
  19  |     const hasTelegramSection = await loggedInPage.locator('text=/telegram/i').first().isVisible().catch(() => false);
  20  |     const hasInstagramSection = await loggedInPage.locator('text=/instagram/i').first().isVisible().catch(() => false);
  21  | 
  22  |     // At least one social verification should be visible
  23  |     expect(hasTelegramSection || hasInstagramSection).toBeTruthy();
  24  |   });
  25  | 
  26  |   test('shows verified status for subscribed user', async ({ loggedInPage }) => {
  27  |     await loggedInPage.route('**/api/**/subscriptions/status*', (route) =>
  28  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_STATUS) }),
  29  |     );
  30  |     await loggedInPage.route('**/api/**/subscriptions/realtime-status*', (route) =>
  31  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_STATUS) }),
  32  |     );
  33  | 
  34  |     await loggedInPage.goto(ROUTES.SUBSCRIPTION);
  35  |     await waitForPageReady(loggedInPage);
  36  | 
  37  |     await loggedInPage.waitForTimeout(2000);
  38  | 
  39  |     // Should show verified indicators or redirect
  40  |     const hasVerified = await loggedInPage.locator('text=/tasdiqlangan|verified|✓|✅/i').first().isVisible().catch(() => false);
  41  |     const url = loggedInPage.url();
  42  | 
  43  |     // Either shows verified status or redirected away (already verified)
  44  |     expect(hasVerified || !url.includes('/subscription')).toBeTruthy();
  45  |   });
  46  | 
  47  |   test('Telegram verify button submits username', async ({ loggedInPage }) => {
  48  |     let telegramVerifyCalled = false;
  49  | 
  50  |     await loggedInPage.route('**/api/**/subscriptions/status*', (route) =>
  51  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  52  |     );
  53  |     await loggedInPage.route('**/api/**/subscriptions/realtime-status*', (route) =>
  54  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  55  |     );
  56  |     await loggedInPage.route('**/api/**/subscriptions/verify-telegram', async (route) => {
  57  |       telegramVerifyCalled = true;
  58  |       await route.fulfill({
  59  |         status: 200,
  60  |         contentType: 'application/json',
  61  |         body: JSON.stringify({
  62  |           success: true,
  63  |           data: { telegram: { verified: true, username: 'testuser_tg' } },
  64  |         }),
  65  |       });
  66  |     });
  67  | 
  68  |     await loggedInPage.goto(ROUTES.SUBSCRIPTION);
  69  |     await waitForPageReady(loggedInPage);
  70  | 
  71  |     // Find Telegram input and fill it
  72  |     const tgInput = loggedInPage.locator('input[placeholder*="telegram" i], input[placeholder*="username" i]').first();
  73  |     if (await tgInput.isVisible().catch(() => false)) {
  74  |       await tgInput.fill('testuser_tg');
  75  | 
  76  |       // Find and click verify/submit button near the telegram section
  77  |       const verifyBtn = loggedInPage.locator('button').filter({ hasText: /tekshirish|verify|tasdiqlash/i }).first();
  78  |       if (await verifyBtn.isVisible().catch(() => false)) {
  79  |         await verifyBtn.click();
  80  |         await loggedInPage.waitForTimeout(1000);
  81  |       }
  82  |     }
  83  |   });
  84  | 
  85  |   test('Instagram verify button submits username', async ({ loggedInPage }) => {
  86  |     await loggedInPage.route('**/api/**/subscriptions/status*', (route) =>
  87  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  88  |     );
  89  |     await loggedInPage.route('**/api/**/subscriptions/realtime-status*', (route) =>
  90  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  91  |     );
  92  |     await loggedInPage.route('**/api/**/subscriptions/verify-instagram', (route) =>
  93  |       route.fulfill({
  94  |         status: 200,
  95  |         contentType: 'application/json',
  96  |         body: JSON.stringify({
  97  |           success: true,
  98  |           data: { instagram: { verified: true, username: 'testuser_ig' } },
  99  |         }),
  100 |       }),
  101 |     );
  102 | 
  103 |     await loggedInPage.goto(ROUTES.SUBSCRIPTION);
  104 |     await waitForPageReady(loggedInPage);
  105 | 
  106 |     const igInput = loggedInPage.locator('input[placeholder*="instagram" i], input[placeholder*="username" i]').last();
  107 |     if (await igInput.isVisible().catch(() => false)) {
  108 |       await igInput.fill('testuser_ig');
  109 | 
  110 |       const verifyBtn = loggedInPage.locator('button').filter({ hasText: /tekshirish|verify|tasdiqlash/i }).last();
  111 |       if (await verifyBtn.isVisible().catch(() => false)) {
  112 |         await verifyBtn.click();
  113 |         await loggedInPage.waitForTimeout(1000);
  114 |       }
  115 |     }
```