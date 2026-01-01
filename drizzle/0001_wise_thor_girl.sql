CREATE TABLE "generation_task" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tuzi_task_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"original_image_url" text NOT NULL,
	"prompt" text NOT NULL,
	"style_id" text NOT NULL,
	"style_label" text NOT NULL,
	"generated_image_url" text,
	"credits_charged" integer DEFAULT 20 NOT NULL,
	"credits_refunded" integer DEFAULT 0,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "generation_task" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "generation_task" ADD CONSTRAINT "generation_task_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;