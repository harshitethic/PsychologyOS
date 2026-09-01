import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { awardXP, masteryPercent, maybePromoteSemester, XP } from "@/lib/learningEngine";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const mcqId = String(body.mcqId || "");
  const selected = Number.isInteger(body.selected) ? Number(body.selected) : 0;
  if (!mcqId) return NextResponse.json({ error: "mcqId is required." }, { status: 400 });

  const mcq = await db.mCQ.findUnique({
    where: { id: mcqId },
    select: { id: true, topicId: true, answerIndex: true },
  });
  if (!mcq) return NextResponse.json({ error: "Question not found." }, { status: 404 });

  const correct = selected === mcq.answerIndex;

  await db.mCQAttempt.create({
    data: { userId: user.id, mcqId: mcq.id, selected, correct },
  });

  const old = await db.topicProgress.findUnique({
    where: { userId_topicId: { userId: user.id, topicId: mcq.topicId } },
  });

  const best = Math.max(old?.bestScore ?? 0, correct ? 100 : 0);
  const topicPercent = masteryPercent(best);

  await db.topicProgress.upsert({
    where: { userId_topicId: { userId: user.id, topicId: mcq.topicId } },
    create: {
      userId: user.id, topicId: mcq.topicId,
      percent: topicPercent, bestScore: best,
      attempts: 1, status: best >= 90 ? "STRONG" : "LEARNING",
      lastStudiedAt: new Date(),
    },
    update: {
      percent: { set: Math.max(old?.percent ?? 0, topicPercent) },
      bestScore: { set: best },
      attempts: { increment: 1 },
      status: best >= 90 ? "STRONG" : "LEARNING",
      lastStudiedAt: new Date(),
    },
  });

  if (best < 90) {
    await db.revisionItem.upsert({
      where: { userId_topicId: { userId: user.id, topicId: mcq.topicId } },
      create: {
        userId: user.id, topicId: mcq.topicId,
        dueAt: new Date(Date.now() + (best < 50 ? 1 : 3) * 86400000),
        interval: best < 50 ? 1 : 3, ease: 2.3,
      },
      update: {
        dueAt: new Date(Date.now() + (best < 50 ? 1 : 3) * 86400000),
        interval: best < 50 ? 1 : 3,
      },
    });
  } else {
    await db.revisionItem.deleteMany({
      where: { userId: user.id, topicId: mcq.topicId },
    });
  }

  const xp = await awardXP(user.id, correct ? XP.MCQ_CORRECT : XP.MCQ_WRONG);
  const promotion = await maybePromoteSemester(user.id);

  return NextResponse.json({
    ok: true, correct, topicPercent,
    xp: xp.xp, level: xp.level, promotion,
  });
}
