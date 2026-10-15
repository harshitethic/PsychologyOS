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

  // The signed admin session is a boolean; account identity is the configured username.
  const account = await db.adminAccount.findUnique({
    where: { username: process.env.ADMIN_USERNAME || "admin" },
  });
  if (!account || !(await bcrypt.compare(currentPassword, account.passwordHash))) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  // A concurrent password rotation must not overwrite newer credentials after
  // this request has checked the old password.
  const changed = await db.adminAccount.updateMany({
    where: { id: account.id, passwordHash: account.passwordHash },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });
  if (changed.count !== 1) {
    return NextResponse.json({ error: "Credentials changed. Sign in again." }, { status: 401 });
  }

  await clearAdminSession();
  return NextResponse.json({ ok: true, message: "Password changed. Sign in again." });
}
