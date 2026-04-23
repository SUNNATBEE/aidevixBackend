/**
 * Aidevix — Prompt Library Seed v4
 * 2026 Professional Edition: Multi-Agent, Token Optimization,
 * Advanced MCP, Hooks, Vibe Coding, Security, Orchestration.
 *
 * node backend/seeders/seedPrompts4.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const connectDB = require('../config/database');
const Prompt = require('../models/Prompt');
const User = require('../models/User');

const PROMPTS = [

  // ════════════════════════════════════════════════════════════
  // CLAUDE CODE — Advanced 2026
  // ════════════════════════════════════════════════════════════

  {
    title: 'Claude Code — Multi-Agent Orkestatsiya (2026)',
    description: 'Claude Agent SDK bilan bir nechta agentni parallel boshqarish',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['multi-agent', 'orchestration', 'sdk', 'parallel', '2026'],
    isFeatured: true,
    content: `Claude Agent SDK — Multi-Agent Orkestatsiya:

AGENT SDK NIMA (2026):
Claude Agent SDK — bir nechta Claude agentni koddan boshqarish.
Har bir agent o'z toollar, kontekst va rolga ega.

ARXITEKTURA:
\`\`\`
Orchestrator Agent (planner)
├── Backend Agent   → Express/DB kod yozadi
├── Frontend Agent  → React/Next.js kod yozadi
├── Test Agent      → Test yozadi va ishlatadi
└── Review Agent    → Kod sifatini tekshiradi
\`\`\`

AGENT SDK ISHLATISH:
\`\`\`javascript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// Agent yaratish
async function runAgent(role, task, tools = []) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 16384,
    system: \`Sen \${role} san. Faqat o'z scope'ingda ishla.\`,
    tools: tools,
    messages: [{ role: 'user', content: task }]
  })

  // Tool use loop
  while (response.stop_reason === 'tool_use') {
    const toolResults = await executeTools(response)
    response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 16384,
      system: \`Sen \${role} san.\`,
      tools: tools,
      messages: [...messages, ...toolResults]
    })
  }
  return response
}

// Parallel agents
const [backend, frontend] = await Promise.all([
  runAgent('backend developer', 'Auth controller yoz', backendTools),
  runAgent('frontend developer', 'Login page yoz', frontendTools)
])

// Review agent
const review = await runAgent(
  'senior code reviewer',
  \`Backend:\n\${backend}\n\nFrontend:\n\${frontend}\n\nReview qil.\`
)
\`\`\`

CLAUDE CODE ICHIDA SUBAGENT:
\`\`\`
Claude Code da Agent tool orqali subagent ishlatiladi:
- Explore agent — codebase qidirish
- Plan agent — arxitektura rejasi
- General agent — parallel task

Prompt: "3 ta agentni parallel ishga tushir:
1. Backend API endpoint yoz
2. Frontend component yoz
3. Test yoz
Har biri tugagach natijani birlashtir."
\`\`\`

QACHON MULTI-AGENT:
✅ Katta feature (backend + frontend + test)
✅ Codebase audit (security + perf + quality)
✅ Refactor (analyze + plan + execute + verify)
❌ Kichik fix (overkill)
❌ Bitta fayl o'zgartirish`,
  },

  {
    title: 'Claude Code — Hooks: Avtomatik Workflow (2026)',
    description: 'PostToolUse, PreToolUse, Stop hooks bilan avtomatlashtirilgan pipeline',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['hooks', 'automation', 'pipeline', 'postToolUse', 'preToolUse'],
    isFeatured: true,
    content: `Claude Code Hooks — avtomatlashtirilgan workflow:

HOOKS NIMA:
Hooks — Claude Code har bir amal oldidan/keyin avtomatik
ishlaydigan shell buyruqlar. CI/CD pipeline kabi.

HOOK TURLARI:
| Hook | Qachon | Ishlatish |
|------|--------|-----------|
| PreToolUse | Tool ishlatishdan OLDIN | Validatsiya, bloklash |
| PostToolUse | Tool ishlatishdan KEYIN | Formatting, lint |
| Notification | Bildirishnoma kerakda | Desktop alert |
| Stop | Session tugaganda | Summary, git status |

TO'LIQ HOOKS KONFIGURATSIYASI:
\`\`\`json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "if echo '$CLAUDE_TOOL_INPUT' | grep -qE 'rm -rf|DROP|sudo'; then echo 'BLOCKED: Xavfli buyruq!' >&2; exit 1; fi"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_TOOL_RESULT_FILE 2>/dev/null || true"
          },
          {
            "type": "command",
            "command": "npx eslint --fix $CLAUDE_TOOL_RESULT_FILE 2>/dev/null || true"
          }
        ]
      },
      {
        "matcher": "Bash(npm test*)",
        "hooks": [{
          "type": "command",
          "command": "echo '\\n📊 Test coverage:' && npx jest --coverage --silent 2>/dev/null | tail -5 || true"
        }]
      }
    ],
    "Notification": [
      {
        "hooks": [{
          "type": "command",
          "command": "notify-send 'Claude Code' '$CLAUDE_NOTIFICATION' 2>/dev/null || powershell -c \\"[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('$CLAUDE_NOTIFICATION')\\" 2>/dev/null || true"
        }]
      }
    ],
    "Stop": [
      {
        "hooks": [{
          "type": "command",
          "command": "echo '\\n📋 Session Summary:' && git diff --stat && echo '\\n📁 Modified:' && git status --short"
        }]
      }
    ]
  }
}
\`\`\`

MATCHER PATTERNS:
- "Write" — faqat Write tool
- "Write|Edit" — Write YOKI Edit
- "Bash(npm *)" — npm bilan boshlanuvchi bash
- "Bash(git push*)" — git push ni tutish

ENV O'ZGARUVCHILARI (hooks ichida):
- $CLAUDE_TOOL_INPUT — tool ga berilgan input
- $CLAUDE_TOOL_RESULT_FILE — yaratilgan fayl path
- $CLAUDE_NOTIFICATION — bildirishnoma matni

REAL PRODUCTION HOOKLAR:
\`\`\`json
"PostToolUse": [
  {
    "matcher": "Write(*.ts)|Edit(*.ts)",
    "hooks": [{
      "type": "command",
      "command": "npx tsc --noEmit $CLAUDE_TOOL_RESULT_FILE 2>&1 | head -20"
    }]
  }
]
\`\`\`
Bu hook har TypeScript fayl yozilganda avtomatik type-check qiladi.`,
  },

  {
    title: 'Claude Code — Token Tejash: Professional Strategiyalar',
    description: 'Claude Code da tokenlarni samarali ishlatish va pul tejash',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['tokens', 'cost', 'optimization', 'saving', 'efficiency'],
    isFeatured: true,
    content: `Claude Code da token va pul tejash strategiyalari:

TOKEN NARXLARI (2026):
| Model | Input (1M) | Output (1M) |
|-------|-----------|-------------|
| Opus 4.6 | $15 | $75 |
| Sonnet 4.6 | $3 | $15 |
| Haiku 4.5 | $0.80 | $4 |

STRATEGIYA 1 — Model Switching:
\`\`\`
/model haiku     → oddiy savollar, explain
/model sonnet    → kod yozish (default)
/model opus      → murakkab arxitektura
\`\`\`
QOIDA: 80% vaqt Sonnet, 15% Haiku, 5% Opus

STRATEGIYA 2 — Aniq Scope:
❌ "Butun loyihani refactor qil" (500K+ token)
✅ "src/controllers/authController.js login() ni refactor qil" (5K token)

STRATEGIYA 3 — CLAUDE.md Sifati:
Yaxshi CLAUDE.md = kamroq codebase scan = kamroq token.
Agent CLAUDE.md o'qib loyihani tushunsa, har safar grep/glob qilmaydi.

STRATEGIYA 4 — Checkpoint Pattern:
\`\`\`
1-qadam: "Tahlil qil, kod YOZMA" (kam output)
2-qadam: "Endi faqat X ni yoz" (focused output)
\`\`\`

STRATEGIYA 5 — Compact Prompt:
❌ "Men Next.js 14 loyiham bor, u App Router ishlatadi,
    TypeScript bilan yozilgan, Tailwind CSS ham bor,
    backend Express da, MongoDB ishlatamiz..."
✅ "Next.js 14 + Express + MongoDB loyihada
    auth refresh token qo'sh"

STRATEGIYA 6 — /compact Buyrug'i:
Uzoq suhbatda context window to'lganda:
\`\`\`
/compact    → suhbatni ixchamlashtiradi
\`\`\`
Bu avtomatik ham ishlaydi, lekin qo'lda ishlatish yaxshiroq.

STRATEGIYA 7 — Worktree Izolyatsiya:
\`\`\`bash
claude --worktree feature/auth "auth modulini yoz"
\`\`\`
Har task alohida context = tozaroq, kamroq token.

STRATEGIYA 8 — Background Agent:
Katta taskni background agentga bering:
\`\`\`
# Terminal 1: asosiy ish
claude "frontend ishlayapman"

# Terminal 2: background task
claude --worktree fix/tests "barcha testlarni tuzat"
\`\`\`

OYLIK BYUDJET REJASI:
| Daraja | Oylik | Qanday |
|--------|-------|--------|
| Boshlang'ich | $20-50 | Haiku + Sonnet |
| O'rta | $50-150 | Sonnet asosiy |
| Professional | $150-500 | Opus + Sonnet |

KUZATISH:
claude --usage  → token ishlatilishini ko'rish`,
  },

  {
    title: 'Claude Code — Extended Thinking: Chuqur Tahlil',
    description: 'Extended thinking rejimida murakkab muammolarni hal qilish',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['thinking', 'reasoning', 'complex', 'analysis', 'deep'],
    isFeatured: true,
    content: `Claude Extended Thinking — murakkab muammolar uchun:

NIMA BU:
Extended thinking — Claude "ichida fikrlaydi" va keyin javob beradi.
Natija: aniqroq, chuqurroq, kamroq xato.

QACHON KERAK:
✅ Murakkab arxitektura qarorlari
✅ Performance bottleneck topish
✅ Security vulnerability analiz
✅ Algorithm optimallashtirish
✅ Legacy kod tushunish
✅ Multi-step debugging

QANDAY YOQISH:
\`\`\`
Opus modelda avtomatik ishlaydi.
/model opus → murakkab savol bering
\`\`\`

THINKING UCHUN OPTIMAL PROMPT:
\`\`\`
Bu loyihadagi authentication flowni tahlil qil:

1. Avval hozirgi implementatsiyani o'qi va tushun
2. Security muammolarni identifikatsiya qil
3. Har bir muammo uchun risk darajasini baho
4. Eng xavflisidan boshlab tuzatish rejasini yoz
5. Kod misollar bilan ko'rsat

Fikrlab javob ber — tezlik muhim emas, sifat muhim.
\`\`\`

NATIJA FARQI:
Oddiy prompt:
  "Auth ni tuzat" → yuzaki tuzatish

Extended thinking prompt:
  "Auth flowni chuqur tahlil qil, security
   muammolarni OWASP bo'yicha tekshir,
   har birining exploit scenariyasini yoz,
   keyin priority bo'yicha tuzat" → professional audit

API DA ISHLATISH:
\`\`\`javascript
const response = await client.messages.create({
  model: 'claude-opus-4-6',
  max_tokens: 16384,
  thinking: {
    type: 'enabled',
    budget_tokens: 10000 // fikrlash uchun token limit
  },
  messages: [{ role: 'user', content: complexPrompt }]
})

// Thinking va response alohida keladi
for (const block of response.content) {
  if (block.type === 'thinking') {
    console.log('Fikrlash:', block.thinking)
  }
  if (block.type === 'text') {
    console.log('Javob:', block.text)
  }
}
\`\`\`

BUDGET TOKENS:
- 5,000 — oddiy reasoning
- 10,000 — o'rtacha murakkablik
- 30,000 — juda murakkab (arxitektura, security)

ESLATMA: Thinking tokenlari FAQAT output narxida hisob.
Opus output $75/M — ehtiyot bo'ling budget bilan.`,
  },

  {
    title: 'Claude Code — Prompt Caching: Takroriy So\'rovlarda Tejash',
    description: 'API da prompt caching yoqib 90% gacha tejash',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['caching', 'api', 'cost', 'optimization', 'performance'],
    isFeatured: false,
    content: `Claude Prompt Caching — takroriy so'rovlarda 90% tejash:

NIMA BU:
Prompt caching — katta system prompt yoki context ni
bir marta yuborib, keyingi so'rovlarda qayta ishlatish.

NARX FARQI:
| Tur | Narx (Sonnet) |
|-----|---------------|
| Oddiy input | $3/M tokens |
| Cache yozish | $3.75/M (25% qimmat) |
| Cache o'qish | $0.30/M (90% ARZON!) |

QACHON FOYDALI:
✅ Har safar bir xil system prompt (10K+ token)
✅ Katta codebase context qayta-qayta yuborish
✅ Chat application (har message da system prompt)
✅ Batch processing (1000+ so'rov)

API ISHLATISH:
\`\`\`javascript
const Anthropic = require('@anthropic-ai/sdk')
const client = new Anthropic()

// 1-so'rov: Cache yaratiladi
const response1 = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4096,
  system: [
    {
      type: 'text',
      text: longSystemPrompt,  // 10K+ token
      cache_control: { type: 'ephemeral' }  // ← CACHE
    }
  ],
  messages: [{ role: 'user', content: 'Birinchi savol' }]
})
// cache_creation_input_tokens: 10000 ($3.75 = $0.0375)

// 2-so'rov: Cache ishlatiladi (90% tejash!)
const response2 = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4096,
  system: [
    {
      type: 'text',
      text: longSystemPrompt,  // AYNAN shu matn
      cache_control: { type: 'ephemeral' }
    }
  ],
  messages: [{ role: 'user', content: 'Ikkinchi savol' }]
})
// cache_read_input_tokens: 10000 ($0.30 = $0.003!)
\`\`\`

CACHE QOIDALARI:
1. Minimum 1024 token (kichik matn cache bo'lmaydi)
2. TTL: 5 daqiqa (keyin expired)
3. AYNAN bir xil matn bo'lishi shart
4. Faqat system va messages[0] ga qo'ysa bo'ladi

REAL USE CASE — AI Coach:
\`\`\`javascript
const SYSTEM_PROMPT = \`
  Sen Aidevix AI Coach san...
  [10K token loyiha konteksti]
\`

// Har bir user savoliga AYNAN shu system prompt
app.post('/api/coach', async (req, res) => {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    system: [{
      type: 'text',
      text: SYSTEM_PROMPT,
      cache_control: { type: 'ephemeral' }
    }],
    messages: [{ role: 'user', content: req.body.message }]
  })
  // 2-chi userdan boshlab 90% arzon!
})
\`\`\``,
  },

  {
    title: 'Claude Code — MCP Advanced: Context7, Sentry, Linear',
    description: '2026 dagi eng foydali MCP pluginlar va real-world integratsiyalar',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['mcp', 'context7', 'sentry', 'linear', 'advanced', 'plugins'],
    isFeatured: true,
    content: `MCP Advanced Pluginlar — 2026 professional setup:

1. CONTEXT7 — Eng Yangi Docs Avtomatik:
Nima: Istalgan kutubxona docs ni real-time olish.
Nega: Claude training cutoff eski — Context7 YANGI docs beradi.
\`\`\`json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]
}
\`\`\`
Ishlatish: "Next.js 15 App Router docs ni olib ko'rsat"
Agent avtomatik Context7 dan so'raydi.

2. SENTRY — Error Monitoring:
Nima: Production errorlarni Claude ga ko'rsatish.
\`\`\`json
"sentry": {
  "command": "npx",
  "args": ["-y", "@sentry/mcp-server"],
  "env": {
    "SENTRY_AUTH_TOKEN": "sntrys_...",
    "SENTRY_ORG": "your-org"
  }
}
\`\`\`
Ishlatish: "Sentry dagi oxirgi 5 ta error ni ko'r va tuzat"

3. LINEAR — Task Management:
\`\`\`json
"linear": {
  "command": "npx",
  "args": ["-y", "@linear/mcp-server"],
  "env": { "LINEAR_API_KEY": "lin_..." }
}
\`\`\`
Ishlatish: "Linear dagi PROJ-123 taskni o'qi va implement qil"

4. SUPABASE — Database:
\`\`\`json
"supabase": {
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server"],
  "env": { "SUPABASE_URL": "...", "SUPABASE_KEY": "..." }
}
\`\`\`
Ishlatish: "Supabase da users jadvalini ko'r va query yoz"

5. PLAYWRIGHT — Browser Testing:
\`\`\`json
"playwright": {
  "command": "npx",
  "args": ["-y", "@anthropic/mcp-playwright"]
}
\`\`\`
Ishlatish: "Login sahifani olib screenshot qil va UI bug top"

6. DOCKER — Container Management:
\`\`\`json
"docker": {
  "command": "npx",
  "args": ["-y", "@docker/mcp-server"]
}
\`\`\`

FULL PRODUCTION SETUP:
\`\`\`json
{
  "mcpServers": {
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": { "SENTRY_AUTH_TOKEN": "..." }
    }
  }
}
\`\`\`

MASLAHAT: Birdan 10 ta MCP ulama — har biri token sarflaydi.
Faqat keraklilarini ulang (3-5 ta optimal).`,
  },

  {
    title: 'Claude Code — /slash Buyruqlar To\'liq Qo\'llanma',
    description: 'Barcha slash commandlar va ularni qachon ishlatish',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['commands', 'slash', 'shortcuts', 'reference'],
    isFeatured: false,
    content: `Claude Code slash buyruqlar to'liq qo'llanma:

ASOSIY BUYRUQLAR:
| Buyruq | Nima qiladi |
|--------|-------------|
| /help | Yordam ko'rsatish |
| /model | Model almashtirish (opus/sonnet/haiku) |
| /compact | Suhbatni ixchamlashtirish (token tejash) |
| /clear | Suhbatni tozalash |
| /cost | Joriy session token/narx |
| /config | Sozlamalar |

FAYL BOSHQARUVI:
| Buyruq | Nima qiladi |
|--------|-------------|
| /add-dir | Yangi papka qo'shish (multi-repo) |
| /init | CLAUDE.md yaratish |

WORKFLOW:
| Buyruq | Nima qiladi |
|--------|-------------|
| /commit | Git commit yaratish |
| /review | Kod review qilish |

MASLAHATLAR:
1. /model haiku → oddiy savollar uchun (arzon)
2. /model opus → murakkab task uchun
3. /compact → suhbat uzoqlashganda
4. /cost → qancha sarflaganingni bilish
5. /clear → yangi task boshlashda

KEYBOARD SHORTCUTS:
| Tugma | Nima qiladi |
|-------|-------------|
| Tab | Autocomplete |
| Ctrl+C | Bekor qilish |
| Escape | To'xtatish |
| Up arrow | Oldingi buyruq |
| Ctrl+L | Ekranni tozalash |

CLI FLAGS:
\`\`\`bash
claude                          # Interactive mode
claude "task"                   # Direct task
claude -p "task"                # Print mode (non-interactive)
claude --model opus             # Model tanlash
claude --worktree branch "task" # Izolyatsiya
claude --resume                 # Oxirgi suhbatni davom
claude --continue               # So'nggi suhbatni davom
claude --verbose                # Batafsil output
\`\`\``,
  },

  // ════════════════════════════════════════════════════════════
  // CURSOR — Advanced 2026
  // ════════════════════════════════════════════════════════════

  {
    title: 'Cursor — Background Agents va Multi-File Edit (2026)',
    description: 'Cursor background agentlar bilan parallel ishlar bajarish',
    category: 'cursor',
    tool: 'Cursor',
    tags: ['background-agent', 'multi-file', 'parallel', '2026'],
    isFeatured: true,
    content: `Cursor Background Agents — 2026 professional workflow:

BACKGROUND AGENT NIMA:
Cursor 2026 da background agent qo'shdi:
Siz ishlayotganda, agent alohida branchda task bajaradi.

QANDAY ISHLATISH:
1. Composer ochish (Ctrl+I)
2. Task yozish
3. "Run in Background" bosish
4. Agent alohida branchda ishlaydi
5. PR tayyor bo'lganda xabar beradi

IDEAL USE CASES:
✅ Test yozish (siz feature yozayotganda)
✅ Dokumentatsiya (siz kodlayotganda)
✅ Bug fix (siz yangi feature qilayotganda)
✅ Refactoring (parallel ishlar)

BACKGROUND AGENT PROMPT:
\`\`\`
Background da quyidagini qil:

1. src/controllers/ dagi barcha controllerlarni o'qi
2. Har biri uchun unit test yoz (Jest)
3. Test fayllarni __tests__/ papkaga qo'y
4. Barcha testlar o'tishini tekshir
5. Coverage report yarat

Branch: test/controller-coverage
PR: "feat: add controller unit tests"
\`\`\`

MULTI-FILE EDIT:
Composer da bir vaqtda bir nechta faylni o'zgartirish:
\`\`\`
Quyidagi fayllarni birga o'zgartir:

1. backend/models/User.js:
   - preferences field qo'sh (Object type)

2. backend/controllers/userController.js:
   - updatePreferences endpoint qo'sh

3. backend/routes/userRoutes.js:
   - PUT /preferences route qo'sh

4. frontend/src/api/userApi.ts:
   - updatePreferences funksiya qo'sh

Barcha fayllar bir-biriga mos bo'lsin.
\`\`\`

@CODEBASE OPTIMAL ISHLATISH:
\`\`\`
@Codebase Loyiha arxitekturasini tushun.
Keyin @file:backend/index.js routelarni ko'r.
Endi yangi /api/notifications endpoint qo'sh:
- Backend: controller + route + model
- Frontend: API client + Redux slice
Mavjud patternlarga mos yoz.
\`\`\`

CURSOR COMPOSER KEYBOARD:
- Ctrl+I — Composer ochish
- Ctrl+Enter — Run/Accept
- Ctrl+Shift+Enter — Background da run
- Escape — Bekor qilish`,
  },

  {
    title: 'Cursor — .cursor/rules: Fayl-Specific Qoidalar (2026)',
    description: 'Cursor Rules — fayl turi bo\'yicha alohida qoidalar berish',
    category: 'cursor',
    tool: 'Cursor',
    tags: ['rules', 'file-specific', 'cursor-rules', 'context'],
    isFeatured: true,
    content: `Cursor Rules — fayl tipiga qarab alohida qoidalar:

JOYLASHUV: .cursor/rules/ papkada .mdc fayllar

TUZILISHI:
\`\`\`
.cursor/
└── rules/
    ├── backend.mdc      # Backend qoidalar
    ├── frontend.mdc     # Frontend qoidalar
    ├── testing.mdc      # Test qoidalar
    ├── api-design.mdc   # API qoidalar
    └── security.mdc     # Security qoidalar
\`\`\`

BACKEND RULES (.cursor/rules/backend.mdc):
\`\`\`markdown
---
description: Backend Express.js qoidalar
globs: backend/**/*.js
alwaysApply: false
---

