# Prisma dependency security decision

Verified 15 October 2026. The installed Prisma CLI and client remain at
6.19.3; this change does not change the schema, database driver or file path.

## Root cause and repair

`npm audit` reported three high-severity entries: `prisma`, `@prisma/config`
and `deepmerge-ts`. These were **one underlying advisory propagated through
the dependency tree**, not three independently demonstrated application exploits.
Prisma config 6.19.3 pins deepmerge-ts 7.1.5. Its recursive-object merge can
exhaust the stack ([GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx)).
Plain JSON cannot represent these cycles, and no remote exploit through this
application's request handlers was demonstrated.

The fix is an npm override **scoped to @prisma/config**, installing the patched
deepmerge-ts 8.0.2. No advisory is ignored or suppressed. The lockfile records
the real replacement package and integrity hash. The same cyclic-object
regression throws `RangeError` on the old tree and passes with the replacement.

This is a major-version transitive override, so compatibility is explicitly
tested rather than assumed. Upstream's [v8 release notes](https://github.com/RebeccaStevens/deepmerge-ts/releases/tag/v8.0.0)
describe changed Map merging, metadata types and `deepmergeInto` mutation
semantics. Prisma's inspected config-loader call site uses `deepmerge` as
its c12 merger; this project's configuration uses ordinary records, not Maps
or custom merge metadata. Tests exercise nested config merging and the actual
Prisma config loader as well as recursive `deepmerge`/`deepmergeInto` inputs.

## Verification

```bash
npm ci
npm run test:prisma-dependency
npm run check
npm run test:admin-setup
npm run test:health
npm run doctor
npm audit --audit-level=high
npm run build
```

The audit gate includes development dependencies. It fails for high/critical
advisories and for audit-service errors; it does not replace CodeQL or testing.
Reassess this override when upgrading Prisma, and remove it when the upstream
dependency itself resolves to a patched compatible release. Future config
using Maps or custom merge metadata needs new compatibility review.

## Why no database major migration here

The previous Prisma 7 PR failed schema validation, and the current audit
range also includes Prisma 7's config dependency chain. A major database
upgrade was therefore not established as the necessary security repair.
Prisma 7 remains a separate compatibility project: config location, explicit
driver adapter, SQLite file-path semantics, existing timestamps and safe seed
behavior must be verified against isolated copies first. Never run a seed or
schema push against production solely to clear an audit warning.

Rollback requires reverting the override and lockfile together and running
`npm ci`; it needs no data migration, but would restore the vulnerable package.
