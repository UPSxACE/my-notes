CREATE TABLE IF NOT EXISTS "confirmation_mail" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" varchar(64) NOT NULL,
	"user_id" serial NOT NULL,
	"mail_id" serial NOT NULL,
	"code" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mail_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"reason" varchar NOT NULL,
	"sent" boolean DEFAULT false NOT NULL,
	"sent_at" timestamp
);
--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "email_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "confirmation_mail" ADD CONSTRAINT "confirmation_mail_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "confirmation_mail" ADD CONSTRAINT "confirmation_mail_mail_id_mail_log_id_fk" FOREIGN KEY ("mail_id") REFERENCES "public"."mail_log"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "confirmation_mails_user_id_idx" ON "confirmation_mail" USING btree (uuid);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "confirmation_mail_uuid_idx" ON "confirmation_mail" USING btree (user_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "confirmation_mail_mail_id_idx" ON "confirmation_mail" USING btree (mail_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "mail_log_reason_idx" ON "mail_log" USING btree (reason);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_name_idx" ON "user" USING btree (username);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user" USING btree (email);