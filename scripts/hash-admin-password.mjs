import bcrypt from "bcryptjs";
const password = process.env.ADMIN_PASSWORD;
if (!password) {
  console.error("Set ADMIN_PASSWORD in the shell first.");
  process.exit(1);
}
console.log(await bcrypt.hash(password, 12));
