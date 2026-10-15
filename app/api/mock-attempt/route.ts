import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { awardXP, masteryPercent, maybePromoteSemester, XP } from "@/lib/learningEngine";

type InputResult = { mcqId: string; selected: number };

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid exam request." }, { status: 400 });
  }
  const examId = String(body.examId || "");
  const results: InputResult[] = Array.isArray(body.results) ? body.results : [];

  if (!examId || !results.length) {
    return NextResponse.json({ error: "examId and results are required." }, { status: 400 });
  }

  try {
    return await db.$transaction(async (tx) => {
      const exam = await tx.mockExam.findUnique({
        where: { id: examId },
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: { mcq: { select: { id: true, topicId: true, answerIndex: true, options: true } } },
          },
        },
      });
      if (!exam) return NextResponse.json({ error: "Exam not found." }, { status: 404 });

      if (!exam.questions.length || results.length > exam.questions.length) {
        return NextResponse.json({ error: "Invalid exam answers." }, { status: 400 });
      }
      const questions = new Map(exam.questions.map(({ mcq }) => [mcq.id, mcq]));
      const selectedByMcq = new Map<string, number>();
      for (const result of results) {
        if (!result || typeof result.mcqId !== "string" || !Number.isInteger(result.selected)) {
          return NextResponse.json({ error: "Invalid exam answers." }, { status: 400 });
        }
        const question = questions.get(result.mcqId);
        // The UI uses -1 for an unanswered question; preserve that contract.
        if (!question || !Array.isArray(question.options) || result.selected < -1 ||
            result.selected >= question.options.length || selectedByMcq.has(result.mcqId)) {
          return NextResponse.json({ error: "Invalid exam answers." }, { status: 400 });
        }
        selectedByMcq.set(result.mcqId, result.selected);
      }
      let score = 0;
      const topics = new Map<string, { correct: number; total: number }>();

      for (const q of exam.questions) {
        const selected = selectedByMcq.get(q.mcq.id);
        const correct = selected !== undefined && selected === q.mcq.answerIndex;
        if (correct) score++;

        const bucket = topics.get(q.mcq.topicId) ?? { correct: 0, total: 0 };
        bucket.total++;
        if (correct) bucket.correct++;
        topics.set(q.mcq.topicId, bucket);
      }

      const total = exam.questions.length;

      await tx.mockAttempt.create({
        data: {
          userId: user.id,
          examId: exam.id,
          score,
          total,
          startedAt: new Date(Date.now() - exam.durationMin * 60000),
          submittedAt: new Date(),
        },
      });

      let xpGain = 0;

      for (const [topicId, bucket] of topics) {
        const percent = Math.round(bucket.correct / bucket.total * 100);
        const old = await tx.topicProgress.findUnique({
          where: { userId_topicId: { userId: user.id, topicId } },
        });

        const best = Math.max(old?.bestScore ?? 0, percent);
        const mastery = masteryPercent(best);

        await tx.topicProgress.upsert({
          where: { userId_topicId: { userId: user.id, topicId } },
          create: {
            userId: user.id, topicId,
            percent: mastery, bestScore: best, attempts: 1,
            status: best >= 90 ? "STRONG" : best >= 70 ? "REVIEW" : "LEARNING",
            lastStudiedAt: new Date(),
          },
          update: {
            percent: Math.max(old?.percent ?? 0, mastery),
            bestScore: best,
            attempts: { increment: 1 },
            status: best >= 90 ? "STRONG" : best >= 70 ? "REVIEW" : "LEARNING",
            lastStudiedAt: new Date(),
          },
        });

        if (best < 90) {
          const interval = best < 50 ? 1 : 3;
          await tx.revisionItem.upsert({
            where: { userId_topicId: { userId: user.id, topicId } },
            create: {
              userId: user.id, topicId,
              dueAt: new Date(Date.now() + interval * 86400000),
              interval, ease: 2.3,
            },
            update: {
              dueAt: new Date(Date.now() + interval * 86400000),
              interval,
            },
          });
        } else {
          await tx.revisionItem.deleteMany({ where: { userId: user.id, topicId } });
        }

        xpGain += bucket.correct * XP.MOCK_CORRECT + (bucket.total - bucket.correct) * XP.MOCK_WRONG;
      }

      const updated = await awardXP(user.id, xpGain, tx);
      const promotion = await maybePromoteSemester(user.id, tx);

      return NextResponse.json({
        ok: true,
        score,
        total,
        percentage: Math.round(score / total * 100),
        xpGain,
        xp: updated.xp,
        level: updated.level,
        promotion,
      });
    }, { maxWait: 5_000, timeout: 5_000 });
  } catch {
    return NextResponse.json({ error: "Unable to save your exam. Please try again." }, { status: 503 });
  }
}
