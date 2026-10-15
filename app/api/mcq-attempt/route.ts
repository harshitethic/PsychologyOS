import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { awardXP, masteryPercent, maybePromoteSemester, XP } from "@/lib/learningEngine";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid answer request." }, { status: 400 });
  }
  const mcqId = String(body.mcqId || "");
  const selected = body.selected;
  if (!Number.isInteger(selected) || selected < 0) {
    return NextResponse.json({ error: "A valid answer index is required." }, { status: 400 });
  }
  if (!mcqId) return NextResponse.json({ error: "mcqId is required." }, { status: 400 });

  try {
    // Commit the attempt, mastery, revision schedule, rewards and promotion as
    // one unit. Returning a response waits for the transaction to commit.
    return await db.$transaction(async (tx) => {
      const mcq = await tx.mCQ.findUnique({
        where: { id: mcqId },
        select: { id: true, topicId: true, answerIndex: true, options: true },
      });
      if (!mcq) return NextResponse.json({ error: "Question not found." }, { status: 404 });

      if (!Array.isArray(mcq.options) || selected >= mcq.options.length) {
        return NextResponse.json({ error: "A valid answer index is required." }, { status: 400 });
      }
      const correct = selected === mcq.answerIndex;

      await tx.mCQAttempt.create({
        data: { userId: user.id, mcqId: mcq.id, selected, correct },
      });

      const old = await tx.topicProgress.findUnique({
        where: { userId_topicId: { userId: user.id, topicId: mcq.topicId } },
      });

      const best = Math.max(old?.bestScore ?? 0, correct ? 100 : 0);
      const topicPercent = masteryPercent(best);

      await tx.topicProgress.upsert({
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
        await tx.revisionItem.upsert({
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
        await tx.revisionItem.deleteMany({
          where: { userId: user.id, topicId: mcq.topicId },
        });
      }

      const xp = await awardXP(user.id, correct ? XP.MCQ_CORRECT : XP.MCQ_WRONG, tx);
      const promotion = await maybePromoteSemester(user.id, tx);

      return NextResponse.json({
        ok: true, correct, topicPercent,
        xp: xp.xp, level: xp.level, promotion,
      });
    }, { maxWait: 5_000, timeout: 5_000 });
  } catch {
    return NextResponse.json({ error: "Unable to save your answer. Please try again." }, { status: 503 });
  }
}
