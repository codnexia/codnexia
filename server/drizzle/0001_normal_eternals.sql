CREATE TABLE "career_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"country_code" varchar(10),
	"country" varchar(255) NOT NULL,
	"city" varchar(255),
	"nationality" varchar(255),
	"linkedin" varchar(500),
	"github" varchar(500),
	"portfolio" varchar(500),
	"website" varchar(500),
	"current_role" varchar(255) NOT NULL,
	"company" varchar(255),
	"experience" varchar(100) NOT NULL,
	"notice_period" varchar(100),
	"employment_type" varchar(50) NOT NULL,
	"work_mode" varchar(50) NOT NULL,
	"salary_expectation" varchar(100),
	"salary_currency" varchar(10),
	"primary_stack" jsonb DEFAULT '[]'::jsonb,
	"other_skills" text,
	"proficiency" varchar(100),
	"languages" text,
	"certifications" text,
	"degree" varchar(255) NOT NULL,
	"field" varchar(255),
	"university" varchar(255),
	"grad_year" varchar(10),
	"position" varchar(255) NOT NULL,
	"cover_letter" text NOT NULL,
	"heard_from" varchar(255),
	"availability" varchar(100),
	"call_date" varchar(20),
	"call_time" varchar(20),
	"timezone" varchar(50),
	"call_topics" jsonb DEFAULT '[]'::jsonb,
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "role" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "rating" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_career_apps_created_at" ON "career_applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_career_apps_status" ON "career_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_career_apps_position" ON "career_applications" USING btree ("position");