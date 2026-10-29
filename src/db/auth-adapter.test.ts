import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/node-sqlite";
import { getTableColumns } from "drizzle-orm";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getSchema } from "better-auth/db";
import * as schema from "./schema";
import { relations } from "./relations";

const options = {
  secret: "unit-test-secret-not-used-in-production-1234567890",
  socialProviders: {
    google: { clientId: "test-google", clientSecret: "test-google-secret" },
    github: { clientId: "test-github", clientSecret: "test-github-secret" },
  },
};

let sqlite: DatabaseSync;
let adapter: ReturnType<ReturnType<typeof drizzleAdapter>>;
const now = new Date("2026-01-01T00:00:00Z");
const user = {
  id: "test-user",
  name: "Test User",
  email: "test@example.invalid",
  emailVerified: true,
  createdAt: now,
  updatedAt: now,
};

beforeEach(() => {
  sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys=ON");
  for (const name of [
    "0000_mighty_starjammers.sql",
    "0001_motionless_swarm.sql",
    "0002_pack_lifecycle.sql",
  ]) {
    const sql = readFileSync(new URL(`./migrations/${name}`, import.meta.url), "utf8");
    sqlite.exec(`BEGIN;\n${sql}\nCOMMIT;`);
  }
  const db = drizzle({ client: sqlite, relations });
  adapter = drizzleAdapter(db, { provider: "sqlite", schema })(options);
});

afterEach(() => {
  sqlite.close();
});

describe("Better Auth 1.7 and Drizzle RC5 adapter compatibility", () => {
  it("has every field required by the configured social-login models", () => {
    const authTables = getSchema(options);
    const tables = {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    };
    for (const [name, table] of Object.entries(tables)) {
      const expected = authTables[name];
      expect(expected).toBeDefined();
      const fields = getTableColumns(table);
      for (const field of Object.keys(expected?.fields ?? {})) {
        expect(fields).toHaveProperty(field);
      }
    }
    expect(authTables.account?.fields).not.toHaveProperty("issuer");
  });

  it("creates and reads existing-style social accounts by provider and account IDs", async () => {
    await adapter.create({ model: "user", data: user, forceAllowId: true });
    await adapter.create({
      model: "account",
      forceAllowId: true,
      data: {
        id: "test-account",
        accountId: "provider-subject",
        providerId: "google",
        userId: user.id,
        createdAt: now,
        updatedAt: now,
      },
    });
    const found = await adapter.findOne<{ id: string; userId: string }>({
      model: "account",
      where: [
        { field: "providerId", value: "google" },
        { field: "accountId", value: "provider-subject" },
      ],
    });
    expect(found?.id).toBe("test-account");
    expect(found?.userId).toBe(user.id);
    expect(
      await adapter.findOne({
        model: "account",
        where: [
          { field: "providerId", value: "github" },
          { field: "accountId", value: "provider-subject" },
        ],
      }),
    ).toBeNull();
  });

  it("persists, reads, updates and deletes sessions with snake_case columns", async () => {
    await adapter.create({ model: "user", data: user, forceAllowId: true });
    const expiresAt = new Date("2027-01-01T00:00:00Z");
    await adapter.create({
      model: "session",
      forceAllowId: true,
      data: {
        id: "test-session",
        userId: user.id,
        token: "fake-session-token",
        expiresAt,
        createdAt: now,
        updatedAt: now,
        ipAddress: "127.0.0.1",
        userAgent: "unit-test",
      },
    });
    const where = [{ field: "token", value: "fake-session-token" }];
    const found = await adapter.findOne<{ userId: string; ipAddress: string; expiresAt: Date }>({
      model: "session",
      where,
    });
    expect(found?.userId).toBe(user.id);
    expect(found?.ipAddress).toBe("127.0.0.1");
    expect(found?.expiresAt).toEqual(expiresAt);
    await adapter.update({ model: "session", where, update: { ipAddress: "127.0.0.2" } });
    expect(
      (await adapter.findOne<{ ipAddress: string }>({ model: "session", where }))?.ipAddress,
    ).toBe("127.0.0.2");
    await adapter.delete({ model: "session", where });
    expect(await adapter.findOne({ model: "session", where })).toBeNull();
  });
});
