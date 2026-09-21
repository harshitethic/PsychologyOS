# HEPlay Cloud

Owner-only Cloudflare Worker for HEPlay.

- No HEPlay signup for users.
- Users only scan their own Telegram QR.
- Owner opens `/admin`, enters the admin PIN, then stores one Telegram API ID/hash globally.
- Each Fire TV keeps its own Telegram TDLib session locally.
- KV stores the global app configuration.
- `/api/config` is intended for HEPlay TV clients.

After deployment, copy the generated `https://<worker>.<account>.workers.dev` URL. HEPlay uses a remote bootstrap file, so the backend URL can be changed without rebuilding every installed APK.

Security note: Telegram app credentials ultimately have to reach TDLib on each client. The Worker keeps them out of the normal UI and centralizes management, but a determined owner of a client device can still extract them.
