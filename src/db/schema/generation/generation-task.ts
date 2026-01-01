import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user";

export const generationTask = pgTable("generation_task", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Tu-zi API task identifier
  tuziTaskId: text("tuzi_task_id"),

  // Status: pending | processing | completed | failed | refunded
  status: text("status").notNull().default("pending"),

  // Input data
  originalImageUrl: text("original_image_url").notNull(),
  prompt: text("prompt").notNull(),
  styleId: text("style_id").notNull(),
  styleLabel: text("style_label").notNull(),

  // Output data
  generatedImageUrl: text("generated_image_url"),

  // Credit management
  creditsCharged: integer("credits_charged").notNull().default(20),
  creditsRefunded: integer("credits_refunded").default(0),

  // Error handling
  errorMessage: text("error_message"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  completedAt: timestamp("completed_at"),
}).enableRLS();

export type GenerationTaskType = typeof generationTask.$inferSelect;
export type GenerationTaskInsertType = typeof generationTask.$inferInsert;
