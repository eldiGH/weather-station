ALTER TABLE "time_sheet_entry" RENAME COLUMN "pricePerHour" TO "price_per_hour";--> statement-breakpoint
ALTER TABLE "time_sheet_entry" ALTER COLUMN "hours" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "time_sheet" ALTER COLUMN "default_hours" SET DATA TYPE double precision;