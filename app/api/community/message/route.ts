import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

const MAX = 600;

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const content = String(body.content || "").trim();
  const replyToId = body.replyToId ? String(body.replyToId) : null;

  if (!content) return NextResponse.json({ error: "Write something first." }, { status: 400 });
  if (content.length > MAX) return NextResponse.json({ error: `Keep messages under ${MAX} characters.` }, { status: 400 });
  if (/https?:\/\/|www\./i.test(content)) return NextResponse.json({ error: "Links are not allowed in the group." }, { status: 400 });

  if (replyToId) {
    const target = await db.communityMessage.findUnique({ where: { id: replyToId } });
    if (!target) return NextResponse.json({ error: "Reply target not found." }, { status: 404 });
  }

  const message = await db.communityMessage.create({
    data: { userId: user.id, content, replyToId },
    include: { user: { select: { username: true, course: true, year: true } } },
  });

  return NextResponse.json({
    message: {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      replyToId: message.replyToId,
      user: message.user,
    },
  });
}
