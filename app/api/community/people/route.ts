import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const people = await db.user.findMany({
    select: { id: true, username: true, course: true, year: true, lastActiveAt: true },
    orderBy: { lastActiveAt: "desc" },
    take: 40,
  });

  return NextResponse.json({
    people: people.map(p => ({
      id: p.id,
      username: p.username,
      course: p.course,
      year: p.year,
      lastActiveAt: p.lastActiveAt ? p.lastActiveAt.toISOString() : null,
    })),
  });
}
