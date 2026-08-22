# A07 — Authentication Failures

**Where:** `backend/src/utils/generateToken.ts`, `backend/src/controllers/AuthController.ts`
**Flow:** Register (`POST /auth/register`) and Login (`POST /auth/login`)

---

## Part 1 — JWT without expiration

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

## Part 2 — No lockout after repeated failed login attempts

```ts
// backend/src/controllers/AuthController.ts
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await loginUser(email, password);
      return res.status(200).json(user);
    } catch (error) {
       if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
    }
}
```

`login` has no concept of attempt count. Every request is evaluated independently — there's no counter per email/IP, no lockout, no delay after repeated failures. Combined with the weak MD5 hashing from [A04](A04-crypto-failures.md), this makes the endpoint viable for online brute-force or credential-stuffing attacks: an attacker can fire unlimited login requests per second with no penalty.

### PoC

```bash
for i in $(seq 1 1000); do
  curl -s -X POST http://localhost:4000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@test.com","password":"guess'"$i"'"}'
done
```

Nothing in the API slows this down, blocks the IP, or locks the account after N failures — the loop above runs at full speed until a correct guess lands or the script stops.

### Impact

Weak or common passwords can be brute-forced online, with no friction at all. Combined with A09's missing logging (below), these attempts also leave no trace.

### Planned fix

Add a rate limiter (e.g. `express-rate-limit`) scoped to the login route, and/or an account lockout after N consecutive failures within a time window, with exponential backoff or a temporary cooldown.

## Related note (A02)

`JWT_SECRET = "secret123"` is also hardcoded in source instead of an environment variable — covered separately in the **A02 — Security Misconfiguration** doc.

---

**Reference:** [OWASP Top 10:2025](https://owasp.org/Top10/)
