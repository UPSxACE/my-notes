import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const customDate = customType<{
  data: string;
  driverData: Date;
}>({
  dataType() {
    return "date";
  },
  fromDriver(value: Date): string {
    return value.toISOString().slice(0, 10);
  },
});

export const users = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 64 }).notNull(),
    fullName: varchar("full_name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    password: varchar("password", { length: 512 }),
    verified: boolean("verified").default(false).notNull(),
    deleted: boolean("deleted").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    bannedUntil: timestamp("banned_until", { mode: "string" }),
  },
  (users) => ({
    usernameIdx: index("user_name_idx").on(users.username),
    emailIdx: index("user_email_idx").on(users.email),
  })
);
