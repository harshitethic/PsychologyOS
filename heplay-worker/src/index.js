const te = new TextEncoder();
const td = new TextDecoder();
const SESSION_COOKIE = "heplay_admin";
const CONFIG_KEY = "telegram_config";
const MAX_ATTEMPTS = 10;

function base64url(bytes) {
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64url(value) {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function json(value, status = 200, headers = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function parseCookies(request) {
  const raw = request.headers.get("cookie") || "";
  return Object.fromEntries(
    raw.split(";").map(v => v.trim()).filter(Boolean).map(v => {
      const i = v.indexOf("=");
      return [decodeURIComponent(v.slice(0, i)), decodeURIComponent(v.slice(i + 1))];
    })
  );
}

async function hmac(pin, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    te.encode(pin),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return base64url(await crypto.subtle.sign("HMAC", key, te.encode(value)));
}

async function makeSession(pin) {
  const exp = Date.now() + 12 * 60 * 60 * 1000;
  const nonce = base64url(crypto.getRandomValues(new Uint8Array(12)));
  const body = `${exp}.${nonce}`;
  return `${body}.${await hmac(pin, body)}`;
}

async function validSession(request, pin) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = await hmac(pin, `${exp}.${nonce}`);
  return sig === expected;
}

async function encryptionKey(pin) {
  const digest = await crypto.subtle.digest("SHA-256", te.encode(`heplay-config-v1:${pin}`));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptConfig(config, pin) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(pin);
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    te.encode(JSON.stringify(config))
  );
  return `${base64url(iv)}.${base64url(cipher)}`;
}

async function decryptConfig(value, pin) {
  if (!value) return null;
  const [ivText, cipherText] = value.split(".");
  if (!ivText || !cipherText) return null;
  try {
    const key = await encryptionKey(pin);
    const clear = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64url(ivText) },
      key,
      fromBase64url(cipherText)
    );
    return JSON.parse(td.decode(clear));
  } catch {
    return null;
  }
}

async function getStoredConfig(env, pin) {
  return decryptConfig(await env.CONFIG.get(CONFIG_KEY), pin);
}

async function loginAllowed(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const key = `login:${ip}`;
  const current = Number(await env.CONFIG.get(key) || "0");
  return { ip, key, current, allowed: current < MAX_ATTEMPTS };
}

async function noteLoginFailure(env, state) {
  await env.CONFIG.put(state.key, String(state.current + 1), { expirationTtl: 900 });
}

async function clearLoginFailures(env, state) {
  await env.CONFIG.delete(state.key);
}

