CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(64)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "user" USING btree (username);