# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> Homepage — Navigation >> footer contains social links
- Location: e2e\homepage.spec.ts:157:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/", waiting until "load"

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
        - button "Qorong'u" [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - button "Ovozni o'chirish" [ref=e24] [cursor=pointer]:
          - img [ref=e25]
        - button "Til" [ref=e28] [cursor=pointer]:
          - generic [ref=e30]: Til
          - img [ref=e31]
        - link "Kirish" [ref=e33] [cursor=pointer]:
          - /url: /login
        - link "Boshlash →" [ref=e34] [cursor=pointer]:
          - /url: /register
  - main [ref=e36]:
    - generic [ref=e37]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e44]: Aidevix
            - generic [ref=e45]: Professional dasturlash platformasi
          - heading "Kelajak kasbini o'zbek tilida o'rgan" [level=1] [ref=e46]
          - paragraph [ref=e47]: Eng talabgir dasturlash yo'nalishlarini noldan boshlab amaliy loyihalar orqali o'rganing va IT sohasiga birinchi qadamingizni qo'ying.
          - generic [ref=e48]:
            - link "Kurslarni ko'rish" [ref=e49] [cursor=pointer]:
              - /url: /courses
            - link "Ro'yxatdan o'tish" [ref=e50] [cursor=pointer]:
              - /url: /register
              - text: Ro'yxatdan o'tish
              - img [ref=e51]
        - complementary [ref=e53]:
          - generic [ref=e54]: Learning Signal
          - generic [ref=e55]:
            - generic [ref=e56]:
              - generic [ref=e57]:
                - generic [ref=e58]: "01"
                - generic [ref=e59]: 15k+
              - generic [ref=e60]: Faol o'quvchilar
            - generic [ref=e61]:
              - generic [ref=e62]:
                - generic [ref=e63]: "02"
                - generic [ref=e64]: 120+
              - generic [ref=e65]: Video darslar
            - generic [ref=e66]:
              - generic [ref=e67]:
                - generic [ref=e68]: "03"
                - generic [ref=e69]: 50+
              - generic [ref=e70]: Mentorlar
          - paragraph [ref=e71]: Frontend, backend, AI va mobile yo'nalishlarini bitta tizimli platformada o'rganing.
      - generic [ref=e73]:
        - generic [ref=e74]:
          - generic [ref=e75]: Metric 01
          - generic [ref=e76]:
            - generic [ref=e77]: "0"
            - text: +
          - generic [ref=e78]: Faol o'quvchilar
        - generic [ref=e79]:
          - generic [ref=e80]: Metric 02
          - generic [ref=e81]:
            - generic [ref=e82]: "0"
            - text: +
          - generic [ref=e83]: Video darslar
        - generic [ref=e84]:
          - generic [ref=e85]: Metric 03
          - generic [ref=e86]:
            - generic [ref=e87]: "0"
            - text: +
          - generic [ref=e88]: Mentorlar
        - generic [ref=e89]:
          - generic [ref=e90]: Metric 04
          - generic [ref=e91]:
            - generic [ref=e92]: "0"
            - text: ".9"
          - generic [ref=e93]: Reyting
      - generic [ref=e95]:
        - generic [ref=e96]:
          - generic [ref=e97]: Paths
          - heading "Sohangizni tanlang" [level=2] [ref=e98]
          - paragraph [ref=e99]: Barcha darajalar uchun optimallashtirilgan o'quv darsliklari
        - generic [ref=e100]:
          - link "01 Frontend Web saytlar ko'rinishi" [ref=e101] [cursor=pointer]:
            - /url: /courses?category=frontend
            - generic [ref=e102]: "01"
            - generic [ref=e103]:
              - heading "Frontend" [level=3] [ref=e104]
              - paragraph [ref=e105]: Web saytlar ko'rinishi
            - img [ref=e107]
          - link "02 Backend Server va mantiq" [ref=e109] [cursor=pointer]:
            - /url: /courses?category=backend
            - generic [ref=e110]: "02"
            - generic [ref=e111]:
              - heading "Backend" [level=3] [ref=e112]
              - paragraph [ref=e113]: Server va mantiq
            - img [ref=e115]
          - link "03 AI & Agentlar LLMs va AI tools AI" [ref=e117] [cursor=pointer]:
            - /url: /courses?category=ai
            - generic [ref=e118]: "03"
            - generic [ref=e119]:
              - heading "AI & Agentlar" [level=3] [ref=e120]
              - paragraph [ref=e121]: LLMs va AI tools
            - generic [ref=e123]: AI
          - link "04 Python Tahlil va Botlar" [ref=e124] [cursor=pointer]:
            - /url: /courses?category=python
            - generic [ref=e125]: "04"
            - generic [ref=e126]:
              - heading "Python" [level=3] [ref=e127]
              - paragraph [ref=e128]: Tahlil va Botlar
            - img [ref=e130]
          - link "05 Mobile Android va iOS" [ref=e132] [cursor=pointer]:
            - /url: /courses?category=mobile
            - generic [ref=e133]: "05"
            - generic [ref=e134]:
              - heading "Mobile" [level=3] [ref=e135]
              - paragraph [ref=e136]: Android va iOS
            - img [ref=e138]
          - link "06 UI/UX Dizayn va Prototip" [ref=e140] [cursor=pointer]:
            - /url: /courses?category=ui-ux
            - generic [ref=e141]: "06"
            - generic [ref=e142]:
              - heading "UI/UX" [level=3] [ref=e143]
              - paragraph [ref=e144]: Dizayn va Prototip
            - img [ref=e146]
          - link "07 Ma'lumotlar SQL va Tahlil" [ref=e148] [cursor=pointer]:
            - /url: /courses?category=malumotlar
            - generic [ref=e149]: "07"
            - generic [ref=e150]:
              - heading "Ma'lumotlar" [level=3] [ref=e151]
              - paragraph [ref=e152]: SQL va Tahlil
            - img [ref=e154]
      - generic [ref=e157]:
        - generic [ref=e158]:
          - generic [ref=e159]:
            - generic [ref=e160]: Showcase
            - heading "Tavsiya etilgan kurslar" [level=2] [ref=e161]
          - link "Barchasini ko'rish" [ref=e162] [cursor=pointer]:
            - /url: /courses
            - text: Barchasini ko'rish
            - img [ref=e163]
        - generic [ref=e167]:
          - generic [ref=e168]: Fresh Videos
          - heading "Amaliy darslar bilan ritmni ushlab turing" [level=3] [ref=e169]
          - paragraph [ref=e170]: Qisqa video formatlari bilan asosiy mavzularni tezroq o'zlashtiring va platforma ichida uzluksiz davom eting.
      - generic [ref=e176]:
        - generic [ref=e177]:
          - generic [ref=e178]:
            - img [ref=e179]
            - generic [ref=e181]: Aidevix Pro Imkoniyati
          - heading "Dasturlash sirlarini Cheksiz o'rganing" [level=2] [ref=e182]:
            - text: Dasturlash sirlarini
            - text: Cheksiz o'rganing
          - paragraph [ref=e183]: Pro obuna orqali barcha pullik kurslar, yopiq darslar va xalqaro darajadagi sertifikatlarga bir marta to'lov orqali ega bo'ling.
          - list [ref=e184]:
            - listitem [ref=e185]:
              - img [ref=e187]
              - generic [ref=e189]: Barcha kurslarga to'liq kirish
            - listitem [ref=e190]:
              - img [ref=e192]
              - generic [ref=e194]: Yopiq hamjamiyat (Community) a'zoligi
            - listitem [ref=e195]:
              - img [ref=e197]
              - generic [ref=e199]: Mentorlar bilan bevosita aloqa
          - generic [ref=e200]:
            - link "PRO'ga o'tish" [ref=e201] [cursor=pointer]:
              - /url: /subscription
              - text: PRO'ga o'tish
              - img [ref=e202]
            - link "Batafsil ma'lumot" [ref=e204] [cursor=pointer]:
              - /url: /courses
        - generic [ref=e206]:
          - generic [ref=e207]: Membership
          - generic [ref=e208]:
            - generic [ref=e209]:
              - generic [ref=e210]:
                - generic [ref=e211]: Plan status
                - generic [ref=e212]: PRO
              - generic [ref=e213]: Active
            - generic [ref=e214]:
              - generic [ref=e215]:
                - generic [ref=e216]: Barcha kurslarga to'liq kirish
                - generic [ref=e217]: +
              - generic [ref=e218]:
                - generic [ref=e219]: Yopiq hamjamiyat (Community) a'zoligi
                - generic [ref=e220]: +
              - generic [ref=e221]:
                - generic [ref=e222]: Mentorlar bilan bevosita aloqa
                - generic [ref=e223]: +
            - generic [ref=e224]:
              - generic [ref=e225]: Priority Access
              - generic [ref=e226]: Yangi kurslarga birinchi kirish va premium roadmap.
      - generic [ref=e230]:
        - generic [ref=e231]: Start Now
        - heading "Kelajakni biz bilan kodlang!" [level=2] [ref=e232]
        - paragraph [ref=e233]: Kurslar, video darslar va real roadmap bilan kod yozishni barqaror tizimga aylantiring.
        - link "Bepul boshlash" [ref=e234] [cursor=pointer]:
          - /url: /register
  - contentinfo [ref=e235]:
    - generic [ref=e237]:
      - generic [ref=e238]:
        - generic [ref=e239]: Aidevix
        - link "Aidevix" [ref=e240] [cursor=pointer]:
          - /url: /
          - img [ref=e242]
          - generic [ref=e244]: Aidevix
        - paragraph [ref=e245]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e246]:
          - link "tg" [ref=e247] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e248]
          - link "in" [ref=e250] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e251]
          - link "yt" [ref=e253] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e254]
      - generic [ref=e256]:
        - heading "Platforma" [level=4] [ref=e257]
        - list [ref=e258]:
          - listitem [ref=e259]:
            - link "Kurslar" [ref=e260] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e261]:
            - link "Mentorlar" [ref=e262] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e263]:
            - link "Narxlar" [ref=e264] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e265]:
            - link "Kompaniyalar uchun" [ref=e266] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e267]:
        - heading "Kompaniya" [level=4] [ref=e268]
        - list [ref=e269]:
          - listitem [ref=e270]:
            - link "Biz haqimizda" [ref=e271] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e272]:
            - link "Blog" [ref=e273] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e274]:
            - link "Karyera" [ref=e275] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e276]:
            - link "Aloqa" [ref=e277] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e278]:
        - heading "Resurslar" [level=4] [ref=e279]
        - list [ref=e280]:
          - listitem [ref=e281]:
            - link "Yordam markazi" [ref=e282] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e283]:
            - link "Maxfiylik siyosati" [ref=e284] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e285]:
            - link "Foydalanish shartlari" [ref=e286] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e287]:
            - link "Sayt xaritasi" [ref=e288] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e289]:
      - paragraph [ref=e290]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e291]:
        - generic [ref=e292]: Toshkent, O'zbekiston
        - generic [ref=e293]: "|"
        - generic [ref=e294]: Tizim ishlamoqda
  - alert [ref=e296]
