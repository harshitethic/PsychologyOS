import fs from "node:fs";
import path from "node:path";

const required = ["package.json","prisma/schema.prisma","app/layout.tsx","app/page.tsx","app/semesters/[number]/page.tsx","public/brain.png"];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
}
JSON.parse(fs.readFileSync("package.json","utf8"));
const env = fs.existsSync(".env") ? fs.readFileSync(".env","utf8") : fs.readFileSync(".env.example","utf8");
if (!/^DATABASE_URL=/m.test(env)) throw new Error("DATABASE_URL is missing from .env/.env.example");
console.log("PSYCHOLOGY OS doctor: OK");
console.log("package.json: valid");
console.log("brain.png: present");
console.log("DATABASE_URL: present");
