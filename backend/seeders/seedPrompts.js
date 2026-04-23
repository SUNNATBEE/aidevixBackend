/**
 * Aidevix — Prompt Library Seed
 * Har bir AI tool uchun eng yaxshi professional promptlar.
 *
 * Ishlatish:
 *   node backend/seeders/seedPrompts.js
 *
 * DIQQAT: Mavjud promptlarni o'chirmaydi, faqat yangi qo'shadi.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Prompt = require('../models/Prompt');
const User = require('../models/User');

// ─── PROMPTS DATA ─────────────────────────────────────────────────────────────

const PROMPTS = [

  // ══════════════════════════════════════════════════════
  // CLAUDE CODE
  // ══════════════════════════════════════════════════════
  {
    title: 'Full-Stack Feature — Boshidan Oxirigacha Yozish',
    description: 'Claude Code bilan yangi feature ni backend + frontend birga yozish uchun universal prompt',
    category: 'vibe_coding',
    tool: 'Claude Code',
    tags: ['feature', 'fullstack', 'claude'],
    isFeatured: true,
    content: `Menga [FEATURE_NAME] feature'ini yozib ber. Quyidagi talablar asosida ish qil:

BACKEND:
- Express route: [METHOD] /api/[path]
- Mongoose model (agar kerak bo'lsa): [model_fields]
- Controller logika: [business_logic]
- Middleware: auth + validation
- Error handling: try/catch + meaningful messages

FRONTEND:
- React component (TypeScript)
- API call (axios)
- Loading + error states
- Responsive Tailwind CSS

QOIDALAR:
1. Har bir faylni to'liq yoz, snippet emas
2. Console.log qoldirma
3. Type safety (TypeScript)
4. Edge case'larni ko'zda tut

Stack: Node.js/Express + MongoDB/Mongoose + Next.js 14 + Redux Toolkit`,
  },

  {
    title: 'Bug Izlash va Tuzatish — Deep Debug Mode',
    description: 'Murakkab bug\'larni tez topish va tuzatish uchun Claude Code prompt',
    category: 'debugging',
    tool: 'Claude Code',
    tags: ['debug', 'fix', 'error'],
    isFeatured: true,
    content: `Quyidagi xatoni tahlil qil va tuzat:

XATO:
\`\`\`
[ERROR_MESSAGE yoki STACK_TRACE]
\`\`\`

KOD:
\`\`\`[language]
[BUGGY_CODE]
\`\`\`

KONTEKST:
- Bu kod nima qilishi kerak: [EXPECTED_BEHAVIOR]
- Hozir nima qilyapti: [ACTUAL_BEHAVIOR]
- Qachon paydo bo'ldi: [WHEN_IT_STARTED]

Quyidagilarni ber:
1. Root cause tahlili
2. Tuzatilgan kod (to'liq)
3. Nega bunday bo'lgani
4. Oldini olish uchun tavsiya`,
  },

  {
    title: 'Kodni Refactor + Optimize Qilish',
    description: 'Eski kodni zamonaviy patterns bilan qayta yozish',
    category: 'refactoring',
    tool: 'Claude Code',
    tags: ['refactor', 'optimize', 'clean-code'],
    isFeatured: false,
    content: `Quyidagi kodni refactor qil:

\`\`\`[language]
[YOUR_CODE]
\`\`\`

MAQSAD:
- [ ] Performance optimization
- [ ] Readability yaxshilash
- [ ] DRY principle (takrorlanishni yo'q qilish)
- [ ] Error handling qo'shish
- [ ] TypeScript types (agar JS bo'lsa)
- [ ] Modern syntax (async/await, optional chaining, etc.)

MUHIM: Funksionallikni o'zgartirma, faqat kod sifatini oshir.
Har bir o'zgarish uchun qisqacha izoh qo'sh.`,
  },

  {
    title: 'API Endpoint — Swagger Doc bilan',
    description: 'To\'liq documented REST API endpoint yozish',
    category: 'coding',
    tool: 'Claude Code',
    tags: ['api', 'swagger', 'rest', 'express'],
    isFeatured: false,
    content: `Express.js da quyidagi API endpoint yoz:

ENDPOINT: [METHOD] /api/[resource]
MAQSAD: [WHAT_IT_DOES]

TALABLAR:
- Input validation (express-validator yoki manual)
- Auth middleware (req.user mavjud)
- Mongoose query (populate kerak bo'lsa ko'rsat)
- Pagination (agar list bo'lsa): ?page=1&limit=20
- Error responses: 400, 401, 403, 404, 500
- Success response format: { success: true, data: ... }

SWAGGER COMMENT ham qo'sh (JSDoc format):
/**
 * @swagger
 * /api/[path]:
 *   [method]:
 *     ...
 */

