import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user";

export const payment = pgTable("payment", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  creditsAdded: integer("credits_added").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
}).enableRLS();

export type PaymentType = typeof payment.$inferSelect;
