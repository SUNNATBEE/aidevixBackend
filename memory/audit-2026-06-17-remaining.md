---
name: audit-2026-06-17-remaining
description: Full-project audit on 2026-06-17 — what was fixed and what remains deferred (needs manual/breaking work)
metadata:
  type: project
---

Full multi-agent audit run on 2026-06-17 (backend + frontend: security, performance, api-design, frontend a11y, SEO, dependencies). ~49 findings; 0 critical-severity code bugs. Frontend `next build` verified green after all changes (Next 14.2.35, swiper@12).

**Fixed this run:** AUTO (.lean(), Promise.all parallel count+find, validateObjectId on admin/session/payment/spaced-rep routes, err.message leak→generic in upload/payme/prompt/challenge/user controllers, auth-form a11y labels+aria, Navbar aria-expanded/inert, manifest→/manifest.json, engines+license, untrack scratch). CONFIRMED+applied: SEC-004 Click payment status guard, API-008 atomic likePrompt, added DB indexes (Video text+{course,order}, UserStats.skills, Payment{status,createdAt}), SEO-008 restricted next/image remotePatterns to known hosts, SEO-009 raw img→next/image, SEO-007 hreflang trim, FE-007/008 accessible dialogs (Escape+focus+role), removed dead deps (scichart/flag-icons/pdfkit/mongodb/@studio-freight/react-lenis→lenis), bumped next^14.2.35 + swiper^12, committed lockfiles (removed from .gitignore), added CI workflow + typecheck/check scripts.

**Deferred — still needs work:**
- **DEP-004**: `frontend/tsconfig.json` still has `noCheck:true`. Removing it surfaces **123 type errors** (mostly `target:es5` Map-iteration + unguarded `useSearchParams()` null). Plan: bump target→es2017, add null guards incrementally, then drop noCheck. Until then `npm run typecheck` is a no-op and CI typecheck step won't catch regressions.
- **Backend cloudinary CVE (high)**: requires cloudinary v1→v3 major upgrade (breaking — uploadController + multer-storage-cloudinary API change). Not forced. Dev-only jest/babel transitive CVEs remain too.
- **PERF-001**: `UserStats.xpAwardedVideos` unbounded embedded array → move to dedicated `VideoXpAward` collection (needs data migration; not auto-applied to protect prod XP data).
- **API-001 (broader)**: many other controllers still catch+return err.message; only prompt/challenge/user gated this run. Ideal: route all to central errorMiddleware via next(err).
- **API-004/005**: inconsistent pagination envelope + no /api/v1 versioning (breaking for clients).
- **SEO-002/003**: fonts double-loaded (next/font + self-hosted) and shipped as uncompressed .ttf (need woff2 conversion — binary tooling).
- **SEO-004**: course detail page fully client-rendered (duplicate fetch, poor LCP) — refactor to use layout's server fetch.
- **SEO-005/006**: OG image + PWA/apple icons are one JPEG (need generated 1200x630 PNG OG card + proper 192/512/maskable/180 PNG icons).
- **SEO-010**: twitter:site/creator handle not added (real X handle unknown).

Audit artifacts (gitignored): `.audit/findings/*.json` (today's: security, performance, api-design, frontend, seo, dependencies), `.audit/fixes/*.json`.