Model: [PASTE_YOUR_MONGOOSE_MODEL]`,
  },

  {
    title: 'Test Yozish — Jest + Supertest',
    description: 'Backend API uchun to\'liq test suite',
    category: 'testing',
    tool: 'Claude Code',
    tags: ['test', 'jest', 'supertest', 'tdd'],
    isFeatured: false,
    content: `Quyidagi controller/route uchun Jest + Supertest testlar yoz:

\`\`\`javascript
[YOUR_CONTROLLER_OR_ROUTE_CODE]
\`\`\`

Test qil:
1. Happy path (muvaffaqiyatli holat)
2. Validation errors (400)
3. Auth errors (401, 403)
4. Not found (404)
5. Server error (500) — mock bilan

Mock qil:
- Mongoose models (jest.mock)
- Auth middleware (req.user = testUser)
- External APIs (agar bo'lsa)

beforeEach/afterEach cleanup qo'sh.
Test coverage: minimum 80%`,
  },

  // ══════════════════════════════════════════════════════
  // CURSOR
  // ══════════════════════════════════════════════════════
  {
    title: 'Cursor Composer — Butun Modul Yaratish',
    description: 'Cursor Composer bilan bir nechta faylni birga yaratish',
    category: 'vibe_coding',
    tool: 'Cursor',
    tags: ['composer', 'module', 'cursor'],
    isFeatured: true,
    content: `@Codebase dan foydalanib [MODULE_NAME] modulini to'liq yarat.

Fayl strukturasi:
src/
├── components/[ModuleName]/
│   ├── index.tsx          (asosiy component)
│   ├── [ModuleName]Card.tsx
│   ├── [ModuleName]Form.tsx
│   └── types.ts
├── hooks/use[ModuleName].ts
├── api/[moduleName]Api.ts
└── store/slices/[moduleName]Slice.ts

Har bir faylda:
- TypeScript strict mode
- Proper imports (path aliases: @components, @hooks, @api)
- Error boundaries
- Loading states
- Tailwind CSS

@package.json dan dependencies ko'r va mavjud pattern larni ishlat.`,
  },

  {
    title: 'Cursor Chat — Component UI Redesign',
    description: 'Mavjud componentni zamonaviy UI bilan qayta dizayn qilish',
    category: 'refactoring',
    tool: 'Cursor',
    tags: ['ui', 'redesign', 'tailwind', 'component'],
    isFeatured: true,
    content: `@[component_file.tsx] ni qayta dizayn qil.

YANGI DIZAYN TALABLARI:
- Dark mode first (bg-[#0a0e1a] palette)
- Glassmorphism effects (backdrop-blur, bg-white/5)
- Smooth animations (framer-motion yoki CSS transition)
- Mobile responsive (sm: md: lg: breakpoints)
- Hover/focus states
- Loading skeleton

SAQLAB QOL:
- Barcha props va types
- Business logic
- Event handlers

QO'SHMA:
- ARIA attributes (accessibility)
- Loading state
- Empty state
- Error state

@tailwind.config.js dan custom colors ko'r.`,
  },

  {
    title: 'Cursor — Bug Fix bilan PR Description',
    description: 'Xatoni topib tuzatish va PR tavsifi yozish',
    category: 'debugging',
    tool: 'Cursor',
    tags: ['bugfix', 'pr', 'git'],
    isFeatured: false,
    content: `@[file_with_bug.ts] dagi xatoni top va tuzat.

Simptom: [DESCRIBE_THE_BUG]
Qadam: [STEPS_TO_REPRODUCE]

Tuzatgandan keyin:
1. Root cause ni tushuntir
2. O'zgartirilgan kod ni ko'rsat (diff format)
3. Quyidagi PR description yoz:

## Bug Fix: [title]

### Problem
[nima bo'lyapti]

### Root Cause
[nega bo'lyapti]

### Solution
[qanday tuzatildi]

### Testing
- [ ] Unit test
- [ ] Manual test

@[related_test_file.test.ts] ham yangilash kerakmi?`,
  },

  {
    title: 'Cursor — Database Query Optimize',
    description: 'Sekin MongoDB querylarni tezlashtirish',
    category: 'coding',
    tool: 'Cursor',
    tags: ['mongodb', 'query', 'performance', 'index'],
    isFeatured: false,
    content: `@[model_file.js] va @[controller_file.js] ni ko'rib, quyidagi queryni optimize qil:

\`\`\`javascript
[SLOW_QUERY]
\`\`\`

Muammo: [PERFORMANCE_ISSUE — masalan: 2000ms response time]

Tahlil qil:
1. N+1 query muammosi bormi?
2. Index kerakmi? (qaysi fieldlarda)
3. populate() ni select() bilan cheklash
4. lean() ishlatish mumkinmi?
5. Aggregation pipeline yaxshiroqmi?

Optimized version yoz va explain() natijasini ko'rsat.`,
  },

  {
    title: 'Cursor Rules — Loyiha Uchun .cursorrules',
    description: 'Loyihaga mos custom Cursor qoidalari',
    category: 'documentation',
    tool: 'Cursor',
    tags: ['cursorrules', 'config', 'rules'],
    isFeatured: false,
    content: `Mening loyihada ishlatish uchun .cursorrules fayli yoz.

LOYIHA: [PROJECT_TYPE — masalan: Next.js 14 + Express API]
STACK: [YOUR_STACK]

Qoidalar qamrab olsin:
- Code style (naming conventions, file structure)
- Import order va path aliases
- Component structure (props, types, exports)
- Error handling pattern
- API response format
- Comment style (qachon, qanday)
- Test yozish qoidalari
- Commit message format

@package.json, @tsconfig.json, @tailwind.config.js ni o'qib, haqiqiy konfigdan foydalanib yoz.`,
  },

  // ══════════════════════════════════════════════════════
  // GITHUB COPILOT
  // ══════════════════════════════════════════════════════
  {
    title: 'Copilot — Smart Autocomplete uchun Seed Comment',
    description: 'Copilot dan maksimal autocomplete olish uchun to\'g\'ri comment yozish',
    category: 'coding',
    tool: 'GitHub Copilot',
    tags: ['autocomplete', 'comment', 'copilot'],
    isFeatured: true,
    content: `// Copilot bilan ishlashda eng samarali comment pattern lar:

// 1. FUNKSIYA UCHUN:
/**
 * [Input] ni olib [output] qaytaradi.
 * @param {Type} paramName - [description]
 * @returns {ReturnType} - [description]
 * @example
 * functionName(example) // => result
 */

// 2. COMPLEX LOGIC UCHUN:
// Step 1: [birinchi qadam nima qiladi]
// Step 2: [ikkinchi qadam]
// Expected: [natija qanday bo'lishi kerak]

// 3. REACT HOOK UCHUN:
// Custom hook that [MAQSAD].
// Uses [DEPENDENCIES].
// Returns { [field1], [field2], [action1] }

// 4. API CALL UCHUN:
// Fetches [RESOURCE] from [ENDPOINT]
// Handles: loading, error, success states
// Caches: [yes/no, strategy]

// Tip: Copilot birinchi qatordan pattern tushunadi.
// Qancha aniq yozsang, shuncha yaxshi suggest qiladi.`,
  },

  {
    title: 'Copilot Chat — Code Review',
    description: 'Copilot Chat bilan professional kod review qilish',
    category: 'refactoring',
    tool: 'GitHub Copilot',
    tags: ['review', 'chat', 'quality'],
    isFeatured: true,
    content: `/explain bu kod nima qilyapti va quyidagilarni ko'rib chiq:

\`\`\`
[YOUR_CODE]
\`\`\`

1. SECURITY: SQL injection, XSS, auth bypass xavflari bormi?
2. PERFORMANCE: O'germaydigan loop, memory leak, N+1 bormi?
3. MAINTAINABILITY: Magic numbers, long functions, deep nesting?
4. ERRORS: Unhandled promise, silent catch, bormi?
5. BEST PRACTICES: SOLID, DRY buzilishlar?

Har bir muammo uchun:
- Muammo: [nima]
- Severity: [critical/major/minor]
- Fix: [kod namunasi]`,
  },

  {
    title: 'Copilot — Unit Test Generation',
    description: 'Copilot bilan avtomatik test yozish',
    category: 'testing',
    tool: 'GitHub Copilot',
    tags: ['test', 'unit', 'jest', 'vitest'],
    isFeatured: false,
    content: `/tests generate comprehensive tests for this function:

\`\`\`typescript
[YOUR_FUNCTION]
\`\`\`

Quyidagi test case'larni qamra:
- ✅ Happy path (normal ishlov)
- ❌ Invalid input (null, undefined, wrong type)
- 🔢 Edge cases (empty array, zero, max value)
- 🔁 Async errors (agar async bo'lsa)
- 🎭 Mocked dependencies

Framework: [Jest/Vitest]
Style: AAA pattern (Arrange, Act, Assert)
Coverage: 100% branch coverage maqsad`,
  },

  {
    title: 'Copilot — Documentation Yaratish',
    description: 'Kod uchun professional README va JSDoc',
    category: 'documentation',
    tool: 'GitHub Copilot',
    tags: ['docs', 'readme', 'jsdoc'],
    isFeatured: false,
    content: `/doc generate documentation for this module:

\`\`\`
[YOUR_MODULE_OR_FILE]
\`\`\`

Yarat:
1. JSDoc har bir public funksiya uchun
2. Type definitions (agar yo'q bo'lsa)
3. README.md:
   - Overview
   - Installation
   - Usage examples (real code)
   - API reference table
   - Configuration options
4. CHANGELOG.md format

Til: O'zbek tilida README, kod ichida inglizcha JSDoc`,
  },

  // ══════════════════════════════════════════════════════
  // CHATGPT
  // ══════════════════════════════════════════════════════
  {
    title: 'ChatGPT — System Design Interview',
    description: 'Katta sistema dizaynini rejalashtirish va arxitektura',
    category: 'architecture',
    tool: 'ChatGPT',
    tags: ['system-design', 'architecture', 'scalability'],
    isFeatured: true,
    content: `Men [SYSTEM_NAME] dizayn qilmoqchiman. Quyidagi savollarni tartib bilan javobla:

1. REQUIREMENTS CLARIFICATION
   - Functional: nima qiladi?
   - Non-functional: qancha foydalanuvchi? latency? availability?

2. CAPACITY ESTIMATION
   - DAU: [N] users
   - Read/Write ratio
   - Storage: [X] GB/day

3. HIGH-LEVEL DESIGN
   - Komponentlar diagrammasi (text format)
   - Data flow

4. DATABASE DESIGN
   - SQL vs NoSQL tanlov va sababi
   - Schema/Collection struktura
   - Indexing strategy

5. API DESIGN
   - Asosiy endpoint'lar

6. SCALABILITY
   - Bottleneck'lar
   - Caching strategy (Redis?)
   - Load balancing
   - Sharding/Partitioning

7. TRADE-OFFS
   - Nima sacrifice qilindi?`,
  },

  {
    title: 'ChatGPT — Algorithm Tushuntir va Yoz',
    description: 'Murakkab algoritmlarni tushunib, kodda implement qilish',
    category: 'coding',
    tool: 'ChatGPT',
    tags: ['algorithm', 'dsa', 'leetcode'],
    isFeatured: false,
    content: `[ALGORITHM_NAME] algoritmini menga o'rgat va JavaScript/Python da yoz.

1. TUSHUNTIRISH (sodda tilda):
   - Nima qiladi?
   - Qanday ishlaydi? (qadamlar bilan)
   - Haqiqiy hayotda qayerda ishlatiladi?

2. VISUAL (ASCII art yoki matn bilan):
   Input: [example]
   Qadam 1: [...]
   Qadam 2: [...]
   Output: [result]

3. KOD:
\`\`\`javascript
// Time: O(?)  Space: O(?)
function [algorithmName](input) {
  // ...
}
\`\`\`

4. TEST CASES:
   - Normal case
   - Edge case (empty, single element, max)

5. OPTIMIZATION:
   - Yaxshilash mumkinmi?`,
  },

  {
    title: 'ChatGPT — Tech Stack Tanlash',
    description: 'Loyiha uchun eng mos texnologiyalarni tanlash',
    category: 'architecture',
    tool: 'ChatGPT',
    tags: ['tech-stack', 'decision', 'comparison'],
    isFeatured: false,
    content: `Men [PROJECT_TYPE] qurmoqchiman. Texnologiya tanlashimga yordam ber.

LOYIHA:
- Tur: [web app / mobile / API / etc]
- Foydalanuvchi: [N] ta, [geography]
- Team: [N] dasturchi, [skill level]
- Budget: [timeframe / resources]
- Main feature'lar: [list]

COMPARE QIL:

Frontend: [React vs Vue vs Svelte]
Backend: [Node vs Python vs Go]
Database: [MongoDB vs PostgreSQL vs Supabase]
Hosting: [Vercel vs Railway vs AWS]

Har biri uchun:
| Kriteriy | Variant A | Variant B |
|----------|-----------|-----------|
| Learning curve | | |
| Performance | | |
| Ecosystem | | |
| Cost | | |

FINAL TAVSIYA va sababi:`,
  },

  {
    title: 'ChatGPT — Code Explain & Learn',
    description: 'Murakkab kodni tushunib o\'rganish',
    category: 'documentation',
    tool: 'ChatGPT',
    tags: ['explain', 'learn', 'understand'],
    isFeatured: false,
    content: `Quyidagi kodni menga tushuntir. Men [SKILL_LEVEL] darajadaman:

\`\`\`
[COMPLEX_CODE]
\`\`\`

Tushuntir:
1. UMUMIY MAQSAD: Bu kod nima qilyapti?
2. QATOR BAQATOR: Har bir muhim qatorni izohla
3. PATTERN: Bu qanday design pattern? Nega ishlatilgan?
4. DEPENDENCIES: Qaysi kutubxona/API ishlatilgan va ular nima qiladi?
5. DATA FLOW: Ma'lumot qanday oqyapti?
6. ANALOGIYA: Oddiy hayotdan misol keltir

Keyin menga savol ber — tushundim-tushunmadimni tekshir.`,
  },

  // ══════════════════════════════════════════════════════
  // GEMINI
  // ══════════════════════════════════════════════════════
  {
    title: 'Gemini — Multimodal: UI Screenshot dan Kod',
    description: 'UI screenshot yoki mockup dan to\'g\'ridan-to\'g\'ri kod yaratish',
    category: 'vibe_coding',
    tool: 'Gemini',
    tags: ['multimodal', 'screenshot', 'ui-to-code'],
    isFeatured: true,
    content: `[Screenshotni upload qil]

Ushbu UI ni React + Tailwind CSS da yoz:

TALABLAR:
- Pixel-perfect (ranglar, spacing, typography)
- Dark mode support
- Responsive (mobile first)
- TypeScript
- Framer Motion animations (hover, transitions)

STRUKTURA:
\`\`\`
ComponentName/
├── index.tsx
├── types.ts
└── styles.ts (agar kerak bo'lsa)
\`\`\`

DIQQAT:
- Hardcoded ma'lumot emas, props orqali
- Accessible (ARIA labels)
- Tailwind class larni to'liq yoz (abbreviation emas)`,
  },

  {
    title: 'Gemini — PDF/Docs dan API Dokumentatsiya',
    description: 'API docs yoki PDF dan kod generatsiya',
    category: 'coding',
    tool: 'Gemini',
    tags: ['pdf', 'docs', 'api-integration'],
    isFeatured: false,
    content: `[API dokumentatsiyasini yoki PDF ni upload qil]

Bu API/kutubxona uchun quyidagilarni yarat:

1. TypeScript TYPES:
\`\`\`typescript
interface ApiResponse { ... }
type RequestParams = { ... }
\`\`\`

2. API WRAPPER CLASS:
\`\`\`typescript
class [ApiName]Client {
  constructor(config: Config) {}
  async [method](params: Params): Promise<Response> {}
}
\`\`\`

3. REACT HOOK:
\`\`\`typescript
function use[ApiName]() {
  // loading, error, data states
  // CRUD actions
}
\`\`\`

4. USAGE EXAMPLE:
\`\`\`tsx
// Real kod misoli
\`\`\``,
  },

  {
    title: 'Gemini — Long Context: Butun Repo Tahlil',
    description: 'Ko\'p fayli katta loyihani bir vaqtda tahlil qilish',
    category: 'architecture',
    tool: 'Gemini',
    tags: ['analysis', 'codebase', 'audit'],
    isFeatured: false,
    content: `[Barcha muhim fayllarni upload qil yoki paste qil]

Bu codebase ni to'liq tahlil qil:

1. ARCHITECTURE REVIEW:
   - Qanday pattern ishlatilgan?
   - Muammolik joylar?
   - Coupling/cohesion darajasi?

2. SECURITY AUDIT:
   - Auth/Authorization to'g'rimi?
   - SQL injection / XSS xavfi?
   - Secrets exposed?

3. PERFORMANCE:
   - N+1 query'lar?
   - Unnecessary re-renders?
   - Bundle size muammolari?

4. ACTIONABLE ROADMAP:
   Priority 1 (critical): [...]
   Priority 2 (important): [...]
   Priority 3 (nice-to-have): [...]

Har bir muammo uchun: fayl nomi + qator raqami + fix example`,
  },

  {
    title: 'Gemini — Error Log Tahlil',
    description: 'Server log yoki error report dan muammoni topish',
    category: 'debugging',
    tool: 'Gemini',
    tags: ['logs', 'error', 'analysis'],
    isFeatured: false,
    content: `[Error log faylini yoki stack trace ni paste qil / upload qil]

Bu xatolarni tahlil qil:

1. PATTERN TOPISH:
   - Eng ko'p takrorlanuvchi xato?
   - Vaqt bo'yicha pattern (peak hours)?
   - Bitta xato boshqalarini keltirib chiqaryaptimi?

2. ROOT CAUSE:
   - Asosiy sabab nima?
   - Memory leak / timeout / race condition?

3. PRIORITIES:
   | Xato | Frequency | Severity | Fix effort |
   |------|-----------|----------|------------|

4. IMMEDIATE FIXES:
   Eng muhim 3 ta xato uchun konkret kod fix.

5. MONITORING:
   Bu xatolarni kelajakda ushlash uchun nima qo'shish kerak?`,
  },

  // ══════════════════════════════════════════════════════
  // WINDSURF
  // ══════════════════════════════════════════════════════
  {
    title: 'Windsurf Cascade — Yangi Loyiha Setup',
    description: 'Windsurf bilan noldan loyiha sozlash',
    category: 'vibe_coding',
    tool: 'Windsurf',
    tags: ['setup', 'boilerplate', 'cascade'],
    isFeatured: true,
    content: `Menga [PROJECT_TYPE] loyiha uchun to'liq setup qil:

STACK:
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind
- Backend: Express.js + MongoDB
- Auth: JWT (cookie-based)
- State: Redux Toolkit

YARAT:
1. Folder structure (enterprise pattern)
2. package.json (barcha dependencies)
3. tsconfig.json + tailwind.config.js
4. .env.example (barcha kerakli vars)
5. ESLint + Prettier config
6. Git hooks (husky + lint-staged)
7. README.md

BONUS:
- CI/CD (GitHub Actions)
- Docker compose (dev environment)
- Vercel/Railway deployment config

Keyin birinchi feature ni ham boshlaylik: [FEATURE]`,
  },

  {
    title: 'Windsurf — Real-time Feature (WebSocket)',
    description: 'WebSocket bilan real-time funksiya qo\'shish',
    category: 'coding',
    tool: 'Windsurf',
    tags: ['websocket', 'realtime', 'socket.io'],
    isFeatured: false,
    content: `Loyihaga real-time [FEATURE_NAME] qo'sh (masalan: notifications, chat, live updates).

BACKEND (socket.io + Express):
1. Socket server setup
2. Room/namespace logika
3. Events: [list your events]
4. Auth middleware (JWT verification)
5. Error handling

FRONTEND (React):
1. Socket connection hook (useSocket.ts)
2. Auto-reconnect logika
3. Event listeners cleanup (useEffect return)
4. Optimistic UI updates
5. Connection status indicator

MAVJUD KOD BILAN INTEGRATSIYA:
@[existing_file.ts] bilan moslashtir.

Performance: debounce, throttle qayerda kerak?`,
  },

  {
    title: 'Windsurf — Deployment Pipeline Yaratish',
    description: 'CI/CD pipeline va deploy skriptlari',
    category: 'architecture',
    tool: 'Windsurf',
    tags: ['cicd', 'deploy', 'github-actions', 'docker'],
    isFeatured: false,
    content: `Loyiham uchun to'liq deployment pipeline yarat:

LOYIHA:
- Backend: Railway (Node.js)
- Frontend: Vercel (Next.js)
- DB: MongoDB Atlas
- Repo: GitHub

YARAT:
1. .github/workflows/ci.yml
   - PR da: lint + test + build
   - main ga push: auto deploy

2. .github/workflows/deploy.yml
   - Backend → Railway
   - Frontend → Vercel
   - Secrets management

3. Dockerfile (backend uchun)
4. .dockerignore
5. railway.toml / vercel.json

ENVIRONMENT MANAGEMENT:
- dev / staging / production
- Secrets qanday manage qilinadi?

Health check endpoint ham qo'sh.`,
  },

  // ══════════════════════════════════════════════════════
  // ANY (universal)
  // ══════════════════════════════════════════════════════
  {
    title: 'Universal — Product Requirements Document (PRD)',
    description: 'Har qanday AI bilan yangi feature PRD yaratish',
    category: 'documentation',
    tool: 'Any',
    tags: ['prd', 'planning', 'requirements'],
    isFeatured: true,
    content: `[FEATURE_NAME] uchun PRD (Product Requirements Document) yoz:

## Overview
- Feature nomi:
- Maqsad:
- Foydalanuvchi muammosi:

## User Stories
Har bir persona uchun:
"[User type] sifatida men [action] qilmoqchiman, chunki [benefit]"

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Technical Requirements
Backend:
- Yangi endpoint'lar:
- Database o'zgarishlar:
- Performance:

Frontend:
- UI komponentlar:
- State management:
- Animations:

## Out of Scope
[Nima qilinmaydi]

## Timeline
- Design: X kun
- Backend: X kun
- Frontend: X kun
- Testing: X kun`,
  },

  {
    title: 'Universal — Code Review Checklist',
    description: 'PR review uchun professional checklist',
    category: 'documentation',
    tool: 'Any',
    tags: ['code-review', 'pr', 'checklist', 'quality'],
    isFeatured: false,
    content: `Quyidagi kodni review qil va CHECKLIST bo'yicha baholashtir:

\`\`\`
[YOUR_CODE]
\`\`\`

## Security ✅/❌
- [ ] Input validation bor
- [ ] SQL/NoSQL injection oldini olingan
- [ ] Sensitive data loglanmaydi
- [ ] Auth check to'g'ri

## Performance ✅/❌
- [ ] N+1 query yo'q
- [ ] Unnecessary re-render yo'q
- [ ] Images optimized
- [ ] Caching o'ylangan

## Code Quality ✅/❌
- [ ] Functions kichik (< 20 qator)
- [ ] Magic number yo'q
- [ ] Error handling bor
- [ ] Dead code yo'q

## Tests ✅/❌
- [ ] Unit tests bor
- [ ] Edge cases covered
- [ ] Mocks to'g'ri

Har ❌ uchun: muammo + fix tavsiyasi`,
  },

  {
    title: 'Universal — Git Commit Message Generator',
    description: 'Professional Conventional Commits format',
    category: 'other',
    tool: 'Any',
    tags: ['git', 'commit', 'conventional-commits'],
    isFeatured: false,
    content: `Quyidagi o'zgarishlar uchun professional git commit message yoz:

O'ZGARISHLAR:
\`\`\`diff
[GIT DIFF PASTE QIL]
\`\`\`

FORMAT: Conventional Commits
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

TYPE:
feat / fix / docs / style / refactor / test / chore / perf

QOIDALAR:
- Subject: imperative mood, 50 char max
- Body: nima va nima uchun (qanday emas)
- Footer: breaking changes, closes #issue

Misol:
feat(auth): add refresh token rotation

Implement sliding window refresh tokens to improve security.
Old tokens are invalidated after each refresh cycle.

Closes #123`,
  },

  {
    title: 'Universal — Interview Prep: Technical Questions',
    description: 'JavaScript/Node.js bo\'yicha intervyu savollarini mashq qilish',
    category: 'other',
    tool: 'Any',
    tags: ['interview', 'javascript', 'nodejs', 'prep'],
    isFeatured: false,
    content: `Men [ROLE] lavozimiga intervyuga tayyorlanmoqchiman. [COMPANY_TYPE] da ishlaydi.

STACK: [JavaScript/TypeScript, Node.js, React, etc.]
LEVEL: [Junior/Middle/Senior]

Quyidagilarni qil:

1. 10 TA TEXNIK SAVOL (real intervyularda so'raladigan):
   Har biri uchun:
   - Savol
   - Ideal javob (qisqa)
   - Follow-up savol

2. CODING CHALLENGE (real misol):
   \`\`\`javascript
   // Savol
   // Misol: array flattenlashtir (recursive, iterative)
   \`\`\`

3. SYSTEM DESIGN SAVOL (agar Senior/Middle bo'lsa)

4. BEHAVIORAL SAVOL (STAR format):
   "Eng qiyin bugni qanday topdingiz?"

5. MENGA SAVOL BER — tushundim-tushunmadimni tekshir.`,
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function seed() {
  await connectDB();

  // Admin userini top
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('❌ Admin user topilmadi. Avval admin user yarating.');
    process.exit(1);
  }

  console.log(`✅ Admin topildi: ${admin.username} (${admin._id})`);
  console.log(`📝 ${PROMPTS.length} ta prompt qo'shilmoqda...\n`);

  let added = 0;
  let skipped = 0;

  for (const p of PROMPTS) {
    const exists = await Prompt.findOne({ title: p.title });
    if (exists) {
      console.log(`⏭️  Skip (mavjud): ${p.title}`);
      skipped++;
      continue;
    }

    await Prompt.create({
      ...p,
      author: admin._id,
      isPublic: true,
      likesCount: Math.floor(Math.random() * 40) + 5,
      viewsCount: Math.floor(Math.random() * 200) + 20,
    });

    console.log(`✅ Qo'shildi [${p.tool}]: ${p.title}`);
    added++;
  }

  console.log(`\n🎉 Tayyor! Qo'shildi: ${added} | O'tkazib yuborildi: ${skipped}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed xatosi:', err.message);
  process.exit(1);
});
