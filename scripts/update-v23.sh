#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Psychology OS V23 updater"
echo "Preserving prisma/dev.db and .env"

if [[ -z "${ADMIN_PASSWORD:-}" ]]; then
  echo "Set ADMIN_PASSWORD to a unique 12+ character password before running this updater." >&2
  exit 1
fi

npm install
npm run admin:local

rm -rf .next
npx prisma generate
npx prisma db push

echo ""
echo "V23 ready."
echo "Admin: http://localhost:3000/admin"
echo "Username: ${ADMIN_USERNAME:-admin}"
echo "Password: supplied securely through ADMIN_PASSWORD (not printed)"
echo ""
npm run dev
