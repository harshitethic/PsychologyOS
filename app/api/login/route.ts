import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const identifier = String(body.identifier || "").trim();
  const password = String(body.password || "");

  if (!identifier || !password) {
    return NextResponse.json({ error: "Username/email and password are required." }, { status: 400 });
  }

  const normalized = identifier.toLowerCase();

  const user = await db.user.findFirst({
    where: {
      OR: [{ email: normalized }, { username: normalized }],
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid username/email or password." }, { status: 401 });
  }

  if (user.banned) {
    return NextResponse.json({ error: "This account has been banned. Contact the administrator." }, { status: 403 });
  }

  if (!(await compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid username/email or password." }, { status: 401 });
  }

  await db.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
  await setSession(user.id);

  return NextResponse.json({ ok: true });
}
