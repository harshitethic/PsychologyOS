import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./prisma";

const COOKIE = "psy_admin_session";
const TTL = 8 * 60 * 60;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "psychology-os-local-admin-secret-change-me";
}
function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createAdminToken(username: string) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  const payload = `${username}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [username, expText, mac] = parts;
  const exp = Number(expText);
  const expected = sign(`${username}.${exp}`);

  if (username !== (process.env.ADMIN_USERNAME || "admin")) return false;
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  if (mac.length !== expected.length) return false;

  return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
}

export async function ensureAdminAccount() {
  const username = process.env.ADMIN_USERNAME || "admin";
  let account = await db.adminAccount.findUnique({ where: { username } });

  if (!account) {
    const passwordHash =
      process.env.ADMIN_PASSWORD_HASH ||
      (process.env.NODE_ENV !== "production"
        ? await bcrypt.hash(process.env.ADMIN_PASSWORD || "hack2use.", 12)
        : "");

    if (!passwordHash) throw new Error("Admin account is not initialized.");

    account = await db.adminAccount.create({
      data: { username, passwordHash },
    });
  }

  return account;
}

export async function getAdminSession() {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE)?.value);
}

export async function setAdminSession(username: string) {
  const store = await cookies();
  store.set(COOKIE, createAdminToken(username), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE);
}
