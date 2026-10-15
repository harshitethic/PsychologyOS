import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";

const require = createRequire(import.meta.url);
const configPath = require.resolve("@prisma/config");
const configRequire = createRequire(configPath);
// Test the exact dependency used by Prisma, including a nested installation.
const { deepmerge, deepmergeInto } = await import(pathToFileURL(configRequire.resolve("deepmerge-ts")));

test("Prisma's merge dependency handles recursive graphs without stack exhaustion", () => {
  const left = { left: true };
  const right = { right: true };
  left.self = left;
  right.self = right;
  const merged = deepmerge(left, right);
  assert.equal(merged.left, true);
  assert.equal(merged.right, true);
  assert.equal(merged.self, merged);
  const target = {};
  target.self = target;
  deepmergeInto(target, right);
  assert.equal(target.right, true);
  assert.equal(target.self, target);
});

test("Prisma-style nested config merges retain schema, migration and datasource values", () => {
  const base = { schema: "prisma/schema.prisma", migrations: { path: "prisma/migrations" } };
  const extra = { migrations: { seed: "tsx prisma/seed.ts" }, datasource: { url: "file:./dev.db" } };
  assert.deepEqual(deepmerge(base, extra), {
    schema: base.schema, migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
    datasource: { url: "file:./dev.db" },
  });
  assert.deepEqual(base.migrations, { path: "prisma/migrations" });
});

test("the real Prisma config loader accepts a local configuration", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "psychology-config-test-"));
  try {
    await writeFile(path.join(root, "prisma.config.mjs"), `
      import { defineConfig } from ${JSON.stringify(pathToFileURL(configPath).href)};
      export default defineConfig({ schema: "prisma/schema.prisma", migrations: { path: "prisma/migrations" } });
    `);
    const { loadConfigFromFile } = await import(pathToFileURL(configPath));
    const result = await loadConfigFromFile({ configRoot: root });
    assert.equal(result.error, undefined);
    assert.equal(result.config.schema, path.join(root, "prisma/schema.prisma"));
    assert.equal(result.config.migrations.path, path.join(root, "prisma/migrations"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
