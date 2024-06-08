import { relations } from "drizzle-orm";
import {} from "drizzle-orm/mysql-core";
import {
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { mailLogs } from "./mail-logs";
import { users } from "./users";

export const recoveryMails = pgTable(
  "recovery_mail",
  {
    id: serial("id").primaryKey(),
    uuid: varchar("uuid", { length: 64 }).notNull(),
    userId: serial("user_id")
      .references(() => users.id)
      .notNull(),
    mailId: serial("mail_id")
      .references(() => mailLogs.id)
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    usedAt: timestamp("used_at", { mode: "string" }),
  },
  (recoveryMails) => ({
    userIdIdx: index("recovery_mails_user_id_idx").on(recoveryMails.uuid),
    uuidIdx: index("recovery_mail_uuid_idx").on(recoveryMails.userId),
    mailIdIdx: index("recovery_mail_mail_id_idx").on(recoveryMails.mailId),
  })
);

export const recoveryMailsRelations = relations(recoveryMails, ({ one }) => ({
  user: one(users, {
    fields: [recoveryMails.userId],
    references: [users.id],
  }),
  mail: one(mailLogs, {
    fields: [recoveryMails.mailId],
    references: [mailLogs.id],
  }),
}));
