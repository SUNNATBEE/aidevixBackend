# Aidevix Security Testing Checklist

Use this checklist for every major release and for any external tester engagement.

## 1) Authentication and Session

- [ ] Unauthenticated user cannot access protected pages (`/profile`, `/settings/security`, `/subscription`, `/admin`).
- [ ] API endpoints that require auth return `401/403` without a valid session.
- [ ] Login flow works only with correct credentials.
- [ ] Logout invalidates current session and user cannot continue using protected APIs.
- [ ] Password reset flow cannot be abused to reveal if an account exists (avoid user enumeration where possible).
- [ ] 2FA flow cannot be bypassed by directly calling post-login routes.
- [ ] Email verification flow cannot be bypassed via crafted requests.

## 2) Authorization (RBAC / Access Control)

- [ ] Regular user cannot access admin UI routes.
- [ ] Regular user cannot access admin API routes.
- [ ] User cannot read/update other user resources by replacing IDs (IDOR checks).
- [ ] Course/video progress endpoints only modify current user data.
- [ ] Prompt save/delete endpoints validate ownership.

## 3) Input Validation and Output Encoding

- [ ] All form fields validate server-side (not only frontend validation).
- [ ] HTML/script payloads are safely encoded and never executed (XSS checks).
- [ ] Long inputs (1k+ chars) do not crash UI or API.
- [ ] Invalid UTF-8 / unusual unicode payloads do not break parsing.
- [ ] Numeric fields reject non-numeric and out-of-range values.

## 4) API Abuse and Rate Limiting

- [ ] Auth endpoints (`/auth/*`) are rate-limited and return `429` on abuse.
- [ ] AI/coach endpoint is rate-limited and has timeout protection.
- [ ] Bug-report and contact flows are rate-limited.
- [ ] Retry headers (`Retry-After`) are present on throttled responses where applicable.
- [ ] Bursty requests from same IP/user are controlled.

## 5) File Upload Security

- [ ] Avatar upload enforces MIME/content type and size limits.
- [ ] Non-image payloads disguised as images are rejected.
- [ ] Uploaded filename/path traversal attempts are blocked.
- [ ] Large file upload cannot cause OOM or prolonged worker lock.
- [ ] Upload error messages do not expose server internals.

## 6) Browser Security Controls

- [ ] HTTPS enforced in production.
- [ ] Security headers present:
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
  - [ ] `Permissions-Policy` set minimally
- [ ] No sensitive secrets appear in frontend bundle or source maps.

## 7) Data Privacy and Sensitive Info

- [ ] API errors do not expose stack traces, file paths, or SQL details.
- [ ] User PII is only returned when necessary.
- [ ] Access tokens/refresh/session details are not leaked in logs.
- [ ] Public endpoints do not return private user metadata.

## 8) Performance and DoS Resilience

- [ ] High-frequency endpoint requests do not cause app crash.
- [ ] Expensive routes have fallback/timeout behavior.
- [ ] Build includes no severe perf regressions (LCP/INP/CLS monitored).
- [ ] Static assets are cacheable and CDN-friendly.

## 9) Frontend Integrity and UX Safety

- [ ] No critical console errors during normal user flow.
- [ ] Broken image URLs have fallback behavior.
- [ ] Long usernames/text do not break layout.
- [ ] Language switch does not leave mixed-language state.
- [ ] Modals/dropdowns remain readable (background/contrast sanity checks).

## 10) Observability and Incident Readiness

- [ ] Alerts configured for 401/403/429/5xx spikes.
- [ ] Request logs include route, status, latency, and source IP metadata.
- [ ] Basic incident runbook exists and is known by maintainer.
- [ ] Recent dependency upgrades reviewed for security advisories.

---

## Manual Test Payload Examples

Use these in forms where users can type text:

- `<script>alert(1)</script>`
- `"><img src=x onerror=alert(1)>`
- `../../../../etc/passwd`
- `${{7*7}}`
- `' OR 1=1 --`

Expected: payload stored/returned as plain text or rejected safely, never executed.

---

## Minimum Pass Criteria (Release Gate)

Release is blocked if any of the following fail:

1. Auth bypass
2. Admin access bypass
3. Stored/reflected XSS
4. Missing abuse controls on auth endpoints
5. Broken upload validation

