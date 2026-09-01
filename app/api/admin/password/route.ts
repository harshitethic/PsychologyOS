import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";
import { getAdminSession, clearAdminSession } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");

  if (newPassword.length < 10) {
    return NextResponse.json({ error: "New password must be at least 10 characters." }, { status: 400 });
  }

  const account = await db.adminAccount.findUnique({ where: { username: session } });
  if (!account || !(await bcrypt.compare(currentPassword, account.passwordHash))) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  await db.adminAccount.update({
    where: { id: account.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });

  await clearAdminSession();
  return NextResponse.json({ ok: true, message: "Password changed. Sign in again." });
}
