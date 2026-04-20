/**
 * Aidevix — Prompt Library Seed v2
 * Har bir AI category uchun professional promptlar.
 * Category: claude, cursor, copilot + skills, agents, md-files
 *
 * Ishlatish: node backend/seeders/seedPrompts2.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const connectDB = require('../config/database');
const Prompt = require('../models/Prompt');
const User = require('../models/User');

const PROMPTS = [

  // ══════════════════════════════════════════════════════
  // CLAUDE CATEGORY — Claude Code specific
  // ══════════════════════════════════════════════════════

  {
    title: 'CLAUDE.md Yozish — Loyiha uchun Agent Qo\'llanmasi',
    description: 'Claude Code agentga loyihani tushuntiruvchi CLAUDE.md fayl yaratish',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['claude-md', 'agent', 'setup', 'instructions'],
    isFeatured: true,
    content: `Mening loyiham uchun professional CLAUDE.md fayl yoz.

LOYIHA MA'LUMOTLARI:
- Nomi: [PROJECT_NAME]
- Stack: [TECH_STACK]
- Maqsad: [PURPOSE]
- Deploy: [WHERE — Railway, Vercel, etc.]

CLAUDE.md qamrab olsin:

## Stack
| Layer | Tech |
|-------|------|
texnologiyalar jadvali

## Architecture
Fayl daraxti va har bir papkaning maqsadi

## Key Files
Eng muhim fayllar va ularning vazifasi

## Commands
\`\`\`bash
npm run dev    # nima qiladi
npm run build  # nima qiladi
npm test       # nima qiladi
\`\`\`

## Important Rules
- Auth qanday ishlaydi
- Qaysi fayllarni O'ZGARTIRMA (agar bo'lsa)
- Business-critical qismlar

## API Patterns
Request/response format misollari

## Environment Variables
Muhim env varlar va ularning maqsadi

QOIDA: Ixcham, ammo to'liq. Agent birinchi o'qishda loyihani tushunsin.`,
  },

  {
    title: 'Claude Code — MCP Server Ulash va Ishlatish',
    description: 'Model Context Protocol serverlarni Claude Code ga ulash',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['mcp', 'server', 'tools', 'integration'],
    isFeatured: true,
    content: `Claude Code uchun MCP (Model Context Protocol) server sozla:

1. MCP CONFIG (~/.claude/config.json yoki settings.json):
\`\`\`json
{
  "mcpServers": {
    "[server-name]": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-[name]"],
      "env": {
        "API_KEY": "[your-key]"
      }
    }
  }
}
\`\`\`

2. FOYDALI MCP SERVERLAR:
- @modelcontextprotocol/server-filesystem — fayl tizimi
- @modelcontextprotocol/server-github — GitHub API
- @modelcontextprotocol/server-postgres — PostgreSQL
- @modelcontextprotocol/server-brave-search — web search
- @modelcontextprotocol/server-memory — persistent memory

3. LOYIHAGA QO'SHISH:
Menga [USE_CASE] uchun MCP server qo'sh va test qil:
- Server: [WHICH_SERVER]
- Maqsad: [WHAT_IT_DOES]
- Claude bilan integration: [HOW_TO_USE]

4. CUSTOM MCP SERVER yoz (agar tayyor yo'q bo'lsa):
Tool nomi: [TOOL_NAME]
Input schema: [PARAMS]
Logic: [WHAT_IT_DOES]`,
  },

  {
    title: 'Claude Code — Hooks Sozlash (.claude/settings.json)',
    description: 'Pre/post tool call hooks bilan avtomatlashtirish',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['hooks', 'settings', 'automation', 'workflow'],
    isFeatured: true,
    content: `Claude Code hooks sozla — har bir tool call dan oldin/keyin avtomatik ishlasin:

HOOKS TURLARI:
- PreToolUse — tool ishlaganidan oldin
- PostToolUse — tool ishlaganidan keyin
- Notification — muhim voqealar uchun
- Stop — session tugaganda

MISOL: .claude/settings.json
\`\`\`json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "echo 'Bash buyrugi ishga tushmoqda'"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "npm run lint -- --fix $CLAUDE_TOOL_RESULT_FILE 2>/dev/null || true"
        }]
      }
    ],
    "Stop": [{
      "type": "command",
      "command": "git add -A && git diff --cached --stat"
    }]
  }
}
\`\`\`

MENGA SOZLA:
Loyihada quyidagi workflow kerak: [DESCRIBE_YOUR_WORKFLOW]
- Har yozilgan faylda: [ACTION — masalan: lint, format, test]
- Bash buyruqlardan oldin: [SAFETY_CHECK]
- Session oxirida: [SUMMARY_ACTION]`,
  },

  {
    title: 'Claude Agent — Sub-Agent Parallel Ishlatish',
    description: 'Claude Code da parallel sub-agentlar bilan katta task bo\'lish',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['agent', 'parallel', 'task', 'delegation'],
    isFeatured: false,
    content: `Katta taskni parallel sub-agentlarga bo'lib baj:

TASK: [LARGE_TASK_DESCRIPTION]

Quyidagi sub-tasklarni PARALLEL bajar:

AGENT 1 — Backend:
Scope: backend/ papka
Task: [BACKEND_SUBTASK]
Output: [EXPECTED_OUTPUT]

AGENT 2 — Frontend:
Scope: frontend/src/ papka
Task: [FRONTEND_SUBTASK]
Output: [EXPECTED_OUTPUT]

AGENT 3 — Tests:
Scope: **/*.test.ts fayllar
Task: [TEST_SUBTASK]
Output: [EXPECTED_OUTPUT]

