import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { relations } from "./relations";
import { session, user } from "./schema";

// Only compile SQL; no D1 methods are called and no database is accessed.
const db = drizzle({} as D1Database, { relations });

describe("Drizzle RC5 database compatibility", () => {
  it("selects auth session fields using existing snake_case database names", () => {
    const query = db
      .select({
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        userId: session.userId,
      })
      .from(session)
      .where(eq(session.token, "fake-token"))
      .toSQL();

    expect(query.sql).toContain('"ip_address"');
    expect(query.sql).toContain('"user_agent"');
    expect(query.sql).toContain('"user_id"');
    expect(query.params).toEqual(["fake-token"]);
  });

  it("inserts auth sessions without introducing camelCase database columns", () => {
    const query = db
      .insert(session)
      .values({
        id: "test-session",
        expiresAt: new Date("2027-01-01T00:00:00Z"),
        token: "fake-token",
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-01T00:00:00Z"),
        ipAddress: "127.0.0.1",
        userAgent: "unit-test",
        userId: "test-user",
      })
      .toSQL();

    for (const name of [
      "expires_at",
      "created_at",
      "updated_at",
      "ip_address",
      "user_agent",
      "user_id",
    ]) {
      expect(query.sql).toContain(`"${name}"`);
    }
    expect(query.sql).not.toContain('"ipAddress"');
    expect(query.sql).not.toContain('"userAgent"');
    expect(query.sql).not.toContain('"userId"');
    expect(query.params).toContain("test-user");
  });

  it("preserves the user lookup query used by the application", () => {
    const query = db.select().from(user).where(eq(user.id, "test-user")).limit(1).toSQL();
    expect(query.sql).toContain('"email_verified"');
    expect(query.sql).toContain('from "user"');
    expect(query.params).toEqual(["test-user", 1]);
  });
});
