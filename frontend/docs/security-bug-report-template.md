# Security Bug Report Template

Copy this template for every finding.

## 1. Title

Short clear title (example: "IDOR: user can read another profile by changing user ID").

## 2. Severity

Choose one:
- Critical
- High
- Medium
- Low

## 3. Area

Choose one:
- Auth
- Authorization/RBAC
- API
- Frontend/XSS
- Upload
- Infrastructure/Rate limit
- Privacy/Data leak
- Performance/DoS

## 4. Environment

- URL:
- Browser:
- Device/OS:
- Account role (guest/user/admin):
- Build version/commit (if known):

## 5. Preconditions

List required conditions before reproducing.

## 6. Steps to Reproduce

1.
2.
3.

## 7. Expected Result

What should happen.

## 8. Actual Result

What actually happened.

## 9. Evidence

- Screenshot(s):
- Video (optional):
- Network request(s):
  - Method:
  - URL:
  - Status:
  - Request body (sanitize secrets):
  - Response body (sanitize secrets):

## 10. Security Impact

Describe real impact:
- Account takeover?
- Data leak?
- Privilege escalation?
- Service degradation?

## 11. Scope

Who is affected:
- Single user
- Any authenticated user
- Any visitor
- Admin only

## 12. Suggested Fix

Short technical recommendation.

## 13. Regression Tests

What tests should be added to prevent recurrence.

