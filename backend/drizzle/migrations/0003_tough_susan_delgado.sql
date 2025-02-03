CREATE TABLE "sensor_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"sensor_id" integer NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp without time zone DEFAULT (now() at time zone 'utc') NOT NULL,
	CONSTRAINT "sensor_data_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "sensor_template" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "sensor_template_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "bme68x_data" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "bme68x_data" CASCADE;--> statement-breakpoint
ALTER TABLE "sensor" ADD COLUMN "sensor_template_id" integer;--> statement-breakpoint
ALTER TABLE "sensor_data" ADD CONSTRAINT "sensor_data_sensor_id_sensor_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor" ADD CONSTRAINT "sensor_sensor_template_id_sensor_template_id_fk" FOREIGN KEY ("sensor_template_id") REFERENCES "public"."sensor_template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor" DROP COLUMN "type";--> statement-breakpoint
DROP TYPE "public"."sensor_type";