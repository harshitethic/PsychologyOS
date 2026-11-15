import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Fetch the newest 250 messages, not the oldest 250. Otherwise a busy
  // community permanently hides fresh activity after crossing the limit.
  const latest = await db.communityMessage.findMany({
    where: { createdAt: { gte: since } },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 250,
    include: {
      user: { select: { username: true, course: true, year: true } },
      replyTo: { select: { id: true, content: true, user: { select: { username: true } } } },
    },
  });

  return NextResponse.json({
    messages: latest.reverse().map(m => ({
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
