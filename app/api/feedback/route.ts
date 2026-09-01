import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const message = String(body.message || "").trim();

  if (!message || message.length > 2000) {
    return NextResponse.json({ error: "Feedback must be 1–2000 characters." }, { status: 400 });
  }

  const feedback = await db.feedback.create({ data: { userId: user.id, message } });
  return NextResponse.json({ feedback });
}
