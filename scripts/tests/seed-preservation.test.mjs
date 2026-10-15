import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { PrismaClient } from "@prisma/client";
import { ensureMockQuestions, ensureTopicResources } from "../../prisma/seed-resources.ts";

test("curriculum seeding preserves learning history in real SQLite", { timeout: 180_000 }, async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "psychology-seed-test-"));
  const url = `file:${path.join(root, "fixture.db")}`;
  const env = { ...process.env, DATABASE_URL: url };
  const db = new PrismaClient({ datasourceUrl: url });
  const run = (args) => {
    const result = spawnSync(process.execPath, args, { env, encoding: "utf8", timeout: 90_000 });
    assert.equal(result.error, undefined, result.error?.message);
    assert.equal(result.status, 0, result.stderr + result.stdout);
  };
  const seed = () => run(["--import", "tsx", "prisma/seed.ts"]);
  try {
    await writeFile(path.join(root, "fixture.db"), "", { flag: "wx" });
    run(["node_modules/prisma/build/index.js", "db", "push", "--skip-generate"]);
    seed();
    const question = await db.mCQ.findFirstOrThrow();
    const card = await db.flashcard.findFirstOrThrow({ where: { topicId: question.topicId } });
    // Existing installations have random IDs, not the new deterministic IDs.
    // Rename two rows before attaching history to simulate such a database.
    const legacyQuestion = await db.mCQ.update({ where: { id: question.id }, data: { id: "legacy-question-id" } });
    const legacyCard = await db.flashcard.update({ where: { id: card.id }, data: { id: "legacy-flashcard-id" } });
    const user = await db.user.create({ data: {
      name: "Seed preservation fixture", username: "seed-fixture", email: "seed@example.invalid",
      passwordHash: "synthetic-unused-hash", securityHash: "synthetic-unused-hash",
    } });
    await db.mCQAttempt.create({ data: { userId: user.id, mcqId: legacyQuestion.id, selected: 0, correct: true } });
    await db.flashcardProgress.create({ data: { userId: user.id, flashcardId: legacyCard.id, state: "KNOWN", seenCount: 7 } });
    await db.topicProgress.create({ data: { userId: user.id, topicId: question.topicId, percent: 75, attempts: 3 } });
    const exam = await db.mockExam.findFirstOrThrow();
    await db.mockAttempt.create({ data: { userId: user.id, examId: exam.id, score: 30, total: 45, startedAt: new Date("2026-01-01") } });

    const snapshot = async () => ({
      questions: await db.mCQ.findMany({ orderBy: { id: "asc" } }),
      cards: await db.flashcard.findMany({ orderBy: { id: "asc" } }),
      examQuestions: await db.mockQuestion.findMany({ orderBy: { id: "asc" } }),
      attempts: await db.mCQAttempt.findMany({ where: { userId: user.id } }),
      cardsProgress: await db.flashcardProgress.findMany({ where: { userId: user.id } }),
      topicsProgress: await db.topicProgress.findMany({ where: { userId: user.id } }),
      mockAttempts: await db.mockAttempt.findMany({ where: { userId: user.id } }),
    });
    const before = await snapshot();
    assert.equal(await db.mockExam.count(), 30, "all six semesters have five papers");
    assert.ok(before.examQuestions.length > 0);
    await t.test("repeated full seeds preserve legacy IDs, resources and history", async () => {
      seed();
      const after = await snapshot();
      assert.deepEqual(after.attempts, before.attempts, "reseed must not erase quiz attempts");
      assert.deepEqual(after.cardsProgress, before.cardsProgress, "reseed must not erase flashcard progress");
      assert.deepEqual(after, before, "all resource identities, exam membership and history must survive");
      seed();
      assert.deepEqual(await snapshot(), before, "a second reseed must remain idempotent");
    });

    await t.test("changed and omitted content retains historical meanings without duplicates", async () => {
      const revisedQuestion = {
        question: legacyQuestion.question, options: legacyQuestion.options,
        answerIndex: (legacyQuestion.answerIndex + 1) % legacyQuestion.options.length,
        explanation: "Revised fixture explanation", difficulty: legacyQuestion.difficulty,
      };
      const revisedCard = [legacyCard.front, "Revised fixture answer"];
      await ensureTopicResources(db, question.topicId, [revisedCard, revisedCard], [revisedQuestion, revisedQuestion]);
      assert.equal(await db.mCQ.count(), before.questions.length + 1);
      assert.equal(await db.flashcard.count(), before.cards.length + 1);
      assert.deepEqual(await db.mCQ.findUnique({ where: { id: legacyQuestion.id } }), legacyQuestion);
      assert.deepEqual(await db.flashcard.findUnique({ where: { id: legacyCard.id } }), legacyCard);
      const added = await snapshot();
      await ensureTopicResources(db, question.topicId, [revisedCard], [revisedQuestion]);
      await ensureTopicResources(db, question.topicId, [], []);
      await ensureMockQuestions(db, exam.id, [legacyQuestion.id]);
      assert.deepEqual(await snapshot(), added, "omission and rerun cannot erase or reinterpret history");
      assert.deepEqual(added.attempts, before.attempts);
      assert.deepEqual(added.cardsProgress, before.cardsProgress);
      assert.deepEqual(added.examQuestions, before.examQuestions);
    });

    await t.test("a failed topic update rolls back flashcards inserted before the failure", async () => {
      await db.$executeRawUnsafe(`CREATE TRIGGER reject_fixture_question BEFORE INSERT ON MCQ
        WHEN NEW.question = 'Injected seed failure' BEGIN SELECT RAISE(ABORT, 'seed failure fixture'); END`);
      const beforeFailure = await snapshot();
      try {
        await assert.rejects(ensureTopicResources(db, question.topicId, [["Uncommitted card", "Must roll back"]], [{
          question: "Injected seed failure", options: ["A", "B"], answerIndex: 0,
          explanation: "Failure fixture", difficulty: "medium",
        }]));
        assert.deepEqual(await snapshot(), beforeFailure, "no partial topic resources should survive");
      } finally {
        await db.$executeRawUnsafe("DROP TRIGGER reject_fixture_question");
      }
    });

    await t.test("a failed paper initialization is atomic and can be retried", async () => {
      const paper = await db.mockExam.create({ data: {
        id: "fixture-paper", title: "Transaction fixture", semesterId: exam.semesterId,
      } });
      await assert.rejects(ensureMockQuestions(db, paper.id, [legacyQuestion.id, "missing-mcq-fixture"]));
      assert.equal(await db.mockQuestion.count({ where: { examId: paper.id } }), 0);
      await ensureMockQuestions(db, paper.id, [legacyQuestion.id, legacyQuestion.id]);
      const membership = await db.mockQuestion.findMany({ where: { examId: paper.id } });
      assert.equal(membership.length, 1);
      assert.equal(membership[0].order, 1);
      await ensureMockQuestions(db, paper.id, []);
      assert.deepEqual(await db.mockQuestion.findMany({ where: { examId: paper.id } }), membership);
    });

    const integrity = await db.$queryRawUnsafe("PRAGMA integrity_check");
    assert.deepEqual(integrity, [{ integrity_check: "ok" }]);
    assert.deepEqual(await db.$queryRawUnsafe("PRAGMA foreign_key_check"), []);
  } finally {
    await db.$disconnect();
    await rm(root, { recursive: true, force: true });
  }
});
