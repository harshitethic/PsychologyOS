# HEPlay Cloud

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/harshitethic/PsychologyOS/tree/heplay-cloudflare/heplay-worker)

Owner-only Cloudflare Worker for HEPlay.

- No HEPlay signup for users.
- Users only scan their own Telegram QR.
- Owner opens `/admin`, enters the admin PIN, then stores one Telegram API ID/hash globally.
- Each Fire TV keeps its own Telegram TDLib session locally.
- KV stores the global app configuration.
- `/api/config` is intended for HEPlay TV clients.

## Deploy

1. Click **Deploy to Cloudflare** above.
2. Sign in to your Cloudflare account.
3. Keep the Worker name `heplay-cloud` (or choose another).
4. For `ADMIN_PIN`, enter `011105`.
5. Let Cloudflare provision the KV namespace and deploy.
6. Open the generated `https://<worker>.<account>.workers.dev/admin` URL.
7. Enter your Telegram API ID/hash once and save.

After that normal HEPlay users simply open the app and scan their own Telegram QR.

HEPlay v0.6 reads the backend address from a remote bootstrap file, so the Worker URL can be changed later without rebuilding all installed APKs.

Security note: Telegram app credentials ultimately have to reach TDLib on each client. The Worker keeps them out of the normal UI and centralizes management, but a determined owner of a client device can still extract them.
