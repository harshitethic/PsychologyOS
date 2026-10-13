import assert from "node:assert/strict";
import { GET } from "../app/api/health/route";

async function main() {
const response = await GET();
const body = await response.json();

assert.equal(response.status, 200);
assert.equal(body.status, "ok");
assert.equal(body.service, "psychology-os");
assert.equal(Number.isNaN(Date.parse(body.timestamp)), false);
assert.match(response.headers.get("cache-control") ?? "", /no-store/i);

console.log("Health route: OK");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