# Backend Rules

## Controller Pattern
- Har controller async/await ishlat
- try/catch bilan wrap qil
- Response format: { success, data, message }
- Error: res.status(code).json({ success: false, message })

## Model Pattern
- Mongoose schema bilan
- Index qo'sh (tez-tez query bo'ladigan fieldlarga)
- Virtual fields kerak bo'lsa qo'sh
- timestamps: true har doim

## Middleware
- Auth: req.user dan foydalanuvchi ol
- Validation: express-validator yoki Joi
- Error handling: next(error) bilan
\`\`\`

FRONTEND RULES (.cursor/rules/frontend.mdc):
\`\`\`markdown
---
description: Frontend Next.js qoidalar
globs: frontend/src/**/*.{ts,tsx}
alwaysApply: false
---

# Frontend Rules

## Components
- Server Components by default
- 'use client' faqat: useState, useEffect, onClick kerakda
- Props interface yoz (type emas)
- Loading/error/empty states majburiy

## Styling
- Tailwind only (no CSS modules, no inline)
- Dark theme: bg-[#0a0e1a] text-white
- Responsive: mobile-first (sm: md: lg:)
- Animation: framer-motion (not CSS)

## State
- Server state: Redux Toolkit + createAsyncThunk
- Local state: useState
- Form: React Hook Form + Zod
\`\`\`

GLOBS MISOLLARI:
- "backend/**/*.js" — barcha backend JS
- "**/*.test.ts" — barcha test fayllar
- "frontend/src/components/**" — barcha componentlar
- "*.config.*" — barcha config fayllar

alwaysApply:
- true → har doim yuklash
- false → faqat relevant fayl ochilganda`,
  },

  {
    title: 'Cursor — Token Tejash va Smart Context (2026)',
    description: 'Cursor da tokenlarni tejash va context ni optimal boshqarish',
    category: 'cursor',
    tool: 'Cursor',
    tags: ['tokens', 'context', 'optimization', 'cost', 'smart'],
    isFeatured: false,
    content: `Cursor da token tejash va smart context:

CURSOR PRICING (2026):
- Pro: $20/mo — 500 premium requests
- Business: $40/mo — unlimited
- Pro+ request: $0.04 per request (average)
- Fast request qolmasa: slow queue

TOKEN TEJASH:
1. INLINE (Ctrl+K) > COMPOSER:
   Kichik task uchun Inline ishlatisng — kamroq context yuboriladi.
   Composer butun faylni yuboradi, Inline faqat tanlangan qismni.

2. @file > @codebase:
   @codebase butun loyihani scan qiladi (ko'p token).
   @file:path aniq faylni oladi (kam token).

3. MODEL SWITCHING:
   - Tab completions: cursor-small (FREE!)
   - Inline chat: haiku (arzon)
   - Composer: sonnet (sifatli)
   Sozlash: Settings > Models

4. .cursorignore:
\`\`\`
# .cursorignore (root da)
node_modules/
dist/
build/
.next/
coverage/
*.min.js
*.map
package-lock.json
\`\`\`
Bu fayllar codebase indexdan chiqadi — tezroq va arzonroq.

5. NOTEPADS > HAR SAFAR PASTE:
   Qayta-qayta ishlatiladigan context ni Notepad ga saqlang.
   @notepad-name bilan referens qiling — samarali.

6. RULES FILE > CHAT DA AYTISH:
   .cursor/rules/ ga bir marta yozing.
   Har safar chatda takrorlamasangiz — token tejaysiz.

7. CHAT TOZALASH:
   Yangi task = yangi chat.
   Eski context keraksiz token sarflaydi.

SMART CONTEXT TIPS:
\`\`\`
❌ "Bu loyihada nima o'zgarish kerak?"
   → @codebase scan = 50K+ token

✅ "@file:backend/controllers/authController.js
    login() da refresh token qo'sh"
   → 2K token
\`\`\`

PRO REQUEST OPTIMALLASHTIRISH:
- 500 request/mo = ~16/kun
- Katta task = 1 Composer (1 request, ko'p ish)
- Kichik savollar = Tab + Inline (bepul!)`,
  },

  // ════════════════════════════════════════════════════════════
  // COPILOT — Advanced 2026
  // ════════════════════════════════════════════════════════════

  {
    title: 'Copilot — Coding Agent: PR Yaratish va Avtomatlash',
    description: 'GitHub Copilot Coding Agent bilan taskni to\'liq avtomatlash',
    category: 'copilot',
    tool: 'GitHub Copilot',
    tags: ['coding-agent', 'pr', 'automation', 'github', '2026'],
    isFeatured: true,
    content: `GitHub Copilot Coding Agent — 2026 avtomatlash:

NIMA BU:
Copilot Coding Agent — GitHub Issue ga assign qilsangiz,
u o'zi branch yaratadi, kod yozadi, PR ochadi. To'liq avtomatik.

QANDAY ISHLATISH:
1. GitHub Issue yarating (aniq tavsif bilan)
2. Issue ga "copilot" ni assign qiling
3. Copilot o'zi:
   - Branch yaratadi
   - Kodni o'zgartiradi
   - Test ishlatadi
   - PR ochadi
4. Siz review qilasiz

ISSUE TEMPLATE (eng samarali):
\`\`\`markdown
## Task
[ANIQ TAVSIF]

## Acceptance Criteria
- [ ] [SHART_1]
- [ ] [SHART_2]
- [ ] Tests pass
- [ ] No TypeScript errors

## Files to modify
- backend/controllers/[FILE]
- frontend/src/components/[FILE]

## Context
- Auth: cookie-based JWT
- API format: { success: boolean, data: T }
- Styling: Tailwind CSS

## Don't touch
- middleware/auth.js
- package.json
\`\`\`

COPILOT AGENT QOIDALARI:
1. Aniq issue = yaxshi PR
2. Scope kichik bo'lsin (1 feature = 1 issue)
3. Test criteria yozing
4. File scope bering
5. Mavjud pattern ko'rsating

COPILOT EXTENSIONS (Marketplace):
| Extension | Nima uchun |
|-----------|------------|
| @docker | Container boshqarish |
| @azure | Cloud resources |
| @sentry | Error debugging |
| @mermaid | Diagramma yaratish |

CUSTOM INSTRUCTIONS:
.github/copilot-instructions.md:
\`\`\`markdown
# Project: [NAME]

## Tech Stack
- Backend: Express 5, MongoDB, JWT
- Frontend: Next.js 14, TypeScript, Tailwind

## Patterns
- Controller: async, try/catch, { success, data }
- Component: Server first, 'use client' faqat kerakda
- API client: axiosInstance.ts orqali

## Testing
- Backend: Jest + Supertest
- Frontend: React Testing Library
- Command: npm test

## Avoid
- console.log, any type, localStorage tokens
\`\`\``,
  },

  {
    title: 'Copilot — Multi-Model va Code Review (2026)',
    description: 'Copilot da modellarni to\'g\'ri almashtirish va kod review qilish',
    category: 'copilot',
    tool: 'GitHub Copilot',
    tags: ['multi-model', 'review', 'pr-review', 'quality'],
    isFeatured: false,
    content: `GitHub Copilot Multi-Model va Code Review:

MODELLAR ALMASHTIRISH (2026):
Chat panelda model dropdown:
| Model | Qachon |
|-------|--------|
| GPT-4o | Kunlik kodlash, default |
| Claude Sonnet 4 | Refactor, debug, review |
| o3 | Murakkab algoritmlar |
| Gemini 2.0 Flash | Tez savol, multimodal |

MODEL TANLASH QOIDASI:
\`\`\`
Autocomplete → GPT-4o (default, eng tez)
Bug fix → Claude Sonnet (nuanced reasoning)
Refactor → Claude Sonnet (kodni yaxshi tushunadi)
Algorithm → o3 (step-by-step fikrlaydi)
Screenshot → Gemini (multimodal)
Quick Q&A → Gemini Flash (eng tez)
\`\`\`

CODE REVIEW PROMPT:
\`\`\`
#selection ni review qil:

1. Bug bor/yo'qligini tekshir
2. Performance muammo bor/yo'q
3. Security xavf bor/yo'q
4. Best practice buzilgan joy
5. Har topilgan muammo uchun FIX ko'rsat

Format: MUAMMO → SABAB → FIX (kod bilan)
\`\`\`

PR REVIEW (GitHub da):
Copilot PR review avtomatik yoqilgan:
Settings → Code Review → Copilot → Enable

Custom review instructions:
\`\`\`markdown
# PR Review Instructions
Check for:
- TypeScript strict compliance
- Error handling in all async operations
- Input validation on API endpoints
- No hardcoded secrets or URLs
- Proper loading/error states in React
- Mobile responsive (Tailwind breakpoints)
\`\`\`

COPILOT CHAT TIPS:
1. #file:path → aniq fayl konteksti
2. #selection → tanlangan kod
3. #terminal → terminal output
4. #problems → VS Code errors
5. /explain → tushuntirish
6. /fix → xatoni tuzatish
7. /tests → test yozish`,
  },

  // ════════════════════════════════════════════════════════════
  // CHATGPT — Advanced 2026
  // ════════════════════════════════════════════════════════════

  {
    title: 'ChatGPT — Custom GPTs: Shaxsiy Developer Asistent',
    description: 'O\'zingiz uchun maxsus coding GPT yaratish va sozlash',
    category: 'coding',
    tool: 'ChatGPT',
    tags: ['custom-gpt', 'assistant', 'builder', 'personalization'],
    isFeatured: true,
    content: `ChatGPT Custom GPT — shaxsiy developer asistent:

NIMA BU:
Custom GPT — maxsus sozlangan ChatGPT.
O'z stack, qoidalar, bilim bazasi bilan.

QANDAY YARATISH:
1. chat.openai.com → Explore GPTs → Create
2. Instructions yozing
3. Knowledge fayllar yuklang
4. Toollar yoqing

INSTRUCTIONS TEMPLATE:
\`\`\`
Nomi: [PROJECT_NAME] Dev Assistant
Modeli: GPT-4o

## Kim san
Sen [PROJECT_NAME] loyihasining senior developer assistenti san.
Faqat shu loyiha kontekstida javob berasan.

## Stack
- Backend: Express 5 + MongoDB + JWT
- Frontend: Next.js 14 + TypeScript + Tailwind
- Deploy: Railway (backend) + Vercel (frontend)

## Bilim bazangda:
- CLAUDE.md — loyiha arxitekturasi
- API docs — barcha endpoint lar
- Schema definitions — MongoDB modellar

## Qoidalar:
1. TypeScript strict ishlat (any = xato)
2. Javob format: tushuntirish + to'liq kod
3. Production-ready kod yoz
4. O'zbek tilida gapir, ingliz kod
5. Security muammoni ko'rsang OGOHLANTIR
6. Mavjud pattern ga mos yoz

## Taqiq:
- console.log qoldirish
- Placeholder kod berish
- localStorage token saqlash
- Inline CSS ishlatish
\`\`\`

KNOWLEDGE FILES YUKLASH:
- CLAUDE.md → loyiha tuzilishi
- package.json → dependencies
- tsconfig.json → TS sozlamalar
- API docs (JSON/MD) → endpoint lar

TOOLS YOQISH:
✅ Code Interpreter — kod ishlatish
✅ Web Browsing — docs qidirish
❌ DALL-E — kerak emas

CODE INTERPRETER UCHUN:
\`\`\`
Bu faylni analiz qil va:
1. Dependency graph chiz
2. Unused exports top
3. Circular imports tekshir
4. Bundle size estimate ber
\`\`\`

TEAM UCHUN:
Custom GPT ni team bilan ulashsa bo'ladi:
Configure → Share → "Anyone with link"
Butun jamoa bir xil kontekstda ishlaydi.`,
  },

  {
    title: 'ChatGPT — Canvas va Code Interpreter (2026)',
    description: 'ChatGPT Canvas da kod yozish va Code Interpreter bilan tahlil',
    category: 'coding',
    tool: 'ChatGPT',
    tags: ['canvas', 'code-interpreter', 'analysis', 'visualization'],
    isFeatured: false,
    content: `ChatGPT Canvas + Code Interpreter:

CANVAS NIMA:
ChatGPT Canvas — inline kod editor.
Kod yozish, tahrirlash, review bir oynada.

CANVAS ISHLATISH:
\`\`\`
"Canvas ochib quyidagi React componentni yoz:
[TASK_DESCRIPTION]"
\`\`\`

CANVAS BUYRUQLAR:
- "Shu qismni refactor qil" (select + comment)
- "TypeScript ga o'gir"
- "Testlar qo'sh"
- "Comment yoz"
- "Bug tuzat"

CANVAS VS CHAT:
| Xususiyat | Chat | Canvas |
|-----------|------|--------|
| Kod yozish | paste+copy | inline edit |
| Tahrirlash | yangi message | select+edit |
| Version | yo'q | bor (undo) |
| Ko'rish | scroll | side panel |

CODE INTERPRETER:
Nima: Python kod ishlatish (serverda)
Foyda: Data analysis, visualization, file processing

USE CASES:
\`\`\`
1. "package.json ni yuklayman. Dependency
   graph yarat va vizualize qil."

2. "Bu CSV faylni analiz qil:
   - Top 10 active users
   - Haftalik trend chart
   - Anomaliyalar bor-yo'q"

3. "Bu API response JSON ni:
   - Schemani extract qil
   - TypeScript interface yarat
   - Validation schema (Zod) yoz"
\`\`\`

DATA VIZUALIZATSIYA:
\`\`\`
"Bu ma'lumotlar bilan:
[DATA]

1. Bar chart: kunlik active users
2. Line chart: haftalik revenue trend
3. Pie chart: user segmentation

matplotlib ishlat, professional stil.
Har grafik alohida PNG sifatida saqla."
\`\`\`

FILE PROCESSING:
- JSON → TypeScript types
- CSV → SQL create table + insert
- SQL → Mongoose schema
- Swagger → API client (axios)`,
  },

  // ════════════════════════════════════════════════════════════
  // GEMINI — Advanced 2026
  // ════════════════════════════════════════════════════════════

  {
    title: 'Gemini — AI Studio Advanced: Tuning, Grounding, Caching',
    description: 'Gemini 2.5 Pro va AI Studio ning ilg\'or imkoniyatlari',
    category: 'coding',
    tool: 'Gemini',
    tags: ['ai-studio', 'tuning', 'grounding', 'caching', 'advanced'],
    isFeatured: true,
    content: `Google Gemini AI Studio — ilg'or funksiyalar:

1. GEMINI 2.5 PRO — Eng Kuchli (2026):
- 1M token context (butun codebase)
- Deep reasoning (thinking mode)
- Multimodal (kod + rasm + video)
- Grounding (Google Search real-time)

2. GROUNDING (Real-time Ma'lumot):
\`\`\`javascript
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro',
  tools: [{ google_search: {} }]  // ← Grounding
})

const result = await model.generateContent(
  'Next.js 15 da qanday yangiliklar bor? ' +
  'Mening loyihamga qanday migratsiya qilaman?'
)
// Gemini Google dan real-time qidiradi va javob beradi
\`\`\`

3. CONTEXT CACHING (katta loyiha uchun):
\`\`\`javascript
const { GoogleAICacheManager } = require('@google/generative-ai/server')
const cacheManager = new GoogleAICacheManager(apiKey)

// Katta codebase ni cache qilish
const cache = await cacheManager.create({
  model: 'gemini-2.0-flash',
  contents: [{
    role: 'user',
    parts: [{ text: entireCodebase }]  // 500K+ token
  }],
  systemInstruction: 'Sen loyiha developer san...',
  ttl: '3600s'  // 1 soat
})

// Cache dan foydalanish (ARZON!)
const model = genAI.getGenerativeModelFromCachedContent(cache)
const result = await model.generateContent('Auth modulni refactor qil')
// Cache narx: ~75% arzon oddiy so'rovdan
\`\`\`

4. STRUCTURED OUTPUT:
\`\`\`javascript
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'object',
      properties: {
        bugs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              file: { type: 'string' },
              line: { type: 'number' },
              severity: { type: 'string', enum: ['low','medium','high'] },
              description: { type: 'string' },
              fix: { type: 'string' }
            }
          }
        }
      }
    }
  }
})

const result = await model.generateContent('Bu koddagi buglarni top: ...')
const bugs = JSON.parse(result.response.text())
// Structured JSON — parse qilish oson
\`\`\`

5. MULTIMODAL CODING:
\`\`\`
"Bu screenshot dan (UI dizayn):
1. React component yoz (Next.js + Tailwind)
2. Responsive bo'lsin
3. Dark theme
4. Framer Motion animation"
\`\`\`

NARXLAR (2026):
| Model | Input (1M) | Output (1M) |
|-------|-----------|-------------|
| Gemini 2.0 Flash | $0.10 | $0.40 |
| Gemini 2.5 Pro | $1.25 | $10.00 |
| Cached input | 75% arzon | — |

GEMINI ENG ARZON AI — production uchun ideal.`,
  },

  // ════════════════════════════════════════════════════════════
  // WINDSURF — Advanced 2026
  // ════════════════════════════════════════════════════════════

  {
    title: 'Windsurf — Cascade Flow + Memories (2026)',
    description: 'Windsurf Cascade flow rejimi va uzoq muddatli xotira',
    category: 'vibe_coding',
    tool: 'Windsurf',
    tags: ['cascade', 'flow', 'memories', 'windsurf', '2026'],
    isFeatured: true,
    content: `Windsurf Cascade — Flow Mode va Memories:

FLOW MODE NIMA:
Cascade Flow — Windsurf ning agent rejimi.
O'zi fayllar ochadi, yozadi, terminal ishlatadi.

FLOW MODE PROMPT:
\`\`\`
Flow rejimida quyidagini bajar:

TASK: User notifications tizimini qo'sh

SCOPE:
Backend:
- NotificationModel yaratish
- notificationController.js
- notificationRoutes.js → /api/notifications

Frontend:
- NotificationBell component
- useNotifications hook
- Redux notification slice

QOIDALAR:
- Mavjud auth middleware ishlat
- Real-time: Socket.io (agar bor bo'lsa) yoki polling
- TypeScript strict
- Tailwind dark theme

Tayyor bo'lgach: git diff ko'rsat
\`\`\`

CASCADE MEMORIES:
Windsurf suhbatlar orasida ma'lumot eslab qoladi:
- Loyiha tuzilishi
- Siz yoqtirgan patternlar
- Oldingi suhbatlardagi qarorlar

MEMORIES GA TA'SIR:
"Eslab qol: men har doim try/catch + custom AppError ishlaman"
"Eslab qol: frontend da Framer Motion animation kerak har component da"

WINDSURFRULES (.windsurfrules):
\`\`\`markdown
# Project Rules

## Error Handling
ALWAYS use AppError class:
throw new AppError(404, 'User not found')

## API Response
ALWAYS return: { success: boolean, data?: T, message?: string }

## Frontend
- Loading: skeleton shimmer
- Error: error boundary + retry button
- Empty: illustration + CTA

## Git
- Branch: feature/[name], fix/[name]
- Commit: conventional commits (feat:, fix:, refactor:)
\`\`\`

SUPERPOWERS:
| Feature | Cursor | Windsurf |
|---------|--------|----------|
| Auto-context | @codebase | Avtomatik |
| Memory | Rules fayllar | Built-in |
| Agent | Composer | Cascade Flow |
| Multi-file | Ha | Ha |
| Background | Ha (2026) | Ha |

WINDSURF AFZALLIGI:
- Context avtomatik topiladi (@ kerak emas)
- Memory built-in (rules fayl + AI eslab qoladi)
- UI sodda va intuitiv`,
  },

  // ════════════════════════════════════════════════════════════
  // UNIVERSAL — Professional 2026
  // ════════════════════════════════════════════════════════════

  {
    title: 'Multi-Agent Pattern: Backend + Frontend + Test Agentlar',
    description: 'Bir nechta AI agentni koordinatsiya qilib katta loyiha bajarish',
    category: 'architecture',
    tool: 'Any',
    tags: ['multi-agent', 'orchestration', 'pattern', 'teamwork'],
    isFeatured: true,
    content: `Multi-Agent Pattern — AI agentlar jamoasi:

KONSEPT:
Bitta katta taskni bir nechta ixtisoslashgan agentga bo'lish.
Har agent o'z sohasida professional.

PATTERN 1 — Feature Pipeline:
\`\`\`
Planner Agent (Claude Opus):
  → Arxitektura va plan yozadi
  → Fayl ro'yxati, API dizayn

Backend Agent (Claude Sonnet):
  → Model, Controller, Route yozadi
  → Input: Planner chiqishi

Frontend Agent (Cursor/Copilot):
  → Component, Page, API client yozadi
  → Input: Backend API spec

Test Agent (Claude Haiku):
  → Unit + Integration test yozadi
  → Input: Backend + Frontend kodi

Review Agent (Claude Opus):
  → Hammani review qiladi
  → Bug, security, performance tekshiradi
\`\`\`

PATTERN 2 — Parallel Audit:
\`\`\`
Orchestrator: "Codebase ni parallel audit qil"
├── Security Agent → OWASP top 10 tekshirish
├── Performance Agent → N+1 queries, memory leaks
├── Quality Agent → Code smells, complexity
└── Docs Agent → JSDoc, README yangilash
\`\`\`

PATTERN 3 — Bug Fix Pipeline:
\`\`\`
Reproducer Agent:
  → Xatoni qayta yaratadi, test yozadi

Analyzer Agent:
  → Root cause topadi

Fixer Agent:
  → Kodni tuzatadi

Verifier Agent:
  → Testlar o'tishini tekshiradi
\`\`\`

AMALDA (Claude Code bilan):
\`\`\`
Terminal 1: claude --worktree feature/api "Backend API yoz"
Terminal 2: claude --worktree feature/ui "Frontend component yoz"
Terminal 3: claude --worktree feature/test "Integration test yoz"
\`\`\`
Har biri alohida branchda — keyin merge.

AMALDA (Cursor bilan):
Composer → Background Agent: "Test yoz"
Siz → Inline: feature kodlash
Copilot → Autocomplete: tez yozish

QOIDA:
1. Har agent FAQAT o'z scope ida ishlaydi
2. Agentlar orasida aniq interfeys (API spec, type defs)
3. Review agent DOIMO kerak — agentlar xato qiladi
4. Kichik task uchun multi-agent = overkill`,
  },

  {
    title: 'AI Coding Security — Xavfsiz Kod Yozish AI Bilan',
    description: 'AI yordamida kod yozishda security best practices',
    category: 'architecture',
    tool: 'Any',
    tags: ['security', 'owasp', 'best-practices', 'safe-coding'],
    isFeatured: true,
    content: `AI bilan xavfsiz kod yozish — security qo'llanma:

MUAMMO:
AI kod yozganda security muammolar paydo bo'lishi mumkin.
Har doim tekshiring!

OWASP TOP 5 (AI KOD UCHUN):

1. INJECTION (SQL/NoSQL/Command):
❌ AI yozishi mumkin:
\`\`\`javascript
const user = await User.findOne({ email: req.body.email })
db.collection.find({ $where: req.body.query })
\`\`\`
✅ Xavfsiz variant:
\`\`\`javascript
const user = await User.findOne({
  email: { $eq: sanitize(req.body.email) }
})
// $where HECH QACHON ishlatmang
\`\`\`

2. XSS (Cross-Site Scripting):
❌ AI yozishi mumkin:
\`\`\`jsx
<div dangerouslySetInnerHTML={{ __html: userComment }} />
\`\`\`
✅ Xavfsiz:
\`\`\`jsx
<div>{DOMPurify.sanitize(userComment)}</div>
// Yoki React default escaping ishlatish
<div>{userComment}</div>
\`\`\`

3. AUTH MUAMMOLAR:
❌ AI yozishi mumkin:
\`\`\`javascript
localStorage.setItem('token', response.token)
// JWT ni decode qilmasdan ishonish
\`\`\`
✅ Xavfsiz:
\`\`\`javascript
// Cookie-based auth (httpOnly, secure, sameSite)
res.cookie('token', jwt, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000
})
\`\`\`

4. SENSITIVE DATA EXPOSURE:
❌ AI yozishi mumkin:
\`\`\`javascript
res.json({ user }) // password, tokens hamma narsa
console.log('API Key:', process.env.API_KEY)
\`\`\`
✅ Xavfsiz:
\`\`\`javascript
const { password, __v, ...safeUser } = user.toObject()
res.json({ success: true, data: safeUser })
\`\`\`

5. RATE LIMITING YO'QLIGI:
✅ Har doim qo'shing:
\`\`\`javascript
const rateLimit = require('express-rate-limit')
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 15 daqiqada 10 ta so'rov
  message: { success: false, message: 'Too many attempts' }
}))
\`\`\`

SECURITY REVIEW PROMPT:
\`\`\`
Bu kodni OWASP Top 10 bo'yicha audit qil:
[KOD]

Har topilgan muammo uchun:
1. Vulnerability nomi
2. Risk darajasi (Critical/High/Medium/Low)
3. Exploit scenariyasi
4. Fix (kod bilan)
\`\`\``,
  },

  {
    title: 'Vibe Coding — AI Bilan Tez Prototip va MVP (2026)',
    description: 'Vibe Coding metodologiyasi: AI bilan soatlar ichida MVP yaratish',
    category: 'vibe_coding',
    tool: 'Any',
    tags: ['vibe-coding', 'mvp', 'prototype', 'rapid', 'methodology'],
    isFeatured: true,
    content: `Vibe Coding — AI bilan tez MVP yaratish metodologiyasi:

NIMA BU:
Vibe Coding — AI ga "vibe" (kayfiyat/yo'nalish) berib,
u kod yozadi, siz yo'naltirasan. Tez prototiplash.

QACHON ISHLATISH:
✅ MVP / Prototip (1-3 kun)
✅ Hackathon
✅ Side project
✅ Feature experiment
❌ Production (keyin refactor kerak)
❌ Critical system (bank, tibbiyot)

WORKFLOW:
\`\`\`
QADAM 1 — Vibe berish (5 daqiqa):
"[APP_NOMI] — [BIR JUMLADA NIMA].
Stack: Next.js + Express + MongoDB.
Foydalanuvchilar: [KIM].
Asosiy feature: [3-5 ta bullet]."

QADAM 2 — Arxitektura (AI bilan, 15 daqiqa):
"Shu app uchun arxitektura yoz:
- DB schema (models)
- API endpoints ro'yxati
- Frontend sahifalar
- Auth flow"

QADAM 3 — Backend (AI agent, 1-2 soat):
"Backend ni yoz: models, controllers, routes.
CRUD + Auth + [CORE_FEATURE].
Har endpoint ishlashini tekshir."

QADAM 4 — Frontend (AI agent, 2-3 soat):
"Frontend ni yoz: sahifalar, componentlar, API client.
Dark theme, Tailwind, responsive."

QADAM 5 — Deploy (30 daqiqa):
Backend → Railway
Frontend → Vercel
DB → MongoDB Atlas
\`\`\`

AI TOOLLAR BO'LINISHI:
| Qadam | Tool | Sabab |
|-------|------|-------|
| Fikrlash | ChatGPT o3 | Deep reasoning |
| Backend | Claude Code | Autonomous agent |
| Frontend | Cursor | IDE native, tez |
| Bug fix | Claude Sonnet | Nuanced debug |
| Deploy | Claude Code | Terminal access |

VIBE CODING PROMPTS:
\`\`\`
"Qanday vibe: Notion kabi task manager.
Dark theme, minimal, tez.
Users: kichik jamoa (5-10 kishi).
Core: tasks, boards, real-time sync.
Stack: Next.js + Express + MongoDB.
YOZIB BER — MVP 3 soatda tayyor bo'lsin."
\`\`\`

KEYIN REFACTOR:
Vibe Coding = tez, lekin sifat past.
MVPdan keyin:
1. TypeScript strict qo'sh
2. Error handling
3. Input validation
4. Test yoz
5. Security audit`,
  },

  {
    title: 'AI Narx Taqqoslash — Byudjet bo\'yicha AI Tanlash (2026)',
    description: 'Barcha AI xizmatlar narxi va byudjetga qarab optimal tanlash',
    category: 'other',
    tool: 'Any',
    tags: ['pricing', 'comparison', 'budget', 'cost', '2026'],
    isFeatured: true,
    content: `AI Developer Tools narxlari — 2026 to'liq taqqoslash:

SUBSCRIPTION NARXLARI:
| Tool | Free | Pro | Business |
|------|------|-----|----------|
| Claude Code | Bor* | $20/mo (Max) | $30/mo (Team) |
| Cursor | Bor (limited) | $20/mo | $40/mo |
| GitHub Copilot | Bor (limited) | $10/mo | $19/mo |
| ChatGPT | Bor | $20/mo (Plus) | $200/mo (Pro) |
| Gemini | Bor | $20/mo (Advanced) | — |
| Windsurf | Bor | $15/mo | $30/mo |

* Claude Code — API token orqali (usage-based)

API NARXLARI (1M TOKEN):
| Model | Input | Output | Cache |
|-------|-------|--------|-------|
| Claude Opus 4.6 | $15 | $75 | $1.50 |
| Claude Sonnet 4.6 | $3 | $15 | $0.30 |
| Claude Haiku 4.5 | $0.80 | $4 | $0.08 |
| GPT-4o | $2.50 | $10 | — |
| GPT-4o mini | $0.15 | $0.60 | — |
| o3 | $10 | $40 | — |
| Gemini 2.0 Flash | $0.10 | $0.40 | $0.025 |
| Gemini 2.5 Pro | $1.25 | $10 | $0.315 |

BYUDJET BO'YICHA OPTIMAL SETUP:

$0/OY (Bepul):
- Copilot Free + ChatGPT Free + Gemini Free
- Autocomplete + savol-javob

$20/OY (Boshlang'ich):
- Copilot Pro ($10) + ChatGPT Free + Gemini Free
- Yoki: Cursor Pro ($20)

$40/OY (O'rta):
- Cursor Pro ($20) + Claude Max ($20)
- IDE agent + Terminal agent

$60/OY (Professional):
- Cursor Pro ($20) + Claude Max ($20) + Copilot Pro ($10) + ChatGPT Plus ($10)
- To'liq ekosistem

$100+/OY (Team):
- Cursor Business + Claude Team + Copilot Business
- Jamoa uchun

API BYUDJET:
| Oylik | Qanday ishlatish |
|-------|------------------|
| $5 | Haiku + Gemini Flash (production) |
| $20 | Sonnet asosiy, Haiku simple tasks |
| $50 | Sonnet + Opus murakkab uchun |
| $100+ | Opus ko'p, caching bilan |

ENG ARZON PRODUCTION API:
Gemini 2.0 Flash: $0.10/M input
= 10M token faqat $1
= Eng arzon AI API`,
  },

  {
    title: 'CLAUDE.md Mega Template — Professional Loyiha Qo\'llanma',
    description: 'Eng to\'liq CLAUDE.md template — har qanday loyiha uchun',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['claude-md', 'template', 'documentation', 'mega'],
    isFeatured: true,
    content: `CLAUDE.md Professional Mega Template:

\`\`\`markdown
# CLAUDE.md

[LOYIHA_NOMI] — [BIR JUMLADA TAVSIF]

## Stack
| Layer | Tech |
|-------|------|
| Backend | [Express/Fastify/NestJS], [DB], [Auth] |
| Frontend | [Next.js/React], [State], [CSS] |
| Deploy | [Backend: Railway/AWS], [Frontend: Vercel] |
| External | [3rd party: Stripe, S3, etc.] |

## Architecture
\\\`\\\`\\\`
[FAYL DARAXTI — faqat muhim papkalar]
\\\`\\\`\\\`

## Key Files
- [FILE_1] — [nima qiladi]
- [FILE_2] — [nima qiladi]
- [FILE_3] — [nima qiladi]

## Auth
[Qanday ishlaydi: JWT cookie? OAuth? Session?]
[Token: qancha vaqt? Refresh bor?]

## API Patterns
Request: [format, auth header/cookie]
Response: { success: boolean, data: T }
Error: { success: false, message: string }

## Business Rules (MUHIM)
- [RULE_1 — nima uchun muhim]
- [RULE_2 — buzilsa nima bo'ladi]

## Important Rules
- [QOIDA_1: masalan "Auth faqat cookie"]
- [QOIDA_2: masalan "DB seed destructive"]
- [QOIDA_3: masalan "Subscription gate bypass qilma"]

## Env Variables
\\\`\\\`\\\`
[VAR_1] — [nima uchun]
[VAR_2] — [nima uchun]
\\\`\\\`\\\`

## Verification Commands
\\\`\\\`\\\`bash
[Syntax check command]
[Type check command]
[Test command]
[Lint command]
\\\`\\\`\\\`

## Deploy
\\\`\\\`\\\`bash
[Deploy commands]
\\\`\\\`\\\`
\`\`\`

YOZISH QOIDALARI:
1. IXCHAM — Agent bir o'qishda tushunsin
2. MUHIM NARSALAR AVVAL — Stack, arch, rules
3. BIZNES QOIDALAR — buzilsa nima bo'ladi
4. COMMANDS — tekshirish buyruqlari
5. YANGILANG — kod o'zgarganda CLAUDE.md ham

ANTI-PATTERNS:
❌ Juda uzun (500+ qator) — agent confusion
❌ Juda qisqa (10 qator) — ma'lumot yo'q
❌ Eskirgan — kod boshqa, CLAUDE.md boshqa
❌ Har fayl haqida — faqat KEY files`,
  },

  {
    title: 'AI Tools Glossary — Atamalar Lug\'ati (2026)',
    description: 'AI developer tools dagi barcha muhim atamalar tushuntirishi',
    category: 'other',
    tool: 'Any',
    tags: ['glossary', 'terms', 'dictionary', 'reference', 'learning'],
    isFeatured: false,
    content: `AI Developer Tools — Atamalar Lug'ati:

ASOSIY ATAMALAR:

TOKEN:
AI uchun so'z birligi. 1 token ≈ 0.75 so'z (ingliz).
"Hello world" = 2 token. Kod uchun ko'proq token kerak.

CONTEXT WINDOW:
AI bir vaqtda ko'ra oladigan matn hajmi.
Claude Sonnet: 200K token ≈ 150K qator kod.

SYSTEM PROMPT:
AI ga berilgan doimiy ko'rsatma. "Sen developer san..." kabi.

TEMPERATURE:
AI javobining "ijodiylik" darajasi.
0.0 = aniq, takrorlanadigan. 1.0 = ijodiy, har xil.

GROUNDING:
AI javobini real ma'lumot bilan tekshirish.
Gemini: Google Search grounding.

AGENT:
AI o'zi qaror qabul qilib, tool ishlata oladigan rejim.
Claude Code, Cursor Composer, Copilot Agent.

MCP (Model Context Protocol):
AI ga tashqi toollar ulash standart protokoli.
Fayl tizimi, DB, API — hammasi MCP orqali.

RAG (Retrieval-Augmented Generation):
AI javobini tashqi ma'lumot bilan boyitish.
"Docs dan qidir + javob ber" = RAG.

FINE-TUNING:
AI modelni maxsus ma'lumot bilan qayta o'qitish.
Ko'p hollarda kerak emas — prompt engineering yetarli.

PROMPT ENGINEERING:
AI dan yaxshi javob olish uchun savolni to'g'ri yozish san'ati.

CHAIN OF THOUGHT (CoT):
AI ni "qadamlar bilan fikrla" deb yo'naltirish.
Murakkab muammolarda aniqroq javob beradi.

FEW-SHOT:
AI ga misol berib, shu formatda javob so'rash.
"Misol: X → Y. Endi: A → ?"

ZERO-SHOT:
Misol bermasdan to'g'ridan-to'g'ri so'rash.

HALLUCINATION:
AI to'qib chiqargan noto'g'ri ma'lumot.
Mavjud bo'lmagan funksiya, paket, API aytishi mumkin.

STREAMING:
AI javobini real-time ko'rsatish (bir vaqtda yozadi).
UX uchun yaxshi — user kutmaydi.

THINKING / REASONING:
AI ichida fikrlash jarayoni.
Extended thinking: ko'proq fikrlash vaqti = aniqroq javob.

WORKTREE:
Git da alohida branch uchun alohida papka.
Claude Code --worktree: agent izolyatsiyada ishlaydi.

HOOKS:
Avtomatik ishlaydigan skriptlar.
PostToolUse hook: fayl yozilgach prettier ishlatish.

CACHE:
Takroriy so'rovlarda tokenni qayta ishlatish.
Prompt caching: 90% gacha tejash mumkin.`,
  },

  {
    title: 'AI Pair Programming — Jamoa bilan AI Ishlash (2026)',
    description: 'Jamoa muhitida AI toollarni samarali ishlatish metodikasi',
    category: 'architecture',
    tool: 'Any',
    tags: ['pair-programming', 'team', 'collaboration', 'methodology'],
    isFeatured: false,
    content: `AI Pair Programming — jamoa bilan AI ishlash:

ROLLARNI BO'LISH:
\`\`\`
Developer (Siz):
- Arxitektura qarorlari
- Business logic
- Code review
- Deploy qarorlari

AI (Agent):
- Boilerplate kod yozish
- Test yozish
- Refactoring
- Dokumentatsiya
- Bug topish
\`\`\`

JAMOA WORKFLOW:
\`\`\`
1. STANDUP: AI bilan kun rejasi
   "Bugun nima qilamiz? Priority?"

2. TASK BREAKDOWN: AI bilan bo'lish
   "Bu featureni subtasklarga bo'l"

3. CODING: AI yozadi, siz review
   Agent mode → kod → review → approve

4. PR: AI description yozadi
   /commit → Push → AI PR body yozadi

5. REVIEW: AI ham review qiladi
   Copilot PR review + siz manual review
\`\`\`

SHARED CONFIGS (jamoa uchun):
\`\`\`
Repo da saqlang:
├── CLAUDE.md                  # Claude Code uchun
├── .cursorrules               # Cursor uchun
├── .cursor/rules/             # Cursor fayl-specific
├── .windsurfrules             # Windsurf uchun
├── .github/
│   └── copilot-instructions.md # Copilot uchun
└── .ai/
    └── team-context.md        # Umumiy kontekst
\`\`\`

BUTUN JAMOA BIR XIL STYLE:
Hammasi repo da → git pull → barcha AI toollar
bir xil qoidada ishlaydi.

PR DESCRIPTION AI BILAN:
\`\`\`
Prompt: "Git diff ni ko'r va PR description yoz:
## Summary (3 bullet)
## Changes (fayl bo'yicha)
## Testing (qanday test qildim)
## Risk (xavfli joylar)"
\`\`\`

CODE REVIEW CHECKLIST:
AI yozgan kodni DOIMO tekshiring:
- [ ] Auth/security muammo yo'q
- [ ] Error handling to'g'ri
- [ ] TypeScript any yo'q
- [ ] console.log yo'q
- [ ] Test yozilgan
- [ ] Performance OK
- [ ] Mavjud patternlarga mos

ANTI-PATTERNS:
❌ AI yozgan kodni review qilmaslik
❌ AI ga butun arxitekturani topshirish
❌ Jamoa a'zolari har xil AI sozlamalari
❌ .env yoki secret AI ga berish
❌ AI hallucination ga ishonib production ga push`,
  },

  {
    title: 'AI Tools Ecosystem Map — Qaysi Tool Nima (2026)',
    description: 'Barcha AI developer toollar ekosistemasi va ularning roli',
    category: 'other',
    tool: 'Any',
    tags: ['ecosystem', 'tools', 'map', 'overview', '2026'],
    isFeatured: true,
    content: `AI Developer Tools Ekosistemasi — 2026:

IDE AI ASSISTANTS:
┌─────────────────────────────────────────────┐
│ Cursor       │ AI-first IDE (VS Code fork)  │
│ Windsurf     │ Cascade AI + Flow mode       │
│ GitHub Copilot│ VS Code extension, best Tab  │
│ Cody (Sourcegraph) │ Codebase-aware chat    │
│ Tabnine      │ Privacy-focused autocomplete │
│ Amazon Q     │ AWS integration              │
└─────────────────────────────────────────────┘

TERMINAL AI AGENTS:
┌─────────────────────────────────────────────┐
│ Claude Code  │ Eng kuchli CLI agent         │
│ Codex CLI    │ OpenAI terminal agent        │
│ Aider        │ Open-source, multi-model     │
│ Continue     │ Open-source IDE extension    │
└─────────────────────────────────────────────┘

AI CHAT PLATFORMS:
┌─────────────────────────────────────────────┐
│ Claude.ai    │ Artifacts + Projects         │
│ ChatGPT      │ Canvas + Custom GPTs         │
│ Gemini       │ 1M context + Grounding       │
│ Perplexity   │ Search-first AI              │
└─────────────────────────────────────────────┘

AI APIs (Production):
┌─────────────────────────────────────────────┐
│ Anthropic API│ Claude models, prompt cache  │
│ OpenAI API   │ GPT, o-series, DALL-E        │
│ Google AI    │ Gemini, Vertex AI            │
│ Groq         │ Ultra-fast inference         │
│ Together AI  │ Open-source models, cheap    │
│ Fireworks    │ Fast inference, fine-tuning  │
└─────────────────────────────────────────────┘

MAXSUS TOOLLAR:
┌─────────────────────────────────────────────┐
│ v0.dev       │ UI component generator       │
│ Bolt.new     │ Full-stack app generator     │
│ Lovable      │ AI app builder               │
│ Replit Agent │ Cloud IDE + AI agent         │
│ Devin        │ Autonomous coding agent      │
└─────────────────────────────────────────────┘

OPTIMAL SETUP (Professional):
\`\`\`
Kunlik kodlash:
  → Cursor (IDE) + Claude Code (terminal)

Katta task:
  → Claude Code Agent Mode (worktree)

Tez savol:
  → Copilot Inline Chat

Arxitektura:
  → Claude Opus (extended thinking)

Debug:
  → Claude Sonnet + Sentry MCP

Test:
  → Copilot /tests yoki Claude Code

Deploy:
  → Claude Code (git + CLI)

Production API:
  → Gemini Flash (arzon) yoki Claude Haiku
\`\`\`

2026 TREND:
1. Multi-agent — bir nechta AI birga ishlaydi
2. Background agents — siz ishlayotganda AI parallel
3. MCP ecosystem — toollar standart protokolda
4. Prompt caching — 90% tejash
5. Agentic coding — AI o'zi branch, PR, deploy`,
  },

  {
    title: '.env va Secrets Boshqarish — AI Bilan Xavfsiz Ishlash',
    description: 'AI toollar bilan ishlashda secretlarni himoya qilish',
    category: 'architecture',
    tool: 'Any',
    tags: ['env', 'secrets', 'security', 'gitignore', 'safe'],
    isFeatured: false,
    content: `AI toollar bilan ishlashda secrets xavfsizligi:

MUAMMO:
AI agent .env faylni o'qiydi va context ga oladi.
Agar AI bulutda ishlasa — secretlaringiz xavf ostida.

QOIDALAR:

1. .GITIGNORE (eng muhim):
\`\`\`
# .gitignore — DOIMO
.env
.env.local
.env.production
*.pem
*.key
credentials.json
service-account.json
\`\`\`

2. CLAUDE CODE PERMISSIONS:
\`\`\`json
{
  "permissions": {
    "deny": [
      "Read(.env*)",
      "Read(*credentials*)",
      "Read(*secret*)",
      "Read(*.pem)",
      "Bash(cat .env*)",
      "Bash(echo $*_KEY)",
      "Bash(printenv)"
    ]
  }
}
\`\`\`

3. .CURSORIGNORE:
\`\`\`
.env*
*.pem
credentials/
secrets/
\`\`\`

4. COPILOT CONTENT EXCLUSION:
GitHub Settings → Copilot → Content Exclusion:
\`\`\`
*.env*
**/credentials/**
**/secrets/**
\`\`\`

5. .env.example (xavfsiz template):
\`\`\`
# .env.example — GIT DA SAQLASH MUMKIN
MONGODB_URI=mongodb://localhost:27017/mydb
JWT_SECRET=your-secret-here
TELEGRAM_BOT_TOKEN=your-token-here
GROQ_API_KEY=your-key-here
\`\`\`
AI ga .env.example ko'rsating, .env emas!

6. AI GA NIMA BERISH MUMKIN:
✅ .env.example (placeholder values)
✅ Config fayl tuzilishi
✅ Environment variable nomlari
❌ Haqiqiy API kalitlar
❌ Database connection string
❌ JWT secret
❌ Private keys

7. AGAR SECRET LEAK BO'LSA:
1. Darhol tokenni rotate qiling
2. Git history dan olib tashlang:
   git filter-branch yoki BFG Repo-Cleaner
3. GitHub Secret Scanning alert tekshiring

BEST PRACTICE:
"AI ga .env.example beraman.
Haqiqiy kalitlarni HECH QACHON paste qilmayman.
Permissions da .env* ni deny qilganman."`,
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function seed() {
  await connectDB();

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) { console.error('❌ Admin topilmadi'); process.exit(1); }

  console.log(`✅ Admin: ${admin.username}\n📝 ${PROMPTS.length} ta prompt...\n`);

  let added = 0, skipped = 0;

  for (const p of PROMPTS) {
    const exists = await Prompt.findOne({ title: p.title });
    if (exists) { console.log(`⏭️  ${p.title}`); skipped++; continue; }

    await Prompt.create({
      ...p,
      author: admin._id,
      isPublic: true,
      likesCount: Math.floor(Math.random() * 120) + 20,
      viewsCount: Math.floor(Math.random() * 600) + 100,
    });
    console.log(`✅ [${p.category}] ${p.title}`);
    added++;
  }

  console.log(`\n🎉 Qo'shildi: ${added} | Skip: ${skipped}`);

  const cats = ['claude','cursor','copilot','coding','architecture','vibe_coding','other'];
  console.log('\n📊 Jami (barcha seedlar):');
  for (const c of cats) {
    const n = await Prompt.countDocuments({ category: c, isPublic: true });
    console.log(`   ${c}: ${n} ta`);
  }

  const total = await Prompt.countDocuments({ isPublic: true });
  console.log(`\n📊 JAMI PROMPTLAR: ${total} ta`);
  process.exit(0);
}

seed().catch(e => { console.error('❌', e.message); process.exit(1); });
