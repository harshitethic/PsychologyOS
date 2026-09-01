import { db } from "./prisma";
import { levelForXP } from "./gamification";

export const XP = {
  MCQ_CORRECT: 10,
  MCQ_WRONG: 2,
  MOCK_CORRECT: 8,
  MOCK_WRONG: 2,
};

export function masteryPercent(scorePercent: number) {
  if (scorePercent >= 90) return 100;
  if (scorePercent >= 80) return 90;
  if (scorePercent >= 70) return 75;
  if (scorePercent >= 50) return 55;
  return 25;
}

export async function awardXP(userId: string, amount: number) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { xp: true } });
  if (!user) throw new Error("User not found");

  const xp = Math.max(0, user.xp + amount);
  return db.user.update({
    where: { id: userId },
    data: { xp, level: levelForXP(xp), lastActiveAt: new Date() },
    select: { xp: true, level: true },
  });
}

export async function upsertTopicResult(userId: string, topicId: string, scorePercent: number) {
  const percent = masteryPercent(scorePercent);
  const existing = await db.topicProgress.findUnique({
    where: { userId_topicId: { userId, topicId } },
  });
  const bestScore = Math.max(existing?.bestScore ?? 0, scorePercent);
  const nextPercent = Math.max(existing?.percent ?? 0, percent);
  const status = bestScore >= 90 ? "STRONG" : bestScore >= 70 ? "REVIEW" : "LEARNING";

  const progress = await db.topicProgress.upsert({
    where: { userId_topicId: { userId, topicId } },
    create: {
      userId, topicId, percent: nextPercent, bestScore,
      attempts: 1, status, lastStudiedAt: new Date(),
    },
    update: {
      percent: nextPercent, bestScore,
      attempts: { increment: 1 }, status, lastStudiedAt: new Date(),
    },
  });

  if (bestScore < 90) {
    const interval = bestScore < 50 ? 1 : bestScore < 70 ? 2 : 4;
    await db.revisionItem.upsert({
      where: { userId_topicId: { userId, topicId } },
      create: {
        userId, topicId,
        dueAt: new Date(Date.now() + interval * 86400000),
        interval, ease: bestScore < 50 ? 2.2 : 2.5,
      },
      update: {
        dueAt: new Date(Date.now() + interval * 86400000),
        interval,
      },
    });
  } else {
    await db.revisionItem.deleteMany({ where: { userId, topicId } });
  }

  return progress;
}

export async function maybePromoteSemester(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { semester: true },
  });
  if (!user?.semester) return null;

  const currentSemester = await db.semester.findFirst({
    where: { number: user.semester },
    include: {
      subjects: {
        include: {
          units: { include: { topics: { select: { id: true } } } },
        },
      },
    },
  });
  if (!currentSemester) return null;

  const topicIds = currentSemester.subjects.flatMap(s =>
    s.units.flatMap(u => u.topics.map(t => t.id))
  );
  if (!topicIds.length) return null;

  const mastered = await db.topicProgress.count({
    where: { userId, topicId: { in: topicIds }, percent: { gte: 100 } },
  });
  if (mastered < topicIds.length) return null;

  const next = await db.semester.findFirst({
    where: { number: user.semester + 1, yearId: currentSemester.yearId },
    select: { number: true },
  });
  if (!next) return { completed: true, advanced: false, semester: user.semester };

  await db.user.update({
    where: { id: userId },
    data: { semester: next.number, lastActiveAt: new Date() },
  });
  return { completed: true, advanced: true, semester: next.number };
}
