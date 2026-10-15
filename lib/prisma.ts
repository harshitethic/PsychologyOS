import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function databaseUrl() {
  const value = process.env.DATABASE_URL;
  if (!value?.startsWith("file:")) return value;
  const queryIndex = value.indexOf("?");
  const file = queryIndex < 0 ? value : value.slice(0, queryIndex);
  const params = new URLSearchParams(queryIndex < 0 ? "" : value.slice(queryIndex + 1));
  // SQLite has one writer. Concurrent interactive transactions in Prisma 6's
  // multi-connection pool can block the active transaction's subsequent work.
  // Queue requests on one shared connection instead of competing for its lock.
  params.set("connection_limit", "1");
  return `${file}?${params}`;
}

export const db = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: databaseUrl() });
// Production route bundles must share the same pool too.
globalForPrisma.prisma = db;
