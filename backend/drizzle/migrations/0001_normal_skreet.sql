CREATE TABLE IF NOT EXISTS "time_sheet_entry" (
	"hours" integer NOT NULL,
	"pricePerHour" double precision NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp without time zone DEFAULT (now() at time zone 'utc') NOT NULL,
	"time_sheet_id" uuid NOT NULL,
	CONSTRAINT "time_sheet_entry_date_time_sheet_id_pk" PRIMARY KEY("date","time_sheet_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "time_sheet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"default_price_per_hour" double precision,
	"default_hours" integer,
	"created_at" timestamp without time zone DEFAULT (now() at time zone 'utc') NOT NULL,
	"owner_id" integer NOT NULL,
	CONSTRAINT "time_sheet_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "time_sheet_entry" ADD CONSTRAINT "time_sheet_entry_time_sheet_id_time_sheet_id_fk" FOREIGN KEY ("time_sheet_id") REFERENCES "public"."time_sheet"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "time_sheet" ADD CONSTRAINT "time_sheet_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
