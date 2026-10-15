import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./prisma";

const COOKIE = "psy_admin_session";
const TTL = 8 * 60 * 60;
type AdminSessionAccount = { id: string; username: string; passwordHash: string };

// Dev-only ephemeral fallback: deliberately changes on server restart.
const devSessionSecret = crypto.randomBytes(32).toString("hex");

function secret() {
  const configured = process.env.ADMIN_SESSION_SECRET;
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set to a unique 32+ character value");
  }
  return devSessionSecret;
}
function sign(payload: string, account: AdminSessionAccount) {
  // Bind sessions to current credentials without exposing the password hash in
  // the cookie. Password rotation invalidates every previously issued token.
  return crypto.createHmac("sha256", secret())
    .update(JSON.stringify(["admin-session-v2", payload, account.id, account.passwordHash])).digest("hex");
}

export function createAdminToken(account: AdminSessionAccount) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  const payload = `${account.username}.${exp}`;
  return `${payload}.${sign(payload, account)}`;
}

export function verifyAdminToken(token: string | undefined, account: AdminSessionAccount) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length < 3) return false;

  const mac = parts.pop()!;
  const expText = parts.pop()!;
  // Credential setup accepts dots in usernames. The final two fields alone
  // are the expiry and MAC; preceding dots belong to the username.
  const username = parts.join(".");
  const exp = Number(expText);
  if (username !== account.username) return false;
  if (!Number.isSafeInteger(exp) || exp <= Math.floor(Date.now() / 1000)) return false;
  // Character length alone is not byte length: multibyte input otherwise makes
  // timingSafeEqual throw. Require the exact encoding emitted by the signer.
  if (!/^[a-f0-9]{64}$/.test(mac)) return false;
  const expected = sign(`${username}.${exp}`, account);

  return crypto.timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(expected, "hex"));
}

export async function ensureAdminAccount() {
  const username = process.env.ADMIN_USERNAME || "admin";
  let account = await db.adminAccount.findUnique({ where: { username } });

  if (!account) {
    let passwordHash = process.env.ADMIN_PASSWORD_HASH || "";
    if (!passwordHash && process.env.NODE_ENV !== "production") {
      const supplied = process.env.ADMIN_PASSWORD;
      if (supplied && supplied.length >= 12) {
        passwordHash = await bcrypt.hash(supplied, 12);
      }
    }

    if (!passwordHash) throw new Error("Admin account is not initialized.");

    account = await db.adminAccount.create({
      data: { username, passwordHash },
    });
  }

  return account;
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  const account = await db.adminAccount.findUnique({
    where: { username: process.env.ADMIN_USERNAME || "admin" },
    select: { id: true, username: true, passwordHash: true },
  });
  return account ? verifyAdminToken(token, account) : false;
}

export async function setAdminSession(account: AdminSessionAccount) {
  const store = await cookies();
  store.set(COOKIE, createAdminToken(account), {
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
