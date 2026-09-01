import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const file = ".env";
const password = process.env.ADMIN_PASSWORD || "hack2use.";
const username = process.env.ADMIN_USERNAME || "admin";
const hash = await bcrypt.hash(password, 12);
const secret = crypto.randomBytes(32).toString("hex");

let env = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
env = env.replace(/^ADMIN_USERNAME=.*$/gm, "");
env = env.replace(/^ADMIN_PASSWORD_HASH=.*$/gm, "");
env = env.replace(/^ADMIN_PASSWORD=.*$/gm, "");
env = env.replace(/^ADMIN_SESSION_SECRET=.*$/gm, "");
env = env.trim() + `\nADMIN_USERNAME=${username}\nADMIN_PASSWORD_HASH=${hash}\nADMIN_SESSION_SECRET=${secret}\n`;
fs.writeFileSync(file, env);
console.log("Admin credentials configured securely in .env");
console.log(`Username: ${username}`);
console.log(`Password: ${password}`);
