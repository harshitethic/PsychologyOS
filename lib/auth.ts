import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "./prisma";

const COOKIE = "psy_os_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is missing from .env");
  return secret;
}

function sign(value: string, passwordHash: string) {
  // A password reset rotates the credential hash and immediately invalidates
  // every outstanding signed cookie, including copies from other devices.
  return createHmac("sha256", getSecret())
    .update(JSON.stringify(["student-session-v2", value, passwordHash]))
    .digest("hex");
}

function makeToken(id: string, expires: number, passwordHash: string) {
  const payload = `${id}.${expires}`;
  return `${payload}.${sign(payload, passwordHash)}`;
}

function readToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, expiresRaw, signature] = parts;
  const expires = Number(expiresRaw);
  // Validate the format before using the unauthenticated user id for a lookup.
  if (!id || !Number.isSafeInteger(expires) || expires <= Date.now() ||
      !/^[a-f0-9]{64}$/.test(signature)) return null;
  return { id, expires, signature };
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const payload = readToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({ where: { id: payload.id } });
  if (!user || user.banned) return null;

  const expected = sign(`${payload.id}.${payload.expires}`, user.passwordHash);
  if (!timingSafeEqual(Buffer.from(payload.signature, "hex"), Buffer.from(expected, "hex"))) {
    return null;
  }

  await db.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() },
  }).catch(() => {});

  return user;
}

export async function setSession(id: string) {
  const user = await db.user.findUnique({
    where: { id },
    select: { passwordHash: true },
  });
  if (!user) throw new Error("Cannot create a session for a missing user");
  const store = await cookies();
  const expires = Date.now() + MAX_AGE * 1000;
  store.set(COOKIE, makeToken(id, expires, user.passwordHash), {
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