QOIDALAR:
- Har agent faqat o'z scope'ida ishlaydi
- Fayllarni to'qnashishiga yo'l qo'yma
- Har agent oxirida natija report qilsin
- Xato bo'lsa main agent ga qaytarsin

Barchasi tayyor bo'lgach, integratsiya qil va test o't.`,
  },

  {
    title: 'Claude — Slash Command Yaratish',
    description: 'Loyiha uchun custom /slash commandlar yozish',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['slash-command', 'custom', 'workflow', 'productivity'],
    isFeatured: false,
    content: `Loyihama mos custom slash command yarat:

COMMAND NOMI: /[command-name]
MAQSAD: [WHAT_IT_DOES]

FAYL: .claude/commands/[command-name].md

TARKIB:
\`\`\`markdown
---
description: [Qisqa tavsif]
allowed-tools: [Bash, Read, Write, Edit, Glob, Grep]
---

# [Command Name]

## Context
$ARGUMENTS — foydalanuvchi bergan parametrlar

## Task
[Step-by-step nima qilish kerak]

## Output Format
[Natija qanday bo'lishi kerak]
\`\`\`

MISOL COMMANDLAR LOYIHAM UCHUN:
1. /deploy — build + push + deploy
2. /review — staged fayllarni review qil
3. /seed — database seed qil
4. /test [file] — fayl testlarini ishga tushir

Menga [COMMAND_NAME] commandini yoz.
Ishlatish: /[command-name] [EXAMPLE_ARGS]`,
  },

  {
    title: 'Claude Code — Memory va Persistent Context',
    description: 'Claude Code da uzoq muddatli xotira sozlash',
    category: 'claude',
    tool: 'Claude Code',
    tags: ['memory', 'context', 'persistent', 'project'],
    isFeatured: false,
    content: `Claude Code xotirasini loyihaga mos sozla:

1. GLOBAL MEMORY (~/.claude/CLAUDE.md):
\`\`\`markdown
# My Preferences
- Kodni o'zbekcha izohlama
- Har doim TypeScript ishlat
- Console.log qoldirma
- Test yozishni unutma
\`\`\`

2. PROJECT MEMORY (./CLAUDE.md):
[LOYIHA SPETSIFIK QOIDALAR]

3. MEMORY FAYLLAR TUZILMASI:
\`\`\`
~/.claude/
├── CLAUDE.md          # Global preferences
├── settings.json      # Hooks, permissions
└── commands/          # Custom slash commands
    ├── deploy.md
    └── review.md
\`\`\`

4. MENGA YORDAM BER:
Quyidagi preferences ni memory ga saqlash uchun
CLAUDE.md faylini yoz:

Texnik:
- Sevimli stack: [STACK]
- Code style: [STYLE]
- Test framework: [FRAMEWORK]

Ish uslubi:
- Kommunikatsiya tili: [LANGUAGE]
- Commit style: [CONVENTIONAL/OTHER]
- Review qat'iyligi: [HIGH/MEDIUM]`,
  },

  // ══════════════════════════════════════════════════════
  // CURSOR CATEGORY — Cursor specific
  // ══════════════════════════════════════════════════════

  {
    title: '.cursorrules — Professional Loyiha Qoidalari',
    description: 'Next.js + Express loyiha uchun to\'liq .cursorrules fayl',
    category: 'cursor',
    tool: 'Cursor',
    tags: ['cursorrules', 'rules', 'config', 'nextjs'],
    isFeatured: true,
    content: `Mening loyihama mos .cursorrules fayl yoz:

STACK: [YOUR_STACK]

\`\`\`
# Project Rules for Cursor AI

## Tech Stack
- Frontend: [Next.js 14 App Router, TypeScript, Tailwind, Redux Toolkit]
- Backend: [Express.js, MongoDB/Mongoose, JWT]
- Testing: [Jest, Supertest]

## Code Style
- Language: TypeScript strict mode
- Formatting: 2 space indent, single quotes
- Max line length: 100 chars
- Semicolons: yes/no

## Naming Conventions
- Components: PascalCase (UserCard.tsx)
- Hooks: camelCase with "use" prefix (useAuth.ts)
- Utils: camelCase (formatDate.ts)
- Constants: UPPER_SNAKE_CASE
- API routes: kebab-case (/api/user-stats)

## File Structure
src/
├── app/         # Next.js pages
├── components/  # React components
├── hooks/       # Custom hooks
├── api/         # API clients
├── store/       # Redux slices
└── utils/       # Helpers

## Import Order
1. React/Next.js
2. Third-party libraries
3. Internal (@/components, @/hooks)
4. Types
5. Styles

## Patterns to Follow
- Always use async/await (no .then chains)
- Error handling: try/catch in async functions
- API responses: { success: boolean, data: T }
- Redux: createAsyncThunk for API calls

## Patterns to AVOID
- No localStorage for auth tokens
- No any type (use unknown)
- No default exports for utilities
- No inline styles (use Tailwind)
- No magic numbers (use constants)

## Component Template
\`\`\`tsx
interface [Name]Props {
  // props
}
export default function [Name]({ }: [Name]Props) {
  return <div></div>
}
\`\`\`
\`\`\``,
  },

  {
    title: 'Cursor — @Codebase Context bilan Feature',
    description: 'Mavjud kodni tahlil qilib unga mos yangi feature qo\'shish',
    category: 'cursor',
    tool: 'Cursor',
    tags: ['codebase', 'context', 'feature', 'consistent'],
    isFeatured: true,
    content: `@Codebase ni tahlil qilib, mavjud pattern larga mos [FEATURE_NAME] qo'sh.

TAHLIL BOSQICHLARI:
1. @src/api/ papkasidan API pattern ko'r
2. @src/store/slices/ dan Redux pattern ko'r
3. @src/hooks/ dan hook pattern ko'r
4. @src/components/ dan component pattern ko'r

SHULARGA MOS YARAT:

1. API CLIENT: src/api/[feature]Api.ts
   Mavjud [existingApi.ts] bilan bir xil pattern

2. REDUX SLICE: src/store/slices/[feature]Slice.ts
   createAsyncThunk + extraReducers pattern

3. HOOK: src/hooks/use[Feature].ts
   useSelector + useDispatch pattern

4. COMPONENT: src/components/[Feature]/index.tsx
   Loading/error/empty states bilan

MUHIM:
- Path aliases (@/components, @/hooks) ishlat
- Mavjud types ni import qil, qayta yozma
- Tailwind classes — mavjud designga mos

Test: @src/[closest_test].test.ts ga qarab test yoz.`,
  },

  {
    title: 'Cursor Notepads — Reusable Context Block',
    description: 'Cursor Notepads bilan qayta ishlatiladigan context yozish',
    category: 'cursor',
    tool: 'Cursor',
    tags: ['notepads', 'context', 'reusable', 'template'],
    isFeatured: false,
    content: `Cursor Notepads uchun reusable context bloklar:

NOTEPAD 1: API Integration Context
\`\`\`
# API Integration Rules
Base URL: /api/proxy/ (Next.js proxy)
Auth: cookie-based (withCredentials: true)
Response format: { success: boolean, data: T, message?: string }
Error format: { success: false, message: string }

Barcha requestlar axiosInstance orqali ketadi.
401 → refresh token, 403 → subscription error.
\`\`\`

NOTEPAD 2: Component Standards
\`\`\`
# Component Rules
- 'use client' directive kerakmi? (state/effect bo'lsa yes)
- Props interface doim export qil
- Loading: <Skeleton /> component ishlat
- Error: toast.error() + console.error()
- Empty state: emojili placeholder
\`\`\`

NOTEPAD 3: Database Patterns
\`\`\`
# MongoDB/Mongoose Patterns
- Always .lean() for read-only queries
- Pagination: .skip((page-1)*limit).limit(limit)
- Populate: faqat kerakli fieldlar: .populate('user', 'username avatar')
- Indexing: frequently filtered fields ga index qo'sh
\`\`\`

Menga [TOPIC] uchun notepad yarat — tez-tez ishlatiladigan context.`,
  },

  {
    title: 'Cursor AI — Diff Review va Accept/Reject',
    description: 'Cursor ning diff UI bilan katta o\'zgarishlarni boshqarish',
    category: 'cursor',
    tool: 'Cursor',
    tags: ['diff', 'review', 'changes', 'workflow'],
    isFeatured: false,
    content: `Cursor da katta refactor qilmoqchiman. Diff ni yaxshi boshqarish uchun:

STRATEGY:
1. Avval faqat tahlil qil (kod yozma):
   "@file.ts ni o'qib, qanday o'zgartirish kerakligini tushuntir"

2. Kichik qismlarga bo'l:
   - Birinchi: types va interfaces
   - Keyin: business logic
   - Oxiri: UI/rendering

3. Har bir qism uchun alohida chat:
   "Faqat [SPECIFIC_PART] ni o'zgartir"

PROMPTING PATTERN:
\`\`\`
@[file.ts]

Faqat quyidagini o'zgartir (boshqasiga tegma):
[SPECIFIC_CHANGE]

O'zgartirmagan qatorlar uchun "// unchanged" comment qoldirma,
to'liq kodni yoz.
\`\`\`

LARGE FILE UCHUN:
\`\`\`
@[large-file.ts] dan faqat [FUNCTION_NAME] funksiyasini
quyidagicha o'zgartir: [CHANGE]

Boshqa funksiyalarga tegma.
\`\`\``,
  },

  {
    title: 'Cursor — Multi-File Refactor Strategiyasi',
    description: 'Bir nechta fayldagi bir xil pattern larni birga o\'zgartirish',
    category: 'cursor',
    tool: 'Cursor',
    tags: ['refactor', 'multi-file', 'rename', 'pattern'],
    isFeatured: false,
    content: `Loyihadagi [OLD_PATTERN] ni [NEW_PATTERN] ga o'zgartir.

MASALAN: Barcha API calllarni yangi formatga o'tkazish

QILADIGAN ISHLAR:
1. @Codebase dan barcha [OLD_PATTERN] larni top
2. Har birini [NEW_PATTERN] ga o'zgartir
3. Import larni yangilart
4. Types ni moslashtir
5. Testlarni yangilat

FAYL RO'YXATI:
\`\`\`
@src/api/authApi.ts
@src/api/courseApi.ts
@src/api/userApi.ts
[boshqa fayllar]
\`\`\`

O'ZGARTIRISH:
\`\`\`typescript
// ESKI:
[OLD_CODE_PATTERN]

// YANGI:
[NEW_CODE_PATTERN]
\`\`\`

DIQQAT:
- Import path larni buzma
- Type compatibility tekshir
- Breaking change bormi? Hamma ishlatuvchi joylarni yangilat`,
  },

  // ══════════════════════════════════════════════════════
  // COPILOT CATEGORY — GitHub Copilot specific
  // ══════════════════════════════════════════════════════

  {
    title: 'Copilot Workspace — Issue dan PR gacha',
    description: 'GitHub Issue dan boshlab to\'liq PR yaratish',
    category: 'copilot',
    tool: 'GitHub Copilot',
    tags: ['workspace', 'issue', 'pr', 'github'],
    isFeatured: true,
    content: `GitHub Copilot Workspace bilan issue dan PR gacha:

ISSUE: #[NUMBER] — [ISSUE_TITLE]
\`\`\`
[ISSUE_DESCRIPTION]
\`\`\`

1. TAHLIL (Copilot Workspace da):
   "Analyze this issue and suggest implementation plan"

2. IMPLEMENTATION PLAN:
   - [ ] Qaysi fayllar o'zgaradi?
   - [ ] Yangi fayllar kerakmi?
   - [ ] Database migration kerakmi?
   - [ ] Tests?

3. KOD YOZISH:
   "Implement the plan step by step"

4. PR DESCRIPTION (auto-generate):
\`\`\`markdown
## Closes #[NUMBER]

### Changes
- [file1.ts]: [what changed]
- [file2.tsx]: [what changed]

### Testing
- [ ] Unit tests passing
- [ ] Manual test: [steps]

### Screenshots (agar UI o'zgarsa)
[before/after]
\`\`\`

5. REVIEW REQUEST:
   "@copilot review this PR for security and performance"`,
  },

  {
    title: 'Copilot — Inline Chat: Complex Logic',
    description: 'Copilot inline chat bilan murakkab algoritmlarni yozish',
    category: 'copilot',
    tool: 'GitHub Copilot',
    tags: ['inline-chat', 'algorithm', 'logic', 'explain'],
    isFeatured: true,
    content: `GitHub Copilot inline chat (Ctrl+I) bilan ishlash:

1. FUNCTION YARATISH:
   Kursor funksiya nomiga qo'yib:
   "Implement this function: [BRIEF_DESCRIPTION]"

   Yoki docstring yozib Enter bos:
   \`\`\`typescript
   /**
    * [FUNCTION_NAME] — [what it does]
    * @param {Type} param — [description]
    * @returns [what it returns]
    */
   \`\`\`

2. REFACTOR:
   Kodni select qilib Ctrl+I:
   "Refactor this to use [PATTERN — async/await, reduce, etc.]"

3. FIX:
   Xatoli kodni select qilib:
   "Fix the bug: [ERROR_MESSAGE]"

4. EXPLAIN:
   Tushunmagan kodni select qilib:
   "/explain this code step by step"

5. OPTIMIZE:
   \`\`\`
   /optimize for performance — avoid N+1 queries
   \`\`\`

SAMARALI PROMPTING:
- Qancha aniq bo'lsa, shuncha yaxshi suggest
- Type larni ko'rsat: "returns Promise<User[]>"
- Constraint ko'rsat: "without external libraries"`,
  },

  {
    title: 'Copilot — .github/copilot-instructions.md',
    description: 'Loyiha uchun Copilot ko\'rsatmalar fayli',
    category: 'copilot',
    tool: 'GitHub Copilot',
    tags: ['instructions', 'config', 'github', 'customization'],
    isFeatured: true,
    content: `Loyihaga .github/copilot-instructions.md fayl yoz:

\`\`\`markdown
# Copilot Instructions for [PROJECT_NAME]

## Project Overview
[1-2 jumlada loyiha haqida]

## Tech Stack
- [Technology]: [version and purpose]

## Coding Standards

### TypeScript
- Strict mode enabled
- No \`any\` type — use \`unknown\` or proper types
- All functions must have return type annotations
- Interfaces over types for objects

### React Components
- Functional components only
- Custom hooks for logic extraction
- Props destructuring in function signature
- Default export for pages, named for components

### API Calls
- Use axiosInstance from '@/api/axiosInstance'
- Always handle loading and error states
- Response type: \`ApiResponse<T>\`

### Error Handling
\`\`\`typescript
try {
  // logic
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  toast.error(message)
}
\`\`\`

## File Naming
- Components: PascalCase.tsx
- Hooks: useCamelCase.ts
- Utils: camelCase.ts
- Types: types.ts (per module)

## Testing
- Test file: [component].test.tsx
- Use React Testing Library
- Mock API calls with MSW
\`\`\``,
  },

  {
    title: 'Copilot Chat — Architecture Decision Record',
    description: 'Arxitektura qarorlarini dokumentlash (ADR)',
    category: 'copilot',
    tool: 'GitHub Copilot',
    tags: ['adr', 'architecture', 'decision', 'documentation'],
    isFeatured: false,
    content: `@workspace dan foydalanib, quyidagi arxitektura qaror uchun ADR yoz:

QAROR: [ARCHITECTURE_DECISION — masalan: "JWT cookie-based auth"]

ADR FORMAT:
\`\`\`markdown
# ADR-[NUMBER]: [Title]

## Status
[Proposed / Accepted / Deprecated]

## Context
[Nima muammo hal qilinmoqda?]

## Decision
[Qanday qaror qilindi?]

## Consequences

### Positive
- [benefit 1]
- [benefit 2]

### Negative
- [tradeoff 1]
- [tradeoff 2]

## Alternatives Considered
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| [A] | | | |
| [B] | | | |

## Implementation Notes
[Kod misoli yoki muhim detallar]
\`\`\`

@[relevant_files] dan real implementation ni ko'rib,
haqiqiy kontekstda yoz.`,
  },

  // ══════════════════════════════════════════════════════
  // CODING CATEGORY — Skills & Professional Patterns
  // ══════════════════════════════════════════════════════

  {
    title: 'TypeScript — Advanced Types va Generic Patterns',
    description: 'Professional TypeScript type system dan to\'liq foydalanish',
    category: 'coding',
    tool: 'Any',
    tags: ['typescript', 'generics', 'types', 'advanced'],
    isFeatured: true,
    content: `TypeScript advanced patterns ni menga o'rgat va loyihada ishlat:

1. GENERIC API RESPONSE:
\`\`\`typescript
type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  message: string;
  code?: number;
}

// Ishlatish:
async function fetchUser(id: string): Promise<ApiResponse<User>> {}
\`\`\`

2. DISCRIMINATED UNIONS (state machine):
\`\`\`typescript
type LoadingState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
\`\`\`

3. UTILITY TYPES loyihada:
\`\`\`typescript
type CreateUserInput = Omit<User, '_id' | 'createdAt' | 'updatedAt'>
type UpdateUserInput = Partial<Pick<User, 'username' | 'bio' | 'avatar'>>
type UserPreview = Pick<User, '_id' | 'username' | 'avatar'>
\`\`\`

4. CONDITIONAL TYPES:
\`\`\`typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
\`\`\`

Menga [USE_CASE] uchun advanced type yoz.`,
  },

  {
    title: 'React Performance — Optimization Checklist',
    description: 'React ilovasini tezlashtirish uchun barcha usullar',
    category: 'coding',
    tool: 'Any',
    tags: ['react', 'performance', 'memo', 'optimization'],
    isFeatured: false,
    content: `Quyidagi React komponentni optimize qil:

\`\`\`tsx
[YOUR_SLOW_COMPONENT]
\`\`\`

OPTIMIZATION BOSQICHLARI:

1. UNNECESSARY RE-RENDERS:
\`\`\`tsx
// React.memo — props o'zgarmasa re-render yo'q
const Component = React.memo(({ data }) => <div>{data}</div>)

// useMemo — qimmat hisoblash uchun
const result = useMemo(() => heavyComputation(data), [data])

// useCallback — funksiya reference uchun
const handleClick = useCallback(() => action(id), [id])
\`\`\`

2. CODE SPLITTING:
\`\`\`tsx
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Skeleton />,
  ssr: false
})
\`\`\`

3. VIRTUAL LIST (ko'p element):
\`\`\`tsx
// react-window yoki react-virtual ishlat
// 1000+ element bo'lsa majburiy
\`\`\`

4. IMAGE OPTIMIZATION:
\`\`\`tsx
<Image src={url} width={48} height={48}
  loading="lazy" placeholder="blur" />
\`\`\`

5. STATE COLOCATION:
Global state emas, local state ishlat (agar mumkin bo'lsa).

Komponentimni tahlil qilib, TOP 3 muammoni tuzat.`,
  },

  {
    title: 'Node.js — Production-Ready Express Middleware',
    description: 'Express ilovasini production uchun to\'liq sozlash',
    category: 'coding',
    tool: 'Any',
    tags: ['nodejs', 'express', 'middleware', 'production'],
    isFeatured: false,
    content: `Express ilovamni production uchun to'liq sozla:

1. SECURITY MIDDLEWARE:
\`\`\`javascript
app.use(helmet())                    // Security headers
app.use(cors({ origin: ALLOWED }))   // CORS
app.use(mongoSanitize())             // NoSQL injection
app.use(xss())                       // XSS protection
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }))
\`\`\`

2. LOGGING (pino yoki winston):
\`\`\`javascript
const logger = pino({ level: 'info' })
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url })
  next()
})
\`\`\`

3. ERROR HANDLING:
\`\`\`javascript
// Global error handler
app.use((err, req, res, next) => {
  logger.error(err)
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Server error' : err.message
  })
})
\`\`\`

4. GRACEFUL SHUTDOWN:
\`\`\`javascript
process.on('SIGTERM', async () => {
  await mongoose.connection.close()
  server.close(() => process.exit(0))
})
\`\`\`

5. HEALTH CHECK:
\`\`\`javascript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState })
})
\`\`\`

Menga [SPECIFIC_MIDDLEWARE] qo'shib ber.`,
  },

  // ══════════════════════════════════════════════════════
  // ARCHITECTURE CATEGORY — Agents & Advanced
  // ══════════════════════════════════════════════════════

  {
    title: 'AI Agent Arxitekturasi — ReAct Pattern',
    description: 'Reasoning + Acting pattern bilan custom AI agent yaratish',
    category: 'architecture',
    tool: 'Any',
    tags: ['agent', 'react-pattern', 'reasoning', 'tools'],
    isFeatured: true,
    content: `[TASK] uchun ReAct (Reasoning + Acting) pattern bilan AI agent yoz:

AGENT STRUKTURA:
\`\`\`typescript
interface AgentTool {
  name: string
  description: string
  execute: (input: string) => Promise<string>
}

class ReActAgent {
  constructor(
    private llm: LLMClient,
    private tools: AgentTool[],
    private maxIterations: number = 10
  ) {}

  async run(task: string): Promise<string> {
    let context = \`Task: \${task}\n\`

    for (let i = 0; i < this.maxIterations; i++) {
      // Thought: LLM reasoning
      const thought = await this.think(context)

      // Action: tool selection
      const action = this.parseAction(thought)
      if (action.type === 'finish') return action.result

      // Observation: tool execution
      const observation = await this.executeTool(action)

      context += \`\nThought: \${thought}\nObservation: \${observation}\`
    }
  }
}
\`\`\`

TOOLS menga kerak:
- [TOOL_1]: [what it does]
- [TOOL_2]: [what it does]

AGENT MAQSADI: [DESCRIBE_AGENT_PURPOSE]

Groq API (llama-3.3-70b) bilan implement qil.`,
  },

  {
    title: 'RAG Pipeline — Kod Dokumentatsiya Search',
    description: 'Retrieval Augmented Generation bilan smart docs search',
    category: 'architecture',
    tool: 'Any',
    tags: ['rag', 'embeddings', 'search', 'vector-db'],
    isFeatured: false,
    content: `Loyiha dokumentatsiyasi uchun RAG pipeline yarat:

ARXITEKTURA:
\`\`\`
Docs (MD fayllar)
    ↓ chunking
Embedding (OpenAI/Ollama)
    ↓
Vector Store (Pinecone/pgvector)
    ↓ semantic search
Retrieved Context
    ↓
LLM (Groq llama) + Context
    ↓
Answer
\`\`\`

IMPLEMENT:
\`\`\`javascript
// 1. Indexing pipeline
async function indexDocs(docsPath) {
  const docs = await loadMarkdownFiles(docsPath)
  const chunks = chunkDocs(docs, { size: 500, overlap: 50 })
  const embeddings = await embed(chunks)
  await vectorStore.upsert(embeddings)
}

// 2. Query pipeline
async function query(question) {
  const queryEmbedding = await embed(question)
  const relevant = await vectorStore.search(queryEmbedding, topK=5)
  const context = relevant.map(r => r.content).join('\n\n')

  return groq.chat({
    messages: [
      { role: 'system', content: \`Context:\n\${context}\` },
      { role: 'user', content: question }
    ]
  })
}
\`\`\`

Mening loyihama mos implement qil:
- Docs joyi: [PATH]
- Vector DB: [CHOICE]
- Embedding: [MODEL]`,
  },

  {
    title: 'Microservices — Event-Driven Arxitektura',
    description: 'Message queue bilan loose-coupled servislar',
    category: 'architecture',
    tool: 'Any',
    tags: ['microservices', 'event-driven', 'queue', 'redis'],
    isFeatured: false,
    content: `[FEATURE] ni event-driven arxitekturada implement qil:

PATTERN:
\`\`\`
Service A (Publisher)
    ↓ emit event
Message Queue (Redis Pub/Sub yoki BullMQ)
    ↓
Service B (Subscriber) → DB update
Service C (Subscriber) → Email send
Service D (Subscriber) → Telegram notify
\`\`\`

IMPLEMENT (Redis + BullMQ):
\`\`\`javascript
// Publisher
import { Queue } from 'bullmq'
const notificationQueue = new Queue('notifications', { connection })

// Event emit
await notificationQueue.add('user.registered', {
  userId, email, username
}, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 }
})

// Subscriber (Worker)
import { Worker } from 'bullmq'
new Worker('notifications', async (job) => {
  if (job.name === 'user.registered') {
    await sendWelcomeEmail(job.data)
    await sendTelegramNotify(job.data)
  }
}, { connection })
\`\`\`

MENGA KERAK:
- Event: [EVENT_NAME]
- Publisher: [SERVICE_A]
- Subscribers: [SERVICE_B, SERVICE_C]
- Error handling + retry strategy`,
  },

  // ══════════════════════════════════════════════════════
  // VIBE_CODING CATEGORY
  // ══════════════════════════════════════════════════════

  {
    title: 'Vibe Coding — "Tushuntir va Yoz" Metodi',
    description: 'AI ga kodni tushuntirib, keyin yozdirib olish eng samarali usul',
    category: 'vibe_coding',
    tool: 'Any',
    tags: ['vibe-coding', 'workflow', 'explain-first', 'method'],
    isFeatured: true,
    content: `"Tushuntir va Yoz" metodi — eng samarali vibe coding usuli:

BOSQICH 1 — TUSHUNTIRISH (kod yozma):
\`\`\`
[FEATURE] ni implement qilmoqchiman.
Kod yozishdan oldin:
1. Qanday yondashuv to'g'ri?
2. Qaysi fayllarni o'zgartirish kerak?
3. Potensial muammolar?
4. Ketma-ket qadamlar?

Faqat plan ber, hali kod yozma.
\`\`\`

BOSQICH 2 — TASDIQLASH:
\`\`\`
Yaxshi plan. [ADJUSTMENT] o'zgartir.
Endi kodlashni boshlaylik.
\`\`\`

BOSQICH 3 — INCREMENTTAL KOD:
\`\`\`
Faqat 1-qadamni yoz: [STEP_1]
Boshqasiga o'tma, ko'rib chiqay.
\`\`\`

BOSQICH 4 — REVIEW va CONTINUE:
\`\`\`
[QABUL QILISH yoki TUZATISH]
Endi 2-qadamga o't.
\`\`\`

NIMA UCHUN SAMARALI:
- AI "runaway" qilmaydi (keragidan ko'p yozadi)
- Har qadam boshqaruv ostida
- Muammolar erta aniqlanadi
- Final kod sifatli bo'ladi`,
  },

  {
    title: 'Vibe Coding — Bir Kunda SaaS MVP',
    description: 'Tez prototip yaratish uchun AI bilan sprint',
    category: 'vibe_coding',
    tool: 'Claude Code',
    tags: ['mvp', 'saas', 'rapid', 'prototype'],
    isFeatured: true,
    content: `[SAAS_IDEA] uchun 1 kunlik MVP sprint:

SOAT 1-2: SETUP (Claude bilan)
\`\`\`
Next.js + Tailwind + MongoDB setup qil.
Auth (email+password), Dashboard layout,
va [CORE_FEATURE] uchun skeleton yarat.
Deployment ready bo'lsin (Vercel + Railway).
\`\`\`

SOAT 3-5: CORE FEATURE
\`\`\`
[CORE_FEATURE] ni to'liq implement qil:
- Backend: CRUD API
- Frontend: UI + state
- Real data bilan ishlaydi
\`\`\`

SOAT 6-7: MONETIZATSIYA
\`\`\`
Payme/Stripe payment qo'sh.
Free tier: [LIMITS]
Pro tier: [PRICE] / oy
\`\`\`

SOAT 8: LAUNCH
\`\`\`
- Landing page (konversiya uchun optimized)
- SEO meta tags
- OG image
- Deploy
\`\`\`

MVP kriterlari:
✅ Ishlaydi
✅ To'lov qabul qiladi
✅ Foydalanuvchi ro'yxatdan o'ta oladi
✅ Core feature ishlatsa bo'ladi`,
  },

  // ══════════════════════════════════════════════════════
  // DEBUGGING CATEGORY
  // ══════════════════════════════════════════════════════

  {
    title: 'Production Debug — Live Issue Tezda Hal Qilish',
    description: 'Production da kritik xato paydo bo\'ldi — tez tuzatish protokoli',
    category: 'debugging',
    tool: 'Any',
    tags: ['production', 'critical', 'hotfix', 'incident'],
    isFeatured: false,
    content: `PRODUCTION da kritik xato! Tez yordamchim bo'l:

SIMPTOM: [WHAT_IS_BROKEN]
XATO VAQTI: [WHEN_STARTED]
TA'SIR: [HOW_MANY_USERS_AFFECTED]

LOG:
\`\`\`
[PASTE_ERROR_LOGS]
\`\`\`

TEZKOR PROTOKOL:

1. TRIAGE (2 daqiqa):
   - Kritikmi yoki degradedmi?
   - Rollback mumkinmi?
   - Feature flag o'chirsa hal bo'ladimi?

2. ROOT CAUSE (5 daqiqa):
   - Qaysi commit dan keyin boshlandi?
   - DB query bormi?
   - External API bormi?

3. HOTFIX:
   - Minimal o'zgarish (1-2 qator)
   - Test yozma (vaqt yo'q), manual tekshir
   - Deploy: git push main

4. POST-MORTEM (keyinroq):
   - Nima bo'ldi?
   - Nega detect qilinmadi?
   - Kelajakda oldini olish?

Hozir eng muhim: [SPECIFIC_ERROR] ni hal qil.`,
  },

  {
    title: 'Performance Profiling — Sekin API tezlashtirish',
    description: 'API response time ni o\'lchab, bottleneck topib tuzatish',
    category: 'debugging',
    tool: 'Any',
    tags: ['performance', 'profiling', 'slow-api', 'optimization'],
    isFeatured: false,
    content: `API endpoint sekin ([N]ms response time). Tezlashtir:

ENDPOINT: [METHOD] /api/[path]
HOZIRGI VAQT: [Xms]
MAQSAD: [Yms dan kam]

KOD:
\`\`\`javascript
[PASTE_CONTROLLER_CODE]
\`\`\`

PROFILING QADAMLARI:

1. TIMING LOG QO'SH:
\`\`\`javascript
const t0 = Date.now()
// ... DB query
console.log('DB query:', Date.now() - t0, 'ms')
const t1 = Date.now()
// ... processing
console.log('Processing:', Date.now() - t1, 'ms')
\`\`\`

2. MONGODB EXPLAIN:
\`\`\`javascript
const result = await Model.find(filter).explain('executionStats')
console.log(result.executionStats)
\`\`\`

3. BOTTLENECK TOPISH:
Natijalarni ko'rib:
- DB query sekinmi? → Index qo'sh yoki query optimize
- N+1 bormi? → populate yoki aggregate ishlat
- Serialize sekinmi? → .lean() ishlat
- External API bormi? → Cache qo'sh (Redis)

MENGA: Bu kodni tahlil qilib, TOP 3 muammoni topib tuzat.`,
  },

  // ══════════════════════════════════════════════════════
  // TESTING CATEGORY
  // ══════════════════════════════════════════════════════

  {
    title: 'E2E Testing — Playwright bilan User Journey',
    description: 'Playwright bilan muhim foydalanuvchi oqimlarini test qilish',
    category: 'testing',
    tool: 'Any',
    tags: ['e2e', 'playwright', 'testing', 'automation'],
    isFeatured: false,
    content: `Playwright bilan [FEATURE] uchun E2E test yoz:

SETUP:
\`\`\`bash
npm install -D @playwright/test
npx playwright install
\`\`\`

TEST SCENARIYLAR:
\`\`\`typescript
import { test, expect } from '@playwright/test'

test.describe('[Feature] E2E', () => {

  test.beforeEach(async ({ page }) => {
    // Login qil
    await page.goto('/login')
    await page.fill('[name=email]', 'test@example.com')
    await page.fill('[name=password]', 'password123')
    await page.click('[type=submit]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('happy path: [ACTION]', async ({ page }) => {
    await page.goto('/[feature]')
    // Steps...
    await expect(page.locator('[data-testid=result]')).toBeVisible()
  })

  test('error state: [SCENARIO]', async ({ page }) => {
    // Mock API error
    await page.route('/api/[endpoint]', route =>
      route.fulfill({ status: 500 })
    )
    // Assert error message shown
    await expect(page.locator('.error-message')).toBeVisible()
  })

})
\`\`\`

MENGA: [USER_JOURNEY] uchun to'liq E2E test yoz.
URL flow: [PAGE1] → [PAGE2] → [PAGE3]`,
  },

  // ══════════════════════════════════════════════════════
  // DOCUMENTATION CATEGORY
  // ══════════════════════════════════════════════════════

  {
    title: 'Markdown Fayl — Professional README Yaratish',
    description: 'Open source yoki professional loyiha uchun README.md',
    category: 'documentation',
    tool: 'Any',
    tags: ['readme', 'markdown', 'documentation', 'open-source'],
    isFeatured: false,
    content: `[PROJECT_NAME] uchun professional README.md yoz:

\`\`\`markdown
<div align="center">
  <img src="logo.png" alt="Logo" width="80">
  <h1>[PROJECT_NAME]</h1>
  <p>[One-liner description]</p>

  [![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
  [![Version](https://img.shields.io/badge/version-1.0.0-green.svg)]()
</div>

## ✨ Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

## 🚀 Quick Start

\`\`\`bash
git clone [repo]
cd [project]
npm install
cp .env.example .env
npm run dev
\`\`\`

## 📖 Documentation
[Link to docs]

## 🏗️ Architecture
[Brief architecture description or diagram]

## 🔧 Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |

## 🤝 Contributing
1. Fork it
2. Create feature branch
3. Commit changes
4. Push & open PR

## 📄 License
MIT © [Year] [Author]
\`\`\`

Haqiqiy texnologiyalar va xususiyatlar bilan to'ldir.`,
  },

];

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function seed() {
  await connectDB();

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('❌ Admin user topilmadi.');
    process.exit(1);
  }

  console.log(`✅ Admin: ${admin.username} (${admin._id})`);
  console.log(`📝 ${PROMPTS.length} ta prompt qo'shilmoqda...\n`);

  let added = 0;
  let skipped = 0;

  for (const p of PROMPTS) {
    const exists = await Prompt.findOne({ title: p.title });
    if (exists) {
      console.log(`⏭️  Skip: ${p.title}`);
      skipped++;
      continue;
    }

    await Prompt.create({
      ...p,
      author: admin._id,
      isPublic: true,
      likesCount: Math.floor(Math.random() * 60) + 10,
      viewsCount: Math.floor(Math.random() * 300) + 50,
    });

    console.log(`✅ [${p.category}/${p.tool}]: ${p.title}`);
    added++;
  }

  console.log(`\n🎉 Tayyor! Qo'shildi: ${added} | Skip: ${skipped}`);

  // Stats
  const counts = {};
  for (const cat of ['claude', 'cursor', 'copilot', 'coding', 'architecture', 'vibe_coding', 'debugging', 'testing', 'documentation']) {
    counts[cat] = await Prompt.countDocuments({ category: cat, isPublic: true });
  }
  console.log('\n📊 Category statistikasi:');
  for (const [cat, count] of Object.entries(counts)) {
    console.log(`   ${cat}: ${count} ta`);
  }

  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Xato:', err.message);
  process.exit(1);
});
