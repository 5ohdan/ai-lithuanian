import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";

const migrationsDir = resolve("src/db/migrations");
const files = readdirSync(migrationsDir, { recursive: true, encoding: "utf8" });
const migrations = files.filter((name) => name.endsWith(".sql")).sort();
const snapshots = files.filter((name) => name.endsWith("/snapshot.json")).sort();
const latestSnapshot = snapshots.at(-1);
assert.ok(latestSnapshot, "Missing Drizzle snapshot");

function database() {
  const root = mkdtempSync(join(tmpdir(), "ai-lithuanian-migrations-"));
  const migrationCopy = join(root, "migrations");
  mkdirSync(migrationCopy);
  const config = join(root, "wrangler.json");
  writeFileSync(
    config,
    JSON.stringify({
      name: "migration-test",
      compatibility_date: "2025-11-17",
      d1_databases: [
        {
          binding: "DB",
          database_name: "migration-test",
          database_id: "00000000-0000-0000-0000-000000000000",
          migrations_dir: migrationCopy,
          migrations_pattern: `${migrationCopy}/**/*.sql`,
        },
      ],
    }),
  );
  /** @param {string[]} args */
  function run(args, expectSuccess = true) {
    const result = spawnSync(
      process.execPath,
      [
        resolve("node_modules/wrangler/bin/wrangler.js"),
        "d1",
        ...args,
        "--config",
        config,
        "--local",
        "--persist-to",
        join(root, "state"),
      ],
      {
        encoding: "utf8",
        env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" },
        timeout: 60000,
      },
    );
    if (expectSuccess) assert.equal(result.status, 0, result.stdout + result.stderr);
    else assert.notEqual(result.status, 0, "Expected migration to reject invalid ownership");
    return result.stdout;
  }
  return {
    root,
    migrationCopy,
    /** @param {string[]} names */
    install(names) {
      for (const name of names) {
        mkdirSync(dirname(join(migrationCopy, name)), { recursive: true });
        cpSync(join(migrationsDir, name), join(migrationCopy, name));
      }
    },
    apply(expectSuccess = true) {
      run(["migrations", "apply", "DB"], expectSuccess);
    },
    /** @param {string} sql */
    query(sql) {
      const results = /** @type {{results: Record<string, string | number | null>[]}[]} */ (
        JSON.parse(run(["execute", "DB", "--command", sql, "--json"]))
      );
      return results.flatMap((result) => result.results);
    },
    close() {
      rmSync(root, { recursive: true, force: true });
    },
  };
}

const authUser = `INSERT INTO user (id,name,email,email_verified,created_at,updated_at)
  VALUES ('test-user','Test User','migration@example.invalid',1,1700000000,1700000000);`;
const legacyUser = `INSERT INTO users (id,email,provider,provider_id)
  VALUES ('test-user','migration@example.invalid','test','test-provider');`;
const pack = `INSERT INTO packs (id,title,difficulty,users_topic,user_id)
  VALUES ('test-pack','Test pack','beginner','food','test-user');`;

/** @param {ReturnType<typeof database>} db */
function assertSchema(db) {
  const columns = db.query("PRAGMA table_info(packs)");
  const snapshot =
    /** @type {{ddl: {entityType: string, name: string, table?: string, type?: string, notNull?: boolean, default?: string | null}[]}} */ (
      JSON.parse(readFileSync(join(migrationsDir, latestSnapshot), "utf8"))
    );
  for (const { name: table } of snapshot.ddl.filter((entry) => entry.entityType === "tables")) {
    const definition = {
      columns: Object.fromEntries(
        snapshot.ddl
          .filter((entry) => entry.entityType === "columns" && entry.table === table)
          .map((entry) => [entry.name, entry]),
      ),
    };
    const actual = db.query(`PRAGMA table_info(${table})`);
    assert.deepEqual(
      actual.map((column) => column.name).sort(),
      Object.keys(definition.columns).sort(),
      `${table} columns differ from schema snapshot`,
    );
    for (const column of actual) {
      const expected = definition.columns[String(column.name)];
      assert.equal(
        String(column.type).toLowerCase(),
        expected.type,
        `${table}.${column.name} type`,
      );
      assert.equal(
        Boolean(column.notnull),
        expected.notNull,
        `${table}.${column.name} nullability`,
      );
      assert.equal(column.dflt_value, expected.default ?? null, `${table}.${column.name} default`);
    }
  }
  for (const name of ["status", "error_message", "updated_at"]) {
    assert.ok(
      columns.some((column) => column.name === name),
      `Missing ${name}`,
    );
  }
  assert.equal(
    columns.find((column) => column.name === "updated_at").dflt_value,
    "CURRENT_TIMESTAMP",
  );
  for (const table of ["packs", "user_data"]) {
    assert.equal(db.query(`PRAGMA foreign_key_list(${table})`)[0].table, "user");
  }
  assert.deepEqual(db.query("PRAGMA foreign_key_check"), []);
  assert.deepEqual(db.query("SELECT name FROM sqlite_master WHERE name='users'"), []);
  assert.deepEqual(
    db.query("SELECT name FROM d1_migrations ORDER BY id").map((row) => row.name),
    migrations,
  );
}

