import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

type HistoryMessage = { role: "user" | "assistant"; content: string };

function validHistory(value: unknown): value is HistoryMessage[] {
  return Array.isArray(value) && value.length <= 10 &&
    value.every((item) =>
      item !== null && typeof item === "object" && !Array.isArray(item) &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string" &&
      item.content.trim().length > 0 && item.content.length <= 1600
    );
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input: unknown = await req.json().catch(() => null);
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return NextResponse.json({ error: "Invalid tutor request." }, { status: 400 });
  }

  const body = input as Record<string, unknown>;
  const question = body.question;
  const topic = body.topic == null ? null : body.topic;
  const history = body.history === undefined ? [] : body.history;
  if (typeof question !== "string" || !question.trim() || question.length > 4000 ||
      (topic !== null && (typeof topic !== "string" || topic.length > 128)) ||
      !validHistory(history)) {
    return NextResponse.json({
      error: "Provide a question of up to 4000 characters and valid conversation history."
    }, { status: 400 });
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await db.aIConversation.deleteMany({
    where: { userId: user.id, createdAt: { lt: since } }
  });
  const saved = await db.aIConversation.findMany({
    where: { userId: user.id, topicId: topic, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
    take: 20,
    select: { role: true, content: true },
  });
  const convo = [...saved, ...history].map((message) =>
    `${message.role === "user" ? "Student" : "Tutor"}: ${message.content.slice(0, 1600)}`
  ).join("\n");
  const prompt = `You are a careful undergraduate psychology tutor. Current topic: ${topic ?? "general"}. Explain clearly, correct misconceptions, use examples and exam-focused distinctions. Do not invent studies, statistics, diagnoses or citations.\nConversation:\n${convo}\nStudent: ${question}\nTutor:`;
  let answer = "AI tutor offline — start Ollama locally to enable this feature.";
  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || "qwen2.5:3b", prompt, stream: false,
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (response.ok) {
      const model = await response.json();
      if (typeof model.response === "string" && model.response.trim()) {
        answer = model.response;
      }
    }
  } catch {
    // The local model is optional; retain the explicit offline response.
  }

  const now = new Date();
  await db.aIConversation.create({
    data: { userId: user.id, topicId: topic, role: "user", content: question, createdAt: now }
  });
  await db.aIConversation.create({
    data: {
      userId: user.id, topicId: topic, role: "assistant",
      content: answer, createdAt: new Date(now.getTime() + 1)
    }
  });
  return NextResponse.json({ answer });
}
