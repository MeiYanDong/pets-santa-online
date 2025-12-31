import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/get-session";
import { db } from "@/db";
import { payment, userCredits, creditUsage } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user credits
    const credits = await db
      .select()
      .from(userCredits)
      .where(eq(userCredits.userId, userId))
      .limit(1);

    // Get payment history
    const payments = await db
      .select()
      .from(payment)
      .where(eq(payment.userId, userId))
      .orderBy(desc(payment.createdAt));

    // Get credit usage history
    const usage = await db
      .select()
      .from(creditUsage)
      .where(eq(creditUsage.userId, userId))
      .orderBy(desc(creditUsage.createdAt))
      .limit(50);

    return NextResponse.json({
      credits: credits[0] || {
        balance: 0,
        totalPurchased: 0,
        totalUsed: 0,
      },
      payments,
      usage,
    });
  } catch (error) {
    console.error("Billing error:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing data" },
      { status: 500 }
    );
  }
}
