import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "./prisma";

const COOKIE = "psy_os_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is missing from .env");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

function makeToken(id: string, expires: number) {
  const payload = `${id}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) return null;

  const [id, expiresRaw, signature] = parts;
  const expires = Number(expiresRaw);

  if (!id || !Number.isFinite(expires)) return null;
  if (expires < Date.now()) return null;

  const expected = sign(`${id}.${expires}`);

  try {
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expected, "hex");

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return null;
    }
  } catch {
    return null;
  }

  return id;
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;

  if (!token) return null;

  const id = readToken(token);

  if (!id) return null;

  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user || user.banned) return null;

  await db.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() },
  }).catch(() => {});

  return user;
}

export async function setSession(id: string) {
  const store = await cookies();
  const expires = Date.now() + MAX_AGE * 1000;

  store.set(COOKIE, makeToken(id, expires), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();

  store.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
