import { pgTable } from "drizzle-orm/pg-core";
import { PgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull()
});

export const notes = pgTable("notes", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id),
    title: text("title").notNull(),
    body: text("body"),
    created_at: timestamp("created_at").defaultNow().notNull()
});

export const passwordResetCodes = pgTable("password_reset_codes", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id),
    code: text("code").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull()
});