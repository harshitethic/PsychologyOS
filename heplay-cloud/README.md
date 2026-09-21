# HEPlay Cloud

Owner-only global Telegram app configuration for the multi-user HEPlay client.

- Owner opens `/admin` and enters the Telegram API ID/hash once.
- Every HEPlay TV fetches `/api/config`.
- Every device then authenticates its own Telegram account via QR.
- Telegram sessions and libraries never live in this backend.

## Vercel setup
Set this folder as the Vercel project root. Connect a **Private Vercel Blob** store and configure:
- `ADMIN_PIN=011105`
- `SESSION_SECRET=<random long secret>`
- `CONFIG_ENCRYPTION_KEY=<32-byte base64 random key>`

The backend stores the Telegram application config encrypted in private Blob storage.
