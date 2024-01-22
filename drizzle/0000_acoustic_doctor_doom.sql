-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "access_method_type" AS ENUM('member card', 'provisional pass');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "format_type" AS ENUM('physical', 'digital');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "document_type" AS ENUM('art', 'manuscript', 'ethnology', 'file', 'map', 'picture', 'poster', 'media', 'music', 'reference', 'magazine', 'book');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "service_type" AS ENUM('loan', 'heritage preservation', 'cultural event', 'consultation in a room', 'bibliographic references');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status_type" AS ENUM('requested', 'approved', 'in-loan', 'renovated', 'returned', 'non-returned', 'lost');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "loan_type" AS ENUM('loan_member', 'loan_library');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "penalty_type" AS ENUM('late fees', 'suspension of borrowing privileges', 'replacement cost', 'processing fee');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "category_type" AS ENUM('researcher', 'professional', 'student', 'foreign');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "collection_type" AS ENUM('special', 'general');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "map_type" AS ENUM('topographic', 'road', 'thematic', 'geologic', 'political', 'physical');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "technique_type" AS ENUM('oil', 'acrylic', 'watercolor', 'pastel', 'encaustic', 'fresco', 'gouache', 'ink wash', 'spray');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_collection" (
	"email" varchar(100) PRIMARY KEY NOT NULL,
	"id_collection" varchar(10)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "library" (
	"id_library" serial PRIMARY KEY NOT NULL,
	"name_library" varchar(255) NOT NULL,
	"location_library" varchar(255) NOT NULL,
	"description_library" text,
	"website" varchar(255),
	CONSTRAINT "library_name_library_key" UNIQUE("name_library")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "room" (
	"id_room" varchar(20) PRIMARY KEY NOT NULL,
	"id_library" integer NOT NULL,
	"name_room" varchar(255) NOT NULL,
	"location_room" varchar(255) NOT NULL,
	"description_room" text,
	"access_method" "access_method_type",
	"phone_extension" integer,
	CONSTRAINT "room_name_room_key" UNIQUE("name_room")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collection" (
	"id_collection" varchar(10) PRIMARY KEY NOT NULL,
	"id_room" varchar(20),
	"name_collection" varchar(255) NOT NULL,
	"description_collection" text,
	"type_collection" "collection_type" DEFAULT 'general' NOT NULL,
	CONSTRAINT "collection_name_collection_key" UNIQUE("name_collection")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email" (
	"email" varchar(100) PRIMARY KEY NOT NULL,
	"description_email" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phone" (
	"phone_number" varchar(20) PRIMARY KEY NOT NULL,
	"description_phone" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phone_library" (
	"phone_number" varchar(20) PRIMARY KEY NOT NULL,
	"id_library" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phone_room" (
	"phone_number" varchar(20) PRIMARY KEY NOT NULL,
	"id_room" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_library" (
	"email" varchar(100) PRIMARY KEY NOT NULL,
	"id_library" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_room" (
	"email" varchar(100) PRIMARY KEY NOT NULL,
	"id_room" varchar(20)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "member" (
	"id_member" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer,
	"country" varchar(100) NOT NULL,
	"category" "category_type"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "researcher" (
	"id_member" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "professional" (
	"id_member" integer PRIMARY KEY NOT NULL,
	"organization" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student" (
	"id_member" integer PRIMARY KEY NOT NULL,
	"school" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document" (
	"id_document" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" date,
	"editorial" varchar(255),
	"publication_place" varchar(255),
	"language" varchar(50),
	"format" "format_type",
	"subject" varchar(255),
	"summary" text,
	"is_patrimony" boolean,
	"note" text,
	"type_document" "document_type"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "manuscript" (
	"id_document" integer PRIMARY KEY NOT NULL,
	"period" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "map" (
	"id_document" integer PRIMARY KEY NOT NULL,
	"dimension_height" integer NOT NULL,
	"dimension_width" integer NOT NULL,
	"scale" varchar(20),
	"type_map" "map_type"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "picture" (
	"id_document" integer PRIMARY KEY NOT NULL,
	"dimension_height" integer NOT NULL,
	"dimension_width" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "paint" (
	"id_document" integer PRIMARY KEY NOT NULL,
	"technique" "technique_type",
	"dimension_height" integer NOT NULL,
	"dimension_width" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id_document" integer PRIMARY KEY NOT NULL,
	"genre" varchar(100),
	"director" varchar(100),
	"producer" varchar(100),
	"duration" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "music" (
	"id_document" integer PRIMARY KEY NOT NULL,
	"genre" varchar(100),
	"performer" varchar(100),
	"composer" varchar(100),
	"duration" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reference" (
	"id_document" integer PRIMARY KEY NOT NULL,
	"serial" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "magazine" (
	"id_document" integer PRIMARY KEY NOT NULL,
	"editor" varchar(100),
	"issn" varchar(20)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "book" (
	"id_document" integer PRIMARY KEY NOT NULL,
	"genre" varchar(50),
	"issn" varchar(20),
	"isbn" varchar(20),
	"dewey" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "author" (
	"id_author" bigserial PRIMARY KEY NOT NULL,
	"name_author" varchar(100) NOT NULL,
	"country_author" varchar(100) NOT NULL,
	"description_author" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service" (
	"id_service" bigserial PRIMARY KEY NOT NULL,
	"description_service" text,
	"type_service" "service_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fine" (
	"id_fine" bigserial PRIMARY KEY NOT NULL,
	"id_service" integer NOT NULL,
	"id_document" integer NOT NULL,
	"penalty" "penalty_type" NOT NULL,
	"fee" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_collection" (
	"id_collection" varchar(10) NOT NULL,
	"id_document" integer NOT NULL,
	CONSTRAINT "document_collection_pkey" PRIMARY KEY("id_collection","id_document")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_room" (
	"id_service" integer NOT NULL,
	"id_room" varchar(20) NOT NULL,
	CONSTRAINT "service_room_pkey" PRIMARY KEY("id_service","id_room")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "author_document" (
	"id_author" integer NOT NULL,
	"id_document" integer NOT NULL,
	CONSTRAINT "author_document_pkey" PRIMARY KEY("id_author","id_document")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_member" (
	"id_service" integer NOT NULL,
	"id_member" integer NOT NULL,
	CONSTRAINT "service_member_pkey" PRIMARY KEY("id_service","id_member")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loan_researcher" (
	"id_service" integer NOT NULL,
	"id_document" integer NOT NULL,
	"id_member" integer NOT NULL,
	CONSTRAINT "loan_researcher_pkey" PRIMARY KEY("id_service","id_document","id_member")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loan_professional" (
	"id_service" integer NOT NULL,
	"id_document" integer NOT NULL,
	"id_member" integer NOT NULL,
	CONSTRAINT "loan_professional_pkey" PRIMARY KEY("id_service","id_document","id_member")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loan_library" (
	"id_service" integer NOT NULL,
	"id_document" integer NOT NULL,
	"id_library" integer NOT NULL,
	"id_library2" integer NOT NULL,
	CONSTRAINT "loan_library_pkey" PRIMARY KEY("id_service","id_document","id_library","id_library2")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loan" (
	"id_service" integer NOT NULL,
	"id_document" integer NOT NULL,
	"term" integer,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "status_type" NOT NULL,
	"type_loan" "loan_type" NOT NULL,
	CONSTRAINT "loan_pkey" PRIMARY KEY("id_service","id_document")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_collection" ADD CONSTRAINT "fk_email" FOREIGN KEY ("email") REFERENCES "public"."email"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_collection" ADD CONSTRAINT "fk_collection" FOREIGN KEY ("id_collection") REFERENCES "public"."collection"("id_collection") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "room" ADD CONSTRAINT "fk_library" FOREIGN KEY ("id_library") REFERENCES "public"."library"("id_library") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection" ADD CONSTRAINT "fk_room" FOREIGN KEY ("id_room") REFERENCES "public"."room"("id_room") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phone_library" ADD CONSTRAINT "fk_library" FOREIGN KEY ("id_library") REFERENCES "public"."library"("id_library") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phone_library" ADD CONSTRAINT "fk_phone" FOREIGN KEY ("phone_number") REFERENCES "public"."phone"("phone_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phone_room" ADD CONSTRAINT "fk_room" FOREIGN KEY ("id_room") REFERENCES "public"."room"("id_room") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "phone_room" ADD CONSTRAINT "fk_phone" FOREIGN KEY ("phone_number") REFERENCES "public"."phone"("phone_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_library" ADD CONSTRAINT "fk_library" FOREIGN KEY ("id_library") REFERENCES "public"."library"("id_library") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_library" ADD CONSTRAINT "fk_email" FOREIGN KEY ("email") REFERENCES "public"."email"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_room" ADD CONSTRAINT "fk_room" FOREIGN KEY ("id_room") REFERENCES "public"."room"("id_room") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_room" ADD CONSTRAINT "fk_email" FOREIGN KEY ("email") REFERENCES "public"."email"("email") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "researcher" ADD CONSTRAINT "fk_member" FOREIGN KEY ("id_member") REFERENCES "public"."member"("id_member") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "professional" ADD CONSTRAINT "fk_member" FOREIGN KEY ("id_member") REFERENCES "public"."member"("id_member") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student" ADD CONSTRAINT "fk_member" FOREIGN KEY ("id_member") REFERENCES "public"."member"("id_member") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "manuscript" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "map" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "picture" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "paint" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "music" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reference" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "magazine" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fine" ADD CONSTRAINT "fk_service" FOREIGN KEY ("id_service","id_document") REFERENCES "public"."loan"("id_service","id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_collection" ADD CONSTRAINT "fk_collection" FOREIGN KEY ("id_collection") REFERENCES "public"."collection"("id_collection") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_collection" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_room" ADD CONSTRAINT "fk_room" FOREIGN KEY ("id_room") REFERENCES "public"."room"("id_room") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_room" ADD CONSTRAINT "fk_service" FOREIGN KEY ("id_service","id_document") REFERENCES "public"."loan"("id_service","id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_document" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_document" ADD CONSTRAINT "fk_author" FOREIGN KEY ("id_author") REFERENCES "public"."author"("id_author") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_member" ADD CONSTRAINT "fk_member" FOREIGN KEY ("id_member") REFERENCES "public"."member"("id_member") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_member" ADD CONSTRAINT "fk_service" FOREIGN KEY ("id_service","id_document") REFERENCES "public"."loan"("id_service","id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_researcher" ADD CONSTRAINT "fk_member" FOREIGN KEY ("id_member") REFERENCES "public"."member"("id_member") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_researcher" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_researcher" ADD CONSTRAINT "fk_service" FOREIGN KEY ("id_service","id_document") REFERENCES "public"."loan"("id_service","id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_professional" ADD CONSTRAINT "fk_member" FOREIGN KEY ("id_member") REFERENCES "public"."member"("id_member") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_professional" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_professional" ADD CONSTRAINT "fk_service" FOREIGN KEY ("id_service","id_document") REFERENCES "public"."loan"("id_service","id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_library" ADD CONSTRAINT "fk_library" FOREIGN KEY ("id_library") REFERENCES "public"."library"("id_library") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_library" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_library" ADD CONSTRAINT "fk_service" FOREIGN KEY ("id_service","id_document") REFERENCES "public"."loan"("id_service","id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan_library" ADD CONSTRAINT "fk_library2" FOREIGN KEY ("id_library2") REFERENCES "public"."library"("id_library") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan" ADD CONSTRAINT "fk_document" FOREIGN KEY ("id_document") REFERENCES "public"."document"("id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "loan" ADD CONSTRAINT "fk_service" FOREIGN KEY ("id_service","id_document") REFERENCES "public"."loan"("id_service","id_document") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/