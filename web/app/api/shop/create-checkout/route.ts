import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@/lib/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" as any });

export async function POST(req: NextRequest) {
  try {
    const { items, email } = await req.json();
    if (!Array.isArray(items) || !email) return NextResponse.json({ error: "Bad request" }, { status: 400 });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((i: any) => ({
      quantity: i.quantity,
      price_data: {
        currency: "chf",
        unit_amount: i.priceCents,
        product_data: {
          name: i.title + (i.variantName ? ` – ${i.variantName}` : ""),
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items,
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/thank-you` ,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/cart`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
