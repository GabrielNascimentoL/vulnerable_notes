# A05 — Injection (SQL Injection)

**Where:** `backend/src/repositories/NoteRepository.ts`
**Flow:** Note search (`GET /notes/search?q=`)

---

## Context

The search endpoint builds its SQL by concatenating the raw query string into a `LIKE` clause, instead of parameterizing it:

```ts
// backend/src/repositories/NoteRepository.ts
export async function searchByTitle(query: string): Promise<Note[]> {
  const result = await db.execute(
    sql.raw(`SELECT id, user_id, title, body, created_at FROM notes WHERE title LIKE '%${query}%'`),
  );
  return result.rows as unknown as Note[];
}
```

`sql.raw()` is Drizzle's escape hatch out of parameterized queries — everywhere else in this codebase, `sql\`...\`` with template interpolation is used, which binds values as real query parameters (see [A01](A01-broken-access-control.md)'s and the auth repository's queries for the safe pattern). Here, the search query goes through `sql.raw()` with plain string interpolation instead, so anything the client sends in `q` becomes literal SQL.

This is also missing the ownership filter that `findAllByUserId` has — search results aren't scoped to the authenticated user at all, so even a syntactically valid, non-malicious search can return other users' notes. The injection just makes that worse.

## PoC

A normal search:

```bash
curl -s -G http://localhost:3002/notes/search \
  -H "Authorization: Bearer <token>" \
  --data-urlencode "q=Grocery"
```

The injection, closing the `LIKE` pattern and appending an always-true condition:

```bash
curl -s -G http://localhost:3002/notes/search \
  -H "Authorization: Bearer <token>" \
  --data-urlencode "q=x% OR 1=1 --"
```

This resolves to:

```sql
SELECT id, user_id, title, body, created_at FROM notes WHERE title LIKE '%x%' OR 1=1 --%'
```

The `--` comments out the trailing `%'`, and `OR 1=1` makes every row match regardless of title. Verified during development: an authenticated user with zero notes of their own got back every note in the table, across every user, from a single request.

A naive `' OR '1'='1` (the textbook SQLi payload) does **not** work here — the surrounding `LIKE '%...%'` means the injected `'1'='1'` needs to close the `LIKE` pattern correctly and use a numeric/boolean condition (`OR 1=1`) rather than a string comparison, or it silently fails to match anything. This is a useful detail for the writeup: the classic payload doesn't always transfer directly, the injection has to fit the exact SQL shape it's landing in.

## Impact

Full read access to the `notes` table regardless of ownership, bypassing authentication-based access control entirely for this endpoint. With a more privileged database user or a richer schema, the same class of bug enables writing (`UPDATE`/`DELETE` via stacked queries, depending on driver support) or reading from other tables entirely (`UNION SELECT` against `users`, exposing password hashes).

## Planned fix

Parameterize the query instead of interpolating into raw SQL:

```ts
sql`SELECT id, user_id, title, body, created_at FROM notes WHERE title LIKE ${'%' + query + '%'}`
```

The `%` wildcards are built in JS and passed as a single bound parameter, so the driver escapes the value correctly no matter what it contains. Also add the missing `user_id` filter, so search results are scoped to the authenticated user like the rest of the notes endpoints.

---

**Reference:** [OWASP Top 10:2025](https://owasp.org/Top10/)
