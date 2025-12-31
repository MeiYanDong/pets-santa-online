import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user";

export const userCredits = pgTable("user_credits", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  balance: integer("balance").notNull().default(0),
  totalPurchased: integer("total_purchased").notNull().default(0),
  totalUsed: integer("total_used").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
}).enableRLS();

export type UserCreditsType = typeof userCredits.$inferSelect;
