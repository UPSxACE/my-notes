import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as confirmationmailsSchema from "./database/confirmation-mails";
import * as recoverymailsSchema from "./database/recovery-mails";
import * as mailLogsSchema from "./database/mail-logs";
import * as usersSchema from "./database/users";

export function initDrizzle() {
  if (!process.env.DB_CONNECTION_STRING) {
    throw new Error("Missing DB_CONNECTION_STRING environment variable");
  }

  // for migrations
  const migrationClient = postgres(process.env.DB_CONNECTION_STRING, {
    max: 1,
  });
  migrate(drizzle(migrationClient), { migrationsFolder: "migrations" });
  // for query purposes
  const queryClient = postgres(process.env.DB_CONNECTION_STRING);
  const db = drizzle(queryClient, {
    schema: {
      ...usersSchema,
      ...mailLogsSchema,
      ...confirmationmailsSchema,
      ...recoverymailsSchema,
    },
  });

  return db;
}

export type Db = ReturnType<typeof initDrizzle>;
