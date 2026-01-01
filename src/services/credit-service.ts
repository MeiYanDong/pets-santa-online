"use server";

import { db } from "@/db";
import { userCredits, creditUsage } from "@/db/schema";
import { eq } from "drizzle-orm";

const GENERATION_COST = 20;

export interface CreditOperationResult {
  success: boolean;
  newBalance?: number;
  error?: string;
}

/**
 * Check if user has enough credits
 */
export async function checkCredits(
  userId: string,
  required: number = GENERATION_COST
): Promise<boolean> {
  const credits = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId))
    .limit(1);

  if (credits.length === 0) {
    return false;
  }

  return credits[0].balance >= required;
}

/**
 * Pre-deduct credits when creating a task
 */
export async function deductCredits(
  userId: string,
  taskId: string,
  amount: number = GENERATION_COST
): Promise<CreditOperationResult> {
  const credits = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId))
    .limit(1);

  if (credits.length === 0 || credits[0].balance < amount) {
    return { success: false, error: "Insufficient credits" };
  }

  const newBalance = credits[0].balance - amount;

  // Update balance
  await db
    .update(userCredits)
    .set({
      balance: newBalance,
      totalUsed: credits[0].totalUsed + amount,
    })
    .where(eq(userCredits.userId, userId));

  // Record usage
  await db.insert(creditUsage).values({
    id: crypto.randomUUID(),
    userId,
    amount: -amount, // negative for deduction
    type: "generation",
    description: "Image generation task",
    referenceId: taskId,
    balanceAfter: newBalance,
  });

  return { success: true, newBalance };
}

/**
 * Refund credits when task fails
 */
export async function refundCredits(
  userId: string,
  taskId: string,
  amount: number = GENERATION_COST
): Promise<CreditOperationResult> {
  const credits = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId))
    .limit(1);

  if (credits.length === 0) {
    return { success: false, error: "User credits not found" };
  }

  const newBalance = credits[0].balance + amount;

  // Update balance (reduce totalUsed since it was a refund)
  await db
    .update(userCredits)
    .set({
      balance: newBalance,
      totalUsed: Math.max(0, credits[0].totalUsed - amount),
    })
    .where(eq(userCredits.userId, userId));

  // Record refund
  await db.insert(creditUsage).values({
    id: crypto.randomUUID(),
    userId,
    amount: amount, // positive for refund
    type: "refund",
    description: "Generation task failed - credits refunded",
    referenceId: taskId,
    balanceAfter: newBalance,
  });

  return { success: true, newBalance };
}

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId: string): Promise<number> {
  const credits = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId))
    .limit(1);

  return credits[0]?.balance ?? 0;
}
