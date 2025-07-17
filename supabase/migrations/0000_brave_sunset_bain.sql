CREATE TABLE "current_segment" (
	"id" bigint PRIMARY KEY NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"segment" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"url" text NOT NULL
);
