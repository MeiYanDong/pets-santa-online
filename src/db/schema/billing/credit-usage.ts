import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user";

export const creditUsage = pgTable("credit_usage", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // positive for credits added, negative for credits used
  type: text("type").notNull(), // 'purchase' | 'generation' | 'refund'
  description: text("description"),
  referenceId: text("reference_id"), // payment id or generation id
  balanceAfter: integer("balance_after").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();

export type CreditUsageType = typeof creditUsage.$inferSelect;
