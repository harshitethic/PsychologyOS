# Production HTTP authentication verification

## Reproduced defects

Real requests against the built Next.js production handler showed that a copied
admin cookie remained authorized after password rotation and account deletion.
The old signature covered only username and expiry. An attacker retaining a
cookie could therefore keep administering users until its eight-hour expiry.
A malformed multibyte MAC also passed a character-length check and caused
`timingSafeEqual` to throw because the byte lengths differed, returning HTTP 500.

Admin cookies now authenticate a versioned payload bound to the current account
ID and stored password hash. Neither the ID nor password hash is exposed in the
cookie. Every protected admin request reads the current account before verifying
the signature. Password changes invalidate previous tokens, and recreating an
account with the same username/hash does not revive the old account's tokens.
Signatures must have the exact hexadecimal encoding emitted by the signer.
The parser also supports dots in usernames, as the credential setup permits.

Password rotation uses a conditional database update against the password hash
that was just verified. Two concurrent requests cannot both successfully replace
the same credentials and overwrite each other's newly chosen password.

## Reproduce locally

```bash
npm ci
npm run build
npm run test:http-auth
```

The test creates a disposable SQLite database, pushes the schema there, runs the
real curriculum seed, creates synthetic students and starts the production
request handler on an OS-assigned loopback TCP port. Every database client and
subprocess receives that temporary database URL explicitly. It checks real HTTP
status codes, cookie attributes and persisted records, without contacting an AI
provider or using an existing database. Cleanup terminates the owned server and
removes only the owned temporary directory.

Seven scenarios cover:

1. Missing sessions and incorrect credentials cannot mutate records.
2. Student profile and question attempts use the authenticated identity despite
   a submitted alternate user ID; student cookies do not authorize admin routes.
3. Admin login and immediate rejection of a banned student's existing session.
4. Malformed multibyte cookie signatures return 401 rather than 500.
5. Password rotation rejects copied cookies on all three protected admin APIs;
   the old password fails and the replacement password works.
6. Competing password changes have one winner; the losing password is not saved.
7. Account deletion and recreation cannot revive an outstanding session.

The CI production build is followed by this test. The test explicitly sends
cookies over loopback to exercise server authorization, while asserting the
production `Secure`, `HttpOnly` and `SameSite` attributes. It does not simulate a
browser's HTTPS cookie transport, cross-site behavior or reverse proxy.

The same HTTP harness also runs six [learning transaction scenarios](learning-transactions.md),
covering input validation, injected rollback/retry and concurrent quiz/mock
submissions. Together these are 13 scenarios (14 Node test reports including
their parent).

## Deployment and remaining boundaries

No schema migration is needed. Deploying this change invalidates existing admin
cookies; administrators must sign in again. Reverting the code restores the old
session weaknesses, so a rollback must also rotate `ADMIN_SESSION_SECRET` to
invalidate legacy cookies. Never restore an old signing secret as part of that
rollback. No production deployment or live data operation was performed to
verify this change.

This is still a single configured admin account. It is not a session inventory,
per-device revocation system or MFA implementation. Logout clears the browser
cookie; it does not independently revoke a stolen copy. Password rotation or
signing-secret rotation revokes those copies. A request already authorized
before rotation/deletion may finish; this does not provide transactional
revocation of every in-flight write. Student password-reset/session revocation,
shared rate limiting, trusted proxy handling and abuse controls remain separate
work. The existing login bootstrap can recreate a missing admin account from
configured credentials; deleting its row alone is not permanent disablement.
