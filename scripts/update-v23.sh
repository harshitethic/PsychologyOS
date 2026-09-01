#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Psychology OS V23 updater"
echo "Preserving prisma/dev.db and .env"

npm install
ADMIN_PASSWORD='hack2use.' npm run admin:local

rm -rf .next
npx prisma generate
npx prisma db push

echo ""
echo "V23 ready."
echo "Admin: http://localhost:3000/admin"
echo "Username: admin"
echo "Password: hack2use."
echo ""
npm run dev
