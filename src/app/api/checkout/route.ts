import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "@/lib/auth/get-session";
import { db } from "@/db";
import { payment } from "@/db/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        credits: "200",
      },
    });

    // Create pending payment record
    await db.insert(payment).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      stripeSessionId: checkoutSession.id,
      amount: 1000, // $10.00 in cents
      currency: "usd",
      status: "pending",
      creditsAdded: 0,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
