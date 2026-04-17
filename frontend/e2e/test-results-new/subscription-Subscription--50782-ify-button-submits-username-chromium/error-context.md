# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: subscription.spec.ts >> Subscription Verification >> Instagram verify button submits username
- Location: e2e\subscription.spec.ts:85:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('button').filter({ hasText: /tekshirish|verify|tasdiqlash/i }).last()
    - locator resolved to <button class="w-full p-3 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 disabled:bg-blue-500/10 disabled:cursor-not-allowed text-blue-400 font-medium rounded-lg transition-colors">Obunani tekshirish</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - element is outside of the viewport
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 100ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <p class="mb-8 text-sm leading-relaxed text-gray-400">Siz qatorasiga tizimga kirdingiz. O'z sovg'angizn…</p> from <div class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0c14]/80 px-4 backdrop-blur-sm">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0c14]/80 px-4 backdrop-blur-sm">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <p class="mb-8 text-sm leading-relaxed text-gray-400">Siz qatorasiga tizimga kirdingiz. O'z sovg'angizn…</p> from <div class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0c14]/80 px-4 backdrop-blur-sm">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0c14]/80 px-4 backdrop-blur-sm">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  4 × retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0c14]/80 px-4 backdrop-blur-sm">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
  - generic [ref=e49]:
    - button [ref=e50] [cursor=pointer]:
      - img [ref=e51]
    - img [ref=e55]
    - heading "Kunlik Sovg'a!" [level=2] [ref=e60]
    - paragraph [ref=e61]: Siz qatorasiga tizimga kirdingiz. O'z sovg'angizni qabul qilib oling!
    - button "Yig'ib olish (+50 XP)" [ref=e62] [cursor=pointer]
  - main [ref=e63]:
    - generic [ref=e65]:
      - generic [ref=e66]:
        - img [ref=e68]
        - heading "Ijtimoiy tarmoqlarga obuna" [level=1] [ref=e70]
        - paragraph [ref=e71]: Kurslarni ko'rish uchun ijtimoiy tarmoqlarimizga a'zo bo'ling va accessni tasdiqlang.
      - list [ref=e73]:
        - listitem [ref=e74]: Telegram
        - listitem [ref=e75]: Instagram
        - listitem [ref=e76]: Tayyor!
      - generic [ref=e77]:
        - generic [ref=e79]:
          - generic [ref=e80]:
            - generic [ref=e81]:
              - img [ref=e83]
              - heading "Telegram Verifikatsiya" [level=3] [ref=e85]
              - paragraph [ref=e86]: Telegram kanalimizga obuna bo'lishingiz shart
            - generic [ref=e87]:
              - generic [ref=e88]:
                - generic [ref=e89]: "1"
                - generic [ref=e90]:
                  - paragraph [ref=e91]: Kanalga obuna bo'ling
                  - link "KANALNI OCHISH →" [ref=e92] [cursor=pointer]:
                    - /url: https://t.me/aidevix
              - generic [ref=e93]:
                - generic [ref=e94]: "2"
                - generic [ref=e95]:
                  - paragraph [ref=e96]: ID raqamingizni oling
                  - generic [ref=e97]:
                    - paragraph [ref=e98]:
                      - text: Botimizga
                      - code [ref=e99]: /id
                      - text: yoki
                      - code [ref=e100]: /start
                      - text: "yozing:"
                    - link "@aidevix_bot" [ref=e102] [cursor=pointer]:
                      - /url: https://t.me/aidevix_bot
              - generic [ref=e103]:
                - generic [ref=e104]: "3"
                - generic [ref=e105]:
                  - paragraph [ref=e106]: ID ni kiriting
                  - 'textbox "Masalan: 12345678" [ref=e107]'
                  - button "OBUNANI TEKSHIRISH" [disabled] [ref=e108]
          - generic [ref=e109]:
            - generic [ref=e110]:
              - img [ref=e111]
              - heading "Instagram'ga obuna bo'ling" [level=3] [ref=e114]
              - paragraph [ref=e115]: Sahifamizga obuna bo'ling, keyin username orqali tekshiring
            - generic [ref=e116]:
              - 'heading "1-qadam: Aidevix''ga obuna bo''ling" [level=4] [ref=e117]'
              - link "@aidevix ga obuna bo'lish →" [ref=e118] [cursor=pointer]:
                - /url: https://instagram.com/aidevix
              - paragraph [ref=e119]: Real follower API cheklangan. Server faqat tekshira olgan holatdagina tasdiqlaydi.
            - generic [ref=e120]:
              - heading "2-qadam:" [level=4] [ref=e121]
              - generic [ref=e122]:
                - generic [ref=e123]:
                  - img [ref=e124]
                  - paragraph [ref=e127]: Instagram username tekshiruvi
                - paragraph [ref=e128]: Username yuboriladi. Server tasdiqlamasa access berilmaydi.
              - generic [ref=e129]:
                - textbox "Instagram username (@username)" [active] [ref=e130]: testuser_ig
                - button "Obunani tekshirish" [ref=e131] [cursor=pointer]
                - button "Avval obunani tekshiring" [disabled] [ref=e132]
        - generic [ref=e133]:
          - paragraph [ref=e134]: Obuna holatingiz server tomonda tekshiriladi. Muammo bo'lsa yangilang.
          - button [ref=e135] [cursor=pointer]:
            - img [ref=e136]
  - contentinfo [ref=e139]:
    - generic [ref=e141]:
      - generic [ref=e142]:
        - generic [ref=e143]: Aidevix
        - link "Aidevix" [ref=e144] [cursor=pointer]:
          - /url: /
          - img [ref=e146]
          - generic [ref=e148]: Aidevix
        - paragraph [ref=e149]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e150]:
          - link "tg" [ref=e151] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e152]
          - link "in" [ref=e154] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e155]
          - link "yt" [ref=e157] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e158]
      - generic [ref=e160]:
        - heading "Platforma" [level=4] [ref=e161]
        - list [ref=e162]:
          - listitem [ref=e163]:
            - link "Kurslar" [ref=e164] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e165]:
            - link "Mentorlar" [ref=e166] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e167]:
            - link "Narxlar" [ref=e168] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e169]:
            - link "Kompaniyalar uchun" [ref=e170] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e171]:
        - heading "Kompaniya" [level=4] [ref=e172]
        - list [ref=e173]:
          - listitem [ref=e174]:
            - link "Biz haqimizda" [ref=e175] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e176]:
            - link "Blog" [ref=e177] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e178]:
            - link "Karyera" [ref=e179] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e180]:
            - link "Aloqa" [ref=e181] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e182]:
        - heading "Resurslar" [level=4] [ref=e183]
        - list [ref=e184]:
          - listitem [ref=e185]:
            - link "Yordam markazi" [ref=e186] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e187]:
            - link "Maxfiylik siyosati" [ref=e188] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e189]:
            - link "Foydalanish shartlari" [ref=e190] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e191]:
            - link "Sayt xaritasi" [ref=e192] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e193]:
      - paragraph [ref=e194]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e195]:
        - generic [ref=e196]: Toshkent, O'zbekiston
        - generic [ref=e197]: "|"
        - generic [ref=e198]: Tizim ishlamoqda
  - alert [ref=e200]
