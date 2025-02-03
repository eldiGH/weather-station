ALTER TABLE "sensor_template" RENAME COLUMN "data" TO "fields";--> statement-breakpoint
ALTER TABLE "sensor_template" ADD COLUMN "author_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "sensor_template" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sensor_template" ADD COLUMN "created_at" timestamp without time zone DEFAULT (now() at time zone 'utc') NOT NULL;--> statement-breakpoint
ALTER TABLE "sensor_template" ADD CONSTRAINT "sensor_template_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;