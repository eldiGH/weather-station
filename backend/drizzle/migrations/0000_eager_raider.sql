DO $$ BEGIN
 CREATE TYPE "sensor_type" AS ENUM('BME68X');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bme68x_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"temperature" double precision NOT NULL,
	"humidity" double precision NOT NULL,
	"pressure" double precision NOT NULL,
	"gas_resistance" double precision NOT NULL,
	"battery_percentage" double precision NOT NULL,
	"sensor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bme68x_data_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kiosk" (
	"id" serial PRIMARY KEY NOT NULL,
	"kiosk_uuid" char(36) NOT NULL,
	"owner_id" integer NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	CONSTRAINT "kiosk_id_unique" UNIQUE("id"),
	CONSTRAINT "kiosk_kiosk_uuid_unique" UNIQUE("kiosk_uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kiosk_to_sensor" (
	"kiosk_id" integer NOT NULL,
	"sensor_id" integer NOT NULL,
	CONSTRAINT "kiosk_to_sensor_kiosk_id_sensor_id_pk" PRIMARY KEY("kiosk_id","sensor_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refresh_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" char(36) NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" char(36) NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_token_id_unique" UNIQUE("id"),
	CONSTRAINT "refresh_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sensor" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "sensor_type" NOT NULL,
	"secret" char(36) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"owner_id" integer NOT NULL,
	CONSTRAINT "sensor_id_unique" UNIQUE("id"),
	CONSTRAINT "sensor_secret_unique" UNIQUE("secret")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bme68x_data" ADD CONSTRAINT "bme68x_data_sensor_id_sensor_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kiosk" ADD CONSTRAINT "kiosk_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kiosk_to_sensor" ADD CONSTRAINT "kiosk_to_sensor_kiosk_id_kiosk_id_fk" FOREIGN KEY ("kiosk_id") REFERENCES "public"."kiosk"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kiosk_to_sensor" ADD CONSTRAINT "kiosk_to_sensor_sensor_id_sensor_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sensor" ADD CONSTRAINT "sensor_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
