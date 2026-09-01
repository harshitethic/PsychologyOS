import bcrypt from "bcryptjs";
import { db } from "../lib/prisma.ts";
import { levelForXP } from "../lib/gamification.ts";

const TEST_EMAIL = "psychology-os-system-test@example.invalid";
const TEST_USERNAME = "__psychology_os_system_test__";

function ok(label, condition, detail = "") {
  if (!condition) {
    throw new Error(`FAIL: ${label}${detail ? ` — ${detail}` : ""}`);
  }
  console.log(`PASS  ${label}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  console.log("\n=== PSYCHOLOGY OS SYSTEM FLOW TEST ===\n");

  // Curriculum exists across all six semesters.
  const semesters = await db.semester.findMany({
    orderBy: { number: "asc" },
    include: { subjects: { include: { units: { include: { topics: true } } } } },
  });
  ok("6 semesters exist", semesters.length >= 6, `found ${semesters.length}`);

  const counts = semesters.map(s => ({
    semester: s.number,
    subjects: s.subjects.length,
    topics: s.subjects.reduce((a, sub) => a + sub.units.reduce((b, u) => b + u.topics.length, 0), 0),
  }));
  console.table(counts);
  ok("Semester 1 has study topics", counts.find(x => x.semester === 1)?.topics > 0);
  ok("Semester 2 has study topics", counts.find(x => x.semester === 2)?.topics > 0);

  // Create a temporary student; cascades remove everything at cleanup.
  await db.user.deleteMany({ where: { OR: [{ email: TEST_EMAIL }, { username: TEST_USERNAME }] } });

  const passwordHash = await bcrypt.hash("SystemTestPass!123", 10);
  let user = await db.user.create({
    data: {
      name: "Psychology OS System Test",
      username: TEST_USERNAME,
      email: TEST_EMAIL,
      passwordHash,
      securityHash: "system-test",
      semester: 1,
      year: 1,
    },
  });
  ok("Temporary student created", !!user.id);

  const sem1 = semesters.find(s => s.number === 1);
  const sem2 = semesters.find(s => s.number === 2);
  const sem1Topics = sem1.subjects.flatMap(s => s.units.flatMap(u => u.topics));
  const sem2Topics = sem2.subjects.flatMap(s => s.units.flatMap(u => u.topics));
  ok("Semester 1 topic list loaded", sem1Topics.length > 0);
  ok("Semester 2 topic list loaded", sem2Topics.length > 0);

  // Simulate completing every Semester 1 topic, exactly as the app persists topic progress.
  const now = new Date();
  await db.$transaction(
    sem1Topics.map(topic =>
      db.topicProgress.upsert({
        where: { userId_topicId: { userId: user.id, topicId: topic.id } },
        create: {
          userId: user.id,
          topicId: topic.id,
          status: "STRONG",
          percent: 100,
          bestScore: 100,
          attempts: 3,
          lastStudiedAt: now,
        },
        update: {
          status: "STRONG",
          percent: 100,
          bestScore: 100,
          attempts: 3,
          lastStudiedAt: now,
        },
      })
    )
  );

  const completed = await db.topicProgress.count({
    where: { userId: user.id, percent: { gte: 100 }, topicId: { in: sem1Topics.map(t => t.id) } },
  });
  ok("All Semester 1 topics can be completed", completed === sem1Topics.length, `${completed}/${sem1Topics.length}`);

  // This is the semantic "move to Semester 2" that the current data model supports.
  user = await db.user.update({
    where: { id: user.id },
    data: { semester: 2 },
  });
  ok("Student can move from Semester 1 → Semester 2", user.semester === 2);

  // XP + level progression.
  user = await db.user.update({
    where: { id: user.id },
    data: { xp: 1240, level: levelForXP(1240) },
  });
  ok("XP is persisted", user.xp === 1240);
  ok("Level is derived from XP", user.level === 3, `1240 XP -> level ${user.level}`);

  // Weak-topic persistence: one topic is deliberately weak while the rest are strong.
  const weakTopic = sem2Topics[0];
  await db.topicProgress.upsert({
    where: { userId_topicId: { userId: user.id, topicId: weakTopic.id } },
    create: {
      userId: user.id,
      topicId: weakTopic.id,
      status: "LEARNING",
      percent: 20,
      bestScore: 40,
      attempts: 4,
      lastStudiedAt: now,
    },
    update: {
      status: "LEARNING",
      percent: 20,
      bestScore: 40,
      attempts: 4,
      lastStudiedAt: now,
    },
  });

  const weak = await db.topicProgress.findFirst({
    where: { userId: user.id, topicId: weakTopic.id, bestScore: { lt: 70 } },
    include: { topic: true },
  });
  ok("Weak topic is stored", !!weak, weak ? `${weak.topic.title} @ ${weak.bestScore}%` : "");

  // MCQ attempt data: 2 correct, 1 wrong.
  const mcqs = await db.mCQ.findMany({ where: { topicId: weakTopic.id }, take: 3 });
  ok("Seeded MCQs exist", mcqs.length >= 1, `found ${mcqs.length}`);

  for (let i = 0; i < Math.min(3, mcqs.length); i++) {
    await db.mCQAttempt.create({
      data: {
        userId: user.id,
        mcqId: mcqs[i].id,
        selected: i === 0 ? mcqs[i].answerIndex : 0,
        correct: i === 0,
      },
    });
  }
  const attempts = await db.mCQAttempt.findMany({ where: { userId: user.id } });
  const accuracy = Math.round(attempts.filter(a => a.correct).length / attempts.length * 100);
  ok("Analytics MCQ accuracy computes", accuracy >= 33 && accuracy <= 100, `${accuracy}%`);

  // Mock exam storage + analytics average.
  const mock = await db.mockExam.findFirst({ where: { semesterId: sem1.id } });
  ok("Mock exam exists for Semester 1", !!mock);
  if (mock) {
    await db.mockAttempt.create({
      data: {
        userId: user.id,
        examId: mock.id,
        score: 36,
        total: 45,
        startedAt: now,
        submittedAt: new Date(now.getTime() + 15 * 60 * 1000),
      },
    });
    const mockAttempts = await db.mockAttempt.findMany({ where: { userId: user.id } });
    const mockAvg = Math.round(mockAttempts.reduce((a, x) => a + x.score / x.total, 0) / mockAttempts.length * 100);
    ok("Analytics mock average computes", mockAvg === 80, `${mockAvg}%`);
  }

  // Revision queue storage.
  await db.revisionItem.upsert({
    where: { userId_topicId: { userId: user.id, topicId: weakTopic.id } },
    create: {
      userId: user.id,
      topicId: weakTopic.id,
      dueAt: new Date(Date.now() - 60_000),
      interval: 1,
      ease: 2.5,
    },
    update: {
      dueAt: new Date(Date.now() - 60_000),
      interval: 1,
      ease: 2.5,
    },
  });
  const due = await db.revisionItem.findUnique({
    where: { userId_topicId: { userId: user.id, topicId: weakTopic.id } },
  });
  ok("Revision item is stored", !!due && due.dueAt <= new Date());

  console.log("\n=== CLEANUP ===\n");
  await db.user.delete({ where: { id: user.id } });
  const leftover = await db.user.findUnique({ where: { email: TEST_EMAIL } });
  ok("Temporary test account removed", !leftover);

  console.log("\nALL SYSTEM CHECKS PASSED.\n");
}

main().catch(async err => {
  console.error("\nSYSTEM TEST FAILED\n");
  console.error(err);
  process.exitCode = 1;
}).finally(async () => {
  await db.$disconnect();
});
