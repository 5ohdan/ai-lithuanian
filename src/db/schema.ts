import { sqliteTable, integer, text, primaryKey, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { nanoid } from "nanoid";

export const words = sqliteTable("words", {
  id: text()
    .$defaultFn(() => nanoid())
    .primaryKey()
    .notNull(),
  original: text().notNull(),
  translation: text().notNull(),
  transcription: text().notNull(),
  partOfSpeech: text("part_of_speech"),
  gender: text(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const meanings = sqliteTable("meanings", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  wordId: text("word_id").references(() => words.id),
  context: text().notNull(),
  translation: text().notNull(),
  example: text().notNull(),
  exampleTranslation: text("example_translation").notNull(),
});

export const packs = sqliteTable("packs", {
  id: text()
    .$defaultFn(() => nanoid())
    .primaryKey()
    .notNull(),
  title: text().notNull(),
  difficulty: text().notNull(),
  status: text().notNull().default("initial_ready"),
  errorMessage: text("error_message"),
  usersTopic: text("users_topic").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => new Date()),
  userId: text("user_id").references(() => user.id),
});

export const packWords = sqliteTable(
  "pack_words",
  {
    packId: text("pack_id")
      .references(() => packs.id)
      .notNull(),
    wordId: text("word_id")
      .references(() => words.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.packId, table.wordId] })],
);

export const userData = sqliteTable("user_data", {
  userId: text("user_id")
    .references(() => user.id)
    .primaryKey()
    .notNull(),
  difficulty: text().notNull(),
});

export const user = sqliteTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
    image: text(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [uniqueIndex("user_email_unique").on(table.email)],
);

export const session = sqliteTable(
  "session",
  {
    id: text().primaryKey().notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text().notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("session_token_unique").on(table.token)],
);

export const account = sqliteTable("account", {
  id: text().primaryKey().notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text(),
  password: text(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export type User = InferSelectModel<typeof user>;
export type Word = InferSelectModel<typeof words>;
export type Meaning = InferSelectModel<typeof meanings>;
export type Pack = InferSelectModel<typeof packs>;
export type PackWord = InferSelectModel<typeof packWords>;
export type UserData = InferSelectModel<typeof userData>;
