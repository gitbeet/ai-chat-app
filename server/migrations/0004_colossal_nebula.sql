ALTER TABLE "users" ALTER COLUMN "email" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;