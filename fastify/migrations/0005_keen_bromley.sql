DROP INDEX IF EXISTS "recovery_mail_code_idx";--> statement-breakpoint
ALTER TABLE "recovery_mail" DROP COLUMN IF EXISTS "code";