```

# Test source

```ts
  12  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  13  |     );
  14  | 
  15  |     await loggedInPage.goto(ROUTES.SUBSCRIPTION);
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
> 112 |         await verifyBtn.click();
      |                         ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  113 |         await loggedInPage.waitForTimeout(1000);
  114 |       }
  115 |     }
  116 |   });
  117 | });
  118 | 
  119 | test.describe('Subscription Gate Component', () => {
  120 |   test('gate blocks content for unverified users', async ({ page }) => {
  121 |     await page.addInitScript(() => {
  122 |       localStorage.setItem('aidevix_user', JSON.stringify({
  123 |         _id: 'u1', username: 'newuser', email: 'new@test.com',
  124 |         subscriptions: { telegram: { verified: false }, instagram: { verified: false } },
  125 |       }));
  126 |     });
  127 | 
  128 |     await page.route('**/api/**/auth/me*', (route) =>
  129 |       route.fulfill({
  130 |         status: 200,
  131 |         contentType: 'application/json',
  132 |         body: JSON.stringify({
  133 |           success: true,
  134 |           data: {
  135 |             user: {
  136 |               _id: 'u1', username: 'newuser', email: 'new@test.com',
  137 |               subscriptions: { telegram: { verified: false }, instagram: { verified: false } },
  138 |             },
  139 |           },
  140 |         }),
  141 |       }),
  142 |     );
  143 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  144 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { accessToken: 'tok' } }) }),
  145 |     );
  146 |     await page.route('**/api/**/subscriptions/status*', (route) =>
  147 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  148 |     );
  149 |     await page.route('**/api/**/xp/stats*', (route) =>
  150 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  151 |     );
  152 |     await page.route('**/api/**/videos/**', (route) =>
  153 |       route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Obuna talab qilinadi' }) }),
  154 |     );
  155 | 
  156 |     await page.goto('/videos/video-1');
  157 |     await waitForPageReady(page);
  158 |     await page.waitForTimeout(3000);
  159 | 
  160 |     // Should show gate or redirect
  161 |     const gateVisible = await page.locator('text=/obuna|telegram|instagram|subscribe/i').first().isVisible().catch(() => false);
  162 |     const redirected = page.url().includes('/subscription') || page.url().includes('/login');
  163 | 
  164 |     expect(gateVisible || redirected).toBeTruthy();
  165 |   });
  166 | });
  167 | 
```