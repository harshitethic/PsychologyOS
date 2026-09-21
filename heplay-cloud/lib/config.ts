import { open, seal } from './crypto';
import { readEncrypted, writeEncrypted } from './store';

export type HePlayConfig = {
  apiId: number;
  apiHash: string;
  revision: number;
  updatedAt: string;
};

export async function getConfig(): Promise<HePlayConfig | null> {
  const raw = await readEncrypted();
  if (!raw) return null;
  return open<HePlayConfig>(raw);
}

export async function saveConfig(apiId: number, apiHash: string): Promise<HePlayConfig> {
  const old = await getConfig().catch(() => null);
  const next: HePlayConfig = {
    apiId,
    apiHash,
    revision: (old?.revision || 0) + 1,
    updatedAt: new Date().toISOString()
  };
  await writeEncrypted(seal(next));
  return next;
}
