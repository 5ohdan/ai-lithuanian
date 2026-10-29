# Database releases

SQL files in `src/db/migrations` are applied by Wrangler, which records filenames
in `d1_migrations`. Do not mix this ledger with `drizzle-kit migrate`, rename
historical SQL files, or use `db:push` on production.

## Local validation

```sh
pnpm db:test
pnpm db:migrate
```

`db:test` uses disposable local D1 databases, fake users, and no production
credentials. It covers fresh installation, populated upgrades, lifecycle defaults,
foreign keys, schema snapshot parity, reapplication, and rollback on invalid
legacy ownership. CI runs it before building/deploying.

`db:migrate` explicitly targets your normal local development database. Back up
valuable local data first. It does not migrate production.

## Current repair

Production inspection found only `0000_mighty_starjammers.sql` applied, one auth
user, and no packs. Recheck before release: these observations can become stale.

- Pending `0001_motionless_swarm.sql` is corrected for D1's always-on foreign
  keys. It switches pack/preference ownership to the auth `user` table and drops
  legacy `users`. It does not migrate legacy identities into auth identities.
- `0002_pack_lifecycle.sql` adds `status`, `error_message`, and `updated_at`.
  Existing packs become `initial_ready`; their creation time is preserved and
  used to initialize the update time.
- Both table-rebuild migrations validate foreign keys before clearing deferred
  checks. Invalid ownership fails and rolls back rather than discarding rows.

`0001` was amended because it is still pending on the inspected production DB.
If another environment already applied it, review that environment separately;
Wrangler does not reapply a migration just because its contents changed.

## Production release (explicit approval required)

Use an identity with D1 read/write permissions. The GitHub Workers Editor token
is for Worker deployments, not direct database management. Confirm the target is
`DB` / `ai-lithuanian` in the intended account before running remote commands.

1. Inspect pending migrations, schema, row counts, and foreign keys:

   ```sh
   pnpm exec wrangler d1 migrations list DB --remote
   pnpm exec wrangler d1 execute DB --remote --command "SELECT name, applied_at FROM d1_migrations ORDER BY id; PRAGMA table_info(packs); PRAGMA foreign_key_check;"
   ```

   Check packs and preferences for legacy owners missing from auth `user` before
   running `0001`. If any exist, stop and design an identity mapping; do not reset
   or silently delete the affected data.

2. Arrange a quiet/maintenance window for the table rebuild. Capture a Time
   Travel bookmark and export a backup to a private location:

   ```sh
   mkdir -p .backups
   chmod 700 .backups
   pnpm exec wrangler d1 time-travel info DB --json
   pnpm exec wrangler d1 export DB --remote --output .backups/before-migration.sql
   chmod 600 .backups/before-migration.sql
   ```

   Save the bookmark privately. Verify the export can be restored to a disposable
   database before treating it as a usable backup. Exports contain sensitive auth
   data: never commit or upload them to public CI artifacts. `.backups/` is ignored.

3. After approval, apply reviewed SQL, then verify migration history, schema,
   foreign keys, and pre/post row counts:

   ```sh
   pnpm db:migrate:remote
   pnpm exec wrangler d1 execute DB --remote --command "SELECT name FROM d1_migrations ORDER BY id; PRAGMA table_info(packs); PRAGMA foreign_key_check;"
   ```

   A migration failure rolls back that migration, not earlier successful ones.
   Confirm actual state before retrying. Do not automatically restore production:
   a Time Travel restore can discard writes made after the captured bookmark.

4. Smoke-test the application. Future changes should expand the schema first,
   deploy compatible code second, and remove old fields only in a later release.
   Reverting Worker code does not revert database changes.

## Drizzle generator compatibility

The installed Drizzle beta requires v7 snapshots and a nested history layout.
Running `drizzle-kit up` without preserving historical SQL filenames would
conflict with production's filename-based migration ledger. Do not repeat the
layout conversion or rename the existing flat SQL files. This repository has now converted snapshots to v7 while retaining the existing
flat SQL filenames. Historical snapshot directories intentionally contain no
`migration.sql`, so the same historical SQL cannot be applied twice.

`pnpm db:generate --name describe_change` now works without a database connection.
It writes new migrations as timestamped directories containing `snapshot.json`
and `migration.sql`. Wrangler's `migrations_pattern` discovers both the old flat
SQL and new nested SQL; D1 continues recording each path relative to
`src/db/migrations`.

Review generated SQL for D1 compatibility before applying it. Drizzle can still
emit `PRAGMA foreign_keys=OFF` during table rebuilds: use deferred checks plus
explicit foreign-key validation as in the reviewed repair migrations. Be
especially careful when rebuilding parents of `ON DELETE CASCADE` relationships.
Run `pnpm db:test` after every schema/migration change. Tests also verify no-op
generation and that Wrangler discovers a newly generated nested migration.

See [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/) and
[D1 foreign keys](https://developers.cloudflare.com/d1/sql-api/foreign-keys/).
