import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

// Credential provisioning is explicit: never create a well-known admin account.
const password = process.env.ADMIN_PASSWORD;
const username = process.env.ADMIN_USERNAME || "admin";
if (!password || password.length < 12 || password.length > 200 || /[\r\n\0]/.test(password)) {
  throw new Error("Set ADMIN_PASSWORD to a unique password of 12–200 characters (no newlines).");
}
if (!/^[A-Za-z0-9_.-]{3,64}$/.test(username)) {
  throw new Error("ADMIN_USERNAME must contain 3–64 ASCII letters, digits, dots, hyphens or underscores.");
}
if (typeof fs.constants.O_NOFOLLOW !== "number") {
  throw new Error("Safe local .env provisioning requires filesystem O_NOFOLLOW support.");
}

const file = path.resolve(".env");
let existing = "";
let source;
try {
  source = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (source !== undefined) {
  try {
    if (!fs.fstatSync(source).isFile()) throw new Error(".env must be a regular file");
    existing = fs.readFileSync(source, "utf8");
  } finally {
    fs.closeSync(source);
  }
}

const reserved = /^(?:ADMIN_USERNAME|ADMIN_PASSWORD|ADMIN_PASSWORD_HASH|ADMIN_SESSION_SECRET)=/;
const preserved = existing.split(/\r?\n/).filter((line) => !reserved.test(line)).join("\n").trimEnd();
const hash = await bcrypt.hash(password, 12);
const secret = crypto.randomBytes(32).toString("hex");
const output = [
  preserved,
  `ADMIN_USERNAME=${username}`,
  `ADMIN_PASSWORD_HASH=${hash}`,
  `ADMIN_SESSION_SECRET=${secret}`,
  "",
].filter((line, index) => index !== 0 || line).join("\n");

// Use a private exclusive temp file and atomic rename. Never write in place
// through an existing symlink or log generated credential material.
const temporary = path.join(path.dirname(file), `.env.${crypto.randomBytes(12).toString("hex")}.tmp`);
let target;
try {
  target = fs.openSync(temporary, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL, 0o600);
  fs.writeFileSync(target, output, "utf8");
  fs.fsyncSync(target);
  fs.closeSync(target);
  target = undefined;
  fs.renameSync(temporary, file);
} finally {
  if (target !== undefined) fs.closeSync(target);
  try { fs.unlinkSync(temporary); } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
console.log("Admin configured in private .env. No credentials were printed.");
