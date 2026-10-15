import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

type SeedQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  difficulty: string;
};

function questionKey(q: Omit<SeedQuestion, "options"> & { options: unknown }): string {
  return JSON.stringify([q.question, q.options, q.answerIndex, q.explanation, q.difficulty]);
}

function resourceId(kind: string, topicId: string, content: string): string {
  return `seed-${kind}-${createHash("sha256").update(JSON.stringify([topicId, content])).digest("hex")}`;
}

// IDs are referenced by student history. Reuse identical legacy rows and append
// changed content; never delete resources or change the meaning of an old ID.
export async function ensureTopicResources(
  db: PrismaClient,
  topicId: string,
  flashcards: [string, string][],
  questions: SeedQuestion[],
): Promise<void> {
  await db.$transaction(async (tx) => {
    const cards = await tx.flashcard.findMany({ where: { topicId } });
    const cardKeys = new Set(cards.map((c) => JSON.stringify([c.front, c.back])));
    for (const [front, back] of flashcards) {
      const key = JSON.stringify([front, back]);
      if (cardKeys.has(key)) continue;
      await tx.flashcard.create({ data: { id: resourceId("card", topicId, key), topicId, front, back } });
      cardKeys.add(key);
    }

    const existing = await tx.mCQ.findMany({ where: { topicId } });
    const questionKeys = new Set(existing.map(questionKey));
    for (const question of questions) {
      const key = questionKey(question);
      if (questionKeys.has(key)) continue;
      await tx.mCQ.create({ data: { id: resourceId("mcq", topicId, key), topicId, ...question } });
      questionKeys.add(key);
    }
  });
}

// A paper's membership/order must stay stable after students can attempt it.
// Initialize an empty paper atomically; changes need a new paper or migration.
export async function ensureMockQuestions(db: PrismaClient, examId: string, mcqIds: string[]): Promise<void> {
  await db.$transaction(async (tx) => {
    if (await tx.mockQuestion.count({ where: { examId } })) return;
    await tx.mockQuestion.createMany({
      data: [...new Set(mcqIds)].map((mcqId, index) => ({ examId, mcqId, order: index + 1 })),
    });
  });
}
