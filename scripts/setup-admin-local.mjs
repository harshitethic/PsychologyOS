import fs from "fs";
import crypto from "crypto";
const password=process.env.ADMIN_PASSWORD||"hack2use.";
let env=fs.existsSync(".env")?fs.readFileSync(".env","utf8"):"";
env=env.split(/\r?\n/).filter(x=>!x.startsWith("ADMIN_USERNAME=")&&!x.startsWith("ADMIN_PASSWORD=")&&!x.startsWith("ADMIN_PASSWORD_HASH=")&&!x.startsWith("ADMIN_SESSION_SECRET=")).filter(Boolean).join("\n");
env+=`\nADMIN_USERNAME=admin\nADMIN_PASSWORD=${password}\nADMIN_SESSION_SECRET=${crypto.randomBytes(32).toString("hex")}\n`;
fs.writeFileSync(".env",env);
console.log("Local admin configured: admin / "+password);