function adminHtml() {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HEPlay Admin</title>
<style>
:root{color-scheme:dark;--red:#e50914;--bg:#050505;--panel:#121212;--line:#2c2c2c;--muted:#999}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 15% 0,#310508 0,transparent 32%),var(--bg);font-family:Inter,system-ui,-apple-system,sans-serif;color:#fff;min-height:100vh}
.wrap{max-width:920px;margin:auto;padding:48px 22px}.brand{font-size:34px;font-weight:950;letter-spacing:.4px}.brand b{color:var(--red)}
.card{margin-top:28px;background:linear-gradient(180deg,#161616,#0d0d0d);border:1px solid var(--line);border-radius:24px;padding:28px;box-shadow:0 25px 80px #0009}
.grid{display:grid;grid-template-columns:1.3fr .75fr;gap:20px}.eyebrow{font-size:12px;letter-spacing:.16em;color:#f16068;font-weight:800}.muted{color:var(--muted);line-height:1.55}
label{display:block;font-size:13px;font-weight:800;margin:18px 0 7px}input{width:100%;padding:14px 15px;background:#080808;border:1px solid #333;color:#fff;border-radius:12px;font-size:16px;outline:none}
input:focus{border-color:var(--red);box-shadow:0 0 0 3px #e5091425}button{margin-top:20px;padding:14px 18px;border:0;border-radius:12px;background:var(--red);color:#fff;font-size:15px;font-weight:900;cursor:pointer}
.pill{display:inline-block;background:#1d1d1d;border:1px solid #333;border-radius:999px;padding:7px 10px;font-size:12px}.row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.msg{margin-top:14px;padding:12px;border-radius:10px;background:#191919}.bad{color:#ff878e}.ok{color:#75e2a5}.hidden{display:none!important}code{word-break:break-all;color:#ddd}
@media(max-width:720px){.grid{grid-template-columns:1fr}.wrap{padding-top:28px}}
</style>
</head>
<body>
<main class="wrap">
  <div class="row"><div class="brand"><b>HE</b>PLAY</div><span class="pill">Cloudflare</span></div>

  <section id="loginCard" class="card">
    <div class="eyebrow">OWNER ONLY</div>
    <h1>HEPlay Admin</h1>
    <p class="muted">Normal HEPlay users never create an account. They only scan their own Telegram QR.</p>
    <form id="loginForm">
      <label>Admin PIN</label>
      <input id="pin" type="password" inputmode="numeric" autocomplete="current-password" placeholder="••••••" required>
      <button>Unlock</button>
    </form>
    <div id="loginMsg" class="msg bad hidden"></div>
  </section>

  <div id="adminArea" class="grid hidden">
    <section class="card">
      <div class="eyebrow">GLOBAL TELEGRAM APP</div>
      <h1>Configure once</h1>
      <p class="muted">These application credentials are shared by HEPlay itself. Every Fire TV still signs into a separate Telegram account and keeps its own session locally.</p>
      <form id="configForm">
        <label>Telegram API ID</label>
        <input id="apiId" inputmode="numeric" placeholder="12345678" required>
        <label>Telegram API Hash</label>
        <input id="apiHash" type="password" placeholder="Paste API hash" required>
        <button>Save globally</button>
      </form>
      <div id="saveMsg" class="msg hidden"></div>
    </section>
    <aside class="card">
      <div class="eyebrow">STATUS</div>
      <h2 id="status">Checking…</h2>
      <p class="muted">Users: <b>no HEPlay signup</b><br>Login: Telegram QR only<br>Session: stored on each Fire TV</p>
      <p class="muted">Backend URL<br><code id="origin"></code></p>
      <button id="logout" style="background:#262626">Lock admin</button>
    </aside>
  </div>
</main>
<script>
const qs=s=>document.querySelector(s);
qs('#origin').textContent=location.origin;
async function load(){
  const r=await fetch('/api/admin/config',{cache:'no-store'});
  if(r.status===401){qs('#loginCard').classList.remove('hidden');qs('#adminArea').classList.add('hidden');return}
  if(!r.ok){qs('#loginMsg').textContent='Admin is not configured on this Worker.';qs('#loginMsg').classList.remove('hidden');return}
  const j=await r.json();
  qs('#loginCard').classList.add('hidden');qs('#adminArea').classList.remove('hidden');
  qs('#status').textContent=j.configured?'Configured ✓':'Waiting for API credentials';
  if(j.api_id)qs('#apiId').value=j.api_id;
  qs('#apiHash').placeholder=j.configured?'Enter hash only to replace current configuration':'Paste API hash';
}
qs('#loginForm').addEventListener('submit',async e=>{
  e.preventDefault();const box=qs('#loginMsg');box.classList.add('hidden');
  const r=await fetch('/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({pin:qs('#pin').value})});
  if(r.ok){qs('#pin').value='';await load()}else{const j=await r.json().catch(()=>({}));box.textContent=j.error||'Login failed';box.classList.remove('hidden')}
});
qs('#configForm').addEventListener('submit',async e=>{
  e.preventDefault();const box=qs('#saveMsg');box.classList.remove('hidden');box.className='msg';box.textContent='Saving…';
  const r=await fetch('/api/admin/config',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({api_id:Number(qs('#apiId').value),api_hash:qs('#apiHash').value})});
  const j=await r.json().catch(()=>({}));
  if(r.ok){box.classList.add('ok');box.textContent='Saved. HEPlay clients can now go straight to Telegram QR.';qs('#apiHash').value='';await load()}else{box.classList.add('bad');box.textContent=j.error||'Save failed'}
});
qs('#logout').addEventListener('click',async()=>{await fetch('/api/admin/logout',{method:'POST'});location.reload()});
load();
</script>
</body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pin = String(env.ADMIN_PIN || "").trim();

    if (url.pathname === "/health") {
      return json({ ok: true, service: "heplay-cloud", time: new Date().toISOString() });
    }

    if (url.pathname === "/" && request.method === "GET") {
      return new Response(`HEPlay Cloud is online. Owner: ${url.origin}/admin`, {
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" }
      });
    }

    if (url.pathname === "/admin" && request.method === "GET") {
      return new Response(adminHtml(), {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "x-frame-options": "DENY",
          "content-security-policy": "default-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'"
        }
      });
    }

    if (url.pathname === "/api/admin/login" && request.method === "POST") {
      if (!pin) return json({ error: "ADMIN_PIN is not configured" }, 503);
      const state = await loginAllowed(request, env);
      if (!state.allowed) return json({ error: "Too many attempts. Try again later." }, 429);
      const body = await request.json().catch(() => ({}));
      if (String(body.pin || "") !== pin) {
        await noteLoginFailure(env, state);
        return json({ error: "Wrong PIN" }, 401);
      }
      await clearLoginFailures(env, state);
      const token = await makeSession(pin);
      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
          "set-cookie": `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`
        }
      });
    }

    if (url.pathname === "/api/admin/logout" && request.method === "POST") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "set-cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
        }
      });
    }

    if (url.pathname === "/api/admin/config") {
      if (!pin) return json({ error: "ADMIN_PIN is not configured" }, 503);
      if (!(await validSession(request, pin))) return json({ error: "Unauthorized" }, 401);

      if (request.method === "GET") {
        const cfg = await getStoredConfig(env, pin);
        return json({
          configured: !!cfg,
          api_id: cfg?.api_id || null,
          revision: cfg?.revision || 0,
          updated_at: cfg?.updated_at || null
        });
      }

      if (request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        const apiId = Number(body.api_id);
        const apiHash = String(body.api_hash || "").trim();
        if (!Number.isInteger(apiId) || apiId <= 0 || apiHash.length < 8 || apiHash.length > 128) {
          return json({ error: "Invalid Telegram API ID/hash" }, 400);
        }
        const old = await getStoredConfig(env, pin);
        const cfg = {
          api_id: apiId,
          api_hash: apiHash,
          revision: (old?.revision || 0) + 1,
          updated_at: new Date().toISOString()
        };
        await env.CONFIG.put(CONFIG_KEY, await encryptConfig(cfg, pin));
        return json({ ok: true, revision: cfg.revision, updated_at: cfg.updated_at });
      }

      return json({ error: "Method not allowed" }, 405);
    }

    if (url.pathname === "/api/config" && request.method === "GET") {
      const ua = request.headers.get("user-agent") || "";
      if (!ua.startsWith("HEPlay/")) return new Response("Not found", { status: 404 });
      if (!pin) return json({ configured: false, error: "Owner configuration pending" }, 503);
      const cfg = await getStoredConfig(env, pin);
      if (!cfg) return json({ configured: false, error: "Owner configuration pending" }, 503);
      return json({
        configured: true,
        api_id: cfg.api_id,
        api_hash: cfg.api_hash,
        revision: cfg.revision
      });
    }

    return new Response("Not found", { status: 404 });
  }
};