```

# Test source

```ts
  58  |     const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content');
  59  |     expect(ogSiteName).toBe('Aidevix');
  60  |   });
  61  | 
  62  |   test('has Twitter Card meta tags', async ({ page }) => {
  63  |     await page.goto(ROUTES.HOME);
  64  | 
  65  |     const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
  66  |     expect(twitterCard).toBe('summary_large_image');
  67  |   });
  68  | 
  69  |   test('has proper robots meta', async ({ page }) => {
  70  |     await page.goto(ROUTES.HOME);
  71  | 
  72  |     // Should be indexable
  73  |     const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  74  |     expect(robots).toContain('index');
  75  |     expect(robots).toContain('follow');
  76  |   });
  77  | 
  78  |   test('viewport meta is set correctly', async ({ page }) => {
  79  |     await page.goto(ROUTES.HOME);
  80  | 
  81  |     const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  82  |     expect(viewport).toContain('width=device-width');
  83  |   });
  84  | 
  85  |   test('has favicon', async ({ page }) => {
  86  |     await page.goto(ROUTES.HOME);
  87  |     const favicon = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
  88  |     await expect(favicon.first()).toHaveAttribute('href', /favicon/i);
  89  |   });
  90  | });
  91  | 
  92  | test.describe('Homepage — Navigation', () => {
  93  |   test.beforeEach(async ({ page }) => {
  94  |     await page.route('**/api/**/courses/top*', (route) =>
  95  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) }),
  96  |     );
  97  |     await page.route('**/api/**/videos/top*', (route) =>
  98  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) }),
  99  |     );
  100 |     await page.route('**/api/**/auth/me*', (route) =>
  101 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  102 |     );
  103 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  104 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  105 |     );
  106 |   });
  107 | 
  108 |   test('navbar is visible', async ({ page }) => {
  109 |     await page.goto(ROUTES.HOME);
  110 |     await waitForPageReady(page);
  111 | 
  112 |     const nav = page.locator(SELECTORS.NAVBAR).first();
  113 |     await expect(nav).toBeVisible();
  114 |   });
  115 | 
  116 |   test('logo links to home', async ({ page }) => {
  117 |     await page.goto(ROUTES.HOME);
  118 |     await waitForPageReady(page);
  119 | 
  120 |     const logoLink = page.locator('a[href="/"]').first();
  121 |     await expect(logoLink).toBeVisible();
  122 |   });
  123 | 
  124 |   test('nav links to courses', async ({ page }) => {
  125 |     await page.goto(ROUTES.HOME);
  126 |     await waitForPageReady(page);
  127 | 
  128 |     const coursesLink = page.locator('a[href="/courses"]').first();
  129 |     if (await coursesLink.isVisible()) {
  130 |       await coursesLink.click();
  131 |       await page.waitForURL('**/courses', { timeout: TIMEOUTS.PAGE_LOAD });
  132 |     }
  133 |   });
  134 | 
  135 |   test('nav shows login/register for unauthenticated user', async ({ page }) => {
  136 |     await page.goto(ROUTES.HOME);
  137 |     await waitForPageReady(page);
  138 | 
  139 |     // Should show auth buttons somewhere on page
  140 |     const loginLink = page.locator('a[href="/login"]');
  141 |     const registerLink = page.locator('a[href="/register"]');
  142 | 
  143 |     const hasLogin = await loginLink.count() > 0;
  144 |     const hasRegister = await registerLink.count() > 0;
  145 | 
  146 |     expect(hasLogin || hasRegister).toBeTruthy();
  147 |   });
  148 | 
  149 |   test('footer is visible', async ({ page }) => {
  150 |     await page.goto(ROUTES.HOME);
  151 |     await waitForPageReady(page);
  152 | 
  153 |     const footer = page.locator(SELECTORS.FOOTER).first();
  154 |     await expect(footer).toBeVisible();
  155 |   });
  156 | 
  157 |   test('footer contains social links', async ({ page }) => {
> 158 |     await page.goto(ROUTES.HOME);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  159 |     await waitForPageReady(page);
  160 | 
  161 |     // Footer should have telegram and instagram links
  162 |     const telegramLink = page.locator('a[href*="t.me"]').first();
  163 |     const instagramLink = page.locator('a[href*="instagram"]').first();
  164 | 
  165 |     const hasTelegram = await telegramLink.count() > 0;
  166 |     const hasInstagram = await instagramLink.count() > 0;
  167 | 
  168 |     expect(hasTelegram || hasInstagram).toBeTruthy();
  169 |   });
  170 | });
  171 | 
  172 | test.describe('Homepage — Content', () => {
  173 |   test.beforeEach(async ({ page }) => {
  174 |     await page.route('**/api/**/courses/top*', (route) =>
  175 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) }),
  176 |     );
  177 |     await page.route('**/api/**/videos/top*', (route) =>
  178 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) }),
  179 |     );
  180 |     await page.route('**/api/**/auth/me*', (route) =>
  181 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  182 |     );
  183 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  184 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  185 |     );
  186 |   });
  187 | 
  188 |   test('displays hero section', async ({ page }) => {
  189 |     await page.goto(ROUTES.HOME);
  190 |     await waitForPageReady(page);
  191 | 
  192 |     // Hero should have heading with Aidevix or relevant text
  193 |     const heading = page.locator('h1, h2').first();
  194 |     await expect(heading).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  195 |   });
  196 | 
  197 |   test('displays course cards', async ({ page }) => {
  198 |     await page.goto(ROUTES.HOME);
  199 |     await waitForPageReady(page);
  200 | 
  201 |     // Wait for content to load
  202 |     await page.waitForTimeout(2000);
  203 | 
  204 |     // Should show course-related content
  205 |     const courseSection = page.locator('text=/kurs/i').first();
  206 |     if (await courseSection.isVisible()) {
  207 |       expect(true).toBeTruthy();
  208 |     }
  209 |   });
  210 | 
  211 |   test('CTA buttons are clickable', async ({ page }) => {
  212 |     await page.goto(ROUTES.HOME);
  213 |     await waitForPageReady(page);
  214 | 
  215 |     // Find primary CTA buttons
  216 |     const ctaButtons = page.locator('a.btn, button.btn').filter({ hasText: /boshlash|kurslar|ro.*yxat/i });
  217 |     const count = await ctaButtons.count();
  218 | 
  219 |     if (count > 0) {
  220 |       // First CTA should be clickable
  221 |       await expect(ctaButtons.first()).toBeEnabled();
  222 |     }
  223 |   });
  224 | });
  225 | 
  226 | test.describe('Homepage — Responsive', () => {
  227 |   test.beforeEach(async ({ page }) => {
  228 |     await page.route('**/api/**', (route) => {
  229 |       const url = route.request().url();
  230 |       if (url.includes('courses/top')) {
  231 |         return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) });
  232 |       }
  233 |       if (url.includes('videos/top')) {
  234 |         return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) });
  235 |       }
  236 |       return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) });
  237 |     });
  238 |   });
  239 | 
  240 |   test('mobile: hamburger menu appears on small screens', async ({ page }) => {
  241 |     await page.setViewportSize({ width: 375, height: 812 });
  242 |     await page.goto(ROUTES.HOME);
  243 |     await waitForPageReady(page);
  244 | 
  245 |     // Should see hamburger menu button on mobile
  246 |     const menuBtns = page.locator('button').filter({ has: page.locator('svg') });
  247 |     const count = await menuBtns.count();
  248 |     expect(count).toBeGreaterThan(0);
  249 |   });
  250 | 
  251 |   test('desktop: nav links visible on large screens', async ({ page }) => {
  252 |     await page.setViewportSize({ width: 1440, height: 900 });
  253 |     await page.goto(ROUTES.HOME);
  254 |     await waitForPageReady(page);
  255 | 
  256 |     const nav = page.locator(SELECTORS.NAVBAR).first();
  257 |     await expect(nav).toBeVisible();
  258 |   });
```