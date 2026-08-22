# A02 — Security Misconfiguration

**Status:** partial — more items will be added as they're implemented (helmet, CORS, debug routes).

---

## Hardcoded JWT secret

**Where:** `backend/src/utils/generateToken.ts`

```ts
const JWT_SECRET = "secret123";
```

The signing secret is a literal string in source code instead of coming from an environment variable.

### Impact

- The secret is exposed to anyone with read access to the repository (including public repos, forks, or leaked source).
- Since the same secret is used across all environments (dev, staging, prod would all share it if deployed as-is), a leak anywhere compromises token signing everywhere.
- Anyone with the secret can forge valid JWTs for any `userId`, fully bypassing authentication.

### PoC

With the secret known (it's in this repo), a valid token for any user can be forged without ever logging in:

```js
const jwt = require("jsonwebtoken");
const forgedToken = jwt.sign({ userId: "any-uuid-here" }, "secret123");
// forgedToken is accepted by any endpoint that trusts this secret
```

### Planned fix

Move the secret to an environment variable, generated per environment and never committed:

```ts
const JWT_SECRET = process.env.JWT_SECRET!;
```

---

**Reference:** [OWASP Top 10:2025](https://owasp.org/Top10/)
