import { get, put } from '@vercel/blob';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const FILE = 'heplay/config.enc';
const LOCAL = path.join(process.cwd(), 'data', 'config.enc');
const onVercel = () => Boolean(process.env.VERCEL || process.env.BLOB_READ_WRITE_TOKEN);

export async function readEncrypted(): Promise<string | null> {
  if (onVercel()) {
    const result = await get(FILE, { access: 'private', useCache: false });
    if (!result) return null;
    return await new Response(result.stream).text();
  }
  try { return await fs.readFile(LOCAL, 'utf8'); } catch { return null; }
}

export async function writeEncrypted(value: string): Promise<void> {
  if (onVercel()) {
    await put(FILE, value, {
      access: 'private',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'text/plain'
    });
    return;
  }
  await fs.mkdir(path.dirname(LOCAL), { recursive: true });
  await fs.writeFile(LOCAL, value, 'utf8');
}
