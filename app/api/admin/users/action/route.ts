import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  const action = String(body.action || "");

  if (!id || !["BAN", "UNBAN"].includes(action)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const updated = await db.user.update({
    where: { id },
    data: { banned: action === "BAN" },
    select: { id: true, username: true, banned: true },
  });

  return NextResponse.json({ user: updated });
}
