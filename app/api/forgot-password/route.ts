import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

const ERROR = "Invalid account recovery details.";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!identifier || !answer || newPassword.length < 8 || newPassword.length > 256) {
    return NextResponse.json(
      { error: "Enter your username/email, recovery answer, and a password of 8–256 characters." },
      { status: 400 }
    );
  }

  const normalized = identifier.toLowerCase();
  const user = await db.user.findFirst({
    where: { OR: [{ email: normalized }, { username: normalized }] },
  });

  // Do not reveal whether an account exists; the recovery answer must match
  // the bcrypt hash recorded when the user registered.
  if (!user || user.banned || !user.securityHash ||
      !(await compare(answer.toLowerCase(), user.securityHash))) {
    return NextResponse.json({ error: ERROR }, { status: 401 });
  }

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await hash(newPassword, 12) },
  });
  return NextResponse.json({ message: "Password updated. You can now log in." });
}
