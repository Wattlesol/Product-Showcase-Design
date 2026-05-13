CREATE TABLE "events" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"event_type" text NOT NULL,
	"product_id" text,
	"product_name" text,
	"timestamp" text NOT NULL,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"address" text,
	"city" text,
	"province" text,
	"cart_items" text,
	"total_price" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"last_updated" text NOT NULL,
	"ip_address" text,
	CONSTRAINT "leads_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "order_comments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"comment" text NOT NULL,
	"author" text DEFAULT 'admin',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"cart_items" jsonb NOT NULL,
	"total_price" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" integer NOT NULL,
	"variant_id" text NOT NULL,
	"image_type" text NOT NULL,
	"data" "bytea" NOT NULL,
	"content_type" text DEFAULT 'image/webp'
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"original_price" integer,
	"rating" text DEFAULT '5.0',
	"category" text NOT NULL,
	"description" text NOT NULL,
	"variants" jsonb NOT NULL,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "visits" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"timestamp" text NOT NULL,
	"path" text NOT NULL,
	"ip_address" text,
	"referrer" text,
	"ttclid" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text
);