void test("fresh D1 migrates and supports pack lifecycle defaults", () => {
  const db = database();
  try {
    db.install(migrations);
    db.apply();
    assertSchema(db);
    db.query(authUser + pack);
    const [row] = db.query("SELECT status,error_message,updated_at FROM packs");
    assert.equal(row.status, "initial_ready");
    assert.equal(row.error_message, null);
    assert.ok(row.updated_at);
    db.query("UPDATE packs SET status='failed',error_message='Mock failure' WHERE id='test-pack'");
    assert.equal(db.query("SELECT status FROM packs")[0].status, "failed");
    db.apply(); // Reapplying must be a no-op.
    assert.equal(db.query("SELECT COUNT(*) AS count FROM packs")[0].count, 1);
  } finally {
    db.close();
  }
});

void test("upgrade from production's 0000 preserves users, sessions, packs, words and preferences", () => {
  const db = database();
  try {
    db.install([migrations[0]]);
    db.apply();
    db.query(
      authUser +
        legacyUser +
        pack +
        `
      INSERT INTO session (id,expires_at,token,created_at,updated_at,user_id)
        VALUES ('test-session',2000000000,'fake-token',1700000000,1700000000,'test-user');
      INSERT INTO user_data (user_id,difficulty) VALUES ('test-user','beginner');
      INSERT INTO words (id,original,translation,transcription) VALUES ('test-word','labas','hello','labas');
      INSERT INTO pack_words (pack_id,word_id) VALUES ('test-pack','test-word');
      INSERT INTO meanings (word_id,context,translation,example,example_translation)
        VALUES ('test-word','greeting','hello','Labas!','Hello!');
    `,
    );
    const [before] = db.query("SELECT created_at FROM packs");
    db.install(migrations.slice(1));
    db.apply();
    assertSchema(db);
    for (const table of [
      "user",
      "session",
      "packs",
      "user_data",
      "words",
      "pack_words",
      "meanings",
    ]) {
      assert.equal(
        db.query(`SELECT COUNT(*) AS count FROM ${table}`)[0].count,
        1,
        `${table} data lost`,
      );
    }
    const [after] = db.query("SELECT created_at,updated_at,status FROM packs");
    assert.equal(after.created_at, before.created_at);
    assert.equal(after.updated_at, before.created_at);
    assert.equal(after.status, "initial_ready");
  } finally {
    db.close();
  }
});

void test("upgrade rejects legacy owners without an auth user and rolls back without data loss", () => {
  const db = database();
  try {
    db.install([migrations[0]]);
    db.apply();
    db.query(legacyUser + pack);
    db.install(migrations.slice(1));
    db.apply(false);
    assert.equal(db.query("SELECT COUNT(*) AS count FROM packs")[0].count, 1);
    assert.equal(db.query("SELECT COUNT(*) AS count FROM users")[0].count, 1);
    assert.equal(db.query("PRAGMA foreign_key_list(packs)")[0].table, "users");
    assert.equal(db.query("SELECT COUNT(*) AS count FROM d1_migrations")[0].count, 1);
  } finally {
    db.close();
  }
});

void test("Drizzle generation is a no-op for current schema and new nested SQL is applied by D1", () => {
  const db = database();
  try {
    db.install([...migrations, ...snapshots]);
    /** @param {string} schema */
    function generate(schema) {
      const result = spawnSync(
        process.execPath,
        [
          resolve("node_modules/drizzle-kit/bin.cjs"),
          "generate",
          "--dialect",
          "sqlite",
          "--schema",
          schema,
          "--out",
          "./migrations",
          "--casing",
          "snake_case",
          "--name",
          "generator_probe",
        ],
        { cwd: db.root, encoding: "utf8", timeout: 60000 },
      );
      assert.equal(result.status, 0, result.stdout + result.stderr);
      return result.stdout;
    }
    assert.match(generate(resolve("src/db/schema.ts")), /No schema changes/);
    assert.deepEqual(
      readdirSync(db.migrationCopy, { recursive: true, encoding: "utf8" })
        .filter((name) => name.endsWith(".sql"))
        .sort(),
      migrations,
    );
    db.apply();
    const schema = join(db.root, "probe-schema.ts");
    writeFileSync(
      schema,
      `export * from ${JSON.stringify(resolve("src/db/schema.ts"))};
      import { sqliteTable, text } from ${JSON.stringify(resolve("node_modules/drizzle-orm/sqlite-core/index.js"))};
      export const migrationProbe = sqliteTable("migration_probe", { id: text().primaryKey().notNull() });`,
    );
    generate(schema);
    const generated = readdirSync(db.migrationCopy, { recursive: true, encoding: "utf8" }).filter(
      (name) => name.endsWith("/migration.sql"),
    );
    assert.equal(
      generated.length,
      1,
      "Expected one new nested migration, no duplicate historical SQL",
    );
    db.apply();
    assert.equal(db.query("PRAGMA table_info(migration_probe)")[0].name, "id");
    assert.deepEqual(
      db.query("SELECT name FROM d1_migrations ORDER BY id").map((row) => row.name),
      [...migrations, ...generated],
    );
    assert.match(generate(schema), /No schema changes/);
  } finally {
    db.close();
  }
});
