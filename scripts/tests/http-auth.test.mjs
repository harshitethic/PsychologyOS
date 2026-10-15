import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// Exercise the built production request handler over real loopback HTTP. Port 0
// lets the OS allocate a private test port without a reserve/rebind race.
const serverScript = `
  import next from 'next';
  import { createServer } from 'node:http';
  const app = next({ dev: false, hostname: '127.0.0.1', port: 0 });
  await app.prepare();
  const server = createServer(app.getRequestHandler());
  server.listen(0, '127.0.0.1', () => console.log('TEST_PORT=' + server.address().port));
`;

test("production HTTP authentication and learning boundaries", { timeout: 180_000 }, async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "psychology-http-test-"));
  const database = path.join(root, "fixture.db");
  const url = `file:${database}`;
  const adminPassword = randomBytes(20).toString("hex");
  const studentPassword = randomBytes(20).toString("hex");
  const env = {
    ...process.env, NODE_ENV: "production", DATABASE_URL: url,
    SESSION_SECRET: randomBytes(32).toString("hex"),
    ADMIN_SESSION_SECRET: randomBytes(32).toString("hex"),
    ADMIN_USERNAME: "http.admin", ADMIN_PASSWORD: "",
    ADMIN_PASSWORD_HASH: await bcrypt.hash(adminPassword, 12),
  };
  const db = new PrismaClient({ datasourceUrl: url });
  let child;
  let serverOutput = "";
  try {
    await writeFile(database, "", { flag: "wx" });
    for (const args of [
      ["node_modules/prisma/build/index.js", "db", "push", "--skip-generate"],
      ["--import", "tsx", "prisma/seed.ts"],
    ]) {
      const result = spawnSync(process.execPath, args, { env, encoding: "utf8", timeout: 90_000 });
      assert.equal(result.error, undefined, result.error?.message);
      assert.equal(result.status, 0, result.stderr + result.stdout);
    }
    const passwordHash = await bcrypt.hash(studentPassword, 12);
    const users = [];
    for (const username of ["http-alice", "http-bob"]) {
      users.push(await db.user.create({ data: {
        name: username, username, email: `${username}@example.invalid`,
        passwordHash, securityHash: "unused-fixture", course: "Original course",
      } }));
    }
    const [alice, bob] = users;
    const question = await db.mCQ.findFirstOrThrow();
    child = spawn(process.execPath, ["--input-type=module", "-e", serverScript], {
      env, stdio: ["ignore", "pipe", "pipe"],
    });
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Production server start timed out: ${serverOutput}`)), 30_000);
      const onData = (chunk) => {
        serverOutput = (serverOutput + chunk.toString()).slice(-32_768);
        const match = serverOutput.match(/TEST_PORT=(\d+)/);
        if (match) { clearTimeout(timer); resolve(Number(match[1])); }
      };
      child.stdout.on("data", onData);
      child.stderr.on("data", onData);
      child.once("error", (error) => { clearTimeout(timer); reject(error); });
      child.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${serverOutput}`)); });
    });
    const base = `http://127.0.0.1:${port}`;
    const post = (route, body = {}, cookie) => fetch(base + route, {
      method: "POST", headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
      body: JSON.stringify(body), redirect: "manual", signal: AbortSignal.timeout(10_000),
    });
    const session = (response, name, sameSite) => {
      const header = response.headers.get("set-cookie");
      assert.ok(header?.startsWith(`${name}=`));
      assert.match(header, /; HttpOnly/i);
      assert.match(header, /; Secure/i);
      assert.match(header, new RegExp(`; SameSite=${sameSite}`, "i"));
      return header.split(";")[0];
    };
    let studentCookie;
    let adminCookie;
    let currentAdminPassword = adminPassword;

    await t.test("unauthenticated requests and bad passwords cannot mutate data", async () => {
      assert.equal((await post("/api/profile", { course: "Rejected" })).status, 401);
      assert.equal((await post("/api/mcq-attempt", { mcqId: question.id, selected: question.answerIndex })).status, 401);
      assert.equal((await post("/api/admin/users/action", { id: bob.id, action: "BAN" })).status, 401);
      assert.equal((await post("/api/login", { identifier: alice.username, password: "wrong" })).status, 401);
      assert.equal((await post("/api/admin/login", { username: env.ADMIN_USERNAME, password: "wrong" })).status, 401);
      assert.equal(await db.mCQAttempt.count(), 0);
      assert.equal((await db.user.findUniqueOrThrow({ where: { id: alice.id } })).course, "Original course");
    });

    await t.test("student login, profile and learning writes stay bound to the session user", async () => {
      const login = await post("/api/login", { identifier: alice.email, password: studentPassword });
      assert.equal(login.status, 200);
      studentCookie = session(login, "psy_os_session", "lax");
      assert.equal((await post("/api/profile", { userId: bob.id, course: "Psychology", year: 2 }, studentCookie)).status, 200);
      assert.equal((await db.user.findUniqueOrThrow({ where: { id: alice.id } })).course, "Psychology");
      assert.equal((await db.user.findUniqueOrThrow({ where: { id: bob.id } })).course, "Original course");
      const answer = await post("/api/mcq-attempt", { userId: bob.id, mcqId: question.id, selected: question.answerIndex }, studentCookie);
      assert.equal(answer.status, 200);
      assert.equal((await answer.json()).correct, true);
      assert.equal((await db.mCQAttempt.findFirstOrThrow()).userId, alice.id);
      assert.equal(await db.mCQAttempt.count({ where: { userId: bob.id } }), 0);
      assert.equal(await db.topicProgress.count({ where: { userId: alice.id } }), 1);
      assert.equal((await post("/api/admin/users/action", { id: bob.id, action: "BAN" }, studentCookie)).status, 401);
    });

    await t.test("admin login works and banning immediately rejects an existing student session", async () => {
      const login = await post("/api/admin/login", { username: env.ADMIN_USERNAME, password: adminPassword });
      assert.equal(login.status, 200);
      adminCookie = session(login, "psy_admin_session", "strict");
      assert.equal((await post("/api/admin/users/action", { id: alice.id, action: "BAN" }, adminCookie)).status, 200);
      assert.equal((await post("/api/profile", { course: "Rejected after ban" }, studentCookie)).status, 401);
      assert.equal((await post("/api/login", { identifier: alice.username, password: studentPassword })).status, 403);
      assert.equal((await post("/api/admin/users/action", { id: alice.id, action: "UNBAN" }, adminCookie)).status, 200);
    });

    await t.test("malformed multibyte signatures return unauthorized, not a server error", async () => {
      const future = Math.floor(Date.now() / 1000) + 600;
      const malformed = `psy_admin_session=${env.ADMIN_USERNAME}.${future}.${encodeURIComponent("é".repeat(64))}`;
      assert.equal((await post("/api/admin/users/action", { id: bob.id, action: "BAN" }, malformed)).status, 401);
      assert.equal((await db.user.findUniqueOrThrow({ where: { id: bob.id } })).banned, false);
    });

    await t.test("password rotation invalidates copied admin cookies across all protected routes", async () => {
      const nextPassword = randomBytes(20).toString("hex");
      const rotation = await post("/api/admin/password", { currentPassword: adminPassword, newPassword: nextPassword }, adminCookie);
      assert.equal(rotation.status, 200);
      assert.match(rotation.headers.get("set-cookie"), /psy_admin_session=;/);
      for (const route of ["/api/admin/users/action", "/api/admin/feedback", "/api/admin/password"]) {
        assert.equal((await post(route, { id: bob.id, action: "BAN" }, adminCookie)).status, 401, route);
      }
      assert.equal((await post("/api/admin/login", { username: env.ADMIN_USERNAME, password: adminPassword })).status, 401);
      const login = await post("/api/admin/login", { username: env.ADMIN_USERNAME, password: nextPassword });
      assert.equal(login.status, 200);
      adminCookie = session(login, "psy_admin_session", "strict");
      assert.equal((await post("/api/admin/users/action", { id: bob.id, action: "BAN" }, adminCookie)).status, 200);
      assert.equal((await db.user.findUniqueOrThrow({ where: { id: bob.id } })).banned, true);
      currentAdminPassword = nextPassword;
    });

    await t.test("competing password changes cannot overwrite each other's credentials", async () => {
      const candidates = [randomBytes(20).toString("hex"), randomBytes(20).toString("hex")];
      const oldCookie = adminCookie;
      const responses = await Promise.all(candidates.map((newPassword) => post("/api/admin/password", {
        currentPassword: currentAdminPassword, newPassword,
      }, oldCookie)));
      assert.deepEqual(responses.map((r) => r.status).sort(), [200, 401]);
      const winner = responses.findIndex((r) => r.status === 200);
      const account = await db.adminAccount.findUniqueOrThrow({ where: { username: env.ADMIN_USERNAME } });
      assert.equal(await bcrypt.compare(candidates[winner], account.passwordHash), true);
      assert.equal(await bcrypt.compare(candidates[1 - winner], account.passwordHash), false);
      assert.equal((await post("/api/admin/users/action", { id: bob.id, action: "UNBAN" }, oldCookie)).status, 401);
      const login = await post("/api/admin/login", { username: env.ADMIN_USERNAME, password: candidates[winner] });
      assert.equal(login.status, 200);
      adminCookie = session(login, "psy_admin_session", "strict");
    });

    await t.test("deletion and recreation cannot revive an outstanding admin session", async () => {
      const removed = await db.adminAccount.delete({ where: { username: env.ADMIN_USERNAME } });
      assert.equal((await post("/api/admin/users/action", { id: bob.id, action: "UNBAN" }, adminCookie)).status, 401);
      await db.adminAccount.create({ data: { username: removed.username, passwordHash: removed.passwordHash } });
      assert.equal((await post("/api/admin/users/action", { id: bob.id, action: "UNBAN" }, adminCookie)).status, 401);
      assert.equal((await db.user.findUniqueOrThrow({ where: { id: bob.id } })).banned, true);
    });
    assert.deepEqual(await db.$queryRawUnsafe("PRAGMA foreign_key_check"), []);
  } finally {
    if (child && child.exitCode === null && child.signalCode === null) {
      const exited = once(child, "exit");
      child.kill("SIGTERM");
      const timer = setTimeout(() => child.kill("SIGKILL"), 5_000);
      try { await exited; } finally { clearTimeout(timer); }
    }
    await db.$disconnect();
    await rm(root, { recursive: true, force: true });
  }
});
