ALTER TABLE "mail_log" ADD COLUMN "last_attempt" timestamp;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "confirmation_mail_code_idx" ON "confirmation_mail" USING btree (code);