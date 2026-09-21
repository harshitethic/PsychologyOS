import crypto from 'node:crypto';

const COOKIE = 'heplay_admin';
function secret(): string {
  const value = process.env.SESSION_SECRET || '';
  if (!value) throw new Error('SESSION_SECRET is missing');
  return value;
}
function sign(body: string) {
  return crypto.createHmac('sha256', secret()).update(body).digest('base64url');
}
export function makeSession(): string {
  const body = String(Date.now() + 12 * 60 * 60 * 1000);
  return `${body}.${sign(body)}`;
}
export function validSession(value?: string | null): boolean {
  if (!value) return false;
  const [body, sig] = value.split('.');
  if (!body || !sig || Number(body) < Date.now()) return false;
  const expected = sign(body);
  return sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
export const sessionCookie = COOKIE;
