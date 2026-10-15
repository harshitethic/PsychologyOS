# Atomic quiz and mock-exam submissions

## Failure reproduced

The original quiz handler wrote an attempt, updated mastery and revision data,
then awarded XP in separate database operations. A SQLite trigger rejecting the
last XP update left the earlier attempt and progress committed even though the
HTTP request failed. Mock-exam submission had the same partial-write behavior.

Concurrent quiz requests also performed a read/modify/write on XP without a
shared transaction. A real eight-request HTTP reproduction began at 490 XP and
finished at 528, although four correct and four incorrect answers should have
produced 538. Missing quiz answers were silently coerced to option zero; malformed
mock answer entries could produce a server error.

## Commit boundary

Both submission handlers now run their database reads and writes inside one
Prisma interactive transaction on SQLite. Attempts, per-topic mastery, revision
schedules, XP, levels and semester promotion commit together. The shared reward
and promotion helpers require the transaction client so they do not accidentally
write through a separate database connection. HTTP success is returned only
after the transaction completes.

The transaction has a five-second acquisition budget and a five-second execution
budget. A database/transaction failure returns a generic HTTP 503. Nothing from
the database exception is reflected to the caller. Invalid answer indexes or
malformed bodies return 400; unknown questions/exams return 404. Mock submissions
reject unknown and duplicate question IDs while retaining the UI's `-1` marker
for unanswered questions and the existing treatment of omitted questions.

## Executable evidence

```bash
npm ci
npm run build
npm run test:http-auth
```

The production HTTP suite uses an owned temporary SQLite database. In addition
to authentication checks, it verifies:

- Missing, null, string, fractional, negative and out-of-range quiz selections
  cause no learning-data writes.
- A trigger-injected reward failure rolls back new attempts, topic progress and
  revision rows; retry after removing the trigger commits once and earns only
  the expected reward.
- Eight simultaneous quiz requests preserve all attempts, accumulate the exact
  XP total, cross the level threshold correctly and cannot downgrade mastery.
- Invalid, duplicate and unknown mock answers leave records unchanged.
- A late mock-exam reward failure rolls back the entire submission; a later
  all-unanswered paper still follows the existing scoring/reward contract.
- Concurrent quiz and mock submissions retain their combined reward total,
  attempt counts and derived level.

These are correctness tests with small fixtures, not a throughput benchmark or
evidence of multi-host database scalability. Authentication's `lastActiveAt`
update happens before the transaction and is intentionally not rolled back.

## Remaining boundaries

Successful submissions are not idempotent: a client retry after losing a success
response can create another attempt and reward. An idempotency-key contract and
UI integration are separate work. The current practice reward model also permits
repeated answers and rewards unanswered mock questions; this change preserves
that behavior rather than defining anti-abuse policy. SQLite lock contention can
still produce a retryable 503. Browser/reverse-proxy behavior, load testing,
promotion policy and independent security review remain distinct verification
tasks. No schema change or production database mutation is needed for this fix.
