import { relations } from "drizzle-orm";
import {} from "drizzle-orm/mysql-core";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { mailLogs } from "./mail-logs";
import { users } from "./users";

export const confirmationMails = pgTable(
  "confirmation_mail",
  {
    id: serial("id").primaryKey(),
    uuid: varchar("uuid", { length: 64 }).notNull(),
    userId: serial("user_id")
      .references(() => users.id)
      .notNull(),
    mailId: serial("mail_id")
      .references(() => mailLogs.id)
      .notNull(),
    code: integer("code").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (confirmationMails) => ({
    userIdIdx: index("confirmation_mails_user_id_idx").on(
      confirmationMails.uuid
    ),
    uuidIdx: index("confirmation_mail_uuid_idx").on(confirmationMails.userId),
    mailIdIdx: index("confirmation_mail_mail_id_idx").on(
      confirmationMails.mailId
    ),
    codeIdx: index("confirmation_mail_code_idx").on(confirmationMails.code),
  })
);

export const confirmationMailsRelations = relations(
  confirmationMails,
  ({ one }) => ({
    user: one(users, {
      fields: [confirmationMails.userId],
      references: [users.id],
    }),
    mail: one(mailLogs, {
      fields: [confirmationMails.mailId],
      references: [mailLogs.id],
    }),
  })
);
