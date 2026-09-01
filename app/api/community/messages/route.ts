import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const messages = await db.communityMessage.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
    take: 250,
    include: {
      user: { select: { username: true, course: true, year: true } },
      replyTo: { select: { id: true, content: true, user: { select: { username: true } } } },
    },
  });

  return NextResponse.json({
    messages: messages.map(m => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      replyTo: m.replyTo
        ? { id: m.replyTo.id, content: m.replyTo.content, username: m.replyTo.user.username }
        : null,
      user: { username: m.user.username, course: m.user.course, year: m.user.year },
    })),
  });
}
