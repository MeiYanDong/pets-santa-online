import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { payment, userCredits, creditUsage } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const creditsToAdd = parseInt(session.metadata?.credits || "0", 10);

      if (!userId) {
        console.error("No userId in session metadata");
        return NextResponse.json(
          { error: "No userId in session metadata" },
          { status: 400 }
        );
      }

      // Update payment record
      await db
        .update(payment)
        .set({
          status: "completed",
          stripePaymentIntentId: session.payment_intent as string,
          creditsAdded: creditsToAdd,
        })
        .where(eq(payment.stripeSessionId, session.id));

      // Get or create user credits
      const existingCredits = await db
        .select()
        .from(userCredits)
        .where(eq(userCredits.userId, userId))
        .limit(1);

      let newBalance: number;

      if (existingCredits.length === 0) {
        // Create new credits record
        newBalance = creditsToAdd;
        await db.insert(userCredits).values({
          id: crypto.randomUUID(),
          userId,
          balance: creditsToAdd,
          totalPurchased: creditsToAdd,
          totalUsed: 0,
        });
      } else {
        // Update existing credits
        newBalance = existingCredits[0].balance + creditsToAdd;
        await db
          .update(userCredits)
          .set({
            balance: newBalance,
            totalPurchased: existingCredits[0].totalPurchased + creditsToAdd,
          })
          .where(eq(userCredits.userId, userId));
      }

      // Record credit usage
      await db.insert(creditUsage).values({
        id: crypto.randomUUID(),
        userId,
        amount: creditsToAdd,
        type: "purchase",
        description: `Purchased ${creditsToAdd} credits`,
        referenceId: session.id,
        balanceAfter: newBalance,
      });

      console.log(`Added ${creditsToAdd} credits to user ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
