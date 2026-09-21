import crypto from 'node:crypto';

function key(): Buffer {
  const raw = process.env.CONFIG_ENCRYPTION_KEY || '';
  if (!raw) throw new Error('CONFIG_ENCRYPTION_KEY is missing');
  const b64 = Buffer.from(raw, 'base64');
  return b64.length === 32 ? b64 : crypto.createHash('sha256').update(raw).digest();
}

export function seal(value: unknown): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map(x => x.toString('base64url')).join('.');
}

export function open<T>(value: string): T {
  const [ivS, tagS, dataS] = value.split('.');
  if (!ivS || !tagS || !dataS) throw new Error('Invalid encrypted config');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(ivS, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagS, 'base64url'));
  const clear = Buffer.concat([decipher.update(Buffer.from(dataS, 'base64url')), decipher.final()]);
  return JSON.parse(clear.toString('utf8')) as T;
}
