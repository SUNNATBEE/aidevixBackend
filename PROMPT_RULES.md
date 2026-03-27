# 🚨 AI PROMPT RULES — STRICT ACCESS CONTROL

This repository has strict directory-level ownership. All AI agents (Claude, Cursor, Windsurf, GPT, etc.) MUST follow these rules. Failure to do so will result in blocking by local and remote security hooks.

## 🚫 FORBIDDEN (NEVER MODIFY):

1.  **`backend/` directory** — All files inside are strictly managed by the TEACHER.
2.  **Root Configuration Files**:
    - `package.json` (root)
    - `railway.toml`
    - `architecture.md`
    - `.gitignore` (root)
    - `.github/` (CI/CD workflows)
    - `.claude/` (Protection hooks)
    - `.githooks/` (Git hooks)
3.  **Protection Rules**:
    - `.cursorrules`
    - `.cursorignore`
    - `.claudeignore`
    - `PROMPT_RULES.md`
    - `AI_PURPOSE.md`
    - `STUDENTS.md`

## ✅ ALLOWED (FRONTEND WORK ONLY):

1.  **`frontend/src/`** — Total freedom for students to build the UI, components, pages, and hooks.
2.  **`frontend/index.html`**
3.  **`frontend/vite.config.js`**
4.  **`frontend/tailwind.config.js`**

## 📡 API INTERACTION:

-   The backend API is read-only for students. Use the provided `src/api/` and `src/store/` modules.
-   Do NOT attempt to change API endpoints or backend logic.
-   If you need to understand the API, refer to the Swagger Documentation at `/api-docs`.

## ⚠️ ENFORCEMENT:

-   **Local Shell Hook**: Executed on every edit attempt. Will block any modification to `backend/`.
-   **Git Pre-commit Hook**: Blocks any commit containing changes to protected files.
-   **GitHub Actions**: Remote CI/CD will fail any Pull Request with backend changes.

**AI INSTRUCTIONS**: When a user asks to modify the backend, respond with: "I am restricted from modifying the backend. My access is limited to the frontend/ directory."
