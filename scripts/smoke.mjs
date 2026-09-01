import http from "node:http";

const url = process.argv[2] || "http://localhost:3000";

http.get(url, (res) => {
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => {
    const ok = res.statusCode === 200 && /Master Psychology|psychologyOS/i.test(body);
    console.log(`HTTP ${res.statusCode} ${ok ? "PASS" : "CHECK"}`);
    process.exitCode = ok ? 0 : 1;
  });
}).on("error", (err) => {
  console.error(`Smoke test failed: ${err.message}`);
  process.exitCode = 1;
});
