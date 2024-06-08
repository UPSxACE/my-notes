import {
  boolean,
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const mailLogs = pgTable(
  "mail_log",
  {
    id: serial("id").primaryKey(),
    reason: varchar("reason").notNull(),
    sent: boolean("sent").default(false).notNull(),
    sentAt: timestamp("sent_at", { mode: "string" }),
    lastAttempt: timestamp("last_attempt", { mode: "string" }),
  },
  (mailLogs) => ({
    reasonIdx: index("mail_log_reason_idx").on(mailLogs.reason),
  })
);
