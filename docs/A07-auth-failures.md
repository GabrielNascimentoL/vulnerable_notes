# A07 — Authentication Failures

**Where:** `backend/src/utils/generateToken.ts`
**Flow:** Register (`POST /auth/register`) and Login (`POST /auth/login`)

---

## Context

The JWT issued after register/login is signed without an expiration.

```ts
// backend/src/utils/generateToken.ts
const JWT_SECRET = "secret123";

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET);
}
```

`jwt.sign()` is called without the `expiresIn` option. By default, `jsonwebtoken` does not expire tokens automatically — once issued, a token is valid forever (until the secret is rotated).

## PoC

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'
```

The returned `token` can be used in authenticated requests indefinitely — months or years later, with no re-login and no active-session check. If a token leaks (logs, XSS, a compromised device), the attacker gets permanent access to the account, with no expiration window forcing revalidation.

## Impact

A stolen token grants permanent account access, with no need to capture credentials again.

## Planned fix

Add an expiration.

```ts
jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
```

## Related note (A02)

`JWT_SECRET = "secret123"` is also hardcoded in source instead of an environment variable — covered separately in the **A02 — Security Misconfiguration** doc.

---

**Reference:** [OWASP Top 10:2025](https://owasp.org/Top10/)
