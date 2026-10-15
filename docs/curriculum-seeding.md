# Curriculum seeding without erasing learning history

`npm run db:seed` can initialize a new database and add curriculum resources to
an existing installation. Previously it deleted and recreated every MCQ and
flashcard. SQLite's foreign-key cascades also deleted their student attempts and
flashcard progress. Rebuilding mock-paper membership changed what an existing
paper represented.

## Preservation rules

- An identical flashcard or MCQ reuses the existing row, including legacy random
  IDs. New rows receive a deterministic ID derived from the topic and content.
- Question identity includes the options, correct answer, explanation and
  difficulty. A changed answer creates a new resource; it does not silently
  reinterpret an old attempt. The same applies to a changed flashcard answer.
- Resources omitted from the seed remain. Existing duplicate rows are also left
  intact because students may have history attached to either ID.
- A topic's resource additions commit in one transaction. Failure rolls back
  both cards and questions added in that transaction.
- A mock paper's questions are populated atomically only when the paper is
  empty. Existing question IDs and order are retained, even if a paper is
  partially populated. Retrying a failed initialization is safe.

This is an additive curriculum loader, not a complete content-versioning
system. Old and revised questions can both appear in practice. Correcting or
retiring published material requires a reviewed migration that preserves the
meaning of historical attempts; new exam compositions should use new paper IDs.
Topic notes and other curriculum metadata still receive their normal updates.

## Failure and operational boundaries

Run one seed process at a time during a maintenance window. Transactions cover
one topic's resources or one paper's membership, not the entire curriculum.
Earlier successful topics remain if a later topic fails; fix the cause and rerun.
No concurrent-writer guarantee, automatic busy retry or whole-seed rollback is
claimed. Back up an existing database before deployment or curriculum changes.
Do not use `prisma db push --force-reset` to update an installation with users.

This fix prevents future cascaded deletions. It cannot recover attempts already
deleted by an older seed; recovery requires an earlier backup.

## Reproduce the verification

```bash
npm ci
npx prisma generate
npm run test:seed-preservation
```

The test creates its own temporary SQLite file and explicitly supplies that
database URL to Prisma and every seed subprocess. It never uses the development
or production database and removes only its temporary directory afterward.

It runs the actual complete curriculum seed, attaches synthetic student history
to legacy IDs, runs two more seeds, and compares resource IDs, quiz attempts,
flashcard progress, topic progress, mock attempts and paper membership. It also
checks changed/omitted content, duplicate inputs, a SQLite-triggered insertion
failure after a card write, an invalid paper foreign key, retry behavior and
SQLite integrity/foreign-key checks. These cases run in CI with the production
build, type checks, dependency regressions, admin setup and health checks.
