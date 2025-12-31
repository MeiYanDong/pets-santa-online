import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { payment, userCredits, creditUsage } from "@/db/schema";
import { eq } from "drizzle-orm";

// Required for Stripe webhook signature verification
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log("Webhook received");

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    console.log("Signature present:", !!signature);
    console.log("Webhook secret configured:", !!webhookSecret);

    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log("Event type:", event.type);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("Processing checkout.session.completed");
      console.log("Session ID:", session.id);
      console.log("Payment status:", session.payment_status);
      console.log("Metadata:", JSON.stringify(session.metadata));

      // Only process if payment is actually paid
      if (session.payment_status !== "paid") {
        console.log("Payment not paid, skipping");
        return NextResponse.json({ received: true });
      }

      const userId = session.metadata?.userId;
      const creditsToAdd = parseInt(session.metadata?.credits || "0", 10);

      console.log("User ID:", userId);
      console.log("Credits to add:", creditsToAdd);

      if (!userId) {
        console.error("No userId in session metadata");
        return NextResponse.json(
          { error: "No userId in session metadata" },
          { status: 400 }
        );
      }

      // Try to update or create payment record
      try {
        const existingPayment = await db
          .select()
          .from(payment)
          .where(eq(payment.stripeSessionId, session.id))
          .limit(1);

        console.log("Existing payment found:", existingPayment.length > 0);

        if (existingPayment.length > 0) {
          await db
            .update(payment)
            .set({
              status: "completed",
              stripePaymentIntentId: session.payment_intent as string,
              creditsAdded: creditsToAdd,
            })
            .where(eq(payment.stripeSessionId, session.id));
          console.log("Payment record updated");
        } else {
          await db.insert(payment).values({
            id: crypto.randomUUID(),
            userId,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            amount: session.amount_total || 1000,
            currency: session.currency || "usd",
            status: "completed",
            creditsAdded: creditsToAdd,
          });
          console.log("Payment record created");
        }
      } catch (paymentError) {
        console.error("Failed to update/create payment record:", paymentError);
      }

      // Get or create user credits
      try {
        const existingCredits = await db
          .select()
          .from(userCredits)
          .where(eq(userCredits.userId, userId))
          .limit(1);

        let newBalance: number;

        if (existingCredits.length === 0) {
          newBalance = creditsToAdd;
          await db.insert(userCredits).values({
            id: crypto.randomUUID(),
            userId,
            balance: creditsToAdd,
            totalPurchased: creditsToAdd,
            totalUsed: 0,
          });
        } else {
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
      } catch (creditsError) {
        console.error("Failed to update credits:", creditsError);
        return NextResponse.json(
          { error: "Failed to update credits" },
          { status: 500 }
        );
      }
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
