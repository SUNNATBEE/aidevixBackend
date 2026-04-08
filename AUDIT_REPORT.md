# Aidevix Audit Report

Date: 2026-04-07

Scope:
- Backend and frontend static review
- Basic command verification
- Repo token-efficiency setup for Codex

## Executive summary

The project has a workable feature surface, but several critical controls are either bypassed or intentionally disabled. The biggest risks are:
- Instagram subscription gating is effectively fake and can be bypassed.
- Frontend auth tokens are stored in `localStorage`, exposing sessions to XSS.
- Build-time quality gates are disabled, so broken TypeScript/ESLint can ship.
- Password reset and payment webhook flows are underprotected.
- Repo automation/scripts are inconsistent and can fail or cause destructive side effects.

## Findings

### Critical

1. Instagram verification is a hardcoded allow-path.
   Evidence:
   - `backend/utils/socialVerification.js:22`
   - `backend/utils/socialVerification.js:47`
   Impact:
   - Any user can unlock Instagram-gated flows by submitting almost any username.
   - Business rule enforcement around paid or gated content is not trustworthy.
   Recommendation:
   - Remove soft-approval from production paths.
   - Gate access only on verifiable signals.
   - If real verification is unavailable, mark the flow as manual review instead of auto-pass.

2. Subscription middleware fails open.
   Evidence:
   - `backend/middleware/subscriptionCheck.js:46`
   - `backend/middleware/subscriptionCheck.js:48`
   Impact:
   - External API failure or verification exceptions still allow protected video access.
   Recommendation:
   - Fail closed for protected content.
   - If product requires resilience, issue a temporary degraded-state response rather than granting access.

3. Tokens are stored in browser `localStorage`.
   Evidence:
   - `frontend/src/utils/tokenStorage.ts:6`
   - `frontend/src/utils/tokenStorage.ts:12`
   - `frontend/src/api/axiosInstance.ts:50`
   Impact:
   - Any XSS becomes account takeover.
   - Refresh token theft persists sessions beyond access-token expiry.
   Recommendation:
   - Move auth to `httpOnly`, `secure`, `sameSite` cookies.
   - Reduce refresh token exposure and rotate with revocation metadata.

4. Payment webhook handlers do not verify provider signatures/authenticity.
   Evidence:
   - `backend/controllers/paymentController.js:259`
   - `backend/controllers/paymentController.js:280`
   - `backend/controllers/paymentController.js:297`
   Impact:
   - An attacker can potentially forge webhook payloads and complete enrollments.
   Recommendation:
   - Validate Payme and Click signatures exactly per provider spec.
   - Reject unsigned or mismatched requests before business logic runs.

### High

5. Frontend production build ignores TypeScript and ESLint failures.
   Evidence:
   - `frontend/next.config.mjs:17`
   - `frontend/next.config.mjs:21`
   Impact:
   - Broken code can deploy silently.
   Recommendation:
   - Re-enable both checks and fix the resulting issues.

6. Password reset flow is weak.
   Evidence:
   - `backend/controllers/authController.js:256`
   - `backend/controllers/authController.js:277`
   - `backend/controllers/authController.js:293`
   Impact:
   - OTP is stored in clear form.
   - `resetPassword` does not enforce the same password policy as registration.
   - Reset token is signed with the access-token secret rather than a dedicated secret.
   Recommendation:
   - Hash reset codes in DB.
   - Re-validate new password strength.
   - Use a separate reset secret and invalidate previous reset state after verification.

7. Swagger auth falls back to default credentials outside production.
   Evidence:
   - `backend/middleware/swaggerAuth.js:33`
   - `backend/middleware/swaggerAuth.js:34`
   Impact:
   - Staging/dev deployments can expose docs behind guessable credentials.
   Recommendation:
   - Remove default credentials entirely.
   - Disable docs unless explicit env vars are present.

8. CORS policy is broader than expected for a protected product.
   Evidence:
   - `backend/index.js:66`
   - `backend/index.js:70`
   - `backend/index.js:72`
   Impact:
   - `*`, all `*.vercel.app`, private network IPs, and `null` origins increase attack surface.
   Recommendation:
   - Use a strict allowlist by environment.
   - Do not auto-allow `null` or broad preview domains in production.

9. Root `postinstall` references a missing script.
   Evidence:
   - `package.json:21`
   Impact:
   - Fresh installs can fail immediately.
   Recommendation:
   - Remove or replace `setup-protection.sh`.
   - Prefer platform-safe scripts for Windows/Linux CI.

10. Telegram subscription component uses the wrong token key and bypasses shared API client.
   Evidence:
   - `frontend/src/components/subscription/TelegramVerify.tsx:48`
   - `frontend/src/components/subscription/TelegramVerify.tsx:52`
   Impact:
   - Verification can fail even for logged-in users because app tokens are stored under different keys.
   - Duplicates auth logic outside `axiosInstance`.
   Recommendation:
   - Reuse `subscriptionApi` or `axiosInstance`.
   - Read tokens only through the shared storage/auth layer.

### Medium

11. Seed script is destructive and logs default admin credentials.
   Evidence:
   - `backend/seeders/seedCourses.js:785`
   - `backend/seeders/seedCourses.js:831`
   Impact:
   - Running the seed wipes course/project/video data.
   - Console leaks weak known credentials.
   Recommendation:
   - Add an explicit confirmation env guard for destructive seed runs.
   - Never print credentials; create admin only from env or one-time setup flow.

12. Backend can continue serving after DB connection failure.
   Evidence:
   - `backend/index.js:20`
   Impact:
   - Service may boot "healthy" while most requests fail later.
   Recommendation:
   - Block startup until DB is connected, or expose an unhealthy state and fail readiness checks.

13. `unhandledRejection` is logged but process is not terminated cleanly.
   Evidence:
   - `backend/index.js:289`
   Impact:
   - App may continue in undefined state after fatal async failures.
   Recommendation:
   - Log centrally, stop accepting traffic, and exit so the process supervisor can restart.

14. README and comments show encoding corruption.
   Evidence:
   - `README.md`
   - multiple files display mojibake in comments/output
   Impact:
   - Documentation quality drops and onboarding becomes harder.
   Recommendation:
   - Normalize all text files to UTF-8 without BOM and validate editor settings.

15. Mixed docs/context are outdated versus current stack.
   Evidence:
   - Existing `CLAUDE.md` still mentions Vite and React Router, while repo now uses Next.js app/pages mix.
   Impact:
   - Agents and contributors waste tokens and time on stale assumptions.
   Recommendation:
   - Keep one minimal current context file.

## Verification notes

- `node --check backend/index.js`: passed
- `frontend npm.cmd run build`: failed with `spawn EPERM` in this sandbox, so I could not fully validate production build
- `frontend npm.cmd run lint`: blocked by interactive first-time Next ESLint setup, which indicates lint is not fully configured
- `backend npm.cmd test`: no tests exist; script intentionally exits with error

## Important operational note

While verifying the repo, `backend npm.cmd run seed -- --help` still executed the real seeder because the script ignores `--help`. It connected to MongoDB and reseeded course/project/video data. That behavior itself is part of the audit problem and should be fixed.

## Recommended remediation order

1. Fix auth/session model: move tokens to cookies, lock down refresh/reset flows.
2. Remove fake Instagram verification and fail-open subscription behavior.
3. Add webhook signature validation for payment providers.
4. Re-enable TypeScript/ESLint build gates and fix actual errors.
5. Make install/seed scripts safe and cross-platform.
6. Tighten CORS and Swagger exposure by environment.
