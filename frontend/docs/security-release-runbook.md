# Security Release Runbook

This is the release-time security workflow for Aidevix frontend.

## A) Pre-Release (Required)

1. Run local quality gates:
   - `npm run lint`
   - `npm run build`
2. Run through `security-testing-checklist.md`.
3. Confirm no unresolved Critical/High findings.
4. Validate key flows manually:
   - login/logout
   - register + verification
   - profile update + avatar upload
   - prompts/coach interaction
5. Review console and network for repeated errors:
   - unexpected `401/403` on public pages
   - repeated `404` assets
   - unhandled `500` responses

## B) Go/No-Go Decision

Release is **No-Go** if:
- Any auth/authorization bypass exists
- Any exploitable XSS exists
- Upload validation is broken
- Auth endpoints have no abuse controls

## C) Post-Release Monitoring (First 2 Hours)

Monitor:
- 401/403/429/5xx rates
- latency spikes
- top failing endpoints

If anomalies spike:
1. Enable stricter temporary rate limits
2. Disable non-critical high-cost features if needed
3. Announce incident status internally

## D) Incident Response (Short Playbook)

1. Identify attack vector (route/IP pattern/user-agent).
2. Add temporary block/limit rules.
3. Verify service recovery.
4. Create incident note:
   - root cause
   - timeline
   - impact
   - permanent fix

## E) After Action

- Convert incidents into regression checks.
- Update `security-testing-checklist.md`.
- Track recurring patterns for proactive hardening.

