CREATE TABLE IF NOT EXISTS "recovery_mail" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" varchar(64) NOT NULL,
	"user_id" serial NOT NULL,
	"mail_id" serial NOT NULL,
	"code" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recovery_mail" ADD CONSTRAINT "recovery_mail_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recovery_mail" ADD CONSTRAINT "recovery_mail_mail_id_mail_log_id_fk" FOREIGN KEY ("mail_id") REFERENCES "public"."mail_log"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recovery_mails_user_id_idx" ON "recovery_mail" USING btree (uuid);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recovery_mail_uuid_idx" ON "recovery_mail" USING btree (user_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recovery_mail_mail_id_idx" ON "recovery_mail" USING btree (mail_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recovery_mail_code_idx" ON "recovery_mail" USING btree (code);