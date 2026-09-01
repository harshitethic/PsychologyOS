import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureAdminAccount, setAdminSession } from "@/lib/adminAuth";

const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  const key = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const existing = attempts.get(key);

  if (existing && existing.resetAt > now && existing.count >= 5) {
    return NextResponse.json({ error: "Too many attempts. Try again in 10 minutes." }, { status: 429 });
  }

  if (!existing || existing.resetAt <= now) {
    attempts.set(key, { count: 0, resetAt: now + 10 * 60 * 1000 });
  }

  const body = await req.json().catch(() => ({}));
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  try {
    const account = await ensureAdminAccount();
    const valid = username === account.username && await bcrypt.compare(password, account.passwordHash);

    if (!valid) {
      attempts.get(key)!.count += 1;
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    attempts.delete(key);
    await setAdminSession(account.username);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Admin account is not initialized." }, { status: 500 });
  }
}
