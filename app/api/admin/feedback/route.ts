import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  const reply = String(body.reply || "").trim();

  if (!id || !reply || reply.length > 2000) {
    return NextResponse.json({ error: "Invalid reply." }, { status: 400 });
  }

  const feedback = await db.feedback.update({
    where: { id },
    data: { adminReply: reply, status: "REPLIED", repliedAt: new Date() },
  });

  return NextResponse.json({ feedback });
}
