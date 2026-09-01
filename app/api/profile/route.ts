import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const course = String(body.course || "").trim().slice(0, 120) || null;
  const yearNumber = body.year === "" || body.year == null ? null : Number(body.year);
  const year = Number.isInteger(yearNumber) && yearNumber >= 1 && yearNumber <= 8 ? yearNumber : null;

  const updated = await db.user.update({
    where: { id: user.id },
    data: { course, year },
  });

  return NextResponse.json({ user: { course: updated.course, year: updated.year } });
}
