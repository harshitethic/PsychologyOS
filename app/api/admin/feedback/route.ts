import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid reply." }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  if (typeof input.id !== "string" || typeof input.reply !== "string") {
    return NextResponse.json({ error: "Invalid reply." }, { status: 400 });
  }
  const id = input.id.trim();
  const reply = input.reply.trim();
  if (!id || id.length > 128 || !reply || reply.length > 2000) {
    return NextResponse.json({ error: "Invalid reply." }, { status: 400 });
  }

  try {
    const feedback = await db.feedback.update({
      where: { id },
      data: { adminReply: reply, status: "REPLIED", repliedAt: new Date() },
    });
    return NextResponse.json({ feedback });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Feedback not found." }, { status: 404 });
    }
    throw error;
  }
}
