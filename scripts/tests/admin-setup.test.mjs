import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const setup = path.join(root, "scripts/setup-local-admin.mjs");
const legacy = path.join(root, "scripts/setup-admin-local.mjs");
const smoke = path.join(root, "scripts/smoke.mjs");
const password = "test-admin-long-random-password-2026";

function inTemp(run) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "psychology-admin-"));
  try { return run(directory); }
  finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

function execute(script, cwd, extra = {}) {
  return spawnSync(process.execPath, [script], {
    cwd,
    env: { ...process.env, ADMIN_PASSWORD: password, ADMIN_USERNAME: "test_admin", ...extra },
    encoding: "utf8",
    timeout: 15000,
  });
}

test("new setup requires an explicit password, creates no known account", () => inTemp((directory) => {
  const outcome = execute(setup, directory, { ADMIN_PASSWORD: "" });
  assert.notEqual(outcome.status, 0);
  assert.equal(fs.existsSync(path.join(directory, ".env")), false);
  assert.doesNotMatch(outcome.stdout, /hack2use/);
}));

test("writes hashed credentials atomically with private file mode", () => inTemp((directory) => {
  const file = path.join(directory, ".env");
  fs.writeFileSync(file, "DATABASE_URL=file:./dev.db\nOPENAI_DISABLED=true\nADMIN_PASSWORD=old-plaintext\n");
  const outcome = execute(setup, directory);
  assert.equal(outcome.status, 0, outcome.stderr);
  assert.doesNotMatch(outcome.stdout + outcome.stderr, /test-admin-long-random-password-2026/);
  const content = fs.readFileSync(file, "utf8");
  assert.match(content, /DATABASE_URL=file:\.\/dev\.db/);
  assert.match(content, /OPENAI_DISABLED=true/);
  assert.match(content, /ADMIN_USERNAME=test_admin/);
  assert.match(content, /ADMIN_PASSWORD_HASH=\$2/);
  assert.match(content, /ADMIN_SESSION_SECRET=[a-f0-9]{64}/);
  assert.equal(content.includes("ADMIN_PASSWORD="), false);
  assert.equal(content.includes(password), false);
  assert.equal((fs.statSync(file).mode & 0o777), 0o600);
  const hash = content.match(/^ADMIN_PASSWORD_HASH=(.*)$/m)[1];
  assert.equal(bcrypt.compareSync(password, hash), true);
}));

test("legacy setup entry point uses the safe implementation", () => inTemp((directory) => {
  const result = execute(legacy, directory);
  assert.equal(result.status, 0, result.stderr);
  const content = fs.readFileSync(path.join(directory, ".env"), "utf8");
  assert.match(content, /^ADMIN_PASSWORD_HASH=/m);
  assert.doesNotMatch(content, /^ADMIN_PASSWORD=/m);
  assert.doesNotMatch(result.stdout, /test-admin-long-random-password-2026/);
}));

test("rejects existing symlink without modifying target", () => inTemp((directory) => {
  const external = path.join(directory, "external");
  fs.writeFileSync(external, "DO_NOT_TOUCH");
  const file = path.join(directory, ".env");
  fs.symlinkSync(external, file);
  const result = execute(setup, directory);
  assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(external, "utf8"), "DO_NOT_TOUCH");
}));

test("rejects weak or newline-containing passwords and invalid usernames", () => inTemp((directory) => {
  for (const env of [
    { ADMIN_PASSWORD: "short" },
    { ADMIN_PASSWORD: "some-lengthy\nunsafe-value" },
    { ADMIN_USERNAME: "../../bad" },
  ]) {
    const result = execute(setup, directory, env);
    assert.notEqual(result.status, 0);
    assert.equal(fs.existsSync(path.join(directory, ".env")), false);
  }
}));

test("smoke-test errors do not reflect dynamic network error strings", () => {
  const result = spawnSync(process.execPath, [smoke, "http://127.0.0.1:1"], {
    cwd: root, encoding: "utf8", timeout: 6000,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Smoke test failed/);
  assert.doesNotMatch(result.stderr, /ECONNREFUSED|connect|socket/);
});
